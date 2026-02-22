# /UserStory Command

**Context Layers:**
- [Layer 03c: Planning](../../system/layers/03-specialization/planning.md#user-story-format) — User Story Format & Best Practices
- [Context: Personas](../../context/personas.md) — Laura Becker & Thomas Wagner

## Zweck
Erstellt eine User Story unter einem Feature.

## Verantwortlicher Agent
**Planner Agent**

## Syntax
```
/UserStory <Story-Beschreibung> <Parent-Feature-ID>
```

## Workflow
1. Parent Feature validieren
2. Persona identifizieren (Laura oder Thomas)
3. Story im Format "Als... möchte ich... damit..." erstellen
4. Acceptance Criteria definieren (Given/When/Then)
5. Tasks ableiten
6. Story als GitHub Issue anlegen (Label: `user-story`)
7. Story Points schätzen
8. Mit Parent Feature verlinken

## Template: User Story

### GitHub Issue Felder
- **Title**: `[Story] Als <Persona>, möchte ich <Aktion>`
- **Labels**: `user-story`, `<modul>`, `<priority>`, `<persona>`
- **Milestone**: Gleicher Milestone wie Parent
- **Assignees**: Developer Agent (nach Zuweisung)

### Body Template

```markdown
## 📖 User Story

**Story-ID**: US-XXX
**Parent Feature**: #<Feature-Issue-Number>

### Story
> Als **<Persona>**
> möchte ich **<Aktion/Funktion>**,
> damit **<Nutzen/Ziel>**.

### 👤 Persona
**<Name>** — <Kurzbeschreibung>
(Details: [Personas](../../context/personas.md))

### ✅ Acceptance Criteria

**AC 1: <Titel>**
```gherkin
Given [Vorbedingung]
When [Aktion]
Then [Erwartetes Ergebnis]
```

**AC 2: <Titel>**
```gherkin
Given [Vorbedingung]
When [Aktion]
Then [Erwartetes Ergebnis]
```

### 📊 Schätzung
- **Story Points**: 1 / 2 / 3 / 5 / 8 / 13
- **Complexity**: S / M / L

### 🔒 DSGVO-Relevanz
- [ ] Verarbeitet personenbezogene Daten
- [ ] Consent erforderlich
- [ ] Art. 9 Gesundheitsdaten

### 🎨 Design
- Wireframe: [Link]
- Design-Spec: #<DesignSpec-Issue>

### 📋 Tasks (Child Issues)
- [ ] Task 1 (#XX)
- [ ] Task 2 (#XX)
```

## Verwandte Commands
- **/Feature** → Parent Feature
- **/Task** → Tasks unter dieser Story
- **/DesignSpec** → Design für diese Story

## AIVA Health Beispiel
```
/UserStory "Termin bei Hausarzt buchen" FEAT-001

Als Laura (32, Marketing Managerin)
möchte ich einen Termin bei meinem Hausarzt buchen,
damit ich schnell und unkompliziert einen Vorsorgetermin vereinbaren kann.
```
