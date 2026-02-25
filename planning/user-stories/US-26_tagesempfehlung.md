# US-26 — Tagesempfehlung erhalten

> **Feature:** [F-15 Regelbasierte Empfehlungen](../features/F-15_empfehlungen.md)
> **Größe:** L | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** nach dem Check-in eine konkrete Empfehlung erhalten,  
> **damit** ich sofort weiss was ich heute für meine Gesundheit tun kann.

---

## Akzeptanzkriterien

- [ ] Empfehlung erscheint direkt nach Check-in
- [ ] Empfehlung basiert auf Mood-Score + Kontext (Wochentag, letzte 7 Tage Trend)
- [ ] Beispielregeln:
  - Mood = 1 (Schlecht) → „Gönn dir heute 10 Min. Spaziergang"
  - Mood = 5 (Super) + Schlaf < 6h → „Du scheinst top drauf! Heute früher ins Bett?"
- [ ] MVP: Regelbasiert (if–else), kein ML
- [ ] Empfehlung kann als „umgesetzt" markiert werden

---

## Technische Tasks

- [ ] `TASK-100` Backend: Empfehlungs-Engine (`src/services/recommendations.js`)
- [ ] `TASK-101` Backend: `GET /api/recommendations/today`
- [ ] `TASK-102` Daten: Empfehlungs-Regelset (JSON: Bedingungen + Texte)
- [ ] `TASK-103` Frontend: `RecommendationCard`-Komponente
