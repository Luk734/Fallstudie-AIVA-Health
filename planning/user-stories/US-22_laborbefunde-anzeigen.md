# US-22 — Laborbefunde anzeigen

> **Feature:** [F-12 Laborbefunde](../features/F-12_laborbefunde.md)
> **Größe:** L | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Thomas  
> **möchte ich** meine Laborergebnisse in der App sehen,  
> **damit** ich meine Gesundheitswerte im Blick behalte ohne Papierbefunde aufzubewahren.

---

## Akzeptanzkriterien

- [ ] Liste der Laborbefunde nach Datum sortiert (neueste zuerst)
- [ ] Jeder Befund zeigt: Datum, Labor/Arzt, Anzahl Parameter
- [ ] MVP: Mock-Daten (kein echtes ePA/FHIR-Interface)
- [ ] Detail-Ansicht mit allen Laborwerten

---

## Technische Tasks

- [ ] `TASK-84` DB: Tabellen `lab_reports` + `lab_values` (parameter, value, unit, reference_min, reference_max)
- [ ] `TASK-85` Backend: `GET /api/labs` + `GET /api/labs/:id`
- [ ] `TASK-86` Daten: Mock-Laborbefunde für Thomas (Seed-Datei)
- [ ] `TASK-87` Frontend: `LabReportList` + `LabReportDetail`-Komponenten
