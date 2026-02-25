# US-27 — Gesundheitsmetriken vom Wearable sehen

> **Feature:** [F-16 Wearable-Daten (Mock)](../features/F-16_wearable-mock.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura (nutzt Apple Watch)  
> **möchte ich** meine Gesundheitsdaten in AIVA Health sehen,  
> **damit** ich nicht zwischen verschiedenen Apps wechseln muss.

---

## Akzeptanzkriterien

- [ ] Angezeigte Metriken: Herzfrequenz (Ø + Min/Max), Schritte, Schlaf (Stunden + Qualität)
- [ ] MVP: simulierte Daten (kein echtes SDK)
- [ ] Daten werden täglich automatisch „aktualisiert" (Mock-Cron)
- [ ] Hinweis in UI: „Demo-Daten – echte Wearable-Integration folgt"

---

## Technische Tasks

- [ ] `TASK-104` DB: Tabelle `health_metrics` (user_id, date, steps, heart_rate_avg, sleep_hours, sleep_quality)
- [ ] `TASK-105` Backend: Cron-Job – täglich realistische Mock-Daten generieren
- [ ] `TASK-106` Backend: `GET /api/metrics?date=`
- [ ] `TASK-107` Frontend: `MetricCard`-Komponente (generisch: Icon + Wert + Einheit)
