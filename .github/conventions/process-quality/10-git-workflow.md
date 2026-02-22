# Convention 10 — Git Workflow

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Conventional Commits, Branch Naming, GitFlow, Pull Request Templates.  
> **Geladen von:** ALL Agents

---

## Conventional Commits (Mandatory)

Format: `<type>(<scope>): <subject>`

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(care): add appointment booking` |
| `fix` | Bug fix | `fix(labs): resolve null in lab result parser` |
| `docs` | Documentation only | `docs(readme): update setup guide` |
| `style` | Code style (no functional change) | `style(components): format with Prettier` |
| `refactor` | Code refactoring | `refactor(coach): extract validation logic` |
| `test` | Add/modify tests | `test(care): add appointment booking tests` |
| `chore` | Maintenance | `chore(deps): update React to v19` |
| `perf` | Performance improvements | `perf(labs): cache lab result queries` |
| `ci` | CI/CD changes | `ci(actions): add test coverage gate` |
| `build` | Build system changes | `build(vite): optimize bundle size` |
| `revert` | Revert previous commit | `revert: revert "feat(care): add X"` |

### Scope (Recommended)

AIVA-spezifische Scopes:

| Scope | Modul |
|-------|-------|
| `care` | AIVA Care (Terminmanagement) |
| `coach` | AIVA Coach (Empfehlungen) |
| `labs` | AIVA Labs (Befunde/Medikation) |
| `family` | AIVA Family (Familienkonto) |
| `core` | Core Platform (Auth, Consent, etc.) |
| `design` | Design System |
| `api` | API Layer |
| `deps` | Dependencies |

### Subject Rules

- **Imperative mood**: 'add feature' not 'added feature'
- **No period at end**
- **Max 50 characters**
- **Lowercase after colon**: `feat(care): add endpoint`

### Complete Examples

```
feat(care): add appointment booking service

- Implement booking with Doctolib mock
- Add consent check before booking
- Add unit tests for booking flow

Closes #42
```

```
fix(labs): prevent crash on missing reference range

Null check was missing when lab result has no reference.
Added defensive check and fallback display.

Fixes #71
```

---

## Branch Naming Strategy

Format: `<type>/<short-description>`

### Branch Types

| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New features | `feature/appointment-booking` |
| `fix/` | Bug fixes | `fix/lab-result-null-crash` |
| `hotfix/` | Critical production fixes | `hotfix/consent-bypass` |
| `refactor/` | Code refactoring | `refactor/extract-care-service` |
| `docs/` | Documentation | `docs/update-api-guide` |
| `test/` | Tests | `test/e2e-appointment-flow` |
| `chore/` | Maintenance | `chore/update-dependencies` |

### Branch Naming Rules

- **kebab-case**: `feature/appointment-booking` ✅
- **Descriptive**: `feature/add-booking` besser als `feature/booking`
- **< 50 characters**
- **No ticket numbers alone**: `feature/add-login` not `feature/42`

### Protected Branches

- `main` — Production code (requires PR + reviews)
- `develop` — Development integration (requires PR)

---

## Git Workflow (GitFlow-based)

```
main (production)
  ↑
  └── develop (integration)
        ↑
        ├── feature/appointment-booking
        ├── feature/medication-reminder
        └── fix/consent-validation
```

### Standard Feature Workflow

```bash
# 1. Feature Branch erstellen
git checkout develop
git pull origin develop
git checkout -b feature/appointment-booking

# 2. Entwickeln & Committen
git add .
git commit -m "feat(care): add appointment booking service"

# 3. Regelmäßig synchronisieren
git checkout develop && git pull origin develop
git checkout feature/appointment-booking
git rebase develop

# 4. Pull Request erstellen → develop
# 5. Nach Approval: Squash & Merge
```

### Hotfix Workflow

```bash
# Critical Fix direkt auf main
git checkout main && git pull origin main
git checkout -b hotfix/consent-bypass

git commit -m "fix(core): prevent consent bypass in API"
# PR → main, dann auch in develop mergen
```

### Merge Strategies

- **Feature → Develop**: Squash and merge (clean history)
- **Develop → Main**: Merge commit (preserve history)
- **Hotfix → Main**: Merge commit

---

## Pull Request Template

```markdown
## Beschreibung
<!-- Was ändert dieser PR? Welches Problem wird gelöst? -->

## Typ
- [ ] Feature
- [ ] Bugfix
- [ ] Refactoring
- [ ] Dokumentation
- [ ] Tests

## Checklist
- [ ] Code folgt Conventions
- [ ] Tests hinzugefügt/aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] DSGVO-Check (falls Gesundheitsdaten betroffen)
- [ ] Self-Review durchgeführt

## Related Issues
Closes #___

## Test Plan
<!-- Wie wurde getestet? -->
```

### PR Requirements

- **Minimum 1 Approval** required (MVP), 2 für Production
- **All CI checks** must pass
- **No merge conflicts**
- **PRs < 500 Zeilen** (ideal)
- **Single responsibility**: Ein Feature/Fix pro PR

---

## Cross-References

- **Review Process** → [Convention 11: Review Process](11-review-process.md)
- **Process Layer** → [Layer 02: Process Workflow](../../system/layers/02-process-workflow.md)
