# Convention 13 — Documentation

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Documentation Standards für AIVA Health — Code Comments, README, ADRs.  
> **Geladen von:** ALL Agents

---

## Code Documentation

### JSDoc/TSDoc (Mandatory für public APIs)

```typescript
/**
 * Books an appointment for a patient with a healthcare provider.
 * 
 * @param patientId - The patient's unique identifier
 * @param request - Booking details including date and provider
 * @returns The created appointment with status BOOKED
 * @throws {ConsentRequiredError} If patient has no 'care:write' consent
 * @throws {NotFoundError} If patient does not exist
 * @throws {ValidationError} If booking date is in the past
 * 
 * @example
 * ```typescript
 * const appointment = await bookingService.book('patient-123', {
 *   date: new Date('2026-03-15T10:00:00Z'),
 *   provider: 'Dr. Schmidt'
 * });
 * ```
 */
async function book(patientId: string, request: BookingRequest): Promise<Appointment> {
  // ...
}
```

### Wann dokumentieren

| Element | Dokumentation | Format |
|---------|--------------|--------|
| Public Functions/Methods | ✅ Pflicht | JSDoc/TSDoc |
| Interfaces/Types | ✅ Pflicht | TSDoc |
| Complex Logic | ✅ Pflicht | Inline Comments |
| Private Methods | ⚠️ Bei Komplexität | Inline Comments |
| Constants | ✅ Wenn nicht selbsterklärend | JSDoc |
| Triviale Getter/Setter | ❌ Nicht nötig | – |

### Inline Comments

```typescript
// ✅ Erklärt WARUM, nicht WAS
// Herzfrequenz unter 30 bpm wird als Sensordefekt gewertet, 
// nicht als medizinisch plausibel (selbst bei Bradykardie)
if (heartRate.bpm < 30) {
  return { status: 'SENSOR_ERROR', value: heartRate.bpm };
}

// ❌ Erklärt WAS (überflüssig)
// Check if heart rate is less than 30
if (heartRate.bpm < 30) { }
```

---

## README Standards

Jedes Modul, jede Komponente, jedes Package braucht eine README.md:

### Modul-README Template

```markdown
# AIVA [Module Name]

> Kurzbeschreibung in einem Satz.

## Features
- Feature 1
- Feature 2

## Getting Started
\`\`\`bash
# Installation
npm install

# Development
npm run dev

# Tests
npm test
\`\`\`

## Architecture
<!-- Kurze Beschreibung der Architektur -->

## API Reference
<!-- Wichtigste Endpoints/Interfaces -->

## Testing
<!-- Wie Tests ausführen, was ist abgedeckt -->

## Related
- [Convention X](link)
- [Module Y](link)
```

---

## Architecture Decision Records (ADRs)

Format für wichtige architektonische Entscheidungen.

### ADR Template

```markdown
# ADR-[NNN]: [Titel]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Context
Was ist das Problem? Warum muss eine Entscheidung getroffen werden?

## Decision
Was wurde entschieden?

## Consequences
### Positive
- Plus 1
- Plus 2

### Negative
- Minus 1
- Minus 2

### Neutral
- Hinweis
```

### ADR Beispiel für AIVA Health

```markdown
# ADR-001: Mock-First für externe Integrationen im MVP

## Status
Accepted

## Context
AIVA Health integriert Doctolib (Termine), ePA (Befunde), und 
Wearables (Gesundheitsdaten). Echte API-Zugänge sind im MVP 
nicht verfügbar. Wir müssen entscheiden, wie wir damit umgehen.

## Decision
Alle externen Integrationen werden initial als Mock implementiert
mit Interface-Abstraktion (Hexagonal Architecture), sodass echte
Implementierungen später ohne Code-Änderung in der Business Logic
eingesetzt werden können.

## Consequences
### Positive
- MVP-Fortschritt nicht durch externe Dependencies blockiert
- Saubere Architektur von Anfang an
- Einfaches Testing

### Negative
- Mock-Daten bilden nicht alle Edge Cases ab
- Zusätzlicher Aufwand für Mock-Implementierungen
```

---

## Changelog

Jedes Release braucht einen CHANGELOG-Eintrag:

```markdown
# Changelog

## [0.2.0] - 2026-03-15
### Added
- AIVA Labs: Medikamenten-Liste und Reminder
- AIVA Labs: Laborbefund-Anzeige (Mock-ePA)

### Fixed
- Consent-Check Race Condition bei parallelen Requests

### Changed
- Appointment-Buchung um Provider-Auswahl erweitert

## [0.1.0] - 2026-02-15
### Added
- AIVA Care MVP: Termine anzeigen, buchen, erinnern
- Core Platform: Auth, Consent, Design System Basis
```

---

## Cross-References

- **Code Conventions** → [Convention 01: Code Structure](../code-architecture/01-code-structure.md)
- **Review Process** → [Convention 11: Review Process](11-review-process.md)
