# US-06 — Profil bearbeiten

> **Feature:** [F-02 Nutzer-Profil](../features/F-02_nutzer-profil.md)
> **Größe:** S | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** bestehender Nutzer  
> **möchte ich** mein Profil jederzeit bearbeiten können,  
> **damit** meine Daten aktuell bleiben.

---

## Akzeptanzkriterien

- [ ] Profil-Seite unter „Einstellungen" erreichbar
- [ ] Alle Felder aus Onboarding bearbeitbar
- [ ] Erfolgsmeldung nach dem Speichern

---

## Technische Tasks

- [ ] `TASK-25` Backend: `PUT /api/profile` (Profil aktualisieren)
- [ ] `TASK-26` Backend: `GET /api/profile` (Profil laden)
- [ ] `TASK-27` Frontend: Profil-Seite mit editierbaren Feldern
