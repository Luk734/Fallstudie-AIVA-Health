# US-16 — Termin bearbeiten & löschen

> **Feature:** [F-07 Termin erstellen & bearbeiten](../features/F-07_termin-erstellen.md)
> **Größe:** S | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** einen bestehenden Termin ändern oder absagen können,  
> **damit** meine Terminliste immer aktuell ist.

---

## Akzeptanzkriterien

- [ ] Alle Felder bearbeitbar
- [ ] Löschen nur mit Bestätigungs-Dialog (verhindert versehentliches Löschen)
- [ ] Gelöschte Termine erscheinen im Verlauf als „Storniert" (Soft Delete)

---

## Technische Tasks

- [ ] `TASK-59` Backend: `PUT /api/appointments/:id`
- [ ] `TASK-60` Backend: `DELETE /api/appointments/:id` (Soft Delete: status = 'cancelled')
- [ ] `TASK-61` Frontend: Edit-Formular (gleiche Komponente wie Create, wiederverwendet)
- [ ] `TASK-62` Frontend: Bestätigungs-Dialog-Komponente (`ConfirmDialog`)
