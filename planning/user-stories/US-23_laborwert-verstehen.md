# US-23 — Laborwert verstehen

> **Feature:** [F-13 Referenzbereich-Visualisierung](../features/F-13_referenzbereich.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Thomas (kein Mediziner)  
> **möchte ich** auf einen Blick verstehen ob mein Laborwert im Normalbereich ist,  
> **damit** ich nicht selbst Referenzwerte nachschlagen muss.

---

## Akzeptanzkriterien

- [ ] Ampel-System: 🟢 Grün (Normal) / 🟡 Gelb (Grenzwertig) / 🔴 Rot (Auffällig)
- [ ] Visualisierung als Skala mit Pfeil-Marker auf aktuellem Wert
- [ ] Verlauf der letzten 3 Messungen als Mini-Diagramm
- [ ] Erklärungstext für jeden Parameter in verständlicher Sprache (kein Medizinjargon)

---

## Technische Tasks

- [ ] `TASK-88` Frontend: `LabValueGauge`-Komponente (Skala-Visualisierung)
- [ ] `TASK-89` Frontend: `LabValueHistory`-Komponente (Mini-Balkendiagramm)
- [ ] `TASK-90` Daten: Erklärungstexte für häufige Parameter (JSON-Datei)
