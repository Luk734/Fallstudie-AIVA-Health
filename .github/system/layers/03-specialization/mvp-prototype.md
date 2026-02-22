# Layer 3d: MVP & Prototype Specialization

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: Developer (MVP-Mode), Planner (MVP-Scoping), UX-Designer (Prototyping)

---

## MVP vs. Prototype vs. Production

### Production Code
**Ziel**: Langlebig, wartbar, skalierbar, vollständig getestet

- ✅ 80%+ Test Coverage (Unit + Integration + E2E)
- ✅ SOLID Principles, Clean Architecture
- ✅ Vollständige Dokumentation
- ✅ Error Handling für alle Edge Cases
- ✅ Performance-optimiert
- ✅ Security-hardened (OWASP Top 10)
- ✅ DSGVO-vollständig (Consent, Audit, Encryption)
- ✅ Accessibility (WCAG 2.1 AA)

**Quality Gates**: 0 Errors, 80% Coverage, 0 Critical Vulns — BLOCKING

### MVP (Minimum Viable Product)
**Ziel**: Schnellstmöglich echten User-Value liefern, lernen, iterieren

- ✅ Core Features only (80/20-Regel)
- ✅ 60-70% Test Coverage acceptable
- ⚠️ Mock statt Real Implementation wo möglich (Doctolib, ePA, Wearables)
- ⚠️ Simplified Error Handling (Happy Path + Basic Errors)
- ⚠️ Manual Deployment acceptable
- ✅ **ABER**: Security & DSGVO non-negotiable
- ✅ **ABER**: Code muss erweiterbar sein (kein Throw-Away)

**Quality Gates**: 60% Coverage OK, ABER 0 Critical Vulnerabilities

**Timeline**: MVPs dauern 2-8 Wochen (Timeboxed!)

### Prototype
**Ziel**: Konzept validieren, Feedback sammeln (Throw-Away Code OK)

- ⚠️ Hardcoded Mock Data acceptable
- ⚠️ No Tests required
- ⚠️ No Error Handling (Happy Path only)
- ⚠️ Inline Styles acceptable
- ✅ Fokus auf User Flow & Interactions
- ✅ Schnelle Iteration (Stunden/Tage)

**Quality Gates**: KEINE (Ziel ist Lernen, nicht Production)

**Timeline**: 1-5 Tage (Strict Timeboxing!)

---

## MVP-Prinzipien (Lean Startup)

### 1. Build-Measure-Learn Loop
```
1. BUILD: Kleinste testbare Hypothese implementieren
   → z.B. "Können wir Termine in <3 Klicks buchen?"
2. MEASURE: User Feedback sammeln
   → z.B. Laura testet Terminbuchung, Thomas testet Medikamenten-Reminder
3. LEARN: Validieren oder Verwerfen
   → z.B. "Push-Reminder reicht für Thomas" oder "Thomas braucht SMS"
4. REPEAT: Nächste Iteration
```

**Timeboxing**: Jede Iteration max. 2 Wochen

### 2. Scope Discipline (MoSCoW)

```markdown
## MVP Scope: AIVA Care

**MUST**:
- Termin-Übersicht (nächste 3 Termine)
- Termin buchen (Mock Doctolib)
- Erinnerung erstellen (Push-Mock)

**SHOULD**:
- Arzt suchen (by Fachrichtung)
- Termin absagen

**COULD**:
- Vorsorge-Kalender
- Termin-Historie

**WON'T (MVP)**:
- Echte Doctolib-API (→ Post-MVP)
- Video-Konsultation (→ v2.0)
- Bewertungen (→ v2.0)
```

### 3. Mock-First Strategy

**Regel**: Wenn Integration > 4 Stunden dauert → Mock it!

```typescript
// MVP: Mock Doctolib Service
class MockDoctolibService implements IDoctolibService {
  async searchDoctors(specialty: string): Promise<Doctor[]> {
    console.log(`[MOCK] Searching doctors: ${specialty}`);
    return [
      { id: '1', name: 'Dr. Müller', specialty: 'Hausarzt', nextSlot: tomorrow() },
      { id: '2', name: 'Dr. Schmidt', specialty: 'Kardiologie', nextSlot: nextWeek() },
    ];
    // TODO: Post-MVP — echte Doctolib API
  }
  
  async bookAppointment(doctorId: string, slot: TimeSlot): Promise<Appointment> {
    console.log(`[MOCK] Booking: doctor=${doctorId}`);
    return { id: generateId(), doctorId, slot, status: 'confirmed' };
    // TODO: Post-MVP — echte Buchungs-API
  }
}
```

**Mock-Kandidaten für AIVA Health**:

