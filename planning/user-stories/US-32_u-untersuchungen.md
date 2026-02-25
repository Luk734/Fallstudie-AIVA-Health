# US-32 — Fällige U-Untersuchungen sehen

> **Feature:** [F-20 U-Untersuchungen & Impfplan](../features/F-20_u-untersuchungen.md)
> **Größe:** L | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** auf einen Blick sehen welche U-Untersuchungen für mein Kind anstehen,  
> **damit** ich keine wichtige Vorsorge verpasse.

---

## Akzeptanzkriterien

- [ ] Automatische Berechnung basierend auf Geburtsdatum: U1 bis U11
- [ ] Jeder Eintrag zeigt: U-Bezeichnung, empfohlenes Alter, Zeitfenster
- [ ] Status: Ausstehend / Erledigt / Überfällig (🔴)
- [ ] Erledigt-Status mit Datum und Arzt bestätigbar
- [ ] Erinnerung 4 Wochen vor fälligem U

---

## Technische Tasks

- [ ] `TASK-123` DB: Tabelle `child_checkups` (profile_id, checkup_type, due_date, completed_at, doctor)
- [ ] `TASK-124` Backend: U-Berechnungslogik basierend auf Geburtsdatum
- [ ] `TASK-125` Backend: `GET /api/profiles/:id/checkups`
- [ ] `TASK-126` Daten: U1–U11 Zeitplan (Seed-Datei nach STIKO)
- [ ] `TASK-127` Frontend: `CheckupTimeline`-Komponente
- [ ] `TASK-128` Frontend: `CheckupCard` mit Status-Ampel
