# AIVA Health — Work Item Templates

> **Version:** v1.0.0  
> **Stand:** 2026-02-03

## Übersicht

Work Item Templates definieren die Struktur für GitHub Issues auf jeder Planungsebene.  
Sie werden von den `/Epic`, `/Feature`, `/UserStory` und `/Task` Commands verwendet.

## Hierarchy

```
Epic
 └── Feature
      └── User Story
           └── Task
```

## Templates

| Template | Datei | GitHub Labels |
|----------|-------|--------------|
| [Epic](epic.md) | Strategische Initiative | `epic` |
| [Feature](feature.md) | Funktionaler Bereich | `feature` |
| [User Story](user-story.md) | Persona-basierte Anforderung | `user-story` |
| [Task](task.md) | Technische Umsetzungseinheit | `task` |

## GitHub Labels

### Typ-Labels
| Label | Farbe | Beschreibung |
|-------|-------|-------------|
| `epic` | `#7B68EE` | Strategische Initiative |
| `feature` | `#0075CA` | Funktionales Feature |
| `user-story` | `#008672` | User Story |
| `task` | `#E4E669` | Technischer Task |
| `bug` | `#D73A4A` | Bug Report |
| `design-spec` | `#F9D0C4` | Design Spezifikation |
| `test-plan` | `#BFD4F2` | Test Plan |
| `prototype` | `#D4C5F9` | Prototyp |

### Modul-Labels
| Label | Farbe | Modul |
|-------|-------|-------|
| `core` | `#333333` | Core Platform |
| `care` | `#4CAF50` | AIVA Care |
| `labs` | `#2196F3` | AIVA Labs |
| `coach` | `#FF9800` | AIVA Coach |
| `family` | `#9C27B0` | AIVA Family |

### Prioritäts-Labels
| Label | Farbe | Bedeutung |
|-------|-------|-----------|
| `priority:critical` | `#B60205` | Sofort |
| `priority:high` | `#D93F0B` | Nächster Sprint |
| `priority:medium` | `#FBCA04` | Eingeplant |
| `priority:low` | `#0E8A16` | Nice to have |

### DSGVO-Labels
| Label | Beschreibung |
|-------|-------------|
| `dsgvo:art9` | Gesundheitsdaten (Art. 9) |
| `dsgvo:consent` | Consent erforderlich |
| `dsgvo:audit` | Audit Trail nötig |

## GitHub Milestones

| Milestone | Phase | Zeitrahmen |
|-----------|-------|-----------|
| `v0.1.0 — Core Platform` | Auth, Consent, Design System | Wo 1-3 |
| `v0.2.0 — AIVA Care` | Terminmanagement | Wo 3-5 |
| `v0.3.0 — AIVA Labs` | Befunde, Medikation | Wo 5-7 |
| `v0.4.0 — AIVA Coach` | Check-In, Empfehlungen | Wo 7-9 |
| `v0.5.0 — AIVA Family` | Familienkonto | Wo 9-11 |
| `v1.0.0 — MVP Release` | Polish, E2E, Accessibility | Wo 11+ |

## Instanzen

Erstellte Work Items werden als GitHub Issues gespeichert. Zusätzlich können lokale Referenzen unter `workitems/instances/` abgelegt werden:

```
workitems/instances/
├── epics/
│   └── EPIC-001-aiva-care.md
├── features/
│   └── FEAT-001-terminbuchung.md
├── stories/
│   └── US-001-termin-buchen.md
└── tasks/
    └── TASK-001-appointment-card.md
```
