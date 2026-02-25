# US-21 — Erinnerung zur Einnahme erhalten

> **Feature:** [F-11 Medikamenten-Erinnerung](../features/F-11_medikamenten-erinnerung.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Thomas  
> **möchte ich** zur eingestellten Zeit an mein Medikament erinnert werden,  
> **damit** ich es auch an stressigen Tagen nicht vergesse.

---

## Akzeptanzkriterien

- [ ] Erinnerung zu konfigurierten Einnahmezeiten (z.B. 08:00 und 20:00)
- [ ] MVP: In-App-Benachrichtigung im Notification-Center
- [ ] Erinnerung zeigt: Medikamentenname, Dosierung, direkten „Eingenommen"-Button
- [ ] Erinnerung verschwindet nach Bestätigung

---

## Technische Tasks

- [ ] `TASK-80` Backend: Cron-Job für Medikamenten-Reminder (node-cron, täglich zur Einnahmezeit)
- [ ] `TASK-81` Backend: Notification-Eintrag in DB erstellen
- [ ] `TASK-82` Frontend: Erinnerung in Notification-Center einblenden
- [ ] `TASK-83` Frontend: Quick-Action „Eingenommen" direkt aus Notification
