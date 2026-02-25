# US-24 — Befinden eintragen

> **Feature:** [F-14 Täglicher Check-in](../features/F-14_check-in.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** täglich in 10 Sekunden mein Befinden eintragen,  
> **damit** AIVA Health meinen Trend erkennt und mir passende Empfehlungen geben kann.

---

## Akzeptanzkriterien

- [ ] 5-stufige Emoji-Skala: 😞 Schlecht → 😐 Mittelmäßig → 🙂 Okay → 😊 Gut → 😄 Super
- [ ] Optionales Freitextfeld: „Was beschäftigt dich heute?"
- [ ] Pro Tag nur ein Check-in möglich
- [ ] Streak-Anzeige: „Du bist seit X Tagen dabei 🔥"

---

## Technische Tasks

- [ ] `TASK-91` DB: Tabelle `checkins` (user_id, date, mood_score (1–5), note, created_at)
- [ ] `TASK-92` Backend: `POST /api/checkins` (Validierung: nur 1 pro Tag)
- [ ] `TASK-93` Backend: `GET /api/checkins/today`
- [ ] `TASK-94` Backend: `GET /api/checkins/streak` (aktuelle Streak berechnen)
- [ ] `TASK-95` Frontend: `CheckInCard`-Komponente (Emoji-Auswahl)
- [ ] `TASK-96` Frontend: `StreakBadge`-Komponente
