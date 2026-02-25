# US-03 — Logout

> **Feature:** [F-01 Authentifizierung](../features/F-01_authentifizierung.md)
> **Größe:** S | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** eingeloggter Nutzer  
> **möchte ich** mich ausloggen können,  
> **damit** andere Personen keinen Zugriff auf meine Daten haben (z.B. geteiltes Gerät).

---

## Akzeptanzkriterien

- [ ] Logout-Button in der Navigation sichtbar
- [ ] Nach Logout → Token aus localStorage entfernt
- [ ] Nach Logout → Weiterleitung zur Login-Seite
- [ ] Direkte URL-Eingabe nach Logout → Redirect zu Login (geschützte Routen)

---

## Technische Tasks

- [ ] `TASK-15` Frontend: Logout-Funktion (Token löschen)
- [ ] `TASK-16` Frontend: `PrivateRoute`-Komponente (schützt alle Seiten)
- [ ] `TASK-17` Frontend: Auth-Context (globaler Login-Status)
