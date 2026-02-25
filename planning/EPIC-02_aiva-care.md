# EPIC-02 — AIVA Care (Terminmanagement)

> **Milestone:** MVP - AIVA Care  
> **Roadmap-Phase:** Phase 2 (Wochen 3–5)  
> **Ziel:** Laura kann Arzttermine verwalten, Vorsorge-Erinnerungen empfangen und ihren Gesundheitskalender im Blick behalten.  
> **Primäre Persona:** Laura Becker (32, vergisst Arzttermine aus Zeitmangel)  
> **Status:** 📋 Geplant | Startet nach EPIC-01

---

## Warum dieses Epic?

Lauras größtes Problem: Sie schiebt Arzttermine auf und vergisst Vorsorgeuntersuchungen.  
AIVA Care löst das mit einem Kalender + Erinnerungen + einfacher Terminbuchung.

---

## Features in diesem Epic

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-06](#f-06-termin-übersicht) | Termin-Übersicht & Kalender | 🔴 MUST | M | EPIC-01 |
| [F-07](#f-07-termin-erstellen--bearbeiten) | Termin erstellen & bearbeiten | 🔴 MUST | M | F-06 |
| [F-08](#f-08-vorsorge-kalender) | Vorsorge-Kalender | 🟡 SHOULD | L | F-06 |
| [F-09](#f-09-termin-erinnerungen) | Termin-Erinnerungen (Push-Mock) | 🟡 SHOULD | S | F-07 |

---

## F-06: Termin-Übersicht

### US-13: Nächste Termine anzeigen

> **Als** Laura  
> **möchte ich** meine nächsten Arzttermine auf einen Blick sehen,  
> **damit** ich nichts vergesse und frühzeitig planen kann.

**Akzeptanzkriterien:**
- [ ] Liste der nächsten 3 Termine auf dem Dashboard sichtbar
- [ ] Vollständige Liste unter AIVA Care abrufbar
- [ ] Jeder Termin zeigt: Datum, Uhrzeit, Arzt/Art, Ort
- [ ] Vergangene Termine unter „Verlauf" einsehbar
- [ ] Leerer Zustand: freundliche Nachricht „Kein Termin geplant – soll ich dir helfen?"

**Technische Tasks:**
- [ ] `TASK-48` DB: Tabelle `appointments` (id, user_id, title, doctor, location, datetime, notes, status)
- [ ] `TASK-49` Backend: `GET /api/appointments` (alle Termine des Nutzers)
- [ ] `TASK-50` Backend: `GET /api/appointments/upcoming` (nächste 3)
- [ ] `TASK-51` Frontend: `AppointmentList`-Komponente
- [ ] `TASK-52` Frontend: `AppointmentCard`-Komponente

**Größe:** M | **Priorität:** 🔴 MUST

---

### US-14: Termin-Detail anzeigen

> **Als** Laura  
> **möchte ich** die Details eines Termins sehen,  
> **damit** ich weiß wo ich hingehen muss und was ich vorbereiten soll.

**Akzeptanzkriterien:**
- [ ] Detail-Ansicht mit: Arzt, Adresse, Telefon, Notizen
- [ ] „In Karte öffnen" Button (verlinkt auf Google Maps)
- [ ] „Termin bearbeiten" und „Stornieren" Optionen

**Technische Tasks:**
- [ ] `TASK-53` Backend: `GET /api/appointments/:id`
- [ ] `TASK-54` Frontend: `AppointmentDetail`-Seite

**Größe:** S | **Priorität:** 🔴 MUST

---

## F-07: Termin erstellen & bearbeiten

### US-15: Neuen Termin anlegen

> **Als** Laura  
> **möchte ich** einen neuen Arzttermin in wenigen Schritten eintragen,  
> **damit** ich meine Termine zentral verwalten kann.

**Akzeptanzkriterien:**
- [ ] Formular: Titel, Arzt, Datum & Uhrzeit, Ort, Notizen (optional)
- [ ] Datum-/Zeitauswahl mit nativem Datepicker (mobile-freundlich)
- [ ] Termin erscheint sofort in der Liste nach Speichern
- [ ] „Mock-Doctolib": Vorgefertigte Arztliste zum Auswählen (keine echte API für MVP)

**Technische Tasks:**
- [ ] `TASK-55` Backend: `POST /api/appointments`
- [ ] `TASK-56` Backend: Validierung (Datum nicht in Vergangenheit)
- [ ] `TASK-57` Frontend: `CreateAppointment`-Formular
- [ ] `TASK-58` Frontend: Mock-Arztliste (JSON-Datei mit Beispiedärzten)

**Größe:** M | **Priorität:** 🔴 MUST

---

### US-16: Termin bearbeiten & löschen

> **Als** Laura  
> **möchte ich** einen bestehenden Termin ändern oder absagen können,  
> **damit** meine Terminliste immer aktuell ist.

**Akzeptanzkriterien:**
- [ ] Alle Felder bearbeitbar
- [ ] Löschen nur mit Bestätigungs-Dialog (verhindert versehentliches Löschen)
- [ ] Gelöschte Termine erscheinen im Verlauf als „Storniert"

**Technische Tasks:**
- [ ] `TASK-59` Backend: `PUT /api/appointments/:id`
- [ ] `TASK-60` Backend: `DELETE /api/appointments/:id` (Soft Delete: status = cancelled)
- [ ] `TASK-61` Frontend: Edit-Formular (gleiche Komponente wie Create, wiederverwendet)
- [ ] `TASK-62` Frontend: Bestätigungs-Dialog-Komponente

**Größe:** S | **Priorität:** 🔴 MUST

---

## F-08: Vorsorge-Kalender

### US-17: Gesetzliche Vorsorge sehen

> **Als** Laura (32 Jahre)  
> **möchte ich** sehen, welche Vorsorgeuntersuchungen mir aktuell zustehen,  
> **damit** ich keine kostenlosen Leistungen der Krankenkasse verpasse.

**Akzeptanzkriterien:**
- [ ] Liste der relevanten Vorsorge für Lauras Alter (32 Jahre, weiblich)
- [ ] Beispiele: Hautkrebs-Screening ab 35, Mammographie ab 50, Gynäkologische Vorsorge jährlich
- [ ] Basis: statische Daten aus offiziellen Quellen (kein Live-API für MVP)
- [ ] Erledigt/nicht erledigt Status (vom Nutzer setzbar)
- [ ] Thomas (56, männlich): Darmkrebsvorsorge, PSA-Test sichtbar

**Technische Tasks:**
- [ ] `TASK-63` DB: Tabelle `prevention_schedules` (type, age_from, age_to, gender, frequency_months, description)
- [ ] `TASK-64` Backend: `GET /api/prevention` (gefiltert nach Alter + Geschlecht des Nutzers)
- [ ] `TASK-65` Daten: prevention_schedules Seed-Datei (Quelldaten)
- [ ] `TASK-66` Frontend: `PreventionList`-Seite

**Größe:** L | **Priorität:** 🟡 SHOULD

---

## F-09: Termin-Erinnerungen

### US-18: Erinnerung einrichten

> **Als** Laura  
> **möchte ich** vor einem Termin erinnert werden,  
> **damit** ich den Termin nicht vergesse.

**Akzeptanzkriterien:**
- [ ] Erinnerung wahlweise 1 Tag oder 1 Stunde vorher
- [ ] MVP: In-App-Benachrichtigung (kein echter Push)
- [ ] Erinnerungen in einer „Benachrichtigungen"-Ansicht sichtbar
- [ ] Erinnerung als gelesen markieren

**Technische Tasks:**
- [ ] `TASK-67` DB: Tabelle `notifications` (user_id, type, message, related_id, read, created_at)
- [ ] `TASK-68` Backend: `GET /api/notifications`
- [ ] `TASK-69` Backend: Cron-Job (Erinnerungen 1 Tag vorher generieren, node-cron)
- [ ] `TASK-70` Frontend: `NotificationBell`-Komponente mit Badge-Zähler

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## Zusammenfassung EPIC-02

| Feature | User Stories | Tasks | Status |
|---------|-------------|-------|--------|
| F-06 Termin-Übersicht | 2 (US-13, US-14) | 7 | 📋 Geplant |
| F-07 Termin erstellen/bearbeiten | 2 (US-15, US-16) | 8 | 📋 Geplant |
| F-08 Vorsorge-Kalender | 1 (US-17) | 4 | 📋 Geplant |
| F-09 Erinnerungen | 1 (US-18) | 4 | 📋 Geplant |
| **Gesamt** | **6** | **23** | |

**Geschätzte Dauer:** 2 Wochen  
**Startet:** Nach EPIC-01 vollständig abgeschlossen
