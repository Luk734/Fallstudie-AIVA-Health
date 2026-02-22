# /Prototype Command

**Context Layers:**
- [Layer 03d: MVP Prototype](../../system/layers/03-specialization/mvp-prototype.md) — MVP Principles & Scope Guard
- [Convention 17: MVP Conventions](../../conventions/other/17-mvp-conventions.md) — Mock-First & Timeboxing
- [Convention 18: Design System](../../conventions/other/18-design-system.md) — AIVA Health Design Tokens

## Zweck
Erstellt einen interaktiven Prototyp für ein Feature.

## Verantwortlicher Agent
**UX-Designer Agent**

## Syntax
```
/Prototype <Feature-Name> [--type=lofi|hifi|code] [--timebox=1d|3d|5d]
```

## Workflow
1. Design-Spezifikation reviewen
2. **Scope Guard Checklist** ausführen:
   - □ MVP-Essential? (MUST-HAVE?)
   - □ Can we Mock it? (Integration > 4h?)
   - □ Can we Simplify? (50% enough?)
   - □ Can it Wait? (Post-MVP?)
3. Prototyp-Typ bestimmen:
   - **Lo-Fi**: Wireframe/Figma (1-2 Tage)
   - **Hi-Fi**: Design-System angewandt (2-3 Tage)
   - **Code**: Funktionaler Prototyp (3-5 Tage)
4. STRICT Timebox setzen
5. Prototyp erstellen (Mock Data OK)
6. Usability Test (min. gegen Personas)
7. Learnings dokumentieren
8. Go/No-Go entscheiden

## Template: Prototype Documentation

### GitHub Issue Felder
- **Title**: `[Prototype] <Feature-Name>`
- **Labels**: `prototype`, `<modul>`, `design`
- **Assignees**: UX-Designer Agent

### Body Template

```markdown
## 🎨 Prototype: <Feature-Name>

**Feature**: #<Feature-Issue-Number>
**Design Spec**: #<DesignSpec-Issue-Number>

---

### 📋 Scope (STRICT)

**Scope Guard Checklist:**
- [ ] MVP-Essential? → [Ja/Nein + Begründung]
- [ ] Can we Mock it? → [Ja/Nein]
- [ ] Can we Simplify? → [Beschreibung]
- [ ] Can it Wait? → [Nein, weil...]

**In Scope** (Max 3-5 Features):
1. [Core Feature 1]
2. [Core Feature 2]
3. [Core Feature 3]

**Out of Scope** (Explizit):
- [Feature X] → Post-MVP
- [Feature Y] → Nicht essential

**Timebox**: [1-5 Tage MAX]
**Type**: Lo-Fi | Hi-Fi | Code
**Throwaway**: Ja (Learnings only) | Nein (Refactor zu MVP)

---

### 🎯 Prototyp-Ziel
[Was soll validiert werden?]

### 🖼️ Screens

#### Screen 1: <Name>
```
┌──────────────────────────┐
│  [Screen Layout]          │
│                           │
│  [Component-Beschreibung] │
│                           │
│  [CTA Button]             │
└──────────────────────────┘
```

#### Screen 2: <Name>
```
┌──────────────────────────┐
│  [Screen Layout]          │
└──────────────────────────┘
```

---

### 🧪 Usability Test

**Test gegen Personas:**
| Persona | Aufgabe | Ergebnis | Learnings |
|---------|---------|----------|-----------|
| Laura (32) | [Aufgabe] | ✅/❌ | [Learning] |
| Thomas (56) | [Aufgabe] | ✅/❌ | [Learning] |

---

### 📊 Learnings

**Validated Hypotheses:**
- ✅ [Hypothese die bestätigt wurde]

**Invalidated Hypotheses:**
- ❌ [Hypothese die widerlegt wurde]

**Pivots / Änderungen:**
- 🔄 [Was muss geändert werden]

---

### ✅ Go/No-Go Decision
- [ ] **GO** → Weiter zu Implementation
- [ ] **PIVOT** → Design anpassen, neuer Prototyp
- [ ] **CANCEL** → Feature nicht umsetzen (ADR erstellen)
```

### File-Struktur (Code-Prototyp)
```
prototypes/
└── <feature-name>/
    ├── README.md       # Dokumentation & Learnings
    ├── index.html      # Entry Point
    ├── styles.css      # AIVA Design Tokens
    ├── app.js          # Interactions (Mock Data)
    └── mock-data.json  # Hardcoded Test-Daten
```

## Verwandte Commands
- **/DesignSpec** → Design-Spezifikation als Grundlage
- **/Component** → Components aus Prototyp implementieren
- **/Feature** → Feature-Anforderungen

## AIVA Health Beispiel
```
/Prototype Termin-Buchung --type=code --timebox=3d

Code-Prototyp für Termin-Buchungsflow:
1. Arzt auswählen (Mock-Daten)
2. Zeitslot wählen (Mock-Kalender)
3. Bestätigung

Scope Guard: Doctolib-Integration → Mock.
Timebox: 3 Tage, dann Go/No-Go.
```