| Service | Mock | Post-MVP Real Integration |
|---------|------|--------------------------|
| Doctolib API | MockDoctolibService | Doctolib Partner-API |
| ePA/FHIR | MockEPAService | Gematik ePA API |
| Apple Health | MockWearableService | HealthKit SDK |
| Google Fit | MockWearableService | Google Fit API |
| Push Notifications | console.log | FCM / APNs |
| Auth | MockAuthService | OAuth 2.0 / OpenID Connect |

### 4. Timeboxing

```markdown
## Feature Timeline (Strict)
- 1 Feature: Max 1 Woche
- 1 Sprint: Max 2 Wochen
- 1 MVP-Modul: Max 3 Wochen
- Gesamt-MVP: Max 8 Wochen

## Scope Cut Trigger
- Tag 5 von 7: Review — Schaffen wir Feature?
  → JA: Weitermachen
  → NEIN: SHOULD → WON'T, nur MUST ausliefern
```

### 5. 80/20-Regel (Pareto)

```markdown
## AIVA Care: Value/Effort Analysis

| Feature | User Value | Effort | Ratio | MVP? |
|---------|-----------|--------|-------|------|
| Termin-Übersicht | 10 | 2 | 5.0 | ✅ MUST |
| Termin buchen (Mock) | 9 | 3 | 3.0 | ✅ MUST |
| Erinnerung (Push-Mock) | 8 | 2 | 4.0 | ✅ MUST |
| Arzt suchen | 6 | 2 | 3.0 | ⚠️ SHOULD |
| Vorsorge-Kalender | 4 | 4 | 1.0 | ❌ WON'T |
| Video-Konsultation | 3 | 8 | 0.4 | ❌ WON'T |

→ Top 3 Features = MVP Core
```

### 6. Dokumentation WHY (ADRs für Scope-Cuts)

```markdown
# ADR-001: Scope Cut — Video-Konsultation

## Status: Accepted

## Context
MVP Timeline: 8 Wochen. Video-Konsultation würde 8 Tage kosten.

## Decision
WON'T HAVE in MVP. Terminbuchung über Doctolib (Mock) ausreichend für User Tests.

## Consequences
- ✅ Spart 8 Tage Entwicklung
- ✅ Kann Terminbuchung first validieren
- ⚠️ Premium-Feature für spätere Monetarisierung
- 🔄 Revisit Post-MVP basierend auf Feedback
```

---

## Scope-Management Patterns

### Vertical Slicing

```markdown
✅ GOOD: Vertical Slicing für AIVA Health

Slice 1: Termin buchen (E2E) — 3 Tage
  - [ ] DB: appointments table (5 Spalten)
  - [ ] API: POST /api/appointments (Basic Validation)  
  - [ ] UI: BookAppointmentPage (DoctorSearch + SlotPicker)
  Value: Laura kann Termin buchen ✅

Slice 2: Medikament nehmen (E2E) — 2 Tage
  - [ ] DB: medication_reminders table
  - [ ] API: PUT /api/medications/:id/take
  - [ ] UI: MedicationReminderCard (Take/Snooze/Skip)
  Value: Thomas bekommt Reminder ✅

Slice 3: Laborwert anzeigen (E2E) — 2 Tage
  - [ ] DB: lab_results table
  - [ ] API: GET /api/lab-results
  - [ ] UI: LabResultChart (mit Referenzbereich)
  Value: Thomas sieht Befunde ✅
```

### MVP Definition of Done (Reduced)

```markdown
## MVP DoD
- [ ] Code implementiert & reviewed
- [ ] Unit Tests (≥60% Coverage, Critical Paths)
- [ ] ⚠️ Integration Tests (Happy Path only)
- [ ] ⚠️ NO E2E Tests (manual testing acceptable)
- [ ] ⚠️ Error Handling (Happy Path + Basic Errors)
- [ ] ✅ DSGVO-Check (Gesundheitsdaten verschlüsselt)
- [ ] ✅ Security scan (0 Critical)
- [ ] ✅ ADR für Scope-Cuts
```

---

## MVP-Mode Agent Behavior

### Developer Agent (MVP-Mode)
**Temperature**: 0.3 → 0.35 (mehr Pragmatismus)

**Vor jeder Implementation fragen**:
1. "Ist das MVP-essentiell?"
2. "Kann ich das mocken?"
3. "Was ist die einfachste Implementation?"
4. "Kann das auf Post-MVP warten?"

**Code Quality Adjustments**:
- ✅ Type Safety MANDATORY (kein `any`)
- ⚠️ Reduced Error Handling (Happy Path + Basic)
- ⚠️ Inline TODOs acceptable: `// TODO: Post-MVP — Add validation`
- ✅ **DSGVO non-negotiable** (auch im MVP!)

