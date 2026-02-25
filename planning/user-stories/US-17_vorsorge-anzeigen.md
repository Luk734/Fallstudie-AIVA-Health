# US-17 — Gesetzliche Vorsorge sehen

> **Feature:** [F-08 Vorsorge-Kalender](../features/F-08_vorsorge-kalender.md)
> **Größe:** L | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura (32 Jahre, weiblich)  
> **möchte ich** sehen, welche Vorsorgeuntersuchungen mir aktuell zustehen,  
> **damit** ich keine kostenlosen Leistungen der Krankenkasse verpasse.

---

## Akzeptanzkriterien

- [ ] Liste der relevanten Vorsorge gefiltert nach Alter und Geschlecht
- [ ] Beispiele Laura: Gynäkologische Vorsorge (jährlich), Hautkrebs-Screening (ab 35)
- [ ] Beispiele Thomas (56, männlich): Darmkrebsvorsorge, PSA-Test
- [ ] Basis: statische Daten aus GKV-Leistungskatalog (kein Live-API)
- [ ] Status vom Nutzer setzbar: Noch offen / Erledigt
- [ ] Erinnerung 6 Wochen vor fälliger Untersuchung

---

## Technische Tasks

- [ ] `TASK-63` DB: Tabelle `prevention_schedules` (type, age_from, age_to, gender, frequency_months, description)
- [ ] `TASK-64` Backend: `GET /api/prevention` (gefiltert nach Nutzer-Alter + Geschlecht)
- [ ] `TASK-65` Daten: prevention_schedules Seed-Datei (statische GKV-Daten)
- [ ] `TASK-66` Frontend: `PreventionList`-Seite
