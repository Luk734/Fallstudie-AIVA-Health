# US-04 — Session-Persistenz

> **Feature:** [F-01 Authentifizierung](../features/F-01_authentifizierung.md)
> **Größe:** S | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Nutzer  
> **möchte ich** nach einem Browser-Neustart noch eingeloggt sein,  
> **damit** ich mich nicht jedes Mal neu einloggen muss.

---

## Akzeptanzkriterien

- [ ] Token-Validierung beim App-Start (läuft der Token noch?)
- [ ] Abgelaufener Token → automatisch zur Login-Seite
- [ ] Lade-Spinner während Token-Prüfung (kein Flackern der Seite)

---

## Technische Tasks

- [ ] `TASK-18` Backend: `GET /api/auth/me` (Token validieren, User zurückgeben)
- [ ] `TASK-19` Frontend: Token-Check im Auth-Context beim App-Start
- [ ] `TASK-20` Frontend: Loading-State (Spinner-Komponente)
