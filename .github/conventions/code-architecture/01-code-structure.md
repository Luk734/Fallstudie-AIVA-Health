# Convention 01 — Code Structure & Naming

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Code naming conventions, file structure, and TypeScript strict mode rules.  
> **Geladen von:** Developer Agent, Reviewer Agent

---

## Naming Conventions — TypeScript/JavaScript

### Classes & Interfaces

- **Classes**: PascalCase (`AppointmentService`, `VitalSignValidator`)
- **Interfaces**: PascalCase with optional 'I' prefix (`IAppointmentRepository`, `HealthMetric`)
- **Types**: PascalCase (`AppointmentStatus`, `ConsentType`)

### Functions & Methods

- **Functions/Methods**: camelCase, use verbs (`bookAppointment()`, `fetchLabResults()`, `saveConsent()`)
- **Async Functions**: camelCase with descriptive action verbs (`syncWearableDataAsync()`)

### Variables & Parameters

- **Variables/Parameters**: camelCase (`patientName`, `heartRate`, `isConsentGiven`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_HEART_RATE_BPM`, `CONSENT_EXPIRY_DAYS`, `DEFAULT_REMINDER_MINUTES`)
- **Private Class Members**: Underscore prefix optional (`_cache`, `_encryptionKey`)

### Boolean Variables

- Use prefixes: `is`, `has`, `should`, `can`
- Examples: `isConsentGiven`, `hasActiveReminder`, `shouldEscalate`, `canShareData`

### Event Handlers

- Use `on` or `handle` prefix
- Examples: `onCheckIn()`, `handleMedicationTaken()`, `handleAppointmentBooked()`

### Arrays

- Use plural form: `appointments`, `medications`, `labResults`, `familyMembers`

### Anti-Patterns (Forbidden)

- ❌ Too short names: `d`, `data`, `temp`
- ❌ Abbreviations: `appt`, `med`, `usr`
- ❌ Generic names without context: `value`, `item`, `result`

---

## Health-Domain Naming Guide

| Concept | ✅ Good | ❌ Bad |
|---------|---------|--------|
| Termin | `appointment`, `Appointment` | `appt`, `termin`, `apt` |
| Medikament | `medication`, `Medication` | `med`, `drug`, `pill` |
| Laborbefund | `labResult`, `LabResult` | `lab`, `result`, `lr` |
| Vitalzeichen | `vitalSign`, `VitalSign` | `vital`, `vs`, `sign` |
| Einwilligung | `consent`, `Consent` | `ok`, `agreed`, `perm` |
| Familienmitglied | `familyMember`, `FamilyMember` | `member`, `fm`, `fam` |

> **Regel**: Domänenbegriffe IMMER ausschreiben — Gesundheitsdaten erfordern Klarheit.

---

## File & Folder Structure (tech-agnostic Empfehlung)

```
src/
├── modules/                    # Bounded Contexts als Module
│   ├── care/                   # AIVA Care (Terminmanagement)
│   │   ├── components/         # UI Components (PascalCase)
│   │   │   ├── AppointmentCard/
│   │   │   │   ├── AppointmentCard.tsx
│   │   │   │   ├── AppointmentCard.test.tsx
│   │   │   │   └── index.ts
│   │   ├── services/           # Business Logic (camelCase)
│   │   │   └── appointmentService.ts
│   │   ├── types/              # Type Definitions
│   │   │   └── appointment.types.ts
│   │   └── hooks/              # Custom Hooks
│   │       └── useAppointments.ts
│   ├── coach/                  # AIVA Coach
│   ├── labs/                   # AIVA Labs
│   └── family/                 # AIVA Family
├── shared/                     # Cross-Module Shared Code
│   ├── components/             # Shared UI (Design System Wrappers)
│   ├── services/               # Auth, Consent, Notification
│   ├── types/                  # Shared Types (Patient, User, etc.)
│   ├── utils/                  # Formatters, Validators
│   └── constants/              # App-wide Constants
├── infrastructure/             # Adapters & External
│   ├── api/                    # API Clients
│   ├── mocks/                  # Mock Implementations (MVP)
│   └── storage/                # Local Storage, Cache
└── app/                        # App Shell, Routing, Layout
```

### File Naming Rules

- **Components**: PascalCase (`AppointmentCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAppointments.ts`)
- **Services**: camelCase with 'Service' suffix (`appointmentService.ts`)
- **Types**: lowercase with `.types.ts` suffix (`appointment.types.ts`)
- **Constants**: lowercase with `.constants.ts` suffix (`care.constants.ts`)
- **Tests**: Same name + `.test.tsx/ts`
- **Mocks**: Same name + `.mock.ts` or in `__mocks__/` directory
- **CSS Modules**: Same name + `.module.css`

---

## TypeScript Strict Mode (Mandatory)

Alle TypeScript-Projekte müssen Strict Mode aktiviert haben.

### tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Forbidden Patterns

- ❌ FORBIDDEN: `any` — `function processData(data: any) { }`
- ❌ FORBIDDEN: `as any` casts — `const result = someFunction() as any;`
- ❌ AVOID: Non-null assertions (`!`), use optional chaining instead

### Null Safety

- **Optional Chaining**: `const name = patient?.firstName;`
- **Nullish Coalescing**: `const display = name ?? 'Unbekannter Patient';`
- **Type Guards**: Use `typeof`, `in`, or custom type guard functions

---

## Cross-References

- **Architektur-Patterns** → [Convention 03: Patterns](03-patterns.md)
- **Error Handling** → [Convention 04: Error Handling](04-error-handling.md)
- **Health-Domain Naming** → [Layer 01: Domain Knowledge](../../system/layers/01-domain-knowledge.md)
