# EPIC-05 — AIVA Family (Familienkonto)

> **Milestone:** MVP - AIVA Family  
> **Roadmap-Phase:** Phase 5 (Wochen 9–11)  
> **Ziel:** Laura kann ein Familienkonto verwalten und das Kind-Profil (U-Untersuchungen, Impfplan) tracken.  
> **Primäre Persona:** Laura Becker (Kind, 2 Jahre – U-Untersuchungen nicht verpassen)  
> **Status:** 📋 Geplant | Startet nach EPIC-04

---

## Warum dieses Epic?

Laura hat ein 2-jähriges Kind. U-Untersuchungen und Impftermine sind gesetzlich empfohlen – aber schnell vergessen.  
AIVA Family bündelt Familiengesundheit in einem Konto mit klaren Berechtigungen.

**Besondere DSGVO-Relevanz:** Kindesdaten sind besonders schützenswert. Eltern handeln als gesetzliche Vertreter.  
Datenweitergabe innerhalb der Familie nur mit expliziter Einwilligung.

---

## Features in diesem Epic

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-18](#f-18-familienkonto--mitglieder) | Familienkonto & Mitglieder | 🟡 SHOULD | L | EPIC-01 |
| [F-19](#f-19-kind-profil) | Kind-Profil | 🟡 SHOULD | M | F-18 |
| [F-20](#f-20-u-untersuchungen--impfplan) | U-Untersuchungen & Impfplan | 🟡 SHOULD | L | F-19 |
| [F-21](#f-21-daten-sharing--berechtigungen) | Daten-Sharing & Berechtigungen | 🟢 COULD | M | F-18 |

---

## F-18: Familienkonto & Mitglieder

### US-29: Familienkonto erstellen

> **Als** Laura  
> **möchte ich** ein Familienkonto anlegen,  
> **damit** ich die Gesundheit mehrerer Familienmitglieder zentral verwalten kann.

**Akzeptanzkriterien:**
- [ ] Ein Nutzer kann ein Familienkonto erstellen und wird automatisch Admin
- [ ] Familienkonto hat einen eigenen Namen (z.B. „Familie Becker")
- [ ] Max. 6 Mitglieder im MVP
- [ ] Admin kann Mitglieder einladen (per E-Mail-Link)

**Technische Tasks:**
- [ ] `TASK-112` DB: Tabelle `families` (id, name, admin_user_id, created_at)
- [ ] `TASK-113` DB: Tabelle `family_members` (family_id, user_id, role: admin/member, joined_at)
- [ ] `TASK-114` Backend: `POST /api/families` (Familienkonto erstellen)
- [ ] `TASK-115` Backend: `POST /api/families/invite` (Einladungs-E-Mail, MVP: Mock)
- [ ] `TASK-116` Frontend: `FamilySetup`-Seite

**Größe:** L | **Priorität:** 🟡 SHOULD

---

### US-30: Zwischen Profilen wechseln

> **Als** Laura  
> **möchte ich** schnell zwischen meinem Profil und dem meines Kindes wechseln,  
> **damit** ich nicht zwei Apps benötige.

**Akzeptanzkriterien:**
- [ ] Profilwechsel in der Navigation (Avatar mit Dropdown)
- [ ] Aktives Profil klar sichtbar (Name + Avatar)
- [ ] Alle Ansichten (Care, Labs, Coach) spiegeln aktives Profil
- [ ] PIN/Biometrie-Schutz für Profilwechsel (MVP: optional)

**Technische Tasks:**
- [ ] `TASK-117` Frontend: `ProfileSwitcher`-Komponente
- [ ] `TASK-118` Frontend: Aktives Familienmitglied im Auth-Context speichern
- [ ] `TASK-119` Backend: Alle `GET`-Endpunkte: `family_member_id` als optionaler Query-Param

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## F-19: Kind-Profil

### US-31: Kind-Profil anlegen

> **Als** Laura  
> **möchte ich** ein Profil für mein Kind anlegen,  
> **damit** ich U-Untersuchungen und Impfungen für mein Kind tracken kann.

**Akzeptanzkriterien:**
- [ ] Felder: Vorname, Geburtsdatum, Geschlecht, Blutgruppe (optional)
- [ ] Geburtsdatum berechnet automatisch fällige U-Untersuchungen
- [ ] Kein eigener Login für das Kind (Eltern verwalten das Profil)
- [ ] Mehrere Kinder-Profile möglich

**Technische Tasks:**
- [ ] `TASK-120` DB: Spalte `is_child_profile` + `parent_user_id` in `profiles`
- [ ] `TASK-121` Backend: `POST /api/profiles/child`
- [ ] `TASK-122` Frontend: `ChildProfileForm`-Komponente

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## F-20: U-Untersuchungen & Impfplan

### US-32: Fällige U-Untersuchungen sehen

> **Als** Laura  
> **möchte ich** auf einen Blick sehen welche U-Untersuchungen für mein Kind anstehen,  
> **damit** ich keine wichtige Vorsorge verpasse.

**Akzeptanzkriterien:**
- [ ] Automatische Berechnung basierend auf Geburtsdatum des Kindes
- [ ] U1 bis U11 mit empfohlenem Alter und Zeitfenster
- [ ] Status: Ausstehend / Erledigt / Überf\u00e4llig (🔴)
- [ ] Erledigtes U kann mit Datum und Arzt bestätigt werden
- [ ] Erinnerung 4 Wochen vor fälligem U

**Technische Tasks:**
- [ ] `TASK-123` DB: Tabelle `child_checkups` (profile_id, checkup_type, due_date, completed_at, doctor)
- [ ] `TASK-124` Backend: U-Untersuchungs-Berechnungslogik (basierend auf Geburtsdatum)
- [ ] `TASK-125` Backend: `GET /api/profiles/:id/checkups`
- [ ] `TASK-126` Daten: U1–U11 Zeitplan (Seed-Datei nach STIKO-Empfehlung)
- [ ] `TASK-127` Frontend: `CheckupTimeline`-Komponente
- [ ] `TASK-128` Frontend: `CheckupCard` mit Status-Ampel

**Größe:** L | **Priorität:** 🟡 SHOULD

---

### US-33: Impfplan verwalten

> **Als** Laura  
> **möchte ich** den Impfstatus meines Kindes verwalten,  
> **damit** ich immer weiss ob alle Impfungen aktuell sind.

**Akzeptanzkriterien:**
- [ ] STIKO-Grundimmunisierung als Basis (6-fach, MMR, Varizellen etc.)
- [ ] Jede Impfung: Name, Datum, Arzt, Charge (optional)
- [ ] Ampel: vollständig geimpft / teilweise / überfällig
- [ ] Export als PDF (MVP: 🟢 COULD)

**Technische Tasks:**
- [ ] `TASK-129` DB: Tabelle `vaccinations` (profile_id, vaccine_name, date, doctor, batch_number)
- [ ] `TASK-130` Backend: `POST/GET /api/profiles/:id/vaccinations`
- [ ] `TASK-131` Daten: STIKO-Impfplan (JSON)
- [ ] `TASK-132` Frontend: `VaccinationList`-Seite

**Größe:** L | **Priorität:** 🟡 SHOULD

---

## F-21: Daten-Sharing & Berechtigungen

### US-34: Partner Zugriff geben

> **Als** Laura  
> **möchte ich** meinem Partner Zugriff auf das Kind-Profil geben,  
> **damit** er ebenfalls Untersuchungen eintragen und Erinnerungen empfangen kann.

**Akzeptanzkriterien:**
- [ ] Einladung per E-Mail (MVP: Link, kein echtes E-Mail-Versand nötig)
- [ ] Berechtigungsstufen: Nur-Lesen / Voll-Zugriff
- [ ] Zugriff kann jederzeit entzogen werden
- [ ] DSGVO: Einwilligung des eingeladenen Mitglieds dokumentiert

**Technische Tasks:**
- [ ] `TASK-133` Backend: `POST /api/families/invite` (vollständig)
- [ ] `TASK-134` Backend: `PATCH /api/families/members/:id` (Berechtigungen ändern)
- [ ] `TASK-135` Frontend: `FamilySettings`-Seite

**Größe:** M | **Priorität:** 🟢 COULD

---

## Zusammenfassung EPIC-05

| Feature | User Stories | Tasks | Status |
|---------|-------------|-------|--------|
| F-18 Familienkonto | 2 (US-29, US-30) | 8 | 📋 Geplant |
| F-19 Kind-Profil | 1 (US-31) | 3 | 📋 Geplant |
| F-20 U-Untersuchungen & Impfplan | 2 (US-32, US-33) | 10 | 📋 Geplant |
| F-21 Daten-Sharing | 1 (US-34) | 3 | 📋 Geplant |
| **Gesamt** | **6** | **24** | |

**Geschätzte Dauer:** 2 Wochen  
**DSGVO-Hinweis:** Kindesdaten → Eltern als gesetzliche Vertreter, verschärfte Zustimmungspflicht

---

## Gesamtübersicht aller Epics

| Epic | Features | User Stories | Tasks | Wochen |
|------|----------|-------------|-------|--------|
| EPIC-01 Core Platform | 5 | 12 | 47 | 1–3 |
| EPIC-02 AIVA Care | 4 | 6 | 23 | 3–5 |
| EPIC-03 AIVA Labs | 4 | 5 | 20 | 5–7 |
| EPIC-04 AIVA Coach | 4 | 5 | 21 | 7–9 |
| EPIC-05 AIVA Family | 4 | 6 | 24 | 9–11 |
| **Gesamt MVP** | **21** | **34** | **135** | **~11 Wochen** |
