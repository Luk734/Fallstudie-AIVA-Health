# Layer 2: Process & Workflow

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: Alle Agents (Developer, Reviewer, Planner, Orchestrator, Tester, UX Designer)

---

## Agent Interaction Matrix

| Agent | Kommuniziert mit | Zweck | Protokoll |
|-------|-----------------|-------|-----------|
| **Orchestrator** | Alle Agents | Koordination, Task-Assignment | Command-based |
| **Planner** | Orchestrator | Strategische Planung, Optionen | Report-based |
| **Developer** | Orchestrator, Reviewer, UX Designer | Implementation | PR/Commit-based |
| **Reviewer** | Orchestrator, Developer | Code Review, Feedback | Review-Comments |
| **Tester** | Orchestrator, Developer | Test-Erstellung, Bug Reports | Test-Results |
| **UX Designer** | Orchestrator, Developer | Design Specs, Components | Design-Specs |

---

## Feature Development Lifecycle

### Phase 1: Planning
```
Orchestrator → Planner
Input: Feature Request (z.B. "Medikamenten-Reminder für Thomas")
Output: Optionen (A, B, C) mit Pros/Cons/Aufwand

Planner → Orchestrator
Input: Ausgewählte Option + Requirements
Output: Epic/Feature/Stories Breakdown
```

### Phase 2: Design
```
Orchestrator → UX Designer
Input: Feature Requirements + User Stories
Output: Design-Spezifikation + Component Specs

UX Designer → Orchestrator
Input: Design-System Compliance Check
Output: Bestätigte Design-Konformität oder Lücken
```

### Phase 3: Implementation
```
Orchestrator → Developer
Input: User Story + Designs + Akzeptanzkriterien
Output: Implementation (Code + Tests)

Developer → Orchestrator
Status: "Feature X implementiert, bereit für Review"
```

### Phase 4: Review
```
Orchestrator → Reviewer
Input: PR-Link + Implementation
Output: Review Feedback (Critical/High/Medium/Low) + DSGVO-Check

Reviewer → Developer (via Orchestrator)
Input: Fix-Liste
Output: Approved/Changes Requested
```

### Phase 5: Testing
```
Orchestrator → Tester
Input: Feature Implementation + Requirements
Output: Test Plan + Test Cases + Automation

Tester → Orchestrator
Status: "Alle Tests bestanden, Coverage 85%"
```

### Phase 6: Release
```
Orchestrator → Alle Agents
Input: Release Plan
Output: Deployment-Koordination

Status: "Feature X ausgeliefert"
```

### Phase 7: Quality Gates (Pre-Release — BLOCKING)
```
Orchestrator → Quality Gate Validation
Input: Feature Implementation + Tests
Output: Gate Status (Pass/Fail)

**BLOCKING Quality Gates** (ALLE müssen bestehen):
1. ✅ Linting: 0 Errors
2. ✅ Type-Checking: 0 Errors (TypeScript strict)
3. ✅ Test Coverage: ≥80% (Production) / ≥60% (MVP)
4. ✅ All Tests Passing: 0 failing tests
5. ✅ Code Review: ≥1 Approval vom Reviewer Agent
6. ✅ DSGVO-Check: Gesundheitsdaten korrekt geschützt
7. ✅ 0 Critical Vulnerabilities

🔴 **CRITICAL**: Wenn IRGENDEIN Gate fehlschlägt → Deployment BLOCKIERT bis behoben.
```

---

## Agent Handoff Rules

### Rule 1: Developer → Tester (Immediate Handoff)

**MANDATORY**: Developer MUSS sofort an Tester übergeben nach Implementation.

**Anti-Pattern (VERBOTEN)**:
```
Developer implementiert Feature A → commited → wechselt zu Feature B
Tester validiert Feature A später (Tests schlagen fehl, Developer hat Context verloren)
```

**Korrektes Pattern (MANDATORY)**:
```
Developer implementiert Feature A → übergibt an Tester → wartet auf Validierung ✅
Tester validiert Feature A → meldet Pass/Fail → Developer fixt falls nötig
ERST DANN: Developer wechselt zu Feature B
```

### Rule 2: Failing Tests BLOCK Progress (ABSOLUT)

**BLOCKING RULE**: Wenn Tester fehlgeschlagene Tests meldet → Developer MUSS fixen BEVOR er weitermacht.

