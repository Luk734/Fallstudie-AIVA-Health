# EPIC-04 — AIVA Coach (Check-ins & Empfehlungen)

> **Milestone:** MVP - AIVA Coach  
> **Roadmap-Phase:** Phase 4 (Wochen 7–9)  
> **Ziel:** Laura und Thomas erhalten täglich personalisierte Gesundheitsempfehlungen und können ihren Wohlbefindensverlauf tracken.  
> **Primäre Persona:** Laura Becker (Stressreduktion, Work-Life-Balance)  
> **Status:** 📋 Geplant | Startet nach EPIC-03

---

## Warum dieses Epic?

AIVA Coach ist das „Herzstück" der App – hier geht es um echten täglichen Mehrwert.  
Laura schaut morgens kurz rein, gibt ihr Befinden ein, und bekommt eine umsetzbare Empfehlung.  
MVP: Regelbasiert (kein echtes ML). KI-Empfehlungen kommen in v2.0.

---

## Features in diesem Epic

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-14](#f-14-täglicher-check-in) | Täglicher Check-in | 🔴 MUST | M | EPIC-01 |
| [F-15](#f-15-empfehlungen) | Regelbasierte Empfehlungen | 🟡 SHOULD | L | F-14 |
| [F-16](#f-16-wearable-daten-mock) | Wearable-Daten (Mock) | 🟡 SHOULD | M | EPIC-01 |
| [F-17](#f-17-health-metriken-dashboard) | Health-Metriken Dashboard | 🟢 COULD | M | F-16 |

---

## F-14: Täglicher Check-in

### US-24: Befinden eintragen

> **Als** Laura  
> **möchte ich** täglich in 10 Sekunden mein Befinden eintragen,  
> **damit** AIVA Health meinen Trend erkennt und mir passende Empfehlungen geben kann.

**Akzeptanzkriterien:**
- [ ] 5-stufige Emoji-Skala: 😞 Schlecht → 😐 Mittelmäßig → 🙂 Okay → 😊 Gut → 😄 Super
- [ ] Optionales Freitextfeld: „Was beschäftigt dich heute?"
- [ ] Nur ein Check-in pro Tag möglich (zweiter versuch zeigt heutigen Status)
- [ ] Streak-Anzeige: „Du bist seit X Tagen dabei 🔥"
- [ ] Check-in kann nicht für vergangene Tage nachgetragen werden

**Technische Tasks:**
- [ ] `TASK-91` DB: Tabelle `checkins` (user_id, date, mood_score (1-5), note, created_at)
- [ ] `TASK-92` Backend: `POST /api/checkins` (mit Validierung: nur 1 pro Tag)
- [ ] `TASK-93` Backend: `GET /api/checkins/today` (heutiger Status)
- [ ] `TASK-94` Backend: `GET /api/checkins/streak` (aktuelle Streak berechnen)
- [ ] `TASK-95` Frontend: `CheckInCard`-Komponente (Emoji-Auswahl)
- [ ] `TASK-96` Frontend: `StreakBadge`-Komponente

**Größe:** M | **Priorität:** 🔴 MUST

---

### US-25: Check-in-Verlauf ansehen

> **Als** Laura  
> **möchte ich** meinen Befinden-Verlauf der letzten 30 Tage sehen,  
> **damit** ich Muster erkenne (z.B. Montags immer schlechte Stimmung).

**Akzeptanzkriterien:**
- [ ] Kalender-Ansicht mit Farb-Codierung (grün/gelb/rot nach Mood-Score)
- [ ] Klick auf Tag → Detail mit Note
- [ ] Durchschnitt der letzten 7/30 Tage als Kennzahl

**Technische Tasks:**
- [ ] `TASK-97` Backend: `GET /api/checkins?from=&to=` (gefilterte Abfrage)
- [ ] `TASK-98` Frontend: `MoodCalendar`-Komponente
- [ ] `TASK-99` Frontend: `MoodTrend`-Kennzahl-Komponente

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## F-15: Regelbasierte Empfehlungen

### US-26: Tagesempfehlung erhalten

> **Als** Laura  
> **möchte ich** nach dem Check-in eine konkrete Empfehlung erhalten,  
> **damit** ich sofort weiss was ich heute für meine Gesundheit tun kann.

**Akzeptanzkriterien:**
- [ ] Empfehlung erscheint direkt nach Check-in
- [ ] Empfehlung basiert auf Mood-Score + Kontext (Wochentag, letzte 7 Tage)
- [ ] Beispiele:
  - Mood = 😞 → „Gönn dir heute 10 Min. Spaziergang"
  - Mood = 😄, Schlaf < 6h → „Du scheinst top drauf! Trotzdem: Heute früher ins Bett?"
- [ ] MVP: Regelbasiert (if-else, kein ML)
- [ ] Empfehlung kann als „umgesetzt" markiert werden

**Technische Tasks:**
- [ ] `TASK-100` Backend: Empfehlungs-Engine (Rule-Engine in `src/services/recommendations.js`)
- [ ] `TASK-101` Backend: `GET /api/recommendations/today`
- [ ] `TASK-102` Daten: Empfehlungs-Regelset (JSON: Bedingungen + Texte)
- [ ] `TASK-103` Frontend: `RecommendationCard`-Komponente

**Größe:** L | **Priorität:** 🟡 SHOULD

---

## F-16: Wearable-Daten (Mock)

### US-27: Gesundheitsmetriken vom Wearable sehen

> **Als** Laura (nutzt Apple Watch)  
> **möchte ich** meine Gesundheitsdaten in AIVA Health sehen,  
> **damit** ich nicht zwischen verschiedenen Apps wechseln muss.

**Akzeptanzkriterien:**
- [ ] MVP: Mock-Daten (kein echtes Wearable-SDK)
- [ ] Metriken: Herzfrequenz (Ø + Min/Max), Schritte, Schlaf (Stunden + Qualität)
- [ ] Daten werden täglich automatisch „aktualisiert" (Mock-Cron)
- [ ] Hinweis in UI: „Demo-Daten – echte Wearable-Integration folgt"

**Technische Tasks:**
- [ ] `TASK-104` DB: Tabelle `health_metrics` (user_id, date, steps, heart_rate_avg, sleep_hours, sleep_quality)
- [ ] `TASK-105` Backend: Cron-Job: täglich realistische Mock-Daten generieren
- [ ] `TASK-106` Backend: `GET /api/metrics?date=` (tagesbasiert)
- [ ] `TASK-107` Frontend: `MetricCard`-Komponente (generisch: Icon + Wert + Einheit)

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## F-17: Health-Metriken Dashboard

### US-28: Gesundheits-Übersicht auf einen Blick

> **Als** Nutzer  
> **möchte ich** auf dem Coach-Dashboard alle Metriken auf einen Blick sehen,  
> **damit** ich schnell den Status meiner Gesundheit erfassen kann.

**Akzeptanzkriterien:**
- [ ] Dashboard: Herzfrequenz, Schritte, Schlaf, Mood in Kacheln
- [ ] Wochenverlauf als Mini-Diagramm (Balken)
- [ ] Ampel-Indikator: Grün/Gelb/Rot je nach Abweichung vom Zielwert
- [ ] Zielwerte individuell setzbar (z.B. „Ziel: 8.000 Schritte")

**Technische Tasks:**
- [ ] `TASK-108` DB: Tabelle `health_goals` (user_id, metric_type, target_value)
- [ ] `TASK-109` Backend: `GET /api/metrics/summary` (Wochenübersicht)
- [ ] `TASK-110` Frontend: `CoachDashboard`-Seite
- [ ] `TASK-111` Frontend: `MiniChart`-Komponente (Balkendiagramm ohne externe Library)

**Größe:** M | **Priorität:** 🟢 COULD

---

## Zusammenfassung EPIC-04

| Feature | User Stories | Tasks | Status |
|---------|-------------|-------|--------|
| F-14 Täglicher Check-in | 2 (US-24, US-25) | 9 | 📋 Geplant |
| F-15 Empfehlungen | 1 (US-26) | 4 | 📋 Geplant |
| F-16 Wearable-Mock | 1 (US-27) | 4 | 📋 Geplant |
| F-17 Metriken-Dashboard | 1 (US-28) | 4 | 📋 Geplant |
| **Gesamt** | **5** | **21** | |

**Geschätzte Dauer:** 2 Wochen  
**Post-MVP:** Echte Apple HealthKit / Google Fit Integration, ML-Empfehlungen
