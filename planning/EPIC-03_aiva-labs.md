# EPIC-03 — AIVA Labs (Befunde & Medikation)

> **Milestone:** MVP - AIVA Labs  
> **Roadmap-Phase:** Phase 3 (Wochen 5–7)  
> **Ziel:** Thomas kann seine Medikamente verwalten, wird zuverlässig erinnert und kann Laborbefunde einsehen.  
> **Primäre Persona:** Thomas Wagner (56, Bluthochdruck, nimmt täglich Medikamente)  
> **Status:** 📋 Geplant | Startet nach EPIC-02

---

## Warum dieses Epic?

Thomas' größtes Risiko: Er vergisst seine Blutdruck-Medikamente oder nimmt sie zur falschen Zeit.  
AIVA Labs wird zu seinem täglichen Begleiter für Medikamente und Laborwerte.

**Besondere DSGVO-Relevanz:** Medikamentendaten und Laborbefunde sind hochsensible Gesundheitsdaten (Art. 9 DSGVO). Alle Daten müssen verschlüsselt gespeichert werden.

---

## Features in diesem Epic

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-10](#f-10-medikamenten-liste) | Medikamenten-Liste | 🔴 MUST | M | EPIC-01 |
| [F-11](#f-11-medikamenten-erinnerung) | Medikamenten-Erinnerung | 🔴 MUST | M | F-10 |
| [F-12](#f-12-laborbefunde) | Laborbefunde anzeigen | 🟡 SHOULD | L | EPIC-01 |
| [F-13](#f-13-referenzbereich-visualisierung) | Referenzbereich-Visualisierung | 🟡 SHOULD | M | F-12 |

---

## F-10: Medikamenten-Liste

### US-19: Medikament hinzufügen

> **Als** Thomas  
> **möchte ich** meine Medikamente mit Name, Dosierung und Einnahmefrequenz eintragen,  
> **damit** AIVA Health mich zur richtigen Zeit erinnern kann.

**Akzeptanzkriterien:**
- [ ] Felder: Medikamentenname, Wirkstoff (optional), Dosierung (z.B. „5mg"), Einnahmezeiten (morgens/mittags/abends/Nacht), Startdatum, Enddatum (optional)
- [ ] Mehrere Einnahmezeiten pro Tag möglich
- [ ] Farb-Codierung pro Medikament (für schnelle visuelle Erkennung)
- [ ] Beipackzettel-Link (optional, externe URL)

**Technische Tasks:**
- [ ] `TASK-71` DB: Tabelle `medications` (user_id, name, substance, dosage, times[], start_date, end_date, color, active)
- [ ] `TASK-72` Backend: `POST /api/medications`
- [ ] `TASK-73` Backend: `GET /api/medications` (aktive Medikamente)
- [ ] `TASK-74` Frontend: `MedicationForm`-Komponente
- [ ] `TASK-75` Frontend: `MedicationCard`-Komponente

**Größe:** M | **Priorität:** 🔴 MUST

---

### US-20: Einnahme bestätigen

> **Als** Thomas  
> **möchte ich** nach der Einnahme eines Medikaments einen Haken setzen,  
> **damit** ich nachverfolgen kann ob ich alle Medikamente genommen habe.

**Akzeptanzkriterien:**
- [ ] Tagesansicht: alle heutigen Einnahmen auf einen Blick
- [ ] Einnahme-Status: Ausstehend / Eingenommen / Übersprungen
- [ ] Heutiger Fortschritt in Prozent (z.B. „3 von 4 Einnahmen")
- [ ] Einnahme-Historie der letzten 30 Tage einsehbar

**Technische Tasks:**
- [ ] `TASK-76` DB: Tabelle `medication_logs` (medication_id, user_id, scheduled_time, taken_at, status)
- [ ] `TASK-77` Backend: `POST /api/medications/:id/take` (Einnahme bestätigen)
- [ ] `TASK-78` Backend: `GET /api/medications/today` (heutige Einnahmen)
- [ ] `TASK-79` Frontend: `MedicationToday`-Ansicht mit Checkboxen

**Größe:** M | **Priorität:** 🔴 MUST

---

## F-11: Medikamenten-Erinnerung

### US-21: Erinnerung zur Einnahme erhalten

> **Als** Thomas  
> **möchte ich** zur eingestellten Zeit an mein Medikament erinnert werden,  
> **damit** ich es auch an stressigen Tagen nicht vergesse.

**Akzeptanzkriterien:**
- [ ] Erinnerung zu konfigurierten Einnahmezeiten (z.B. 08:00, 20:00)
- [ ] MVP: In-App-Benachrichtigung (Notification-Center der App)
- [ ] Erinnerung zeigt: Medikamentenname, Dosierung, direkten „Eingenommen"-Button
- [ ] Erinnerung verschwindet nach Bestätigung

**Technische Tasks:**
- [ ] `TASK-80` Backend: Cron-Job für Medikamenten-Reminder (node-cron, täglich zur Einnahmezeit)
- [ ] `TASK-81` Backend: Notification-Eintrag in DB erstellen
- [ ] `TASK-82` Frontend: Erinnerung in Notification-Center einblenden
- [ ] `TASK-83` Frontend: Quick-Action „Eingenommen" direkt aus Notification

**Größe:** M | **Priorität:** 🔴 MUST

---

## F-12: Laborbefunde

### US-22: Laborbefunde anzeigen

> **Als** Thomas  
> **möchte ich** meine Laborergebnisse in der App sehen,  
> **damit** ich meine Gesundheitswerte im Blick behalte ohne Papierbefunde aufzubewahren.

**Akzeptanzkriterien:**
- [ ] Liste der Laborbefunde nach Datum sortiert
- [ ] Jeder Befund zeigt: Datum, Labor/Arzt, Anzahl Parameter
- [ ] MVP: Mock-Daten (echte ePA-Integration erst Post-MVP)
- [ ] Detail-Ansicht mit allen Laborwerten

**Technische Tasks:**
- [ ] `TASK-84` DB: Tabellen `lab_reports` + `lab_values` (parameter, value, unit, reference_min, reference_max)
- [ ] `TASK-85` Backend: `GET /api/labs` + `GET /api/labs/:id`
- [ ] `TASK-86` Daten: Mock-Laborbefunde für Thomas (Seed-Datei)
- [ ] `TASK-87` Frontend: `LabReportList` + `LabReportDetail`

**Größe:** L | **Priorität:** 🟡 SHOULD

---

## F-13: Referenzbereich-Visualisierung

### US-23: Laborwert verstehen

> **Als** Thomas (kein Mediziner)  
> **möchte ich** auf einen Blick verstehen ob mein Laborwert im Normalbereich ist,  
> **damit** ich nicht selbst Referenzwerte nachschlagen muss.

**Akzeptanzkriterien:**
- [ ] Ampel-System: Grün (Normal) / Gelb (Grenzwertig) / Rot (Auffällig)
- [ ] Visualisierung als Skala mit Pfeil-Marker auf aktuellem Wert
- [ ] Verlauf über Zeit (letzten 3 Messungen)
- [ ] Erklärungstext für jeden Parameter in verständlicher Sprache

**Technische Tasks:**
- [ ] `TASK-88` Frontend: `LabValueGauge`-Komponente (Skala-Visualisierung)
- [ ] `TASK-89` Frontend: `LabValueHistory`-Komponente (Mini-Diagramm)
- [ ] `TASK-90` Daten: Erklärungstexte für häufige Parameter (JSON)

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## Zusammenfassung EPIC-03

| Feature | User Stories | Tasks | Status |
|---------|-------------|-------|--------|
| F-10 Medikamenten-Liste | 2 (US-19, US-20) | 9 | 📋 Geplant |
| F-11 Medikamenten-Erinnerung | 1 (US-21) | 4 | 📋 Geplant |
| F-12 Laborbefunde | 1 (US-22) | 4 | 📋 Geplant |
| F-13 Referenzbereich | 1 (US-23) | 3 | 📋 Geplant |
| **Gesamt** | **5** | **20** | |

**Geschätzte Dauer:** 2 Wochen  
**DSGVO-Hinweis:** Verschlüsselung der Medication + Lab-Daten vor Release prüfen!
