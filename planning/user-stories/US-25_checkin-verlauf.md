# US-25 — Check-in-Verlauf ansehen

> **Feature:** [F-14 Täglicher Check-in](../features/F-14_check-in.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** meinen Befinden-Verlauf der letzten 30 Tage sehen,  
> **damit** ich Muster erkenne (z.B. Montags immer schlechte Stimmung).

---

## Akzeptanzkriterien

- [ ] Kalender-Ansicht mit Farb-Codierung nach Mood-Score (grün/gelb/rot)
- [ ] Klick auf Tag → Detail mit Note sichtbar
- [ ] Durchschnitt der letzten 7 und 30 Tage als Kennzahl

---

## Technische Tasks

- [ ] `TASK-97` Backend: `GET /api/checkins?from=&to=` (Datumsfilter)
- [ ] `TASK-98` Frontend: `MoodCalendar`-Komponente
- [ ] `TASK-99` Frontend: `MoodTrend`-Kennzahl-Komponente
