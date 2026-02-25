# US-34 — Partner Zugriff geben

> **Feature:** [F-21 Daten-Sharing & Berechtigungen](../features/F-21_daten-sharing.md)
> **Größe:** M | **Priorität:** 🟢 COULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** meinem Partner Zugriff auf das Kind-Profil geben,  
> **damit** er ebenfalls Untersuchungen eintragen und Erinnerungen empfangen kann.

---

## Akzeptanzkriterien

- [ ] Einladung per E-Mail (MVP: Link, kein echter Mailversand nötig)
- [ ] Berechtigungsstufen: Nur-Lesen / Voll-Zugriff
- [ ] Zugriff kann jederzeit entzogen werden
- [ ] DSGVO: Einwilligung des eingeladenen Mitglieds dokumentiert

---

## Technische Tasks

- [ ] `TASK-133` Backend: `POST /api/families/invite` (vollständig mit Berechtigungsstufen)
- [ ] `TASK-134` Backend: `PATCH /api/families/members/:id` (Berechtigungen ändern/entziehen)
- [ ] `TASK-135` Frontend: `FamilySettings`-Seite mit Mitgliederverwaltung
