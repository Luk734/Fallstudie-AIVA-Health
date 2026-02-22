# /Review Command

**Context Layers:**
- [Layer 03b: Quality](../../system/layers/03-specialization/quality.md#review-criteria) — Review Criteria (4+1 Dimensionen)
- [Convention 11: Review Process](../../conventions/process-quality/11-review-process.md) — Review Workflow & Feedback

## Zweck
Führt einen strukturierten Code Review mit 4+1 Dimensionen durch.

## Verantwortlicher Agent
**Reviewer Agent**

## Syntax
```
/Review [PR-Number | Branch-Name | File-Path]
```

## Workflow
1. Code Changes analysieren (Diff lesen)
2. **4+1 Dimensionen** bewerten:
   - 💎 Code Quality (25%)
   - 🔒 Security (25%)
   - 🧪 Testing (20%)
   - ⚙️ Architecture (20%)
   - 🔐 DSGVO Compliance (10%)
3. Findings nach Severity klassifizieren
4. Gesamtbewertung erstellen
5. Approval/Rejection entscheiden

## Template: Review

### 💎 Code Quality (25%)
- [ ] Code folgt [Naming Conventions](../../conventions/code-architecture/02-naming.md)
- [ ] Keine Code-Duplikate
- [ ] SOLID-Prinzipien befolgt
- [ ] TypeScript Strict Mode konform
- [ ] Aussagekräftige Variablen-/Funktionsnamen
- [ ] Kommentare wo nötig (nicht offensichtliches)

### 🔒 Security (25%)
- [ ] Input-Validierung vorhanden (Zod)
- [ ] Keine Secrets im Code
- [ ] Keine SQL Injection möglich
- [ ] Keine XSS-Schwachstellen
- [ ] Auth/Consent korrekt geprüft
- [ ] Keine Gesundheitsdaten in Logs

### 🧪 Testing (20%)
- [ ] Unit Tests vorhanden
- [ ] Tests sind aussagekräftig (AAA Pattern)
- [ ] Coverage ≥ 60% (MVP) / ≥ 80% (Production)
- [ ] DSGVO-Code ≥ 90% Coverage
- [ ] Edge Cases abgedeckt

### ⚙️ Architecture (20%)
- [ ] Hexagonal Architecture eingehalten
- [ ] Domain-Logik frei von Framework-Dependencies
- [ ] Interfaces für externe Services (Mock-First)
- [ ] Keine zirkulären Dependencies
- [ ] API Design konform mit [Convention 16](../../conventions/fullstack/16-api-design.md)

### 🔐 DSGVO Compliance (10%)
- [ ] Consent vor Datenzugriff geprüft
- [ ] Audit Trail für Gesundheitsdaten
- [ ] Datensparsamkeit eingehalten
- [ ] Löschbarkeit gewährleistet (Art. 17)
- [ ] Export möglich (Art. 20)

---

### 📋 Review Summary

```markdown
## Review: PR #XX — <Titel>

**Reviewer**: Reviewer Agent
**Datum**: [Datum]
**Status**: ✅ Approved | 👍 Approved with Comments | 🔄 Changes Requested

### Scores
| Dimension | Score | Gewichtung |
|-----------|-------|-----------|
| Code Quality | X/10 | 25% |
| Security | X/10 | 25% |
| Testing | X/10 | 20% |
| Architecture | X/10 | 20% |
| DSGVO | X/10 | 10% |
| **Gesamt** | **X/10** | **100%** |

### 🔍 Findings

**Critical ⛔:**
- [Issue]

**Major 🔴:**
- [Issue]

**Minor 🟡:**
- [Issue]

**Suggestions 💡:**
- [Suggestion]

### ✅ Approval Status
- [ ] Approved ✅ (Score ≥ 7/10, keine Critical)
- [ ] Approved with Comments 👍 (Score ≥ 6/10, Minor only)
- [ ] Changes Requested 🔄 (Score < 6 oder Critical/Major)
```

## Verwandte Commands
- **/Bugfix** → Gefundene Issues beheben
- **/TestPlan** → Fehlende Tests planen

## Beispiel
```
/Review PR-42

Review der Terminbuchungs-Implementierung.
Fokus: DSGVO Consent-Flow und Input-Validierung.
```
