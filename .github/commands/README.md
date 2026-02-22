# AIVA Health — Commands

> **Version:** v1.0.0  
> **Stand:** 2026-02-03

## Übersicht

Commands sind strukturierte Anweisungen, die Agents ausführen können. Jeder Command definiert:
- **Zweck** & verantwortlichen Agent
- **Syntax** mit Parametern
- **Workflow** (Schritt-für-Schritt)
- **Template** (Output-Struktur)
- **Context Layer References** (welche Layers geladen werden)

## Available Commands

### Planning Commands
| Command | Agent | Beschreibung |
|---------|-------|-------------|
| [/Epic](epic.md) | Planner | Erstellt ein neues Epic |
| [/Feature](feature.md) | Planner | Erstellt ein Feature unter einem Epic |
| [/UserStory](user-story.md) | Planner | Erstellt eine User Story unter einem Feature |
| [/Task](task.md) | Planner | Erstellt einen Task unter einer Story |

### Development Commands
| Command | Agent | Beschreibung |
|---------|-------|-------------|
| [/Component](component.md) | Developer | Erstellt eine UI Component |
| [/Bugfix](bugfix.md) | Developer | Behebt einen Bug systematisch |

### Quality Commands
| Command | Agent | Beschreibung |
|---------|-------|-------------|
| [/Review](review.md) | Reviewer | Führt Code Review durch |
| [/TestPlan](test-plan.md) | Tester | Erstellt einen Test-Plan |
| [/E2E](e2e.md) | Tester | Erstellt E2E Test-Szenarien |

### Design Commands
| Command | Agent | Beschreibung |
|---------|-------|-------------|
| [/DesignSpec](design-spec.md) | UX-Designer | Erstellt Design-Spezifikation |
| [/Prototype](prototype.md) | UX-Designer | Erstellt interaktiven Prototyp |

### Release Commands
| Command | Agent | Beschreibung |
|---------|-------|-------------|
| [/Release](release.md) | Orchestrator | Erstellt ein Release |

## Verwendung

```
/<Command> <Parameter> [--optionale-flags]
```

**Beispiel:**
```
/Feature Terminbuchung EPIC-001
/Component AppointmentCard --story
/Review PR-42
```

## Context Loading

Jeder Command referenziert spezifische **Context Layers**, die für die Ausführung geladen werden. Dies hält den Kontext klein und fokussiert.
