# /DesignSpec Command

**Context Layers:**
- [Layer 03a: Development](../../system/layers/03-specialization/development.md#health-app-ui-patterns) — Health App UI Patterns
- [Convention 18: Design System](../../conventions/other/18-design-system.md) — AIVA Health Design Tokens
- [Convention 14: Frontend](../../conventions/fullstack/14-frontend.md) — Atomic Design & Accessibility
- [Context: Personas](../../context/personas.md) — Laura & Thomas Design Requirements

## Zweck
Erstellt eine Design-Spezifikation für ein Feature oder eine Component.

## Verantwortlicher Agent
**UX-Designer Agent**

## Syntax
```
/DesignSpec <Feature-Name> [Feature-ID]
```

## Workflow
1. Feature-Anforderungen analysieren
2. Personas & User Needs identifizieren (Laura/Thomas)
3. Wireframes definieren (Lo-Fi)
4. AIVA Health Design System anwenden (Tokens)
5. Accessibility prüfen (Thomas-Requirements)
6. Component-Hierarchie festlegen (Atomic Design)
7. Spezifikation dokumentieren
8. GitHub Issue anlegen (Label: `design-spec`)

## Template: Design Specification

### GitHub Issue Felder
- **Title**: `[Design] <Feature-Name>`
- **Labels**: `design-spec`, `<modul>`, `ux`
- **Assignees**: UX-Designer Agent

### Body Template

```markdown
## 🎨 Design Spec: <Feature-Name>

**Feature**: #<Feature-Issue-Number>
**Erstellt von**: UX-Designer Agent

---

### 👥 User Research

**Target Users:**
| Persona | Bedürfnis | Pain Point |
|---------|-----------|-----------|
| Laura (32) | [Schnell, mobil] | [Zeitdruck, viele Apps] |
| Thomas (56) | [Einfach, übersichtlich] | [Kleine Schrift, komplexe UIs] |

**Design Goals:**
1. Goal 1
2. Goal 2
3. Goal 3

---

### 📐 Layout & Wireframe

```
┌──────────────────────────────────┐
│  Header / Navigation             │
├──────────────────────────────────┤
│                                  │
│  [Wireframe-Beschreibung]        │
│                                  │
│  ┌────────────┐ ┌────────────┐   │
│  │ Component 1│ │ Component 2│   │
│  └────────────┘ └────────────┘   │
│                                  │
├──────────────────────────────────┤
│  Bottom Navigation               │
└──────────────────────────────────┘
```

---

### 🎨 Design Tokens (aus AIVA Design System)

| Token | Wert | Verwendung |
|-------|------|-----------|
| `--aiva-primary-500` | #4CAF50 | Hauptfarbe |
| `--aiva-text-base` | 1rem (16px) | Body Text |
| `--aiva-radius-md` | 0.5rem | Card Radius |
| `--aiva-space-4` | 1rem | Standard Padding |

---

### 🧩 Component-Hierarchie (Atomic Design)

| Level | Component | Props |
|-------|-----------|-------|
| Atom | Button | variant, size, label |
| Atom | Badge | status, color |
| Molecule | <Specific> | ... |
| Organism | <Specific> | ... |

---

### ♿ Accessibility Requirements

| Requirement | Spec | Persona |
|-------------|------|---------|
| Min. Schriftgröße | 16px | Thomas |
| Touch Target | 44×44px | Beide |
| Kontrast | ≥ 4.5:1 | Thomas |
| Keyboard Nav | Tab-Order definiert | Thomas |
| Screen Reader | ARIA Labels | Beide |
| Farb-Kodierung | Immer mit Icon/Text | Thomas |

---

### 📱 Responsive Behavior

| Breakpoint | Layout | Anpassungen |
|-----------|--------|-------------|
| Mobile (<640px) | Single Column | Bottom Nav, Cards full-width |
| Tablet (640-1024px) | 2 Columns | Side Nav optional |
| Desktop (>1024px) | 3 Columns | Full navigation |

---

### 🔒 DSGVO UX-Patterns
- [ ] Consent-Dialog vor Gesundheitsdaten
- [ ] Datenschutz-Info bei Datenerfassung
- [ ] Lösch-Option sichtbar
- [ ] Export-Option unter Einstellungen
```

## Verwandte Commands
- **/Prototype** → Interaktiven Prototyp erstellen
- **/Component** → Component implementieren
- **/Feature** → Feature-Anforderungen

## AIVA Health Beispiel
```
/DesignSpec Vitaldaten Dashboard FEAT-005

Design-Spezifikation für das Vitaldaten-Dashboard
mit VitalSignBadge, Chart-Verlauf und Farbkodierung
(normal/erhöht/kritisch). Fokus: Thomas-Accessibility.
```
