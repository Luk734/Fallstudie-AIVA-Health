# Convention 11 — Review Process

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Code Review Workflow, 4+1 Review Dimensions, Feedback Format.  
> **Geladen von:** Reviewer Agent, Developer Agent

---

## Review Dimensions (4+1)

Jeder Code Review prüft **5 Dimensionen**:

| # | Dimension | Gewichtung | Beschreibung |
|---|-----------|------------|-------------|
| 1 | **Code Quality** | 25% | Readability, SOLID, Clean Code, Naming |
| 2 | **Security** | 25% | Secrets, Input Validation, Auth |
| 3 | **Testing** | 20% | Coverage, AAA Pattern, Edge Cases |
| 4 | **Architecture** | 20% | Hexagonal, DDD, Separation of Concerns |
| 5 | **DSGVO** | 10% | Consent-Check, Verschlüsselung, Audit Trail |

> **+1 = DSGVO**: Immer prüfen wenn Gesundheitsdaten berührt werden.

---

## Review Workflow

### 1. Self-Review (Developer)

Vor PR-Erstellung:
- [ ] Alle Tests grün
- [ ] Naming Conventions eingehalten
- [ ] Keine TODO/FIXME ohne Issue-Link
- [ ] Keine hardcoded Secrets
- [ ] DSGVO-Check wenn Health Data betroffen

### 2. Automated Checks (CI)

- [ ] Lint & Format Check
- [ ] Unit Tests passed
- [ ] Coverage ≥ Threshold (80% Production, 60% MVP)
- [ ] Build erfolgreich

### 3. Reviewer Agent Review

```markdown
## Review: [PR Title]

### Code Quality (25%)
- [ ] Naming folgt Convention 01/02
- [ ] SOLID principles eingehalten
- [ ] Max 20 Zeilen pro Funktion
- [ ] Keine Code Duplication
**Score**: _/5

### Security (25%)
- [ ] Keine hardcoded Secrets
- [ ] Input Validation vorhanden
- [ ] Auth/Consent-Checks korrekt
- [ ] Error Messages ohne Patientendaten
**Score**: _/5

### Testing (20%)
- [ ] AAA Pattern verwendet
- [ ] Edge Cases abgedeckt
- [ ] Naming: "should + behavior"
- [ ] Coverage-Ziel erreicht
**Score**: _/5

### Architecture (20%)
- [ ] Hexagonal Architecture (Ports & Adapters)
- [ ] Dependencies zeigen nach innen
- [ ] Interface Segregation
- [ ] Domain Logic in Core
**Score**: _/5

### DSGVO (10%)
- [ ] Consent-Check vor Datenzugriff
- [ ] Verschlüsselung für Health Data
- [ ] Audit Trail vorhanden
- [ ] Löschbarkeit gewährleistet
**Score**: _/5

### Gesamtbewertung
**Total Score**: _/25
**Empfehlung**: ✅ Approve | 🔄 Request Changes | ❌ Reject

### Kommentare
<!-- Detaillierte Kommentare -->
```

### 4. Feedback Addressing (Developer)

| Severity | Reaktion | Zeitrahmen |
|----------|----------|------------|
| 🔴 Critical | MUSS gefixt werden | Sofort |
| 🟡 Major | SOLL gefixt werden | Vor Merge |
| 🔵 Minor | KANN gefixt werden | Optional |
| 💡 Suggestion | Nice to have | Optional |

### 5. Approval & Merge

- **Alle 🔴 Critical** müssen gelöst sein
- **Alle 🟡 Major** müssen gelöst oder begründet deferred sein
- **Re-Review** bei substantiellen Änderungen

---

## Review Feedback Format

```markdown
### [🔴|🟡|🔵|💡] [Dimension]: [Kurzbeschreibung]

**Datei**: `path/to/file.ts` Zeile X-Y
**Problem**: Was ist das Problem?
**Vorschlag**: Wie sollte es sein?

```typescript
// ❌ Aktuell
const data = await getLabResult(id);

// ✅ Vorschlag
const labResult = await labResultRepository.findById(id);
if (!labResult) throw new NotFoundError('LabResult', id);
```
```

---

## MVP Review (Reduziert)

Im MVP-Mode gelten reduzierte Review-Anforderungen:

| Dimension | Production | MVP |
|-----------|------------|-----|
| Code Quality | 25% | 20% |
| Security | 25% | 30% ⬆️ (DSGVO!) |
| Testing | 20% | 15% |
| Architecture | 20% | 15% |
| DSGVO | 10% | 20% ⬆️ |

> **MVP-Regel**: Security & DSGVO werden im MVP STRENGER geprüft, nicht lockerer.

---

## Cross-References

- **Git Workflow** → [Convention 10: Git Workflow](10-git-workflow.md)
- **Testing Strategy** → [Convention 12: Testing](12-testing-strategy.md)
- **Quality Layer** → [Layer 03: Quality](../../system/layers/03-specialization/quality.md)
- **Process Layer** → [Layer 02: Process Workflow](../../system/layers/02-process-workflow.md)
