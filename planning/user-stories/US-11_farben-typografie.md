# US-11 — Farben & Typografie

> **Feature:** [F-05 Design System](../features/F-05_design-system.md)
> **Größe:** S | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Entwickler  
> **möchte ich** zentral definierte Farben und Schriftgrößen nutzen,  
> **damit** keine inkonsistenten Werte quer durch den Code verteilt werden.

---

## Akzeptanzkriterien

- [ ] CSS-Variablen definiert: Primary (#4F46E5), Teal (#06B6D4), Coral (#F97316), Green (#10B981), Red (#EF4444)
- [ ] Schriftgrößen-Skala: xs (12px), sm (14px), base (16px), lg (18px), xl (20px)
- [ ] Spacing-Skala: 4px-Raster (4, 8, 12, 16, 24, 32, 48, 64px)
- [ ] Thomas: Mindestschriftgröße 16px für Fließtext (WCAG 2.1 AA)

---

## Technische Tasks

- [ ] `TASK-40` Frontend: `src/styles/tokens.css` (CSS Custom Properties)
- [ ] `TASK-41` Frontend: `src/styles/global.css` (Reset + Base Styles)
