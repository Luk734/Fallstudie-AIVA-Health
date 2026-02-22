# Convention 06 — Health Data

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Umgang mit Gesundheitsdaten, Datenmodelle, Validierung, FHIR-Kompatibilität.  
> **Geladen von:** Developer Agent, Tester Agent, Reviewer Agent

---

## Gesundheitsdaten-Klassifizierung

| Kategorie | Sensitivität | Beispiele | Anforderungen |
|-----------|-------------|-----------|---------------|
| **Personenbezogen** | Hoch | Name, Geburtsdatum, E-Mail | Verschlüsselung, Löschbarkeit |
| **Gesundheitsdaten** | Sehr Hoch (Art. 9 DSGVO) | Laborbefunde, Vitalzeichen, Diagnosen | Verschlüsselung + Consent + Audit |
| **Medikation** | Sehr Hoch | Medikamente, Dosierung | Verschlüsselung + Consent + Audit |
| **Verhaltensdaten** | Hoch | Schlaf, Schritte, Check-Ins | Consent + pseudonymisiert speichern |
| **Metadaten** | Mittel | Login-Zeiten, App-Nutzung | Pseudonymisiert |

> **Grundregel**: Alle Daten der Kategorie "Sehr Hoch" erfordern **Consent + Verschlüsselung + Audit Trail**.

---

## Datenmodelle

### Patient (Core Entity)

```typescript
interface Patient {
  id: string;                    // UUID, pseudonymisiert
  firstName: string;             // Verschlüsselt gespeichert
  lastName: string;              // Verschlüsselt gespeichert
  dateOfBirth: Date;             // Verschlüsselt gespeichert
  email: string;                 // Verschlüsselt gespeichert
  gender?: 'male' | 'female' | 'diverse';
  createdAt: Date;
  updatedAt: Date;
}
```

### Vital Signs

```typescript
interface VitalSign {
  id: string;
  patientId: string;
  type: VitalSignType;
  value: number;
  unit: string;
  measuredAt: Date;
  source: 'manual' | 'wearable' | 'device';
  referenceRange?: {
    min: number;
    max: number;
    status: 'normal' | 'borderline' | 'abnormal';
  };
}

type VitalSignType =
  | 'heart_rate'           // bpm
  | 'blood_pressure_sys'   // mmHg
  | 'blood_pressure_dia'   // mmHg
  | 'temperature'          // °C
  | 'oxygen_saturation'    // %
  | 'weight'               // kg
  | 'steps'                // count/day
  | 'sleep_hours';         // hours
```

### Validierungsgrenzen

```typescript
const VITAL_SIGN_RANGES: Record<VitalSignType, { min: number; max: number; unit: string }> = {
  heart_rate:         { min: 30, max: 250, unit: 'bpm' },
  blood_pressure_sys: { min: 60, max: 300, unit: 'mmHg' },
  blood_pressure_dia: { min: 30, max: 200, unit: 'mmHg' },
  temperature:        { min: 34.0, max: 42.0, unit: '°C' },
  oxygen_saturation:  { min: 70, max: 100, unit: '%' },
  weight:             { min: 1, max: 500, unit: 'kg' },
  steps:              { min: 0, max: 100000, unit: 'steps' },
  sleep_hours:        { min: 0, max: 24, unit: 'hours' }
};
```

---

## Medication Data

```typescript
interface Medication {
  id: string;
  patientId: string;
  name: string;                    // z.B. "Ramipril"
  dosage: string;                  // z.B. "5mg"
  frequency: MedicationFrequency;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  notes?: string;
  reminders: MedicationReminder[];
}

interface MedicationReminder {
  id: string;
  medicationId: string;
  time: string;          // "08:00" (24h Format)
  daysOfWeek: number[];  // [1,2,3,4,5] = Mo-Fr
  isActive: boolean;
  missedCount: number;
  lastTakenAt?: Date;
}

type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'weekly'
  | 'as_needed';
```

---

## Lab Results

```typescript
interface LabResult {
  id: string;
  patientId: string;
  type: string;              // z.B. "Blutbild", "Leberwerte"
  parameters: LabParameter[];
  collectedAt: Date;
  reportedAt: Date;
  source: 'epa_mock' | 'epa' | 'manual';
}

interface LabParameter {
  name: string;              // z.B. "Hämoglobin"
  value: number;
  unit: string;              // z.B. "g/dL"
  referenceMin: number;
  referenceMax: number;
  status: 'normal' | 'borderline' | 'abnormal';
}
```

---

## Referenzbereiche Visualisierung

```typescript
function getVitalSignStatus(
  type: VitalSignType, 
  value: number
): 'normal' | 'borderline' | 'abnormal' {
  const range = VITAL_SIGN_RANGES[type];
  
  // Completely out of range = abnormal
  if (value < range.min || value > range.max) return 'abnormal';
  
  // Type-specific normal ranges (medical reference)
  const normalRanges: Record<string, { min: number; max: number }> = {
    heart_rate: { min: 60, max: 100 },
    blood_pressure_sys: { min: 90, max: 140 },
    blood_pressure_dia: { min: 60, max: 90 },
    temperature: { min: 36.1, max: 37.2 },
    oxygen_saturation: { min: 95, max: 100 }
  };

  const normal = normalRanges[type];
  if (!normal) return 'normal'; // steps, weight etc. have no medical normal range
  
  if (value >= normal.min && value <= normal.max) return 'normal';
  return 'borderline';
}
```

### Farb-Coding

| Status | Farbe | CSS Variable | Verwendung |
|--------|-------|-------------|------------|
| Normal | Grün | `--aiva-status-normal` | Wert im Normalbereich |
| Grenzwertig | Orange | `--aiva-status-borderline` | Leichte Abweichung |
| Abnormal | Rot | `--aiva-status-abnormal` | Medizinisch auffällig |

---

## Data Flow Rules

1. **Consent BEFORE Access**: Kein Datenzugriff ohne aktiven Consent
2. **Encrypt at Rest**: AES-256-GCM für alle Gesundheitsdaten
3. **Encrypt in Transit**: TLS 1.3 für alle API-Calls
4. **Audit on Access**: Jeder READ/WRITE wird protokolliert
5. **Pseudonymize**: Patient-IDs sind UUIDs, kein Klarname in Logs
6. **Minimize**: Nur Daten speichern die für den Zweck nötig sind

---

## Cross-References

- **Health Security** → [Convention 08: Health Security](08-health-security.md)
- **Security** → [Convention 05: Security](../process-quality/05-security.md)
- **Domain Knowledge** → [Layer 01: Domain Knowledge](../../system/layers/01-domain-knowledge.md)
- **Security Context** → [Context: Security](../../context/security.md)
