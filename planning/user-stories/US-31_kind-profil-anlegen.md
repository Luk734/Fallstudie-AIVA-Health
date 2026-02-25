# US-31 — Kind-Profil anlegen

> **Feature:** [F-19 Kind-Profil](../features/F-19_kind-profil.md)
> **Größe:** M | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** ein Profil für mein Kind anlegen,  
> **damit** ich U-Untersuchungen und Impfungen für mein Kind tracken kann.

---

## Akzeptanzkriterien

- [ ] Felder: Vorname, Geburtsdatum, Geschlecht, Blutgruppe (optional)
- [ ] Geburtsdatum berechnet automatisch fällige U-Untersuchungen
- [ ] Kein eigener Login für das Kind (Eltern verwalten das Profil als gesetzl. Vertreter)
- [ ] Mehrere Kinder-Profile möglich

---

## Technische Tasks

- [ ] `TASK-120` DB: Spalten `is_child_profile` und `parent_user_id` in Tabelle `profiles`
- [ ] `TASK-121` Backend: `POST /api/profiles/child`
- [ ] `TASK-122` Frontend: `ChildProfileForm`-Komponente
