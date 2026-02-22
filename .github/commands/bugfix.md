# /Bugfix Command

**Context Layers:**
- [Layer 03a: Development](../../system/layers/03-specialization/development.md) — Development Patterns
- [Convention 04: Error Handling](../../conventions/code-architecture/04-error-handling.md) — Error Hierarchy
- [Convention 12: Testing](../../conventions/process-quality/12-testing-strategy.md) — TDD Red-Green-Refactor

## Zweck
Behebt einen Bug systematisch mit TDD-Ansatz.

## Verantwortlicher Agent
**Developer Agent**

## Syntax
```
/Bugfix <Bug-ID> [--priority=critical|high|medium|low]
```

## Workflow
1. Bug reproduzieren
2. Root Cause analysieren
3. **Failing Test schreiben** (Red)
4. Fix implementieren (Green)
5. Refactoren (Refactor)
6. Regression Tests durchführen
7. DSGVO-Impact prüfen (bei Gesundheitsdaten)
8. PR erstellen mit Fix-Dokumentation

## Template: Bugfix

### GitHub Issue Felder
- **Title**: `[Bug] <Bug-Beschreibung>`
- **Labels**: `bug`, `<priority>`, `<modul>`
- **Assignees**: Developer Agent

### Body Template

```markdown
## 🐛 Bug Report

**Bug-ID**: BUG-XXX

### ⚠️ Priorität
- [ ] 🔴 Critical (System down / Datenverlust)
- [ ] 🟠 High (Feature komplett kaputt)
- [ ] 🟡 Medium (Feature teilweise kaputt)
- [ ] 🟢 Low (Kosmetisch)

### 📦 Betroffene Module
- [ ] Core (Auth/Consent)
- [ ] AIVA Care
- [ ] AIVA Labs
- [ ] AIVA Coach
- [ ] AIVA Family

### 🔄 Reproduktionsschritte
1. Schritt 1
2. Schritt 2
3. Schritt 3

### ✅ Erwartetes Verhalten
[Was sollte passieren]

### ❌ Tatsächliches Verhalten
[Was passiert tatsächlich]

### 🔍 Root Cause Analysis
- **Ursache**: [Beschreibung]
- **Betroffener Code**: [Datei:Zeile]
- **Warum nicht verhindert**: [Erklärung]

### 🔧 Fix-Strategie
- **Ansatz**: [Beschreibung]
- **Geänderte Dateien**:
  - `path/to/file1`
  - `path/to/file2`

### 🧪 Tests
- [ ] Failing Test für Bug-Szenario erstellt
- [ ] Fix implementiert → Test grün
- [ ] Alle existierenden Tests laufen
- [ ] Keine Regression eingeführt

### 🔒 DSGVO-Check
- [ ] Betrifft Gesundheitsdaten?
- [ ] Consent-Flow betroffen?
- [ ] Audit Trail aktualisiert?

### 🛡️ Prevention
- **Maßnahmen**: [Was verhindert diesen Bug in Zukunft?]
```

## Verwandte Commands
- **/Review** → Code Review des Fixes
- **/TestPlan** → Erweiterte Tests nach Fix

## Beispiel
```
/Bugfix BUG-012 --priority=high

Consent-Dialog wird nicht angezeigt beim ersten Zugriff
auf Vitaldaten. DSGVO-kritischer Bug.
```
