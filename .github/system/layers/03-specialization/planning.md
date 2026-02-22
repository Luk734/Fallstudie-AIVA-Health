# Layer 3c: Planning & Organization Specialization

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: Planner, Orchestrator

---

## Planungs-Hierarchie

```
Epic (Monate) — z.B. "AIVA Care Modul"
└── Feature (Wochen) — z.B. "Terminbuchung via Doctolib"
    └── User Story (Tage) — z.B. "Laura kann Hausarzt-Termin buchen"
        └── Task (Stunden) — z.B. "DoctorSearch Component implementieren"
```

### AIVA Health Bounded Contexts als Epics

| Epic | Bounded Context | Fokus |
|------|----------------|-------|
| AIVA Care | Terminmanagement | Doctolib-Integration, Vorsorge-Reminder, Kalender |
| AIVA Coach | Empfehlungen | Tägliche Check-ins, Wearable-Analyse, Handlungsempfehlungen |
| AIVA Labs | Befunde & Medikation | ePA-Integration, Laborwerte, Medikamenten-Plan |
| AIVA Family | Familienkonto | Familienmitglieder, Kinder-Profile, U-Untersuchungen |
| Core Platform | Infrastruktur | Auth, Patient-Profile, Consent, Notifications |

---

## Epic Template

```markdown
# Epic: [Name] (Bounded Context: [Care|Coach|Labs|Family|Core])

## Business Value
[Warum ist das wichtig? Welches Problem löst es? Bezug zu Personas]

## Zielgruppe
[Laura Becker (32)? Thomas Wagner (56)? Beide?]

## DDD Bounded Context
**Context**: [z.B. AIVA Care]
**Aggregates**: [z.B. Appointment, Doctor, PreventionReminder]
**Domain Events**: [z.B. AppointmentScheduled, ReminderSent]

## Erfolgskriterien
- [ ] Kriterium 1 (messbar — z.B. "Termin in <3 Klicks buchbar")
- [ ] Kriterium 2 (messbar)
- [ ] Kriterium 3 (messbar)

## Features
1. [Feature-Link 1]
2. [Feature-Link 2]

## Timeline
- Start: [Datum]
- Target: [Datum]
- Status: [Not Started | In Progress | Completed]

## GitHub Milestone
[Link zum GitHub Milestone]

## Abhängigkeiten
- Blockiert von: [Epic/Feature]
- Blockiert: [Epic/Feature]
```

---

## Feature Template

```markdown
# Feature: [Name]

## Beschreibung
[Was wird implementiert?]

## User Story (High-Level)
Als [Laura/Thomas/Familienmitglied]
Möchte ich [Funktion]
Damit [Nutzen]

## Akzeptanzkriterien
- [ ] AC 1: [Spezifisch, messbar]
- [ ] AC 2: [Spezifisch, messbar]
- [ ] AC 3: [Spezifisch, messbar]

## User Stories
1. [Story-Link 1]
2. [Story-Link 2]

## Technische Details
### Frontend
- Components: [Liste]
- State Management: [Ansatz]
- API-Calls: [Endpoints]

### Backend
- Endpoints: [Liste]
- Database: [Schema-Änderungen]
- Business Logic: [Services]

### Externe Integrationen
- [ ] Doctolib API (Mock/Real)
- [ ] ePA/FHIR (Mock/Real)
- [ ] Wearable SDK (Mock/Real)

## Testing Strategy
- Unit Tests: [Scope]
- Integration Tests: [Scope]
- E2E Tests: [User Journey]
- DSGVO-Tests: [Consent, Encryption, Audit]

## GitHub Issue
[Link zum GitHub Issue mit Labels]

## Labels
`epic:[care|coach|labs|family]`, `priority:[p0|p1|p2]`, `type:feature`

## Timeline
- Estimate: [X Wochen]
```

---

## User Story Template