**Protokoll**:
1. Tester führt Tests aus → findet Fehler
2. Tester meldet sofort an Developer (via Orchestrator)
3. Developer STOPPT aktuelle Arbeit
4. Developer fixt fehlgeschlagene Tests
5. Tester re-validiert
6. ERST wenn alle Tests bestehen → Developer fährt fort

**❌ VERBOTEN**: 
- "Ich fixe die Tests später"
- Tests als Skip markieren
- Kaputte Tests committen

**✅ MANDATORY**:
- Tests SOFORT fixen (max 1 Stunde)
- Wenn >1 Stunde nötig → Code-Änderungen reverten
- Niemals kaputte Tests im Codebase lassen

### Rule 3: Reviewer Approval Required Before Merge

**BLOCKING RULE**: Developer kann PR nicht mergen ohne Reviewer Approval.

**Reviewer prüft 4+1 Dimensionen**:
1. Code Quality (SOLID, Clean Code)
2. Security (keine Vulnerabilities)
3. Testing (ausreichende Coverage)
4. Architecture (keine Architektur-Verletzungen)
5. **DSGVO** (Gesundheitsdaten korrekt geschützt) ← AIVA-spezifisch

### Rule 4: Use Commands for Consistency

**BEST PRACTICE**: Agents sollten `/Epic`, `/Feature`, `/UserStory` Commands nutzen statt manuell Dateien zu erstellen.

**Warum?**
- ✅ Automatische Parent-Verlinkung
- ✅ Konsistente Struktur (aus Templates)
- ✅ Vermeidet verwaiste Stories (ohne Parent Epic/Feature)

---

## Communication Protocols

### Report Format
```markdown
**Von**: [Agent Name]
**An**: [Agent Name]
**Betreff**: [Task/Feature Name]

## Status
[Completed | In Progress | Blocked]

## Details
[Spezifika zur erledigten Arbeit]

## Nächste Schritte
[Was als nächstes passieren muss]

## Blocker (falls vorhanden)
[Was den Fortschritt blockiert]
```

### Beispiel: Developer → Orchestrator
```markdown
**Von**: Developer
**An**: Orchestrator
**Betreff**: Medikamenten-Reminder Feature

## Status
Completed

## Details
- MedicationReminderService implementiert
- Push-Notification Integration (Mock für MVP)
- Unit Tests (Coverage: 88%)
- Dosierungs-Validierung mit Value Objects

## Nächste Schritte
Bereit für Code Review (DSGVO-Check wichtig: Medikationsdaten)

## Blocker
Keine
```

---

## Parallel Work Rules

### Orchestrator: MAX 4 Parallel Agents

**Constraint**: Orchestrator kann max 4 Agents parallel koordinieren.

**Reasoning**: 
- Mehr → Komplexität steigt exponentiell
- Merge-Konflikte wahrscheinlicher
- Orchestrator verliert Überblick

**Beispiel**:
- ✅ Developer (AIVA Care Feature) + Developer (AIVA Labs Feature) + Reviewer (AIVA Coach Feature) + Tester (AIVA Family Feature)
- ❌ 6 Developer parallel (Chaos!)

### Conflict Prevention

1. **File-Konflikte**: 
   - Feature A editiert PatientService.ts + Feature B editiert PatientService.ts → Serialisieren!
   
2. **Dependency-Konflikte**:
   - AIVA Labs braucht AIVA Care (Patient muss existieren) → Warten

3. **Resource-Konflikte**:
   - Gleicher Agent für mehrere Tasks → Priorisieren oder Queue

---

## Workflow Patterns

### Sequential
```
Task A → Task B → Task C
Nutzen: Bei Abhängigkeiten (z.B. Datenbank → API → UI)
```

### Parallel
```
Task A ┐
Task B ├→ Merge
Task C ┘
Nutzen: Bei unabhängiger Arbeit (z.B. AIVA Care, AIVA Coach, AIVA Labs Features parallel)
```

### Hybrid
```
Planning → Design ┐
              → AIVA Care Implementation  ┐
              → AIVA Coach Implementation ├→ Review → Testing → Release
              → AIVA Labs Implementation  ┘
Nutzen: Komplexe Features mit unabhängigen Teilen
```

---

## Error Handling

### Developer: Implementation Error
1. Developer versucht zu fixen (max 2 Versuche)
2. Falls immer noch fehlerhaft → Meldung an Orchestrator
3. Orchestrator kann: Tester zum Debuggen einsetzen, Planner für Alternative konsultieren, an User eskalieren

