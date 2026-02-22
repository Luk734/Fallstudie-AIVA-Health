# Convention 05 — Security

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Secret Management, Input Validation, Security Best Practices für AIVA Health.  
> **Geladen von:** ALL Agents

---

## Secret Management (Zero Trust)

### Environment Variables (Mandatory)

```typescript
// ✅ Secrets aus Environment
const apiKey = process.env.AIVA_API_KEY;
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const encryptionKey = process.env.ENCRYPTION_KEY;

// Fail fast wenn Secrets fehlen
if (!apiKey) throw new Error('AIVA_API_KEY not set');
if (!encryptionKey) throw new Error('ENCRYPTION_KEY not set — health data encryption required');
```

```typescript
// ❌ VERBOTEN — Hardcoded Secrets
const apiKey = 'sk-1234567890abcdef';         // VERBOTEN
const password = 'admin123';                   // VERBOTEN
const connectionString = 'Server=prod;Pwd=x'; // VERBOTEN
```

### .env Files (Development Only)

```bash
# .env (MUSS in .gitignore!)
AIVA_API_KEY=dev-key-123
DATABASE_URL=postgres://localhost:5432/aiva
JWT_SECRET=dev-jwt-secret
ENCRYPTION_KEY=dev-encryption-key-32-chars

# .env.example (committed to repo)
AIVA_API_KEY=your-api-key-here
DATABASE_URL=your-database-url-here
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-32-char-encryption-key
```

### Secret Scanning

- **Git Hooks**: Prevent committing secrets (pre-commit hook)
- **GitHub Secret Scanning**: Aktiv für Repository
- **.gitignore**: `.env`, `*.pem`, `*.key`, `secrets/`

---

## Input Validation (Defense in Depth)

### Schema Validation mit Zod

```typescript
import { z } from 'zod';

// Patient Registration
const PatientRegistrationSchema = z.object({
  firstName: z.string()
    .min(2, 'Mindestens 2 Zeichen')
    .max(50, 'Maximal 50 Zeichen')
    .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, 'Ungültige Zeichen'),
  
  lastName: z.string()
    .min(2).max(50)
    .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/),
  
  dateOfBirth: z.coerce.date()
    .min(new Date('1900-01-01'), 'Unrealistisches Geburtsdatum')
    .max(new Date(), 'Geburtsdatum in der Zukunft'),
  
  email: z.string().email('Ungültiges E-Mail-Format'),
  
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Einwilligung ist Pflicht' })
  })
});

// Vital Sign Input
const VitalSignSchema = z.object({
  heartRate: z.number()
    .min(30, 'Herzfrequenz unter 30 bpm unrealistisch')
    .max(250, 'Herzfrequenz über 250 bpm unrealistisch'),
  
  bloodPressureSystolic: z.number().min(60).max(300).optional(),
  bloodPressureDiastolic: z.number().min(30).max(200).optional(),
  
  temperature: z.number().min(34.0).max(42.0).optional(),
  
  measuredAt: z.coerce.date().max(new Date(), 'Messung in Zukunft nicht möglich')
});
```

### Validation Principles

- **Validate all inputs**: Niemals User/External Data vertrauen
- **Fail early**: Validierung am API-Eingang
- **Whitelist**: Erlaubte Werte definieren (nicht Blacklist)
- **Sanitize**: HTML-Entities, SQL-Injection-Schutz
- **Gesundheitsdaten**: Plausibilitätsprüfung (z.B. Herzfrequenz 30-250)

---

## Authentication & Authorization

### JWT Token Handling

```typescript
// Token-Struktur für AIVA Health
interface AivaJwtPayload {
  sub: string;          // Patient-ID
  email: string;
  roles: string[];      // ['patient', 'family_admin']
  consent: string[];    // ['care:read', 'labs:read', 'coach:write']
  iat: number;
  exp: number;
}

// Token-Validierung
function validateToken(token: string): AivaJwtPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AivaJwtPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

// Consent-basierte Autorisierung
function requireConsent(scope: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user.consent.includes(scope)) {
      throw new ConsentRequiredError(scope, req.user.sub);
    }
    next();
  };
}
```

### Authorization Rules

| Route | Required Consent | Rolle |
|-------|-----------------|-------|
| `GET /api/appointments` | `care:read` | patient |
| `POST /api/appointments` | `care:write` | patient |
| `GET /api/lab-results` | `labs:read` | patient |
| `GET /api/medications` | `labs:read` | patient |
| `POST /api/check-ins` | `coach:write` | patient |
| `GET /api/family-members` | `family:read` | family_admin |
| `POST /api/family-invites` | `family:write` | family_admin |

---

## DSGVO Security Rules

### Data Encryption

```typescript
// Gesundheitsdaten MÜSSEN verschlüsselt gespeichert werden
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function encryptHealthData(data: string, key: Buffer): EncryptedData {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
}
```

### Audit Trail (Mandatory für Gesundheitsdaten)

```typescript
interface AuditEntry {
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT';
  resource: string;       // 'appointment', 'lab-result', 'medication'
  resourceId: string;
  userId: string;
  timestamp: Date;
  ip?: string;
  reason?: string;        // Bei DELETE/EXPORT Pflicht
}

// Jeder Zugriff auf Gesundheitsdaten wird geloggt
async function auditAccess(entry: AuditEntry): Promise<void> {
  await auditRepository.save(entry);
}
```

### Data Deletion (Recht auf Löschung)

```typescript
// DSGVO Art. 17 — Recht auf Löschung
async function deletePatientData(patientId: string, reason: string): Promise<void> {
  await auditAccess({
    action: 'DELETE',
    resource: 'patient',
    resourceId: patientId,
    userId: 'system',
    timestamp: new Date(),
    reason
  });

  // Cascade Delete — ALLE Gesundheitsdaten
  await Promise.all([
    appointmentRepository.deleteByPatient(patientId),
    medicationRepository.deleteByPatient(patientId),
    labResultRepository.deleteByPatient(patientId),
    checkInRepository.deleteByPatient(patientId),
    consentRepository.deleteByPatient(patientId)
  ]);

  await patientRepository.delete(patientId);
}
```

---

## Security Checklist (Pre-Commit)

- [ ] Keine hardcoded Secrets im Code
- [ ] Input Validation für alle API-Endpoints
- [ ] Consent-Check vor Gesundheitsdaten-Zugriff
- [ ] Audit Trail für CREATE/READ/UPDATE/DELETE auf Health Data
- [ ] Error Messages enthalten KEINE Patientendaten
- [ ] `.env` ist in `.gitignore`
- [ ] HTTPS/TLS 1.3 für alle externen Verbindungen

---

## Cross-References

- **Health-spezifische Security** → [Convention 08: Health Security](../health-domain/08-health-security.md)
- **Error Handling** → [Convention 04: Error Handling](../code-architecture/04-error-handling.md)
- **Security Context** → [Context: Security](../../context/security.md)
- **Foundation Layer** → [Layer 00: Security Rules](../../system/layers/00-foundation.md#security-mandatory-rules)
