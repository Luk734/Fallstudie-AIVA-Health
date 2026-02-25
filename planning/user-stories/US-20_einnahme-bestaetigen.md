# US-20 — Einnahme bestätigen

> **Feature:** [F-10 Medikamenten-Liste](../features/F-10_medikamenten-liste.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Thomas  
> **möchte ich** nach der Einnahme eines Medikaments einen Haken setzen,  
> **damit** ich nachverfolgen kann ob ich alle Medikamente genommen habe.

---

## Akzeptanzkriterien

- [ ] Tagesansicht: alle heutigen Einnahmen auf einen Blick
- [ ] Status je Einnahme: Ausstehend / Eingenommen / Übersprungen
- [ ] Heutiger Fortschritt als Prozentangabe (z.B. „3 von 4 Einnahmen")
- [ ] Einnahme-Historie der letzten 30 Tage einsehbar

---

## Technische Tasks

- [ ] `TASK-76` DB: Tabelle `medication_logs` (medication_id, user_id, scheduled_time, taken_at, status)
- [ ] `TASK-77` Backend: `POST /api/medications/:id/take` (Einnahme bestätigen)
- [ ] `TASK-78` Backend: `GET /api/medications/today` (heutige Einnahmen)
- [ ] `TASK-79` Frontend: `MedicationToday`-Ansicht mit Checkboxen
