# US-28 — Gesundheits-Übersicht auf einen Blick

> **Feature:** [F-17 Health-Metriken Dashboard](../features/F-17_metriken-dashboard.md)
> **Größe:** M | **Priorität:** 🟢 COULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Nutzer  
> **möchte ich** auf dem Coach-Dashboard alle Metriken auf einen Blick sehen,  
> **damit** ich schnell den Status meiner Gesundheit erfassen kann.

---

## Akzeptanzkriterien

- [ ] Dashboard-Kacheln: Herzfrequenz, Schritte, Schlaf, Mood
- [ ] Wochenverlauf als Mini-Balkendiagramm je Metrik
- [ ] Ampel-Indikator (Grün/Gelb/Rot) je nach Abweichung vom Zielwert
- [ ] Zielwerte individuell setzbar (z.B. „Ziel: 8.000 Schritte/Tag")

---

## Technische Tasks

- [ ] `TASK-108` DB: Tabelle `health_goals` (user_id, metric_type, target_value)
- [ ] `TASK-109` Backend: `GET /api/metrics/summary` (Wochenübersicht)
- [ ] `TASK-110` Frontend: `CoachDashboard`-Seite
- [ ] `TASK-111` Frontend: `MiniChart`-Komponente (einfaches Balkendiagramm, ohne externe Library)
