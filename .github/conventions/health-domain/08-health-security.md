# Convention 08 — Health Security (DSGVO)

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** DSGVO-spezifische Security für Gesundheitsdaten, Consent-Management, Audit Trail.  
> **Geladen von:** ALL Agents (MANDATORY bei Health Data)

---

## DSGVO Art. 9 — Besondere Kategorien

Gesundheitsdaten unterliegen Art. 9 DSGVO und erfordern besonderen Schutz:

### Die 6 Grundregeln

1. **Einwilligung** (Art. 9 Abs. 2a): Ausdrückliche Einwilligung vor Verarbeitung
2. **Zweckbindung** (Art. 5 Abs. 1b): Daten nur für angegebenen Zweck nutzen
3. **Datenminimierung** (Art. 5 Abs. 1c): Nur erforderliche Daten erheben
4. **Speicherbegrenzung** (Art. 5 Abs. 1e): Daten löschen wenn Zweck erfüllt
5. **Integrität** (Art. 5 Abs. 1f): Verschlüsselung und Zugriffsschutz
6. **Rechenschaftspflicht** (Art. 5 Abs. 2): Compliance nachweisen können

---

## Consent Management

### Consent-Modell

```typescript
interface ConsentRecord {
  id: string;
  patientId: string;
  scope: ConsentScope;
  status: 'active' | 'revoked' | 'expired';
  grantedAt: Date;
  revokedAt?: Date;
  expiresAt: Date;
  version: number;      // Consent-Version (bei Terms-Update)
  ipAddress?: string;    // Nachweis
}

type ConsentScope =
  | 'care:read' | 'care:write'
  | 'labs:read' | 'labs:write'
  | 'coach:read' | 'coach:write'
  | 'family:read' | 'family:write'
  | 'wearable:heart_rate' | 'wearable:steps' | 'wearable:sleep' | 'wearable:all'
  | 'data:export' | 'data:share';
```

### Consent-Check Pattern

```typescript
// MANDATORY: Jeder Gesundheitsdaten-Zugriff prüft Consent
async function requireConsent(patientId: string, scope: ConsentScope): Promise<void> {
  const consent = await consentRepository.findActive(patientId, scope);
  
  if (!consent) {
    throw new ConsentRequiredError(scope, patientId);
  }
  
  if (consent.expiresAt < new Date()) {
    throw new ConsentRequiredError(scope, patientId); // Expired = kein Consent
  }
}

// Usage in Services — VOR jedem Datenzugriff
async function getLabResults(patientId: string): Promise<LabResult[]> {
  await requireConsent(patientId, 'labs:read');              // ← PFLICHT
  await auditAccess('READ', 'lab-result', patientId);       // ← PFLICHT
  return labResultRepository.findByPatient(patientId);
}
```

### Consent-Widerruf

```typescript
async function revokeConsent(patientId: string, scope: ConsentScope): Promise<void> {
  const consent = await consentRepository.findActive(patientId, scope);
  if (!consent) return;

  consent.status = 'revoked';
  consent.revokedAt = new Date();
  await consentRepository.save(consent);

  // Audit-Eintrag
  await auditAccess('UPDATE', 'consent', patientId);

  // Optional: Daten-Zugriff sofort sperren
  await invalidatePatientSessions(patientId, scope);
}
```

---

## Audit Trail

### Audit-Pflicht-Tabelle

| Aktion | Audit | Pflichtfelder |
|--------|-------|---------------|
| Login | ✅ | userId, timestamp, ip |
| Gesundheitsdaten lesen | ✅ | userId, resource, resourceId, timestamp |
| Gesundheitsdaten schreiben | ✅ | userId, resource, resourceId, timestamp, changes |
| Gesundheitsdaten löschen | ✅ | userId, resource, resourceId, timestamp, **reason** |
| Daten exportieren | ✅ | userId, resource, timestamp, format, **reason** |
| Consent ändern | ✅ | userId, scope, oldStatus, newStatus, timestamp |
| App-Nutzung (allgemein) | ❌ | – (nur pseudonymisiert aggregiert) |

### Audit-Implementation

