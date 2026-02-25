# US-30 — Zwischen Profilen wechseln

> **Feature:** [F-18 Familienkonto & Mitglieder](../features/F-18_familienkonto.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** schnell zwischen meinem Profil und dem meines Kindes wechseln,  
> **damit** ich nicht zwei separate Apps benötige.

---

## Akzeptanzkriterien

- [ ] Profilwechsel über Avatar-Dropdown in der Navigation
- [ ] Aktives Profil klar sichtbar (Name + Avatar)
- [ ] Alle Ansichten (Care, Labs, Coach) spiegeln aktives Profil wider

---

## Technische Tasks

- [ ] `TASK-117` Frontend: `ProfileSwitcher`-Komponente (Dropdown)
- [ ] `TASK-118` Frontend: Aktives Familienmitglied im Auth-Context speichern
- [ ] `TASK-119` Backend: Alle relevanten `GET`-Endpunkte: `family_member_id` als optionaler Query-Param
