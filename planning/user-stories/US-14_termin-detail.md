# US-14 — Termin-Detail anzeigen

> **Feature:** [F-06 Termin-Übersicht](../features/F-06_termin-uebersicht.md)
> **Größe:** S | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** die Details eines Termins sehen,  
> **damit** ich weiß wo ich hingehen muss und was ich vorbereiten soll.

---

## Akzeptanzkriterien

- [ ] Detail-Ansicht zeigt: Arzt, Adresse, Telefon, Notizen
- [ ] „In Karte öffnen" Button (verlinkt auf Google Maps)
- [ ] „Termin bearbeiten" und „Stornieren" Optionen sichtbar

---

## Technische Tasks

- [ ] `TASK-53` Backend: `GET /api/appointments/:id`
- [ ] `TASK-54` Frontend: `AppointmentDetail`-Seite
