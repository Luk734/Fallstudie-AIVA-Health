# US-19 — Medikament hinzufügen

> **Feature:** [F-10 Medikamenten-Liste](../features/F-10_medikamenten-liste.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Thomas  
> **möchte ich** meine Medikamente mit Name, Dosierung und Einnahmefrequenz eintragen,  
> **damit** AIVA Health mich zur richtigen Zeit erinnern kann.

---

## Akzeptanzkriterien

- [ ] Felder: Medikamentenname, Dosierung (z.B. „5mg"), Einnahmezeiten (morgens/mittags/abends/nachts), Startdatum, Enddatum (optional)
- [ ] Mehrere Einnahmezeiten pro Tag möglich
- [ ] Farb-Codierung pro Medikament (für visuelle Erkennung)
- [ ] Beipackzettel-Link (optional, externe URL)

---

## Technische Tasks

- [ ] `TASK-71` DB: Tabelle `medications` (user_id, name, substance, dosage, times[], start_date, end_date, color, active)
- [ ] `TASK-72` Backend: `POST /api/medications`
- [ ] `TASK-73` Backend: `GET /api/medications` (aktive Medikamente)
- [ ] `TASK-74` Frontend: `MedicationForm`-Komponente
- [ ] `TASK-75` Frontend: `MedicationCard`-Komponente