### Reviewer: Critical Issues Found
1. Reviewer markiert als 🔴 CRITICAL (z.B. unverschlüsselte Gesundheitsdaten)
2. Sofortige Meldung an Orchestrator
3. Orchestrator pausiert Deployment
4. Developer fixt ASAP
5. Re-Review erforderlich

### Tester: Flaky Tests
1. Tester identifiziert Flaky Test
2. Meldet an Developer mit Diagnose
3. Developer fixt Root Cause (Timing, Dependencies, etc.)
4. Tester re-validiert Stabilität (10x Runs)

---

## Decision-Making

### Orchestrator Decision Tree
1. Check Planner's Empfehlung → Klar → Fortschritt / Unklar → User fragen
2. Check Dependencies → Blockiert → Queue / Bereit → Zuweisen
3. Check Kapazität → <4 parallele Agents → Fortschritt / =4 → Queue
4. Task zuweisen → Developer oder UX Designer (je nach Design-Bedarf)

### Planner Options Framework
**Requirement**: 2-3 Optionen präsentieren, nicht nur 1

```markdown
## Option A: [Name]
**Pro**: [Vorteile]
**Con**: [Nachteile]
**Aufwand**: [X Story Points]

## Option B: [Name]
**Pro**: [Vorteile]
**Con**: [Nachteile]
**Aufwand**: [X Story Points]

## Empfehlung
Option [A/B] weil [Begründung]
```

---

## Code Review Workflow

### Step 1: Developer Self-Review
- [ ] SOLID Principles (Layer 1)
- [ ] Clean Code (Layer 1)
- [ ] Type Safety (kein `any`)
- [ ] Unit Tests vorhanden
- [ ] Keine Console Logs
- [ ] Keine TODOs ohne Ticket
- [ ] Gesundheitsdaten verschlüsselt (DSGVO)

### Step 2: Automated Checks (CI)
- [ ] Linting (ESLint/Biome)
- [ ] Type-Checking (TypeScript strict)
- [ ] Unit Tests
- [ ] Coverage ≥ 80%
- [ ] Build-Erfolg

### Step 3: Reviewer Manual Review (4+1 Dimensionen)
- [ ] Code Quality (SOLID, Clean Code)
- [ ] Error Handling
- [ ] Security (keine Vulnerabilities, OWASP)
- [ ] Performance (keine offensichtlichen Bottlenecks)
- [ ] **DSGVO** (Gesundheitsdaten-Schutz, Consent, Audit Trail)

### Step 4: Feedback Loop
Reviewer → Developer:
- 🔴 Critical: Muss vor Merge gefixt werden
- 🟠 High: Sollte vor Merge gefixt werden
- 🟡 Medium: Erwägen zu fixen
- 🟢 Low: Nice to have

### Step 5: Approval & Merge
- [ ] Keine 🔴 Critical Issues
- [ ] Keine 🟠 High Issues (oder begründete Ausnahmen)
- [ ] Alle Tests bestehen
- [ ] Coverage ≥ 80%
- **Merge Strategy**: Squash Merge (saubere History)

---

## Agent Handoffs

### Orchestrator → Developer
1. User Story Link (GitHub Issue)
2. Akzeptanzkriterien
3. Design Link (falls vorhanden)
4. Technische Spezifikation
5. Dependencies identifiziert
6. Geschätzter Aufwand

### Developer → Reviewer
1. PR Link
2. Beschreibung der Änderungen
3. Self-Review Checklist
4. Test Coverage Report
5. DSGVO-Relevanz markiert (falls Gesundheitsdaten betroffen)

### Reviewer → Tester
1. Approved PR
2. Feature-Beschreibung
3. Geänderte Dateien
4. Test Plan (falls vorhanden)
5. Bekannte Edge Cases

### Tester → Orchestrator
1. Test Results (Pass/Fail)
2. Coverage Report
3. Bug Reports (falls vorhanden)
4. Sign-off für Release

---

## Conflict Resolution

### Merge-Konflikte
1. Developer löst Konflikte lokal
2. Re-runs Tests
3. Bittet um Re-Review bei signifikanten Änderungen

### Design-Konflikte
1. Developer meldet Bedenken an UX Designer
2. UX Designer klärt oder aktualisiert Design
3. Orchestrator vermittelt bei Uneinigkeit

### Priority-Konflikte
1. Orchestrator verwaltet Priority Queue
2. Bei Streit → Planner konsultieren
3. Bei Unklarheit → an User/PO eskalieren