```markdown
# User Story: [Name]

## Story
Als [Laura (32) / Thomas (56) / Familienmitglied]
Möchte ich [Funktion]
Damit [Nutzen]

## Akzeptanzkriterien
- [ ] AC 1: [Spezifisch, messbar]
- [ ] AC 2: [Spezifisch, messbar]
- [ ] AC 3: [Spezifisch, messbar]

## Tasks
1. [Task-Link 1]
2. [Task-Link 2]

## Definition of Done
- [ ] Code implementiert & reviewed
- [ ] Unit Tests (Coverage ≥ 80%)
- [ ] Integration Tests (Happy Path)
- [ ] E2E Test für Happy Path (wenn applicable)
- [ ] DSGVO-Check (wenn Gesundheitsdaten)
- [ ] Dokumentation aktualisiert
- [ ] QA Sign-off

## Estimate
- Points: [1, 2, 3, 5, 8, 13]

## GitHub Issue
[Link] — Labels: `story`, `epic:care`, `sprint:X`
```

---

## Task Template

```markdown
# Task: [Name]

## Beschreibung
[Was genau muss gemacht werden?]

## Schritte
1. [Schritt 1]
2. [Schritt 2]
3. [Schritt 3]

## Akzeptanzkriterien
- [ ] Kriterium 1
- [ ] Kriterium 2

## Code-Referenzen
- File(s): [path/to/file.ts]
- Function(s): [functionName()]
- Test(s): [path/to/test.spec.ts]

## Estimate
- Hours: [X Stunden]
```

---

## Dependency Management

### Arten von Abhängigkeiten

**Technical**:
```
AIVA Labs braucht Core Platform (Patient-Profil muss existieren)
→ Core Platform zuerst implementieren
```

**Business**:
```
AIVA Family braucht AIVA Care (Familienmitglieder brauchen eigene Termine)
→ AIVA Care zuerst, dann AIVA Family
```

**External Integration**:
```
Doctolib API noch nicht verfügbar → Mock-First
ePA/FHIR Spezifikation unklar → Mock-First, Real Post-MVP
```

### Dependency Matrix

```markdown
| Module | Blockiert von | Blockiert | Status |
|--------|--------------|-----------|--------|
| Core Platform | - | Alle Module | In Progress |
| AIVA Care | Core Platform | AIVA Family | Not Started |
| AIVA Coach | Core Platform | - | Not Started |
| AIVA Labs | Core Platform | - | Not Started |
| AIVA Family | Core Platform, AIVA Care | - | Not Started |
```

---

## Roadmap Planning

### Empfohlene Module-Reihenfolge

```
Phase 1 (Wochen 1-3): Core Platform
  → Auth, Patient-Profil, Consent, Notifications-Skeleton

Phase 2 (Wochen 3-5): AIVA Care (MVP)
  → Terminbuchung (Mock Doctolib), Vorsorge-Reminder

Phase 3 (Wochen 5-7): AIVA Labs (MVP)
  → Befundanzeige (Mock ePA), Medikamenten-Reminder

Phase 4 (Wochen 7-9): AIVA Coach (MVP)
  → Tägliche Check-ins, Basis-Empfehlungen (Mock Wearable)

Phase 5 (Wochen 9-11): AIVA Family (MVP)
  → Familienkonto, Kinder-Profile, U-Untersuchungen

Phase 6 (Wochen 11+): Integration & Polish
  → Echte APIs, Performance, E2E Tests, Release
```

---

## Estimation Techniques

### Story Points (Fibonacci)
```
1 Point  = Trivial (< 2h)   — z.B. Text-Änderung, Config
2 Points = Simple (2-4h)    — z.B. Neue API-Endpoint
3 Points = Medium (4-8h)    — z.B. Neue Component mit Tests
5 Points = Complex (1-2d)   — z.B. Feature mit DB-Schema + API + UI
8 Points = Very Complex (2-3d) — z.B. Externe Integration (Mock)
13 Points = Epic-Level       — z.B. Komplettes Modul → Aufteilen!
```

