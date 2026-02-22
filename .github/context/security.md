# AIVA Health — Security & Compliance

> Extrahiert aus [AIVA_Context.md](../AIVA_Context.md) — Pflicht-Referenz für alle Agents bei Gesundheitsdaten.

---

## DSGVO-Grundsätze (Art. 9 — Besondere Datenkategorien)

Gesundheitsdaten sind **besondere Kategorien personenbezogener Daten** (Art. 9 DSGVO) und unterliegen erhöhtem Schutz.

### Grundregeln (non-negotiable, auch im MVP!)
1. **Explizite Einwilligung** (Art. 9 Abs. 2a) vor jeder Verarbeitung von Gesundheitsdaten
2. **Datensparsamkeit** (Art. 5 Abs. 1c) — nur notwendige Daten erheben
3. **Zweckbindung** (Art. 5 Abs. 1b) — Daten nur für angegebenen Zweck nutzen
4. **Recht auf Löschung** (Art. 17) — Nutzer kann jederzeit alle Daten löschen lassen
5. **Recht auf Auskunft** (Art. 15) — Nutzer kann alle gespeicherten Daten einsehen
6. **Datenportabilität** (Art. 20) — Export in maschinenlesbarem Format

---

## Technische Sicherheitsmaßnahmen

### Authentifizierung & Verifizierung
- **Erstregistrierung**: Personalausweis-Verifizierung
- **Login**: FaceID / TouchID / biometrische Authentifizierung
- **Session-Management**: Token-basiert, automatischer Timeout

### Verschlüsselung
- **At-Rest**: Alle Gesundheitsdaten verschlüsselt in Datenbank (AES-256)
- **In-Transit**: TLS 1.3 für alle API-Kommunikation
- **Ende-zu-Ende**: Für besonders sensible Daten (Befunde, Medikation)

### Consent-Management
```typescript
// Consent MUSS vor jeder Verarbeitung geprüft werden
interface ConsentRecord {
  patientId: string;
  consentType: ConsentType;
  grantedAt: Date;
  expiresAt: Date | null;
  scope: DataScope[];
  revokedAt: Date | null;
}

type ConsentType = 
  | 'health_data_processing'    // Grundlegende Datenverarbeitung
  | 'wearable_sync'             // Wearable-Daten synchronisieren
  | 'epa_access'                // ePA-Zugriff
  | 'family_sharing'            // Daten mit Familie teilen
  | 'ai_recommendations'        // KI-Empfehlungen erhalten
  | 'push_notifications';       // Push-Benachrichtigungen

type DataScope = 'vitals' | 'medications' | 'appointments' | 'lab_results' | 'family_data';
```

### Audit Trail
```typescript
// Alle Zugriffe auf Gesundheitsdaten MÜSSEN protokolliert werden
interface AuditLogEntry {
  timestamp: Date;
  userId: string;
  action: AuditAction;
  resourceType: 'lab_result' | 'medication' | 'appointment' | 'vital_sign' | 'patient_profile';
  resourceId: string;
  ipAddress: string;
  details?: string;
}

type AuditAction =
  | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  | 'EXPORT' | 'SHARE' | 'CONSENT_GRANT' | 'CONSENT_REVOKE';
```

### Input Validation
- Schema-basierte Validierung (Zod / äquivalent)
- Sanitierung aller User-Inputs
- Keine SQL Injection / XSS möglich
- Vital-Sign-Wertebereiche prüfen (z.B. Herzfrequenz 30-250 bpm)

---

## Integrationen & deren Sicherheit

| Integration | Sicherheits-Anforderung | MVP-Status |
|-------------|------------------------|------------|
| Wearables (Apple Health, Fitbit) | OAuth 2.0, nur lesend, Nutzer-Consent | Mock |
| ePA (gematik) | gematik-zertifiziert, TLS 1.3, Connector | Mock |
| Doctolib | API-Key, HTTPS, Nutzer-Consent | Mock |
| Push Notifications (FCM/APNs) | Keine Gesundheitsdaten im Push-Inhalt! | Mock |
| eRezept | gematik-Standard, Ende-zu-Ende | Mock |

### Push-Notification Security
```
❌ VERBOTEN: "Thomas, nimm dein Ramipril 5mg gegen Bluthochdruck"
✅ KORREKT: "Erinnerung: Medikament einnehmen" (Details nur in-App)
```

---

## KI-Funktionen & Ethik

### KI-Features
- **Health Risk Scoring**: Erkennung von Anomalien in Vitalwerten
- **Personalisierte Empfehlungen**: Basierend auf Nutzerverhalten und Gesundheitsdaten
- **Natural Language Processing**: Verständliche Aufbereitung medizinischer Befunde
- **Predictive Analytics**: Vorhersage von Gesundheitsrisiken

### KI-Ethik-Regeln
1. **Transparenz**: Nutzer muss wissen, dass KI Empfehlungen generiert
2. **Kein Diagnose-Ersatz**: „Dies ist keine medizinische Diagnose. Bitte konsultieren Sie Ihren Arzt."
3. **Erklärbarkeit**: KI-Empfehlungen müssen begründet werden können
4. **Bias-Vermeidung**: Regelmäßige Prüfung auf Diskriminierung
5. **Opt-out**: Nutzer kann KI-Empfehlungen jederzeit deaktivieren

---

## Security Checkliste für Agents

### Developer
- [ ] Gesundheitsdaten immer verschlüsselt speichern
- [ ] Consent vor Datenverarbeitung prüfen
- [ ] Audit-Trail für jeden Datenzugriff
- [ ] Keine Gesundheitsdaten in Logs/Console
- [ ] Input Validation für alle Endpoints
- [ ] Keine hardcoded Secrets

### Reviewer (DSGVO-Dimension)
- [ ] Werden Gesundheitsdaten korrekt verschlüsselt?
- [ ] Wird Consent geprüft bevor verarbeitet wird?
- [ ] Gibt es Audit-Trail Einträge?
- [ ] Sind sensible Daten aus Logs gefiltert?
- [ ] Ist Löschung implementiert (Art. 17)?
- [ ] Keine Cross-Context Daten-Leaks?

### Tester
- [ ] Consent-Verweigerung korrekt behandelt?
- [ ] Löschung löscht wirklich alle Daten?
- [ ] Audit-Trail vollständig?
- [ ] Verschlüsselung nachprüfbar (DB-Check)?
- [ ] Push-Notifications enthalten KEINE Details?
