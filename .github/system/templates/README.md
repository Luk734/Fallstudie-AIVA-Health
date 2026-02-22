# AIVA Health — Templates

> **Version:** v1.0.0  
> **Stand:** 2026-02-03

## Übersicht

Dieses Verzeichnis enthält System-Templates und Referenzdokumente für das AIVA Health Agent Framework.

## Struktur

```
system/
├── layers/                 # 4-Layer Context System
│   ├── README.md
│   ├── 00-foundation.md
│   ├── 01-domain-knowledge.md
│   ├── 02-process-workflow.md
│   └── 03-specialization/
│       ├── development.md
│       ├── quality.md
│       ├── planning.md
│       └── mvp-prototype.md
├── tools/                  # Tool-Dokumentation
│   ├── code-search.md
│   ├── file-operations.md
│   ├── terminal.md
│   └── other-tools.md
├── templates/              # Dieses Verzeichnis
│   └── README.md
└── schemas/                # JSON Schemas (optional)
    ├── epic.schema.json
    ├── feature.schema.json
    ├── user-story.schema.json
    └── task.schema.json
```

## Layer System

Das Layer System nutzt `Extends:`-Referenzen um den Kontext klein zu halten:

```
Layer 00: Foundation (immer geladen)
  → Layer 01: Domain Knowledge (bei Domain-Arbeit)
    → Layer 02: Process Workflow (bei Prozess-Arbeit)
      → Layer 03: Specialization (agent-spezifisch)
         ├── 03a: Development (Developer Agent)
         ├── 03b: Quality (Reviewer + Tester)
         ├── 03c: Planning (Planner Agent)
         └── 03d: MVP Prototype (UX-Designer + alle im MVP Mode)
```

## Convention Numbering

| Range | Kategorie | Dateien |
|-------|-----------|---------|
| 01-04 | Code & Architecture | code-structure, naming, patterns, error-handling |
| 05, 10-13 | Process & Quality | security, git, review, testing, docs |
| 06-09 | Health Domain | health-data, wearables, health-security, health-ai |
| 14-16 | Fullstack | frontend, backend, api-design |
| 17-18 | Other | mvp-conventions, design-system |

## Kein Generator

Im Gegensatz zum Referenz-System (Atlas) nutzt AIVA Health **keine Generator-Pipeline**.  
Alle Dateien sind direkte Markdown-Dateien, die manuell gepflegt werden.

**Vorteile:**
- Kein Build-Step nötig
- Sofort editierbar
- Git-diff zeigt echte Änderungen
- Einfacher für das Team

**Nachteile:**
- Manuelle Konsistenz (Cross-References prüfen)
- Kein Template-Rendering mit Variablen