### Three-Point Estimation
```
Expected = (Optimistic + 4 × Most Likely + Pessimistic) / 6
```

---

## Prioritization: MoSCoW

**Must Have**: Ohne geht MVP nicht
- Patient-Profil, Auth, Consent
- Termin-Übersicht (AIVA Care Core)
- Medikamenten-Reminder (für Thomas essentiell)

**Should Have**: Erhöht Value deutlich
- Wearable-Daten-Import
- Laborwerte mit Referenzbereichen
- Push-Notifications

**Could Have**: Nice to have
- Familien-Sharing
- Vorsorge-Kalender
- Ärzte-Bewertungen

**Won't Have (MVP)**: Post-MVP
- KI-gestützte Diagnose-Vorschläge
- Video-Konsultation
- Krankenkassen-Integration

---

## MVP Scope Framework

### Scope Guard Checklist (Mandatory)

Für jedes Feature MUSS der Planner prüfen:

1. **MVP-Essential?** — Ist es MUST-HAVE für Core User Value?
2. **Can we Mock it?** — Dauert echte Integration >4h? → Mock
3. **Can we Simplify?** — Reicht Happy Path statt Full Error Handling?
4. **Can it Wait?** — Ist es für Post-MVP geeignet?

### Mock-First Entscheidungsmatrix

| Service | Aufwand (Real) | Aufwand (Mock) | Decision | Post-MVP |
|---------|---------------|---------------|----------|----------|
| Doctolib API | 5d | 4h | MOCK | Real API |
| ePA/FHIR | 5d | 4h | MOCK | Real API |
| Apple Health | 3d | 2h | MOCK | Real SDK |
| Auth (OAuth) | 2d | 2h | MOCK | Real OAuth |
| Push Notifications | 1d | 1h | MOCK | Real FCM/APNs |

### Vertical Slicing (Best Practice)

```markdown
❌ BAD: Horizontal Slicing
Sprint 1: Alle DB-Schemas
Sprint 2: Alle API-Endpoints
Sprint 3: Alle UI-Pages
→ Problem: Kein User Value bis Sprint 3

✅ GOOD: Vertical Slicing
Sprint 1: Termin buchen (DB + API + UI) → Laura kann Termin buchen ✅
Sprint 2: Medikament nehmen (DB + API + UI) → Thomas bekommt Reminder ✅
Sprint 3: Laborwert anzeigen (DB + API + UI) → Thomas sieht Befunde ✅
```

---

## Sprint Planning Template

```markdown
# Sprint #XX Planning

## Sprint Goal
[Ein-Satz-Beschreibung]

## Capacity
- Sprint Length: 2 Wochen
- Velocity: XX Points
- Planned: XX Points (80% von Velocity)

## Sprint Backlog
1. [Story-Link] — X Points
2. [Story-Link] — X Points
3. [Story-Link] — X Points

Total: XX Points

## GitHub Milestone
[Link zum Sprint Milestone]
```

---

## GitHub Issues Workflow

### Labels
```
type:epic, type:feature, type:story, type:task, type:bug
priority:p0-critical, priority:p1-high, priority:p2-medium, priority:p3-low
module:care, module:coach, module:labs, module:family, module:core
status:backlog, status:in-progress, status:review, status:done
sprint:1, sprint:2, sprint:3, ...
```

### Milestones
- Jeder Sprint = 1 Milestone
- Jedes MVP-Modul = 1 Milestone
- Release = 1 Milestone

### Issue Hierarchy (via Tasklists)
```markdown
# Epic: AIVA Care (GitHub Issue)

## Tasks
- [ ] #12 Feature: Terminbuchung
  - [ ] #13 Story: Laura kann Arzt suchen
  - [ ] #14 Story: Laura kann Termin buchen
  - [ ] #15 Story: Laura bekommt Erinnerung
- [ ] #16 Feature: Vorsorge-Kalender
```