```typescript
// ❌ Over-engineered für MVP
class AppointmentService {
  async bookAppointment(dto: BookAppointmentDto): Promise<Result<Appointment, Error>> {
    const validation = await this.validator.validate(dto);
    if (validation.isFailure) return Result.fail(validation.error);
    const rules = await this.ruleEngine.evaluate(dto);
    if (rules.isFailure) return Result.fail(rules.error);
    return this.db.transaction(async (tx) => {
      const appointment = await tx.appointments.create(dto);
      await tx.auditLog.create({ action: 'BOOK', entity: appointment });
      await this.eventBus.publish(new AppointmentBooked(appointment));
      await this.notificationService.schedule(appointment);
      return Result.ok(appointment);
    });
  }
}

// ✅ MVP — Simplified
class AppointmentService {
  async bookAppointment(dto: BookAppointmentDto): Promise<Appointment> {
    if (!dto.doctorId || !dto.slot) throw new Error('Doctor and slot required');
    
    const appointment = await this.db.appointments.create({
      ...dto,
      status: 'confirmed',
    });
    
    console.log(`[MOCK] Notification scheduled for ${appointment.scheduledAt}`);
    // TODO: Post-MVP — Real push notification
    // TODO: Post-MVP — Audit log
    // TODO: Post-MVP — Event publishing
    
    return appointment;
  }
}
```

### Planner Agent (MVP-Mode)
**Mandatory Questions für jedes Feature**:
1. "Was sind die 20% die 80% Value liefern?"
2. "Was können wir mocken statt bauen?"
3. "Was ist das absolute Minimum für User Value?"
4. "Welche Features können auf Post-MVP warten?"

### UX Designer Agent (MVP-Mode)
- ⚠️ KEINE Custom Illustrationen (Stock OK)
- ⚠️ KEINE Animationen (außer Core Feature)
- ⚠️ Vereinfachte Farbpalette (Primary + Grays)
- ⚠️ Basic Responsive (Mobile + Desktop, kein Tablet)
- ✅ **Accessibility**: Keyboard Nav + Screen Reader (Minimum wegen Thomas)

---

## Rapid Prototyping Patterns

### Low-Fidelity Prototype (1-2 Tage)

**When**: Konzept-Validierung, User Flow Design

```markdown
## Low-Fi Prototype: AIVA Care Terminbuchung

### Scope
- 3 Screens: Termin-Übersicht, Arzt-Suche, Buchungs-Bestätigung
- Basic Click-Through
- Mock Data (3 Ärzte, 5 Zeitslots)

### Timeline
- Design: 4 Stunden
- Feedback (Laura + Thomas): 2 Stunden
- Iteration: 2 Stunden
- Total: 1 Tag

### Learnings
- Laura bevorzugt Karten-Layout für Ärzte
- Thomas braucht größere Buttons (Finger-Zittern)
- Kalender-Ansicht > Liste für Zeitslots
```

### High-Fidelity Prototype (2-5 Tage)

**When**: Technical Feasibility, Integration Testing

```typescript
// AIVA Health Prototype — Hardcoded Data, kein Error Handling
const mockDoctors = [
  { id: '1', name: 'Dr. Müller', specialty: 'Hausarzt', rating: 4.8 },
  { id: '2', name: 'Dr. Schmidt', specialty: 'Kardiologie', rating: 4.5 },
];

const mockMedications = [
  { id: '1', name: 'Ramipril 5mg', frequency: 'morgens', nextDue: '08:00' },
  { id: '2', name: 'Metoprolol 50mg', frequency: 'abends', nextDue: '20:00' },
];

// Prototype: Kein Backend, kein State Management, keine Tests
// Ziel: User Flow validieren mit Laura und Thomas
```

### Throwaway vs. Evolutionary

| Frage | Throwaway | Evolutionary |
|-------|-----------|-------------|
| Code geht in Production? | NEIN | JA |
| Quality Requirements | Keine | Basic (Type Safety) |
| Timeline | 1-3 Tage | 3-5 Tage |
| Use Case | UI/UX Feedback | MVP Foundation |

---

## Anti-Patterns (VERMEIDEN)

### Scope Creep
**Symptome**: Timeline verschiebt sich, MUST-HAVEs wachsen, Perfektionismus

**Lösung**: Hard Freeze an Tag 5, neue Requests → Post-MVP Backlog

### Premature Optimization
**Symptome**: CDN/Caching/Load Balancing vor User Validation

**Lösung**: Start simple, optimiere erst wenn Metrics Problem zeigen

### Mock Dependency Hell
**Symptome**: Mock hat 500+ Zeilen, repliziert echte Business Logic

**Lösung**: Mock < 100 Zeilen, sonst Real Implementation erwägen

### DSGVO-Ignoranz im MVP
**Symptome**: "Encryption kommt Post-MVP", "Consent bauen wir später"

**Lösung**: ❌ VERBOTEN! DSGVO ist non-negotiable, auch im MVP!
