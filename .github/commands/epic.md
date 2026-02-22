# /Epic Command

**Context Layers:**
- [Layer 03c: Planning](../../system/layers/03-specialization/planning.md#epic-definition) — Epic-Struktur & Best Practices
- [Layer 02: Process Workflow](../../system/layers/02-process-workflow.md#feature-lifecycle) — Feature Lifecycle

## Zweck
Erstellt ein neues Epic in der Projektplanung.

## Verantwortlicher Agent
**Planner Agent**

## Syntax
```
/Epic <Epic-Name>
```

## Workflow
1. Epic-Anforderungen analysieren
2. Business Value definieren
3. Strategische Ziele & MoSCoW-Priorisierung festlegen
4. Erfolgsmetriken bestimmen
5. Epic als GitHub Issue anlegen (Label: `epic`)
6. Milestone zuordnen
7. Dokumentation erstellen

## Template: Epic

### GitHub Issue Felder
- **Title**: `[Epic] <Epic-Name>`
- **Labels**: `epic`, `<modul>` (care/labs/coach/family/core)
- **Milestone**: Zugehörige Phase (z.B. "Phase 1: Core Platform")
- **Assignees**: Planner Agent (initial)

### Body Template

```markdown
## 🎯 <Epic-Name>

**Epic-ID**: EPIC-XXX

### 🎯 Business Value
[Beschreibung des Business Value — Bezug zu Personas Laura/Thomas]

### 📊 Strategische Ziele
- Ziel 1
- Ziel 2
- Ziel 3

### 📦 Scope (MoSCoW)

**MUST Have:**
- [Feature 1]
- [Feature 2]

**SHOULD Have:**
- [Feature 3]

**COULD Have:**
- [Feature 4]

**WON'T Have (v1.0):**
- [Feature 5]

### 📈 Erfolgsmetriken
- Metrik 1: [Messwert]
- Metrik 2: [Messwert]

### 🔗 Abhängigkeiten
- Abhängigkeit 1
- Abhängigkeit 2

### 📅 Zeitrahmen
- **Start**: [Datum]
- **Ende**: [Datum]
- **Phase**: [Roadmap-Phase]

### 🔒 DSGVO-Relevanz
- [ ] Verarbeitet Gesundheitsdaten (Art. 9)
- [ ] Consent erforderlich
- [ ] Audit Trail nötig

### 📋 Features (Child Issues)
- [ ] Feature 1 (#XX)
- [ ] Feature 2 (#XX)
```

## Verwandte Commands
- **/Feature** → Erstellt Features unter diesem Epic
- **/UserStory** → Erstellt Stories unter Features

## AIVA Health Beispiel
```
/Epic AIVA Care — Terminmanagement

Erstellt das Epic für das komplette Terminmanagement-Modul
inkl. Termin-Übersicht, Buchung und Vorsorge-Kalender.
```