```typescript
interface AuditEntry {
  id: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'LOGIN';
  resource: string;
  resourceId?: string;
  userId: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  reason?: string;       // Pflicht bei DELETE und EXPORT
  changes?: string;      // Bei UPDATE: was wurde geändert (ohne Klartext-Gesundheitsdaten!)
}

// Audit-Service
class AuditService {
  async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void> {
    await this.repository.save({
      ...entry,
      id: generateUUID(),
      timestamp: new Date()
    });
  }

  // DSGVO-Auskunft: Alle Zugriffe auf Patientendaten
  async getPatientAuditLog(patientId: string): Promise<AuditEntry[]> {
    return this.repository.findByUserId(patientId);
  }
}
```

---

## Datenverschlüsselung

### Encryption at Rest

```typescript
// AES-256-GCM für alle Gesundheitsdaten
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm' as const,
  keyLength: 32, // 256 bits
  ivLength: 16,
  tagLength: 16
};

// Welche Felder verschlüsseln?
const ENCRYPTED_FIELDS: Record<string, string[]> = {
  patient: ['firstName', 'lastName', 'dateOfBirth', 'email'],
  vitalSign: ['value'],
  labResult: ['parameters'],
  medication: ['name', 'dosage', 'notes']
};
```

### Transport Security

- **TLS 1.3** für alle API-Verbindungen
- **Certificate Pinning** für Mobile App (Post-MVP)
- **HSTS** Header bei Web-Version

---

## Recht auf Löschung (Art. 17)

```typescript
// Cascade Delete — ALLE Patientendaten
async function deletePatientCompletely(
  patientId: string, 
  requestedBy: string, 
  reason: string
): Promise<DeletionReport> {
  // 1. Audit FIRST (bevor Daten gelöscht werden!)
  await auditService.log({
    action: 'DELETE',
    resource: 'patient_complete',
    resourceId: patientId,
    userId: requestedBy,
    reason
  });

  // 2. Cascade Delete
  const deletedCounts = {
    appointments: await appointmentRepo.deleteByPatient(patientId),
    medications: await medicationRepo.deleteByPatient(patientId),
    labResults: await labResultRepo.deleteByPatient(patientId),
    checkIns: await checkInRepo.deleteByPatient(patientId),
    vitalSigns: await vitalSignRepo.deleteByPatient(patientId),
    consents: await consentRepo.deleteByPatient(patientId),
    patient: await patientRepo.delete(patientId) ? 1 : 0
  };

  // 3. Report
  return {
    patientId,
    deletedAt: new Date(),
    counts: deletedCounts,
    reason
  };
}
```

---

## Recht auf Datenübertragbarkeit (Art. 20)

```typescript
async function exportPatientData(
  patientId: string,
  format: 'json' | 'csv'
): Promise<ExportResult> {
  await requireConsent(patientId, 'data:export');
  
  await auditService.log({
    action: 'EXPORT',
    resource: 'patient_data',
    resourceId: patientId,
    userId: patientId,
    reason: 'Patient data export request (Art. 20 DSGVO)'
  });

  const data = await gatherAllPatientData(patientId);
  
  return format === 'json' 
    ? exportAsJson(data)
    : exportAsCsv(data);
}
```

---

## Security Checkliste per Agent

### Developer
- [ ] Consent-Check vor jedem Health-Data-Zugriff
- [ ] Audit-Trail für jede CRUD-Operation
- [ ] Verschlüsselung für sensitive Felder
- [ ] Keine Gesundheitsdaten in Logs/Error Messages

### Reviewer
- [ ] Prüfe: Consent-Check vorhanden?
- [ ] Prüfe: Audit-Trail vorhanden?
- [ ] Prüfe: Verschlüsselung korrekt?
- [ ] Prüfe: Löschbarkeit gewährleistet?

### Tester
- [ ] Test: Zugriff ohne Consent → ConsentRequiredError
- [ ] Test: Audit-Eintrag wird geschrieben
- [ ] Test: Cascade Delete löscht alles
- [ ] Test: Verschlüsselte Daten sind nicht im Klartext

---

## Cross-References

- **General Security** → [Convention 05: Security](../process-quality/05-security.md)
- **Health Data** → [Convention 06: Health Data](06-health-data.md)
- **Security Context** → [Context: Security](../../context/security.md)
- **Foundation Layer** → [Layer 00: Security Rules](../../system/layers/00-foundation.md#security-mandatory-rules)
