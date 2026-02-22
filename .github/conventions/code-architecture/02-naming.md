# Convention 02 — Naming Conventions (Domain-Specific)

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Einheitliche Namensgebung für AIVA Health Bounded Contexts, Domain Events, und Aggregates.  
> **Geladen von:** Developer Agent, Reviewer Agent, Planner Agent

---

## Bounded Context Naming

Jedes AIVA-Modul = ein Bounded Context. Alle Klassen, Services und Interfaces innerhalb eines Bounded Contexts tragen den Context-Prefix **nur wenn nötig** (bei Cross-Module Usage).

| Bounded Context | Prefix (wenn nötig) | Beispiele |
|----------------|---------------------|-----------|
| AIVA Care | `Care` | `CareAppointment`, `CareReminderService` |
| AIVA Coach | `Coach` | `CoachCheckIn`, `CoachRecommendation` |
| AIVA Labs | `Labs` | `LabsResult`, `LabsMedication` |
| AIVA Family | `Family` | `FamilyAccount`, `FamilyMemberInvite` |
| Core Platform | – | `Patient`, `User`, `ConsentRecord` |

> **Regel**: Innerhalb eines Moduls **keinen** Prefix verwenden.  
> `appointmentService.ts` in `modules/care/` — nicht `careAppointmentService.ts`.

---

## Aggregate Naming

Aggregates sind PascalCase und beschreiben die Business-Entität.

```typescript
// ✅ Gute Aggregate-Namen
class Appointment { }        // Care
class DailyCheckIn { }       // Coach  
class LabResult { }          // Labs
class MedicationReminder { } // Labs
class FamilyAccount { }      // Family
class Patient { }            // Core

// ❌ Schlechte Aggregate-Namen
class AppointmentData { }    // "Data" suffix ist überflüssig
class CheckInEntity { }      // "Entity" suffix vermeiden
class MedReminder { }        // Abkürzungen verboten
```

---

## Domain Event Naming

Pattern: `<Entity><PastTenseVerb>` (immer Vergangenheitsform)

```typescript
// ✅ Korrekte Domain Events
type AppointmentBooked = { appointmentId: string; patientId: string; date: Date };
type AppointmentCancelled = { appointmentId: string; reason: string };
type MedicationTaken = { medicationId: string; takenAt: Date };
type MedicationSkipped = { medicationId: string; skippedAt: Date; reason?: string };
type CheckInCompleted = { patientId: string; mood: number; date: Date };
type LabResultReceived = { resultId: string; type: string; value: number };
type ConsentGranted = { patientId: string; scope: string; grantedAt: Date };
type ConsentRevoked = { patientId: string; scope: string; revokedAt: Date };
type FamilyMemberInvited = { accountId: string; email: string };

// ❌ Falsche Domain Events
type BookAppointment = { };    // Imperativ statt Vergangenheit
type AppointmentEvent = { };   // Zu generisch
type ApptBooked = { };         // Abkürzung
```

---

## Value Object Naming

Value Objects sind PascalCase und beschreiben den Wert, den sie kapseln.

```typescript
// ✅ Gute Value Object Namen
class HeartRate { constructor(public readonly bpm: number) {} }
class BloodPressure { constructor(public readonly systolic: number, public readonly diastolic: number) {} }
class DateOfBirth { constructor(public readonly date: Date) {} }
class EmailAddress { constructor(public readonly value: string) {} }
class MedicationDosage { constructor(public readonly amount: number, public readonly unit: string) {} }

// ❌ Schlechte Value Object Namen
class HeartRateValue { }    // "Value" suffix redundant
class PressureVO { }        // Abkürzungen
class DOB { }               // Akronyme
```

---

## Service Naming

Pattern: `<Verb/Noun>Service` oder `<Context>Service`

```typescript
// ✅ Domain Services
class AppointmentBookingService { }    // Verb-basiert: beschreibt Aktion
class VitalSignValidationService { }   // spezifischer Kontext
class ConsentManagementService { }     // Management-Pattern für CRUD+Logik

// ✅ Application Services
class NotificationService { }          // Cross-Cutting
class AuthenticationService { }        // Infrastructure-nah
class DataExportService { }            // DSGVO-Feature

// ❌ Schlechte Service-Namen
class AppointmentHelper { }            // "Helper" vermeiden
class DataManager { }                  // Zu generisch
class Utils { }                        // Verboten
```

---

## Repository Naming

Pattern: `I<Entity>Repository` (Interface) + `<Implementation><Entity>Repository`

```typescript
// Interface
interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
}

// Implementation (Adapter)
class InMemoryAppointmentRepository implements IAppointmentRepository { }  // MVP Mock
class PostgresAppointmentRepository implements IAppointmentRepository { }  // Production
```

---

## API Endpoint Naming

RESTful, Plural, kebab-case:

```
GET    /api/appointments              # Liste aller Termine
GET    /api/appointments/:id          # Einzelner Termin
POST   /api/appointments              # Neuen Termin erstellen
PUT    /api/appointments/:id          # Termin aktualisieren
DELETE /api/appointments/:id          # Termin löschen

GET    /api/patients/:id/medications  # Medikamente eines Patienten
POST   /api/check-ins                 # Neuen Check-In erstellen
GET    /api/lab-results/:id           # Laborbefund abrufen
POST   /api/family-accounts/:id/invites  # Familienmitglied einladen
```

### Verbotene Patterns

- ❌ Verben in URLs: `/api/getAppointments`, `/api/createPatient`
- ❌ Singular: `/api/appointment`
- ❌ camelCase: `/api/labResults`
- ❌ Deutsche Begriffe: `/api/termine`, `/api/befunde`

---

## File & Folder Naming per Module

```
modules/care/
├── domain/
│   ├── Appointment.ts            # Aggregate (PascalCase)
│   ├── AppointmentStatus.ts      # Enum/Type
│   └── events/
│       ├── AppointmentBooked.ts   # Domain Event
│       └── AppointmentCancelled.ts
├── services/
│   └── appointmentBookingService.ts  # Service (camelCase)
├── repositories/
│   └── IAppointmentRepository.ts     # Interface
├── components/
│   └── AppointmentCard/
│       ├── AppointmentCard.tsx        # Component (PascalCase)
│       └── AppointmentCard.test.tsx
└── types/
    └── care.types.ts                  # Types
```

---

## Cross-References

- **Code Structure** → [Convention 01: Code Structure](01-code-structure.md)
- **Domain Knowledge** → [Layer 01: Domain Knowledge](../../system/layers/01-domain-knowledge.md)
- **API Design** → [Convention 16: API Design](../fullstack/16-api-design.md)
