# US-29 — Familienkonto erstellen

> **Feature:** [F-18 Familienkonto & Mitglieder](../features/F-18_familienkonto.md)
> **Größe:** L | **Priorität:** 🟡 SHOULD | **Status:** 🔲 Offen

---

## User Story

> **Als** Laura  
> **möchte ich** ein Familienkonto anlegen,  
> **damit** ich die Gesundheit mehrerer Familienmitglieder zentral verwalten kann.

---

## Akzeptanzkriterien

- [ ] Ein Nutzer kann ein Familienkonto erstellen und wird automatisch Admin
- [ ] Familienkonto hat einen eigenen Namen (z.B. „Familie Becker")
- [ ] Max. 6 Mitglieder im MVP
- [ ] Admin kann Mitglieder per E-Mail einladen (MVP: Link, kein echter Mailversand)

---

## Technische Tasks

- [ ] `TASK-112` DB: Tabelle `families` (id, name, admin_user_id, created_at)
- [ ] `TASK-113` DB: Tabelle `family_members` (family_id, user_id, role: admin/member, joined_at)
- [ ] `TASK-114` Backend: `POST /api/families`
- [ ] `TASK-115` Backend: `POST /api/families/invite` (Einladungs-Link generieren, MVP: Mock)
- [ ] `TASK-116` Frontend: `FamilySetup`-Seite
