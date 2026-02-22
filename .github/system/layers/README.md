# AIVA Health Context Layers

Hierarchische Context-Struktur für GitHub Copilot Agents.

## Struktur

```
layers/
├── 00-foundation.md
├── 01-domain-knowledge.md
├── 02-process-workflow.md
└── 03-specialization/
    ├── development.md
    ├── planning.md
    ├── quality.md
    └── mvp-prototype.md
```

## Layer-Hierarchie

### Layer 0: Foundation
Grundlegende Projektinformationen, Tool-Katalog, Skills, Commands, AIVA Health Prinzipien.

### Layer 1: Domain Knowledge
Fachliche Details: SOLID, TDD, Clean Code — mit Gesundheitsdomain-Beispielen (Vitalwerte, Medikation, Patientenprofile).

### Layer 2: Process & Workflow
Multi-Agent Coordination (6 Agents), Feature Lifecycle, Handoff-Rules, Communication Protocols.

### Layer 3: Specialization
Spezialisierte Patterns und Best Practices:
- **Development** (3a): Health-App UI Patterns, Wearable-Integration, Component-Struktur
- **Planning** (3c): Epic/Feature/Story-Definition mit GitHub Issues, Estimation, Prioritization
- **Quality** (3b): Health-QA, DSGVO Quality Gates, Code Review, Testing-Strategien
- **MVP & Prototype** (3d): Build-Measure-Learn für Health-App, Mock-First, Rapid Prototyping

## Verwendung

Layers werden von Agents per `Extends`-Referenz geladen. Jeder Agent lädt nur die Layer, die er benötigt — das hält das Context-Window klein.

**Beispiel** (Developer Agent):
```markdown
**Extends**:
- [Layer 0: Foundation](../system/layers/00-foundation.md)
- [Layer 1: Domain Knowledge](../system/layers/01-domain-knowledge.md)
- [Layer 2: Process & Workflow](../system/layers/02-process-workflow.md)
- [Layer 3a: Development](../system/layers/03-specialization/development.md)
```
