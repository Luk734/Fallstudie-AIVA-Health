# Convention 12 — Testing Strategy

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** AAA Pattern, TDD Workflow, Test Naming, Coverage, Health-Specific Testing.  
> **Geladen von:** Developer Agent, Tester Agent, Reviewer Agent

---

## Test Naming Conventions

### File Naming

```
# Unit Tests
AppointmentCard.test.tsx
appointmentService.test.ts
useAppointments.test.ts

# Integration Tests
AppointmentBooking.integration.test.ts
api.integration.test.ts

# E2E Tests
AppointmentWorkflow.e2e.test.ts
login.e2e.test.ts
```

### Test Name Pattern

Pattern: `should + expected behavior`

```typescript
// ✅ Gute Test-Namen
it('should display next appointment date')
it('should show error when heart rate exceeds 250 bpm')
it('should require consent before showing lab results')
it('should send reminder 30 minutes before appointment')
it('should encrypt patient data before storage')

// ❌ Schlechte Test-Namen
it('works')
it('test appointment')
it('should work correctly')
```

---

## AAA Pattern (Mandatory)

**Arrange-Act-Assert** Muster für alle Tests.

```typescript
describe('AppointmentBookingService', () => {
  describe('book', () => {
    it('should create appointment when patient has consent', () => {
      // Arrange
      const patient = createTestPatient({ consent: ['care:write'] });
      const bookingRequest = { date: tomorrow(), provider: 'Dr. Schmidt' };
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentBookingService(repository);

      // Act
      const appointment = service.book(patient, bookingRequest);

      // Assert
      expect(appointment.status).toBe('BOOKED');
      expect(appointment.patientId).toBe(patient.id);
      expect(appointment.date).toEqual(bookingRequest.date);
    });

    it('should throw ConsentRequiredError when consent missing', () => {
      // Arrange
      const patient = createTestPatient({ consent: [] }); // No consent!
      const service = new AppointmentBookingService(new InMemoryAppointmentRepository());

      // Act & Assert
      expect(() => service.book(patient, { date: tomorrow() }))
        .toThrow(ConsentRequiredError);
    });
  });
});
```

### AAA Rules

- **Always include AAA comments** in tests
- **Separate sections** with blank lines
- **Act & Assert** dürfen kombiniert werden bei Exception-Tests

---

## TDD Workflow

### Red-Green-Refactor

```typescript
// 1. RED — Failing Test schreiben
it('should validate heart rate range', () => {
  expect(() => new HeartRate(300)).toThrow('Heart rate must be 30-250 bpm');
});
// Test FAILS — Klasse existiert noch nicht

// 2. GREEN — Minimaler Code zum Bestehen
class HeartRate {
  constructor(public readonly bpm: number) {
    if (bpm < 30 || bpm > 250) throw new Error('Heart rate must be 30-250 bpm');
  }
}
// Test PASSES

// 3. REFACTOR — Code verbessern
class HeartRate {
  private static readonly MIN_BPM = 30;
  private static readonly MAX_BPM = 250;

  constructor(public readonly bpm: number) {
    if (bpm < HeartRate.MIN_BPM || bpm > HeartRate.MAX_BPM) {
      throw new HealthDataError(
        `Heart rate ${bpm} outside valid range (${HeartRate.MIN_BPM}-${HeartRate.MAX_BPM})`,
        'HEART_RATE'
      );
    }
  }
}
// Test still PASSES, code is cleaner
```

### TDD Principles

- **Write test FIRST** before implementation
- **One test at a time** — single behavior
- **Run tests frequently** — after each change
- **Never skip refactor** — clean code matters

---

## Test Pyramid

```
        /‾‾‾‾‾‾‾‾\
       /   E2E    \          10% — Critical User Flows
      /   (10%)    \
     /‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
    /  Integration    \      20% — API, Module Boundaries
   /    (20%)          \
  /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
 /     Unit Tests         \  70% — Business Logic, Validation
/       (70%)              \
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
```

### Was testen pro Level

| Level | Was | AIVA Beispiele |
|-------|-----|----------------|
| **Unit** | Business Logic, Validation, Value Objects | HeartRate, ConsentCheck, AppointmentBooking |
| **Integration** | API Endpoints, Module-Boundaries, Repositories | POST /appointments, Care→Core |
| **E2E** | Complete User Flows | "Laura bucht Termin", "Thomas sieht Medikamente" |

---

## Coverage Requirements

### Production

