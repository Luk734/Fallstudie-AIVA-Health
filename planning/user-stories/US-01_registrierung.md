# US-01 — Registrierung

> **Feature:** [F-01 Authentifizierung](../features/F-01_authentifizierung.md)
> **Größe:** L | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** neuer Nutzer  
> **möchte ich** mich mit E-Mail und Passwort registrieren,  
> **damit** ich ein persönliches Konto für meine Gesundheitsdaten erhalte.

---

## Akzeptanzkriterien

- [ ] E-Mail-Adresse und Passwort sind Pflichtfelder
- [ ] Passwort muss mind. 8 Zeichen, 1 Großbuchstabe, 1 Zahl enthalten
- [ ] E-Mail darf noch nicht registriert sein (Fehlermeldung: „E-Mail bereits vergeben")
- [ ] Passwort wird gehasht gespeichert (bcrypt, **nie** Klartext!)
- [ ] Nach erfolgreicher Registrierung → automatisch eingeloggt (JWT-Token erhalten)
- [ ] Fehlermeldungen sind auf Deutsch und verständlich

---

## Technische Tasks

- [ ] `TASK-01` DB: Tabelle `users` anlegen (id, email, password_hash, created_at)
- [ ] `TASK-02` Backend: `POST /api/auth/register` implementieren
- [ ] `TASK-03` Backend: Passwort-Validierung (Regex)
- [ ] `TASK-04` Backend: bcrypt-Hashing (Saltround: 12)
- [ ] `TASK-05` Backend: JWT-Token generieren & zurückgeben
- [ ] `TASK-06` Frontend: Registrierungs-Formular (React-Komponente)
- [ ] `TASK-07` Frontend: Axios-Call zu `/api/auth/register`
- [ ] `TASK-08` Frontend: Token im `localStorage` speichern
