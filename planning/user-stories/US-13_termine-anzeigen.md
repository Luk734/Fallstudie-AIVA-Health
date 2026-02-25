# US-13 — Nächste Termine anzeigen

> **Feature:** [F-06 Termin-Übersicht](../features/F-06_termin-uebersicht.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** meine nächsten Arzttermine auf einen Blick sehen,  
> **damit** ich nichts vergesse und frühzeitig planen kann.

---

## Akzeptanzkriterien

- [ ] Nächste 3 Termine auf dem Dashboard sichtbar
- [ ] Vollständige Liste unter AIVA Care abrufbar
- [ ] Jeder Termin zeigt: Datum, Uhrzeit, Arzt/Art, Ort
- [ ] Vergangene Termine unter „Verlauf" einsehbar
- [ ] Leerer Zustand: „Kein Termin geplant – soll ich dir helfen?"

---

## Technische Tasks

- [ ] `TASK-48` DB: Tabelle `appointments` (id, user_id, title, doctor, location, datetime, notes, status)
- [ ] `TASK-49` Backend: `GET /api/appointments` (alle Termine des Nutzers)
- [ ] `TASK-50` Backend: `GET /api/appointments/upcoming` (nächste 3)
- [ ] `TASK-51` Frontend: `AppointmentList`-Komponente
- [ ] `TASK-52` Frontend: `AppointmentCard`-Komponente
