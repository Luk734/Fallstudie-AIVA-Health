# US-09 — Haupt-Navigation

> **Feature:** [F-04 Navigation & App-Layout](../features/F-04_navigation-layout.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Nutzer  
> **möchte ich** einfach zwischen den 4 Modulen wechseln,  
> **damit** ich schnell das finde, was ich brauche.

---

## Akzeptanzkriterien

- [ ] Bottom-Navigation mit 5 Punkten: Home, Care, Labs, Coach, Family
- [ ] Aktiver Tab ist visuell hervorgehoben (Farbe + Unterstrich)
- [ ] Navigation in allen geschützten Seiten sichtbar
- [ ] Thomas: Icons & Text mind. 16px (Barrierefreiheit WCAG 2.1 AA)
- [ ] Touch-Target mind. 44×44px je Nav-Element

---

## Technische Tasks

- [ ] `TASK-34` Frontend: React Router v6 Setup (alle Routen definieren)
- [ ] `TASK-35` Frontend: `AppLayout`-Komponente mit Bottom-Navigation
- [ ] `TASK-36` Frontend: `NavItem`-Komponente (Icon + Label + Active-State)
