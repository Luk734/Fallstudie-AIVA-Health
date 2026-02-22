# Convention 04 — Error Handling

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Einheitliches Error Handling für AIVA Health — Custom Errors, API-Fehler, Health-Data Validation.  
> **Geladen von:** Developer Agent, Reviewer Agent

---

## Custom Error Hierarchy

```typescript
// Base Error für alle AIVA Health Errors
export class AivaError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Domain Errors
export class ValidationError extends AivaError {
  constructor(
    message: string,
    public readonly field: string,
    public readonly violations: string[]
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends AivaError {
  constructor(resource: string, id: string) {
    super(`${resource} with id '${id}' not found`, 'NOT_FOUND', 404);
  }
}

export class ConsentRequiredError extends AivaError {
  constructor(
    public readonly scope: string,
    public readonly patientId: string
  ) {
    super(
      `Consent required for scope '${scope}'`,
      'CONSENT_REQUIRED',
      403
    );
  }
}

export class HealthDataError extends AivaError {
  constructor(
    message: string,
    public readonly dataType: string,
    public readonly patientId: string
  ) {
    super(message, 'HEALTH_DATA_ERROR', 422);
  }
}
```

---

## Error Handling Patterns

### Try-Catch mit spezifischen Fehlern

```typescript
// ✅ Spezifische Fehlerbehandlung
async function bookAppointment(data: BookingRequest): Promise<Appointment> {
  try {
    const patient = await patientRepository.findById(data.patientId);
    if (!patient) throw new NotFoundError('Patient', data.patientId);

    if (!patient.hasConsent('care:appointments')) {
      throw new ConsentRequiredError('care:appointments', data.patientId);
    }

    const appointment = Appointment.create(patient, data.date, data.provider);
    await appointmentRepository.save(appointment);
    return appointment;

  } catch (error) {
    if (error instanceof AivaError) throw error; // Re-throw known errors
    
    // Log unknown errors, wrap in generic error
    logger.error('Unexpected error in bookAppointment', { error, data });
    throw new AivaError('Unexpected error', 'INTERNAL_ERROR', 500, false);
  }
}
```

### Error Response Format (API)

```typescript
// Einheitliches Error-Response-Format
interface ErrorResponse {
  error: {
    code: string;             // Machine-readable code
    message: string;          // Human-readable message (KEINE Gesundheitsdaten!)
    field?: string;           // Betroffenes Feld (bei Validation)
    violations?: string[];    // Liste der Validierungsfehler
    timestamp: string;        // ISO 8601
    requestId: string;        // Für Support/Debugging
  };
}

// Beispiel-Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid vital sign data",
    "field": "heartRate",
    "violations": ["Heart rate must be between 30 and 250 bpm"],
    "timestamp": "2026-02-03T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## Health-Data Validation Errors

### Vital Sign Validation

```typescript
function validateHeartRate(bpm: number): void {
  if (bpm < 30 || bpm > 250) {
    throw new HealthDataError(
      `Heart rate ${bpm} bpm is outside valid range (30-250)`,
      'HEART_RATE',
      '' // patientId wird vom Caller gesetzt
    );
  }
}

function validateBloodPressure(systolic: number, diastolic: number): void {
  if (systolic < 60 || systolic > 300) {
    throw new HealthDataError(
      'Systolic pressure outside valid range (60-300 mmHg)',
      'BLOOD_PRESSURE',
      ''
    );
  }
  if (diastolic < 30 || diastolic > 200) {
    throw new HealthDataError(
      'Diastolic pressure outside valid range (30-200 mmHg)',
      'BLOOD_PRESSURE',
      ''
    );
  }
  if (diastolic >= systolic) {
    throw new HealthDataError(
      'Diastolic must be less than systolic',
      'BLOOD_PRESSURE',
      ''
    );
  }
}
```

---

## Error Logging Rules

### Was loggen

| Severity | Was | Beispiel |
|----------|-----|----------|
| `error` | Unerwartete Fehler, System-Ausfälle | DB down, API timeout |
| `warn` | Erwartete aber problematische Zustände | Consent abgelaufen, Rate limit |
| `info` | Wichtige Business-Events | Termin gebucht, Befund empfangen |
| `debug` | Entwicklung, Detail-Infos | Request/Response Details |

### Was NIEMALS loggen (DSGVO!)

- ❌ **Gesundheitsdaten**: Laborbefunde, Vitalzeichen, Diagnosen
- ❌ **Patientendaten**: Name, Geburtsdatum, Adresse
- ❌ **Credentials**: Passwörter, Tokens, API Keys
- ❌ **Vollständige Request Bodies** mit Patientendaten

```typescript
// ✅ Sicheres Logging
logger.error('Failed to save lab result', {
  resultId: labResult.id,       // ID ok
  patientId: patient.id,        // ID ok (pseudonymisiert)
  errorCode: error.code,
  timestamp: new Date().toISOString()
});

// ❌ DSGVO-Verstoß!
logger.error('Failed to save lab result', {
  patient: patient,             // Gesamtes Patient-Objekt!
  labValues: labResult.values,  // Gesundheitsdaten!
  errorMessage: error.message
});
```

---

## Global Error Handler

```typescript
// Zentraler Error Handler für API
function globalErrorHandler(error: Error, req: Request, res: Response): void {
  if (error instanceof AivaError) {
    // Known operational error
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string
      }
    });
  } else {
    // Unknown error — generic response, detailed logging
    logger.error('Unhandled error', {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      requestId: req.headers['x-request-id']
    });

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string
      }
    });
  }
}
```

---

## Async Error Handling

```typescript
// ✅ Promise.allSettled für parallele Operations 
async function syncAllModules(patientId: string): Promise<SyncResult> {
  const results = await Promise.allSettled([
    syncAppointments(patientId),
    syncMedications(patientId),
    syncLabResults(patientId)
  ]);

  const failures = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason);

  if (failures.length > 0) {
    logger.warn('Partial sync failure', {
      patientId,
      failedModules: failures.map(f => f.code)
    });
  }

  return { 
    success: results.filter(r => r.status === 'fulfilled').length,
    failed: failures.length
  };
}
```

---

## Cross-References

- **Security** → [Convention 05: Security](../process-quality/05-security.md)
- **Health Data** → [Convention 06: Health Data](../health-domain/06-health-data.md)
- **Testing** → [Convention 12: Testing](../process-quality/12-testing-strategy.md)
- **Security Context** → [Context: Security](../../context/security.md)
