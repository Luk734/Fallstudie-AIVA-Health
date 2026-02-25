# US-15 — Neuen Termin anlegen

> **Feature:** [F-07 Termin erstellen & bearbeiten](../features/F-07_termin-erstellen.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** einen neuen Arzttermin in wenigen Schritten eintragen,  
> **damit** ich meine Termine zentral verwalten kann.

---

## Akzeptanzkriterien

- [ ] Formular: Titel, Arzt, Datum & Uhrzeit, Ort, Notizen (optional)
- [ ] Datum-/Zeitauswahl mit nativem Datepicker (mobile-freundlich)
- [ ] Termin erscheint sofort in der Liste nach Speichern
- [ ] Mock-Doctolib: Vorgefertigte Arztliste zum Auswählen (JSON-Datei, keine echte API)

---

## Technische Tasks

- [ ] `TASK-55` Backend: `POST /api/appointments`
- [ ] `TASK-56` Backend: Validierung (Datum nicht in Vergangenheit)
- [ ] `TASK-57` Frontend: `CreateAppointment`-Formular
- [ ] `TASK-58` Frontend: Mock-Arztliste (JSON-Datei mit Beispielärzten)
