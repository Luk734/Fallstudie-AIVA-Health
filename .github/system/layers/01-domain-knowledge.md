# Layer 1: Domain Knowledge

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: Developer, Reviewer, Tester, UX Designer (alle Code-arbeitenden Agents)

---

## Convention-Referenzen

### SOLID Principles
→ See [Convention 03: Architecture Patterns](../../conventions/code-architecture/03-patterns.md)

### TDD (Test-Driven Development)
→ See [Convention 12: Testing Strategy](../../conventions/process-quality/12-testing-strategy.md)

### Clean Code
→ See [Convention 01: Code Structure](../../conventions/code-architecture/01-code-structure.md)

### DRY (Don't Repeat Yourself)
→ See [Convention 03: Architecture Patterns](../../conventions/code-architecture/03-patterns.md)

---

## TDD Workflow

### Red-Green-Refactor Cycle

1. **Red**: Write failing test first
2. **Green**: Implement minimal code to pass
3. **Refactor**: Clean up code

Für Details siehe [Convention 12: Testing Strategy](../../conventions/process-quality/12-testing-strategy.md)

### Bug Fix TDD Pattern

```typescript
// 1. RED: Write test that reproduces bug
it('should reject invalid heart rate values', () => {
  const reading = new VitalSignReading({ heartRate: -5 });
  expect(reading.isValid()).toBe(false);
});

// 2. GREEN: Fix bug
class VitalSignReading {
  isValid(): boolean {
    return this.heartRate >= 30 && this.heartRate <= 250;
  }
}

// 3. REFACTOR: Extract validation
```

---

## AIVA Health Domain Examples

### Bounded Contexts (DDD)

```typescript
// ❌ SCHLECHT — Generische Begriffe
interface User { id: string; name: string; }
interface Item { id: string; items: Thing[]; }

// ✅ GUT — AIVA Health Bounded Contexts (DDD)

// AIVA Care (Terminmanagement)
interface Appointment {
  id: string;
  patientId: string;
  doctorName: string;
  specialty: MedicalSpecialty;
  scheduledAt: Date;
  reminderSent: boolean;
}

// AIVA Coach (Empfehlungen)
interface DailyCheckIn {
  id: string;
  patientId: string;
  date: Date;
  mood: MoodLevel;
  sleepHours: number;
  stepsCount: number;
  recommendations: Recommendation[];
}

// AIVA Labs (Befunde & Medikation)
interface LabResult {
  id: string;
  patientId: string;
  type: LabTestType;
  value: number;
  unit: string;
  referenceRange: { min: number; max: number };
  isAbnormal: boolean;
}

interface MedicationReminder {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: MedicationFrequency;
  nextDueAt: Date;
}

// AIVA Family (Familienkonto)
interface FamilyAccount {
  id: string;
  primaryUserId: string;
  members: FamilyMember[];
  children: ChildProfile[];
}
```

### Domain Events

```typescript
// AIVA Health Domain Events
type DomainEvent =
  | { type: 'AppointmentScheduled'; appointmentId: string; patientId: string }
  | { type: 'AppointmentReminder'; appointmentId: string; minutesBefore: number }
  | { type: 'VitalSignRecorded'; patientId: string; vitalType: string; value: number }
  | { type: 'MedicationTaken'; reminderId: string; takenAt: Date }
  | { type: 'MedicationMissed'; reminderId: string; missedAt: Date }
  | { type: 'LabResultReceived'; labResultId: string; isAbnormal: boolean }
  | { type: 'DailyCheckInCompleted'; checkInId: string; date: Date }
  | { type: 'ChildProfileCreated'; familyId: string; childId: string }
  | { type: 'ConsentGranted'; patientId: string; consentType: ConsentType }
  | { type: 'ConsentRevoked'; patientId: string; consentType: ConsentType };
```

### Value Objects

```typescript
// Health-Domain Value Objects
class HeartRate {
  constructor(private readonly bpm: number) {
    if (bpm < 30 || bpm > 250) {
      throw new InvalidVitalSignError('Heart rate must be between 30 and 250 bpm');
    }
  }
  
  isNormal(): boolean {
    return this.bpm >= 60 && this.bpm <= 100;
  }
  
  get value(): number { return this.bpm; }
}

class BloodPressure {
  constructor(
    private readonly systolic: number,
    private readonly diastolic: number
  ) {
    if (systolic < 70 || systolic > 250) throw new InvalidVitalSignError('Invalid systolic');
    if (diastolic < 40 || diastolic > 150) throw new InvalidVitalSignError('Invalid diastolic');
  }
  
  isHypertensive(): boolean {
    return this.systolic >= 140 || this.diastolic >= 90;
  }
}

class DateOfBirth {
  constructor(private readonly date: Date) {
    if (date > new Date()) throw new Error('Date of birth cannot be in the future');
  }
  
  getAge(): number {
    const today = new Date();
    let age = today.getFullYear() - this.date.getFullYear();
    const monthDiff = today.getMonth() - this.date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.date.getDate())) {
      age--;
    }
    return age;
  }
  
  isChild(): boolean {
    return this.getAge() < 18;
  }
}
```

---

## Persona-Driven Development

Bei jeder Feature-Entscheidung die Personas berücksichtigen:

### Laura Becker (32, Marketing Managerin)
- **Technikaffin**, möchte alles per Smartphone erledigen
- **Vergisst Arzttermine** → Push-Benachrichtigungen mit konfigurierbarem Timing
- **Gesundheitsbewusst** → Wearable-Integration (Apple Watch, Fitbit)
- **Familie**: Kind (2 Jahre) → Vorsorge-Tracker für U-Untersuchungen

### Thomas Wagner (56, Projektleiter)
- **Weniger technikaffin**, braucht einfache Bedienung
- **Vorerkrankungen**: Bluthochdruck → Medikamenten-Erinnerungen sind lebenswichtig
- **Befunde**: Will Laborwerte verstehen → klare Visualisierung mit Referenzbereichen
- **Datenschutz**: Sehr sensibel → transparente Consent-Verwaltung

### Design Implications

```typescript
// Für Thomas: Große, klare Buttons und Schrift
const ACCESSIBILITY_TOKENS = {
  minTouchTarget: '48px',   // WCAG 2.1 AA
  minFontSize: '16px',      // Leserlich für 56-Jährige
  highContrast: true,        // Bluthochdruck → evtl. Sehprobleme
};

// Für Laura: Schnelle Interaktionen, Wearable-Sync
const MOBILE_FIRST_TOKENS = {
  swipeActions: true,        // Schnelles Termin-Management
  pushNotifications: true,   // Arzttermin-Reminder
  wearableSync: true,        // Apple Watch Integration
};
```

---

## Best Practice: Domain-Naming

**Verwende IMMER AIVA Health Domain-Begriffe** statt generischer Terms:

| ❌ Generisch | ✅ AIVA Health Domain |
|---|---|
| `User` | `Patient`, `FamilyMember`, `ChildProfile` |
| `Item` | `Appointment`, `LabResult`, `Medication` |
| `List` | `AppointmentSchedule`, `MedicationPlan`, `VaccinationCalendar` |
| `Service` | `AppointmentService`, `VitalSignService`, `MedicationReminderService` |
| `create()` | `scheduleAppointment()`, `recordVitalSign()`, `addMedication()` |
| `delete()` | `cancelAppointment()`, `archiveLabResult()`, `discontinueMedication()` |
| `status` | `appointmentStatus`, `medicationAdherence`, `checkInStreak` |
