# /Feature Command

**Context Layers:**
- [Layer 03c: Planning](../../system/layers/03-specialization/planning.md#feature-definition) — Feature-Struktur & Best Practices
- [Layer 02: Process Workflow](../../system/layers/02-process-workflow.md#feature-lifecycle) — Feature Lifecycle

## Zweck
Erstellt ein neues Feature unter einem Epic.

## Verantwortlicher Agent
**Planner Agent**

## Syntax
```
/Feature <Feature-Name> <Parent-Epic-ID>
```

## Workflow
1. Parent Epic validieren (existiert als GitHub Issue mit Label `epic`)
2. Feature-Anforderungen analysieren
3. Technische Machbarkeit prüfen
4. Acceptance Criteria definieren
5. User Stories ableiten
6. Feature als GitHub Issue anlegen (Label: `feature`)
7. Mit Parent Epic verlinken (Tasklist im Epic)
8. Dokumentation erstellen

## Template: Feature

### GitHub Issue Felder
- **Title**: `[Feature] <Feature-Name>`
- **Labels**: `feature`, `<modul>`, `<priority>`
- **Milestone**: Gleicher Milestone wie Parent Epic
- **Assignees**: Planner Agent (initial)

### Body Template

```markdown
## 📦 <Feature-Name>

**Feature-ID**: FEAT-XXX
**Parent Epic**: #<Epic-Issue-Number>

### 📝 Beschreibung
[Detaillierte Beschreibung des Features]

### 💼 Business Value
[Nutzen für Laura / Thomas — Persona-Bezug]

### ✅ Acceptance Criteria
- [ ] AC 1: [Beschreibung]
- [ ] AC 2: [Beschreibung]
- [ ] AC 3: [Beschreibung]

### 🔧 Technische Anforderungen
- Anforderung 1
- Anforderung 2

### 📊 Schätzung
- **Complexity**: S / M / L / XL
- **Zeitaufwand**: [Tage]

### 🔗 Abhängigkeiten
- Abhängigkeit 1

### 🔒 DSGVO-Check
- [ ] Consent benötigt?
- [ ] Gesundheitsdaten betroffen?
- [ ] Audit Trail?

### 📋 User Stories (Child Issues)
- [ ] Story 1 (#XX)
- [ ] Story 2 (#XX)
```

## Verwandte Commands
- **/Epic** → Parent Epic erstellen
- **/UserStory** → User Stories zu diesem Feature hinzufügen
- **/Task** → Tasks zu Stories hinzufügen

## Beispiel
```
/Feature Terminbuchung EPIC-001

Implementiert die Termin-Buchungsfunktion mit Arzt-Auswahl,
Zeitslot-Picker und Bestätigungs-Flow.
```
