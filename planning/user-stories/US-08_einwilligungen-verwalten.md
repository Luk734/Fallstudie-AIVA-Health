# US-08 — Einwilligungen verwalten

> **Feature:** [F-03 DSGVO & Consent-Management](../features/F-03_dsgvo-consent.md)
> **Größe:** S | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Nutzer  
> **möchte ich** meine erteilten Einwilligungen jederzeit einsehen und widerrufen können,  
> **damit** ich die Kontrolle über meine Daten behalte (DSGVO Recht auf Widerruf, Art. 7 Abs. 3).

---

## Akzeptanzkriterien

- [ ] Übersicht aller Einwilligungen in den Einstellungen
- [ ] Optionale Einwilligungen können widerrufen werden
- [ ] Widerruf wird mit Zeitstempel dokumentiert
- [ ] Bei Widerruf der Gesundheitsdaten-Einwilligung → Warnung + Konsequenzen erklären

---

## Technische Tasks

- [ ] `TASK-31` Backend: `GET /api/consents` (aktuelle Einwilligungen abrufen)
- [ ] `TASK-32` Backend: `PATCH /api/consents/:id` (Einwilligung widerrufen)
- [ ] `TASK-33` Frontend: Datenschutz-Seite in Einstellungen
