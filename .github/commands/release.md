# /Release Command

**Context Layers:**
- [Layer 02: Process Workflow](../../system/layers/02-process-workflow.md#feature-lifecycle) — Feature Lifecycle
- [Convention 10: Git Workflow](../../conventions/process-quality/10-git-workflow.md) — GitFlow & Versioning
- [Convention 13: Documentation](../../conventions/process-quality/13-documentation.md) — Changelog Format

## Zweck
Erstellt ein Release mit Changelog, Versionierung und Qualitäts-Gates.

## Verantwortlicher Agent
**Orchestrator Agent**

## Syntax
```
/Release <Version> [--type=major|minor|patch]
```

## Workflow
1. Release-Branch erstellen (`release/vX.Y.Z`)
2. Alle offenen PRs für Release prüfen
3. Quality Gates validieren
4. Changelog generieren
5. Version in package.json aktualisieren
6. Release Notes erstellen
7. Git-Tag erstellen
8. GitHub Release publizieren
9. Release-Branch in `main` mergen

## Template: Release

### GitHub Release Felder
- **Tag**: `vX.Y.Z`
- **Title**: `AIVA Health vX.Y.Z — <Release-Name>`
- **Pre-release**: true/false

### Body Template

```markdown
## 🚀 AIVA Health vX.Y.Z — <Release-Name>

**Datum**: [Datum]
**Type**: Major | Minor | Patch

---

### ✨ New Features
- <Feature 1> (#PR-Number)
- <Feature 2> (#PR-Number)

### 🐛 Bug Fixes
- <Bugfix 1> (#PR-Number)
- <Bugfix 2> (#PR-Number)

### 🔒 Security & DSGVO
- <Security Update> (#PR-Number)

### 📚 Documentation
- <Doc Update> (#PR-Number)

### ⚠️ Breaking Changes
- <Breaking Change> (Migration Guide: #XX)

---

### 📊 Quality Gates

| Gate | Status | Details |
|------|--------|---------|
| Build | ✅/❌ | CI/CD |
| Lint | ✅/❌ | 0 Errors |
| Tests | ✅/❌ | Coverage: XX% |
| DSGVO Tests | ✅/❌ | Coverage: XX% |
| Security Scan | ✅/❌ | No Critical |
| Accessibility | ✅/❌ | WCAG AA |
| Review | ✅/❌ | All PRs reviewed |

### 📝 Migration Notes
[Falls Breaking Changes: Schritte für Migration]

---

### 📦 Enthaltene Module
- [ ] Core (Auth, Consent)
- [ ] AIVA Care (Termine)
- [ ] AIVA Labs (Befunde, Medikation)
- [ ] AIVA Coach (Empfehlungen)
- [ ] AIVA Family (Familienkonto)

### 🔄 Bekannte Einschränkungen (MVP)
- Doctolib: Mock-Integration
- ePA: Mock-Integration
- Wearables: Mock-Daten
- KI: Regelbasiert (kein ML)
```

## Versioning (Semantic Versioning)

| Type | Wann | Beispiel |
|------|------|---------|
| **Major** (X.0.0) | Breaking Changes | v2.0.0 |
| **Minor** (0.X.0) | Neue Features | v1.1.0 |
| **Patch** (0.0.X) | Bugfixes | v1.0.1 |

### MVP Versioning
- `v0.1.0` — Core Platform (Auth, Consent)
- `v0.2.0` — AIVA Care
- `v0.3.0` — AIVA Labs
- `v0.4.0` — AIVA Coach
- `v0.5.0` — AIVA Family
- `v1.0.0` — MVP Release

## Verwandte Commands
- **/Review** → Alle PRs reviewen
- **/TestPlan** → Release-Tests
- **/E2E** → E2E Regression

## Beispiel
```
/Release v0.2.0 --type=minor

Release: AIVA Care Modul
- Terminübersicht
- Terminbuchung (Mock-Doctolib)
- Vorsorge-Kalender
```
