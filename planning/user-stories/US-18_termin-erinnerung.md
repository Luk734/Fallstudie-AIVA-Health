# US-18 — Erinnerung einrichten

> **Feature:** [F-09 Termin-Erinnerungen](../features/F-09_termin-erinnerungen.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** vor einem Termin erinnert werden,  
> **damit** ich den Termin nicht vergesse.

---

## Akzeptanzkriterien

- [ ] Erinnerung wahlweise 1 Tag oder 1 Stunde vorher
- [ ] MVP: In-App-Benachrichtigung (kein echter Push-Dienst)
- [ ] Erinnerungen in einer „Benachrichtigungen"-Ansicht gesammelt
- [ ] Erinnerung als gelesen markieren

---

## Technische Tasks

- [ ] `TASK-67` DB: Tabelle `notifications` (user_id, type, message, related_id, read, created_at)
- [ ] `TASK-68` Backend: `GET /api/notifications`
- [ ] `TASK-69` Backend: Cron-Job – Erinnerungen 1 Tag vorher generieren (node-cron)
- [ ] `TASK-70` Frontend: `NotificationBell`-Komponente mit Badge-Zähler (ungelesene)
