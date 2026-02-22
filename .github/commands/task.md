# /Task Command

**Context Layers:**
- [Layer 03c: Planning](../../system/layers/03-specialization/planning.md#task-definition) — Task-Struktur
- [Layer 02: Process Workflow](../../system/layers/02-process-workflow.md) — Handoff-Regeln

## Zweck
Erstellt einen konkreten Umsetzungs-Task unter einer User Story.

## Verantwortlicher Agent
**Planner Agent** (Erstellung) → **Developer/Tester/UX Agent** (Umsetzung)

## Syntax
```
/Task <Task-Name> <Parent-Story-ID> [--type=dev|test|design|docs]
```

## Workflow
1. Parent Story validieren
2. Task-Typ bestimmen (dev/test/design/docs)
3. Definition of Done festlegen
4. Task als GitHub Issue anlegen (Label: `task`)
5. Zuständigen Agent zuweisen
6. Mit Parent Story verlinken

## Template: Task

### GitHub Issue Felder
- **Title**: `[Task] <Task-Name>`
- **Labels**: `task`, `<type>`, `<modul>`
- **Milestone**: Gleicher Milestone wie Parent
- **Assignees**: Zuständiger Agent

### Body Template

```markdown
## ⚙️ <Task-Name>

**Task-ID**: TASK-XXX
**Parent Story**: #<Story-Issue-Number>
**Type**: dev | test | design | docs

### 📝 Beschreibung
[Was genau umgesetzt werden soll]

### ✅ Definition of Done
- [ ] Implementierung abgeschlossen
- [ ] Unit Tests geschrieben (Coverage ≥ 60% MVP)
- [ ] Code Review bestanden
- [ ] Dokumentation aktualisiert
- [ ] DSGVO-Check (wenn gesundheitsdaten-relevant)

### 🔧 Technische Details
- Betroffene Dateien/Module: [Liste]
- Abhängige Services: [Liste]
- API-Änderungen: [Ja/Nein]

### 📊 Schätzung
- **Zeitaufwand**: [Stunden]
- **Complexity**: XS / S / M

### 🔗 Abhängigkeiten
- Blockiert von: #XX
- Blockiert: #XX
```

## Verwandte Commands
- **/UserStory** → Parent Story
- **/Component** → UI-Component erstellen
- **/Bugfix** → Bug beheben

## Beispiel
```
/Task "AppointmentCard Component erstellen" US-005 --type=dev

Erstellt die AppointmentCard-Komponente mit Arzt-Info,
Datum/Uhrzeit und Status-Anzeige.
```
