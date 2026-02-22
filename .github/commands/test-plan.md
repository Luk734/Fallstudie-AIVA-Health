# /TestPlan Command

**Context Layers:**
- [Layer 03b: Quality](../../system/layers/03-specialization/quality.md#test-pyramid) — Test Pyramid & Coverage
- [Convention 12: Testing](../../conventions/process-quality/12-testing-strategy.md) — Testing Strategy & Patterns

## Zweck
Erstellt einen strukturierten Test-Plan für ein Feature oder eine User Story.

## Verantwortlicher Agent
**Tester Agent**

## Syntax
```
/TestPlan <Feature-Name> [Feature-ID]
```

## Workflow
1. Feature-Anforderungen & Acceptance Criteria analysieren
2. Test-Strategie definieren (Pyramid-Level)
3. Test-Cases ableiten (je AC mindestens 1 Test)
4. Health-spezifische Test-Patterns anwenden
5. Test-Daten vorbereiten (Mock Data)
6. Test-Plan dokumentieren
7. GitHub Issue anlegen (Label: `test-plan`)

## Template: Test Plan

### GitHub Issue Felder
- **Title**: `[TestPlan] <Feature-Name>`
- **Labels**: `test-plan`, `<modul>`, `quality`
- **Milestone**: Gleicher Milestone wie Feature

### Body Template

```markdown
## 🧪 Test Plan: <Feature-Name>

**Feature**: #<Feature-Issue-Number>
**Erstellt von**: Tester Agent

### 🎯 Test-Scope

**In Scope:**
- Funktionalität 1
- Funktionalität 2

**Out of Scope:**
- [Explizit ausgeschlossen, mit Begründung]

### 📊 Test-Pyramide

#### Unit Tests (70%)
| Test-Case | Beschreibung | Priorität |
|-----------|-------------|-----------|
| UT-001 | [Beschreibung] | MUST |
| UT-002 | [Beschreibung] | MUST |
| UT-003 | [Beschreibung] | SHOULD |

#### Integration Tests (20%)
| Test-Case | Beschreibung | Priorität |
|-----------|-------------|-----------|
| IT-001 | [Beschreibung] | MUST |
| IT-002 | [Beschreibung] | SHOULD |

#### E2E Tests (10%)
| Test-Case | Beschreibung | Priorität |
|-----------|-------------|-----------|
| E2E-001 | [User Journey] | MUST |

### 🏥 Health-Specific Tests
- [ ] Vital Sign Validierung (Grenzwerte)
- [ ] DSGVO Consent-Flow
- [ ] Medikamenten-Erinnerung Timing
- [ ] Audit Trail Korrektheit
- [ ] Daten-Löschung (Art. 17)
- [ ] Daten-Export (Art. 20)

### 📈 Coverage Ziele
| Bereich | Ziel (MVP) | Ziel (Prod) |
|---------|-----------|-------------|
| Allgemein | ≥ 60% | ≥ 80% |
| DSGVO-Code | ≥ 90% | ≥ 95% |
| Health Data | ≥ 80% | ≥ 90% |

### 🗃️ Test-Daten
- Mock-Patienten: Laura (32), Thomas (56)
- Mock-Vitalwerte: Normal, erhöht, kritisch
- Mock-Medikamente: Ramipril 5mg, Aspirin 100mg
- Mock-Termine: Vergangenheit, heute, Zukunft

### ✅ Exit Criteria
- [ ] Alle MUST Test-Cases bestanden
- [ ] Coverage-Ziele erreicht
- [ ] Keine Critical/High Bugs offen
- [ ] DSGVO-Tests alle grün
```

## Verwandte Commands
- **/E2E** → Detaillierte E2E-Szenarien
- **/Review** → Test-Code reviewen
- **/Feature** → Feature-Anforderungen

## Beispiel
```
/TestPlan Terminbuchung FEAT-001

Erstellt Test-Plan für Terminbuchung inkl.
Consent-Flow, Validierung und Mock-Doctolib-Integration.
```
