# US-10 — Dashboard (Home)

> **Feature:** [F-04 Navigation & App-Layout](../features/F-04_navigation-layout.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** eingeloggter Nutzer  
> **möchte ich** auf der Startseite eine Übersicht meiner wichtigsten Gesundheitsinformationen sehen,  
> **damit** ich sofort den aktuellen Stand kenne ohne durch die App navigieren zu müssen.

---

## Akzeptanzkriterien

- [ ] Persönliche Begrüßung: „Guten Morgen, Laura 👋"
- [ ] Nächster Termin (aus AIVA Care)
- [ ] Heutiger Check-in-Status (aus AIVA Coach)
- [ ] Nächste Medikamenteneinnahme (aus AIVA Labs)
- [ ] Quick-Action Buttons: „Check-in", „Termin buchen"

---

## Technische Tasks

- [ ] `TASK-37` Frontend: `Dashboard`-Seite (Routing-Ziel `/`)
- [ ] `TASK-38` Frontend: `GreetingCard`-Komponente (Name aus Auth-Context)
- [ ] `TASK-39` Frontend: `SummaryCard`-Komponente (generisch, wiederverwendbar)
