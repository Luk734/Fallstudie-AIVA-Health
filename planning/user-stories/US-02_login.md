# US-02 — Login

> **Feature:** [F-01 Authentifizierung](../features/F-01_authentifizierung.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** bestehender Nutzer  
> **möchte ich** mich mit E-Mail und Passwort einloggen,  
> **damit** ich auf meine gespeicherten Gesundheitsdaten zugreifen kann.

---

## Akzeptanzkriterien

- [ ] Bei falschen Zugangsdaten → generische Fehlermeldung (kein Hinweis ob E-Mail oder PW falsch – Security!)
- [ ] Nach 5 Fehlversuchen → 15 Minuten gesperrt (Rate Limiting)
- [ ] Nach Login → Weiterleitung zum Dashboard
- [ ] JWT-Token hat 7 Tage Gültigkeit
- [ ] „Eingeloggt bleiben" → Token bleibt im localStorage

---

## Technische Tasks

- [ ] `TASK-09` Backend: `POST /api/auth/login` implementieren
- [ ] `TASK-10` Backend: bcrypt.compare() für Passwort-Prüfung
- [ ] `TASK-11` Backend: Rate Limiting Middleware (express-rate-limit)
- [ ] `TASK-12` Frontend: Login-Formular (React-Komponente)
- [ ] `TASK-13` Frontend: Axios-Call + Fehlerbehandlung
- [ ] `TASK-14` Frontend: Redirect nach Login (React Router)
