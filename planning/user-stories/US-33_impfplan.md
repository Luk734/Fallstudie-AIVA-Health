# US-33 — Impfplan verwalten

> **Feature:** [F-20 U-Untersuchungen & Impfplan](../features/F-20_u-untersuchungen.md)
> **Größe:** L | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** den Impfstatus meines Kindes verwalten,  
> **damit** ich immer weiss ob alle Impfungen aktuell sind.

---

## Akzeptanzkriterien

- [ ] STIKO-Grundimmunisierung als Basis (6-fach, MMR, Varizellen etc.)
- [ ] Jede Impfung: Name, Datum, Arzt, Chargennummer (optional)
- [ ] Ampel-Status: Vollständig geimpft / Teilweise / Überfällig
- [ ] PDF-Export (🟢 COULD, wenn Zeit reicht)

---

## Technische Tasks

- [ ] `TASK-129` DB: Tabelle `vaccinations` (profile_id, vaccine_name, date, doctor, batch_number)
- [ ] `TASK-130` Backend: `POST /api/profiles/:id/vaccinations` + `GET`
- [ ] `TASK-131` Daten: STIKO-Impfplan (JSON-Datei)
- [ ] `TASK-132` Frontend: `VaccinationList`-Seite
