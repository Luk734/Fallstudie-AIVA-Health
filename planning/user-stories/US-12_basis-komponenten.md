# US-12 — Basis-Komponenten

> **Feature:** [F-05 Design System](../features/F-05_design-system.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Entwickler  
> **möchte ich** vorgefertigte UI-Bausteine nutzen,  
> **damit** ich schnell konsistente Interfaces bauen kann ohne jeden Button neu zu erfinden.

---

## Akzeptanzkriterien

- [ ] `Button` (Varianten: primary, secondary, ghost; Größen: sm, md, lg)
- [ ] `Input` (Text, Password, Date; mit Label und Fehlerzustand in Rot)
- [ ] `Card` (Container mit Shadow und Padding)
- [ ] `Badge` (Status-Tags: grün, gelb, rot, blau)
- [ ] `Spinner` (Lade-Animation)
- [ ] `Alert` (Erfolg grün, Warnung gelb, Fehler rot)
- [ ] Alle Komponenten: mind. 44×44px Touch-Target (WCAG 2.1 AA)

---

## Technische Tasks

- [ ] `TASK-42` Frontend: `src/components/ui/Button.jsx`
- [ ] `TASK-43` Frontend: `src/components/ui/Input.jsx`
- [ ] `TASK-44` Frontend: `src/components/ui/Card.jsx`
- [ ] `TASK-45` Frontend: `src/components/ui/Badge.jsx`
- [ ] `TASK-46` Frontend: `src/components/ui/Spinner.jsx`
- [ ] `TASK-47` Frontend: `src/components/ui/Alert.jsx`
