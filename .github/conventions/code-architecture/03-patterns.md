# Convention 03 — Architecture Patterns

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** SOLID, Hexagonal Architecture, Clean Code, DDD patterns for AIVA Health.  
> **Geladen von:** Developer Agent, Reviewer Agent, Planner Agent

---

## Hexagonal Architecture (Ports & Adapters)

```
Core Domain (Business Logic)
       ↕️
    Ports (Interfaces)
       ↕️
 Adapters (Implementations)
       ↕️
External Systems (APIs, DB, UI)
```

### Core Domain — Independent Business Logic

```typescript
// Domain Entity (no infrastructure dependency)
export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public date: Date,
    public status: AppointmentStatus,
    public provider: string
  ) {}

  cancel(reason: string): void {
    if (this.status === 'COMPLETED') {
      throw new Error('Cannot cancel a completed appointment');
    }
    this.status = 'CANCELLED';
  }
}
```

### Port — Interface in Core

```typescript
export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
}
```

### Adapter — Infrastructure Implementation

```typescript
// Mock Adapter (MVP)
export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private store = new Map<string, Appointment>();

  async findById(id: string): Promise<Appointment | null> {
    return this.store.get(id) ?? null;
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return [...this.store.values()].filter(a => a.patientId === patientId);
  }

  async save(appointment: Appointment): Promise<void> {
    this.store.set(appointment.id, appointment);
  }
}

// Production Adapter (Post-MVP)
export class PostgresAppointmentRepository implements IAppointmentRepository {
  // Real database implementation
}
```

### Hexagonal Principles

- **Core Domain** hat keine Abhängigkeiten zu Infrastructure
- **Ports** definieren Verträge (Interfaces)
- **Adapters** implementieren Infrastruktur-Details
- **Dependencies zeigen immer nach innen** — Core kennt keine Adapter

> **MVP-Regel**: Im MVP immer zuerst InMemory/Mock-Adapter, dann bei Bedarf echte Adapter.

---

## SOLID Principles (Mandatory)

### S — Single Responsibility Principle

Eine Klasse = Eine Verantwortung.

```typescript
// ✅ Getrennte Verantwortungen
class AppointmentValidator {
  validate(appointment: Appointment): ValidationResult { /* nur Validierung */ }
}

class AppointmentRepository {
  save(appointment: Appointment): Promise<void> { /* nur Persistenz */ }
}

class AppointmentBookingService {
  constructor(
    private validator: AppointmentValidator,
    private repository: IAppointmentRepository,
    private notifier: INotificationService
  ) {}

  async book(appointment: Appointment): Promise<void> {
    const result = this.validator.validate(appointment);
    if (!result.isValid) throw new ValidationError(result.errors);
    await this.repository.save(appointment);
    await this.notifier.send(appointment.patientId, 'Termin gebucht');
  }
}
```

```typescript
// ❌ God Class
class AppointmentManager {
  validate() { }
  save() { }
  sendReminder() { }
  generatePdf() { }
  calculateStatistics() { }
  // Zu viele Verantwortungen!
}
```

### O — Open/Closed Principle

Offen für Erweiterung, geschlossen für Modifikation.

```typescript
// ✅ Erweiterbar über Interfaces
interface INotificationChannel {
  send(patientId: string, message: string): Promise<void>;
}

class PushNotification implements INotificationChannel {
  async send(patientId: string, message: string) { /* Push */ }
}

class InAppNotification implements INotificationChannel {
  async send(patientId: string, message: string) { /* In-App */ }
}

// Neuen Kanal hinzufügen OHNE bestehenden Code zu ändern
class SmsNotification implements INotificationChannel {
  async send(patientId: string, message: string) { /* SMS */ }
}
```

### L — Liskov Substitution Principle

Subtypen müssen für Basistypen einsetzbar sein. Alle Implementierungen eines Interfaces müssen den Vertrag vollständig erfüllen.

### I — Interface Segregation Principle

Clients sollen nicht von Interfaces abhängen, die sie nicht nutzen.

```typescript
// ✅ Kleine, spezifische Interfaces
interface IAppointmentReader {
  findById(id: string): Promise<Appointment | null>;
  findByPatient(patientId: string): Promise<Appointment[]>;
}

interface IAppointmentWriter {
  save(appointment: Appointment): Promise<void>;
  delete(id: string): Promise<void>;
}

// Services nutzen nur was sie brauchen
class AppointmentListService {
  constructor(private reader: IAppointmentReader) {} // Nur Lesen
}
```

### D — Dependency Inversion Principle

Abhängigkeiten auf Abstraktionen, nicht auf Konkretionen.

```typescript
// ✅ Abhängigkeit auf Interface
class AppointmentBookingService {
  constructor(private repository: IAppointmentRepository) {} // Interface!
}

// ❌ Abhängigkeit auf konkrete Klasse
class AppointmentBookingService {
  constructor(private repository: PostgresAppointmentRepository) {} // Konkret!
}
```

---

## DDD — Domain-Driven Design Patterns

### Aggregate Pattern

```typescript
// Appointment is the Aggregate Root
class Appointment {
  private reminders: Reminder[] = [];

  addReminder(minutesBefore: number): void {
    if (this.reminders.length >= 3) {
      throw new Error('Maximum 3 reminders per appointment');
    }
    this.reminders.push(new Reminder(this.id, minutesBefore));
  }

  // Nur über das Aggregate Root auf Reminders zugreifen
  getReminders(): readonly Reminder[] {
    return [...this.reminders];
  }
}
```

### Repository Pattern

```typescript
// Repository liefert immer vollständige Aggregates
interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;  // Ganzes Aggregate
  save(appointment: Appointment): Promise<void>;       // Ganzes Aggregate
}
// KEIN: findRemindersForAppointment() — Zugriff nur über Aggregate Root
```

### Domain Event Pattern

```typescript
abstract class DomainEvent {
  readonly occurredAt: Date = new Date();
  abstract readonly type: string;
}

class AppointmentBooked extends DomainEvent {
  readonly type = 'APPOINTMENT_BOOKED';
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
    public readonly date: Date
  ) { super(); }
}
```

---

## Clean Code Rules

### Function Size
- **Max 20 Lines** per Function (Empfehlung)
- **Max 3 Parameters** per Function
- Bei mehr Parametern → Object Parameter verwenden

### Nesting
- **Max 3 Levels** Nesting
- Early Return Pattern verwenden

```typescript
// ✅ Early Return
function bookAppointment(patient: Patient, date: Date): Appointment {
  if (!patient.isActive) throw new Error('Patient inactive');
  if (!isWeekday(date)) throw new Error('Only weekdays');
  if (date < new Date()) throw new Error('Date in past');

  return new Appointment(patient.id, date);
}

// ❌ Deep Nesting
function bookAppointment(patient: Patient, date: Date): Appointment {
  if (patient.isActive) {
    if (isWeekday(date)) {
      if (date >= new Date()) {
        return new Appointment(patient.id, date);
      }
    }
  }
  throw new Error('Invalid');
}
```

### DRY — Don't Repeat Yourself
- Code der 3x vorkommt → Extrahieren
- Aber: Premature Abstraction vermeiden (im MVP lieber WET als falsch abstrakt)

---

## Cross-References

- **Code Structure** → [Convention 01: Code Structure](01-code-structure.md)
- **Naming** → [Convention 02: Naming](02-naming.md)
- **Error Handling** → [Convention 04: Error Handling](04-error-handling.md)
- **Domain Knowledge Layer** → [Layer 01](../../system/layers/01-domain-knowledge.md)