| Metrik | Ziel |
|--------|------|
| Line Coverage | ≥ 80% |
| Branch Coverage | ≥ 75% |
| Critical Paths | 100% |

### MVP

| Metrik | Ziel |
|--------|------|
| Line Coverage | ≥ 60% |
| Branch Coverage | ≥ 50% |
| DSGVO-relevant Code | ≥ 90% ⚠️ |

> **Regel**: DSGVO-relevanter Code (Consent, Encryption, Audit) hat IMMER 90%+ Coverage — auch im MVP.

### What to Test

- ✅ **Must**: Business Logic, Validation, Error Handling, Consent Checks, Health Data Processing
- ✅ **Should**: API Endpoints, State Management, User Interactions
- ⚠️ **Lower Priority**: Simple getters/setters, third-party wrappers, config
- ❌ **Skip**: Generated code, trivial utilities

---

## Health-Specific Test Patterns

### Vital Sign Validation Tests

```typescript
describe('HeartRate', () => {
  it('should accept valid heart rate (60 bpm)', () => {
    const hr = new HeartRate(60);
    expect(hr.bpm).toBe(60);
  });

  it('should reject heart rate below 30 bpm', () => {
    expect(() => new HeartRate(29)).toThrow();
  });

  it('should reject heart rate above 250 bpm', () => {
    expect(() => new HeartRate(251)).toThrow();
  });

  it('should accept boundary values', () => {
    expect(() => new HeartRate(30)).not.toThrow();
    expect(() => new HeartRate(250)).not.toThrow();
  });
});
```

### DSGVO Compliance Tests

```typescript
describe('ConsentManagement', () => {
  it('should block data access without consent', async () => {
    const patient = createTestPatient({ consent: [] });
    
    await expect(labService.getResults(patient.id))
      .rejects.toThrow(ConsentRequiredError);
  });

  it('should create audit entry on data access', async () => {
    const patient = createTestPatient({ consent: ['labs:read'] });
    await labService.getResults(patient.id);
    
    const audits = await auditRepository.findByPatient(patient.id);
    expect(audits).toHaveLength(1);
    expect(audits[0].action).toBe('READ');
  });

  it('should delete all patient data on deletion request', async () => {
    const patient = createTestPatient();
    await deletePatientData(patient.id, 'User request');

    expect(await appointmentRepo.findByPatient(patient.id)).toHaveLength(0);
    expect(await labResultRepo.findByPatient(patient.id)).toHaveLength(0);
    expect(await medicationRepo.findByPatient(patient.id)).toHaveLength(0);
  });
});
```

### Medication Reminder Tests

```typescript
describe('MedicationReminderService', () => {
  it('should send reminder at configured time', async () => {
    // Arrange
    const reminder = createReminder({ time: '08:00', medication: 'Ramipril 5mg' });
    const notifier = new MockNotificationService();

    // Act
    await reminderService.checkAndNotify(reminder, notifier);

    // Assert
    expect(notifier.sentNotifications).toHaveLength(1);
    expect(notifier.sentNotifications[0].title).toContain('Ramipril');
  });

  it('should escalate after 3 missed reminders', async () => {
    const reminder = createReminder({ missedCount: 3 });
    
    await reminderService.checkAndNotify(reminder, notifier);
    
    expect(notifier.sentNotifications[0].priority).toBe('HIGH');
    expect(notifier.sentNotifications[0].title).toContain('Dringend');
  });
});
```

---

## Test Utilities

```typescript
// Test Factories für wiederverwendbare Test-Daten
function createTestPatient(overrides?: Partial<Patient>): Patient {
  return {
    id: 'test-patient-001',
    firstName: 'Laura',
    lastName: 'Becker',
    dateOfBirth: new Date('1994-05-15'),
    consent: ['care:read', 'care:write', 'labs:read'],
    ...overrides
  };
}

function createTestAppointment(overrides?: Partial<Appointment>): Appointment {
  return {
    id: 'test-appointment-001',
    patientId: 'test-patient-001',
    date: new Date('2026-03-15T10:00:00Z'),
    status: 'BOOKED',
    provider: 'Dr. Schmidt',
    ...overrides
  };
}
```

---

## Cross-References

- **Review Process** → [Convention 11: Review Process](11-review-process.md)
- **Health Data** → [Convention 06: Health Data](../health-domain/06-health-data.md)
- **Quality Layer** → [Layer 03: Quality](../../system/layers/03-specialization/quality.md)
