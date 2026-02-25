# EPIC-01 — Core Platform

> **Milestone:** MVP - Core Platform  
> **Roadmap-Phase:** Phase 1 (Wochen 1–3)  
> **Ziel:** Die technische Grundlage schaffen, auf der alle anderen Module aufbauen.  
> **Status:** 🟡 In Bearbeitung

---

## Warum dieses Epic zuerst?

Alle 4 Module (Care, Labs, Coach, Family) brauchen dieselbe Basis:
- Ein Nutzer muss sich **registrieren und einloggen** können
- Der Nutzer muss ein **Profil** haben (Name, Geburtsdatum etc.)
- Die App muss **DSGVO-konform** sein (Gesundheitsdaten sind besonders schützenswert)
- Es muss ein **einheitliches Designsystem** geben, damit alle Seiten gleich aussehen

Ohne diese Grundlage können die anderen Epics nicht starten.

---

## Features in diesem Epic

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-01](#f-01-authentifizierung) | Authentifizierung (Register/Login/Logout) | 🔴 MUST | L | — |
| [F-02](#f-02-nutzer-profil) | Nutzer-Profil (anlegen & bearbeiten) | 🔴 MUST | M | F-01 |
| [F-03](#f-03-dsgvo--consent-management) | DSGVO & Consent-Management | 🔴 MUST | M | F-01 |
| [F-04](#f-04-navigation--layout) | Navigation & App-Layout | 🔴 MUST | S | F-01 |
| [F-05](#f-05-design-system--komponenten) | Design System & Basis-Komponenten | 🟡 SHOULD | M | — |

---

## F-01: Authentifizierung

**Ziel:** Ein Nutzer kann sich registrieren, einloggen und die Session bleibt erhalten.

**Hintergrund:**  
Auth ist der Türsteher der App. Jede Anfrage ans Backend wird geprüft: "Hat dieser Nutzer einen gültigen Token?" Wir nutzen JWT (JSON Web Token) – das ist ein verschlüsseltes „Ticket", das beim Login ausgestellt wird und bei jeder weiteren Anfrage mitgeschickt wird.

### User Stories

---

#### US-01: Registrierung

> **Als** neuer Nutzer  
> **möchte ich** mich mit E-Mail und Passwort registrieren,  
> **damit** ich ein persönliches Konto für meine Gesundheitsdaten erhalte.

**Akzeptanzkriterien:**
- [ ] E-Mail-Adresse und Passwort sind Pflichtfelder
- [ ] Passwort muss mind. 8 Zeichen, 1 Großbuchstabe, 1 Zahl enthalten
- [ ] E-Mail darf noch nicht registriert sein (Fehlermeldung: „E-Mail bereits vergeben")
- [ ] Passwort wird gehasht gespeichert (bcrypt, nie Klartext!)
- [ ] Nach erfolgreicher Registrierung → automatisch eingeloggt (JWT-Token erhalten)
- [ ] Fehlermeldungen sind auf Deutsch und verständlich

**Technische Tasks:**
- [ ] `TASK-01` DB: Tabelle `users` anlegen (id, email, password_hash, created_at)
- [ ] `TASK-02` Backend: `POST /api/auth/register` implementieren
- [ ] `TASK-03` Backend: Passwort-Validierung (Regex oder Zod)
- [ ] `TASK-04` Backend: bcrypt-Hashing (Saltround: 12)
- [ ] `TASK-05` Backend: JWT-Token generieren & zurückgeben
- [ ] `TASK-06` Frontend: Registrierungs-Formular (React-Komponente)
- [ ] `TASK-07` Frontend: Axios-Call zu `/api/auth/register`
- [ ] `TASK-08` Frontend: Token im `localStorage` speichern

**Größe:** L | **Priorität:** 🔴 MUST

---

#### US-02: Login

> **Als** bestehender Nutzer  
> **möchte ich** mich mit E-Mail und Passwort einloggen,  
> **damit** ich auf meine gespeicherten Gesundheitsdaten zugreifen kann.

**Akzeptanzkriterien:**
- [ ] Bei falschen Zugangsdaten → generische Fehlermeldung (kein Hinweis ob E-Mail oder PW falsch – Security!)
- [ ] Nach 5 Fehlversuchen → 15 Minuten gesperrt (Rate Limiting)
- [ ] Nach Login → Weiterleitung zum Dashboard
- [ ] JWT-Token hat 7 Tage Gültigkeit
- [ ] „Eingeloggt bleiben" → Token bleibt im localStorage

**Technische Tasks:**
- [ ] `TASK-09` Backend: `POST /api/auth/login` implementieren
- [ ] `TASK-10` Backend: bcrypt.compare() für Passwort-Prüfung
- [ ] `TASK-11` Backend: Rate Limiting Middleware (express-rate-limit)
- [ ] `TASK-12` Frontend: Login-Formular (React-Komponente)
- [ ] `TASK-13` Frontend: Axios-Call + Fehlerbehandlung
- [ ] `TASK-14` Frontend: Redirect nach Login (React Router)

**Größe:** M | **Priorität:** 🔴 MUST

---

#### US-03: Logout

> **Als** eingeloggter Nutzer  
> **möchte ich** mich ausloggen können,  
> **damit** andere Personen keinen Zugriff auf meine Daten haben (z.B. geteiltes Gerät).

**Akzeptanzkriterien:**
- [ ] Logout-Button in der Navigation sichtbar
- [ ] Nach Logout → Token aus localStorage entfernt
- [ ] Nach Logout → Weiterleitung zur Login-Seite
- [ ] Direkte URL-Eingabe nach Logout → Redirect zu Login (geschützte Routen)

**Technische Tasks:**
- [ ] `TASK-15` Frontend: Logout-Funktion (Token löschen)
- [ ] `TASK-16` Frontend: `PrivateRoute`-Komponente (schützt alle Seiten)
- [ ] `TASK-17` Frontend: Auth-Context (globaler Login-Status)

**Größe:** S | **Priorität:** 🔴 MUST

---

#### US-04: Session-Persistenz

> **Als** Nutzer  
> **möchte ich** nach einem Browser-Neustart noch eingeloggt sein,  
> **damit** ich mich nicht jedes Mal neu einloggen muss.

**Akzeptanzkriterien:**
- [ ] Token-Validierung beim App-Start (läuft der Token noch?)
- [ ] Abgelaufener Token → automatisch zur Login-Seite
- [ ] Lade-Spinner während Token-Prüfung (kein Flackern)

**Technische Tasks:**
- [ ] `TASK-18` Backend: `GET /api/auth/me` (Token validieren, User zurückgeben)
- [ ] `TASK-19` Frontend: Token-Check im Auth-Context beim Start
- [ ] `TASK-20` Frontend: Loading-State (Spinner-Komponente)

**Größe:** S | **Priorität:** 🔴 MUST

---

## F-02: Nutzer-Profil

**Ziel:** Jeder Nutzer hat ein Profil mit persönlichen Daten, das die Grundlage für personalisierte Empfehlungen bildet.

### User Stories

---

#### US-05: Profil anlegen (Onboarding)

> **Als** neu registrierter Nutzer  
> **möchte ich** direkt nach der Registrierung mein Profil anlegen,  
> **damit** AIVA Health mich mit meinem Namen ansprechen und Inhalte personalisieren kann.

**Akzeptanzkriterien:**
- [ ] Felder: Vorname, Nachname, Geburtsdatum, Geschlecht (m/w/d/keine Angabe)
- [ ] Alle Felder optional außer Vorname
- [ ] Geburtsdatum wird für Alter-basierte Empfehlungen genutzt (z.B. Darmkrebsvorsorge ab 50)
- [ ] Profilbild-Upload (MVP: Mock, nur Platzhalter-Avatar)
- [ ] Nach Onboarding → Dashboard

**Technische Tasks:**
- [ ] `TASK-21` DB: Tabelle `profiles` (user_id FK, first_name, last_name, birthdate, gender, avatar_url)
- [ ] `TASK-22` Backend: `POST /api/profile` (Profil erstellen)
- [ ] `TASK-23` Frontend: Onboarding-Step nach Registrierung
- [ ] `TASK-24` Frontend: Datumspicker-Komponente

**Größe:** M | **Priorität:** 🔴 MUST

---

#### US-06: Profil bearbeiten

> **Als** bestehender Nutzer  
> **möchte ich** mein Profil jederzeit bearbeiten können,  
> **damit** meine Daten aktuell bleiben.

**Akzeptanzkriterien:**
- [ ] Profil-Seite unter „Einstellungen" erreichbar
- [ ] Änderungen werden sofort gespeichert (oder mit „Speichern"-Button bestätigt)
- [ ] Erfolgsmeldung nach dem Speichern

**Technische Tasks:**
- [ ] `TASK-25` Backend: `PUT /api/profile` (Profil aktualisieren)
- [ ] `TASK-26` Backend: `GET /api/profile` (Profil laden)
- [ ] `TASK-27` Frontend: Profil-Seite mit editierbaren Feldern

**Größe:** S | **Priorität:** 🔴 MUST

---

## F-03: DSGVO & Consent-Management

**Ziel:** Der Nutzer stimmt der Datenverarbeitung bewusst und nachvollziehbar zu. Gesundheitsdaten sind nach DSGVO Art. 9 besondere Kategorie – strengste Schutzanforderungen.

**Hintergrund DSGVO:**  
Gesundheitsdaten dürfen nur mit **ausdrücklicher Einwilligung** verarbeitet werden. Wir müssen dokumentieren: Wer hat wann was eingewilligt. Das ist keine bürokratische Pflicht, sondern Vertrauensbasis für die Nutzer.

### User Stories

---

#### US-07: Einwilligungen beim Onboarding

> **Als** neuer Nutzer  
> **möchte ich** klar und verständlich gefragt werden, welche Daten AIVA Health nutzen darf,  
> **damit** ich informiert entscheiden kann und meine Privatsphäre geschützt ist.

**Akzeptanzkriterien:**
- [ ] Separate Checkboxen (kein „alles oder nichts"):
  - Nutzungsbedingungen & Datenschutzerklärung (🔴 MUST, Pflicht)
  - Verarbeitung von Gesundheitsdaten zur Personalisierung (🔴 MUST)
  - Anonymisierte Daten für Produktverbesserung (🟢 Optional)
- [ ] Jede Einwilligung mit Zeitstempel in DB gespeichert
- [ ] Links zu Datenschutz und AGB öffnen in neuem Tab

**Technische Tasks:**
- [ ] `TASK-28` DB: Tabelle `consents` (user_id, consent_type, granted, granted_at)
- [ ] `TASK-29` Backend: `POST /api/consents` (Einwilligungen speichern)
- [ ] `TASK-30` Frontend: Consent-Screen mit Checkboxen

**Größe:** M | **Priorität:** 🔴 MUST

---

#### US-08: Einwilligungen verwalten

> **Als** Nutzer  
> **möchte ich** meine erteilten Einwilligungen jederzeit einsehen und widerrufen können,  
> **damit** ich die Kontrolle über meine Daten behalte (DSGVO Recht auf Widerruf).

**Akzeptanzkriterien:**
- [ ] Übersicht aller Einwilligungen in den Einstellungen
- [ ] Optionale Einwilligungen können widerrufen werden
- [ ] Widerruf wird mit Zeitstempel dokumentiert
- [ ] Bei Widerruf der Gesundheitsdaten-Einwilligung → Warnung + Konsequenzen erklären

**Technische Tasks:**
- [ ] `TASK-31` Backend: `GET /api/consents` (aktuelle Einwilligungen)
- [ ] `TASK-32` Backend: `PATCH /api/consents/:id` (Einwilligung widerrufen)
- [ ] `TASK-33` Frontend: Datenschutz-Seite in Einstellungen

**Größe:** S | **Priorität:** 🔴 MUST

---

## F-04: Navigation & App-Layout

**Ziel:** Die App hat eine konsistente Navigation, die Nutzer zu allen Bereichen führt.

### User Stories

---

#### US-09: Haupt-Navigation

> **Als** Nutzer  
> **möchte ich** einfach zwischen den 4 Modulen wechseln,  
> **damit** ich schnell das finde, was ich brauche.

**Akzeptanzkriterien:**
- [ ] Bottom-Navigation (Mobile-First) mit 5 Icons: Home, Care, Labs, Coach, Family
- [ ] Aktiver Tab ist visuell hervorgehoben
- [ ] Navigation in allen geschützten Seiten sichtbar
- [ ] Thomas: Icons & Text mind. 16px (Barrierefreiheit WCAG 2.1 AA)

**Technische Tasks:**
- [ ] `TASK-34` Frontend: React Router Setup (alle Routen definieren)
- [ ] `TASK-35` Frontend: `AppLayout`-Komponente mit Navigation
- [ ] `TASK-36` Frontend: `NavItem`-Komponente (Icon + Label + Active-State)

**Größe:** M | **Priorität:** 🔴 MUST

---

#### US-10: Dashboard (Home)

> **Als** eingeloggter Nutzer  
> **möchte ich** auf der Startseite eine Übersicht meiner wichtigsten Gesundheitsinformationen sehen,  
> **damit** ich sofort den aktuellen Stand kenne ohne durch die App navigieren zu müssen.

**Akzeptanzkriterien:**
- [ ] Persönliche Begrüßung: „Guten Morgen, Laura 👋"
- [ ] Nächster Termin (aus AIVA Care)
- [ ] Heutiger Check-in-Status (aus AIVA Coach)
- [ ] Letzter Befund / nächste Medikamenteneinnahme (aus AIVA Labs)
- [ ] Quick-Action Buttons: „Check-in", „Termin buchen"

**Technische Tasks:**
- [ ] `TASK-37` Frontend: `Dashboard`-Seite
- [ ] `TASK-38` Frontend: `GreetingCard`-Komponente
- [ ] `TASK-39` Frontend: `SummaryCard`-Komponente (generisch, wiederverwendbar)

**Größe:** M | **Priorität:** 🔴 MUST

---

## F-05: Design System & Basis-Komponenten

**Ziel:** Einheitliches Aussehen der gesamten App durch wiederverwendbare Komponenten.

**Hintergrund:**  
Ein Design System ist wie ein Baukasten. Statt jedes Mal einen neuen Button zu bauen, gibt es `<Button variant="primary">` – überall gleich, überall anpassbar. Das spart Entwicklungszeit und sorgt für Konsistenz.

### User Stories

---

#### US-11: Farben & Typografie

> **Als** Entwickler  
> **möchte ich** zentral definierte Farben und Schriftgrößen nutzen,  
> **damit** ich keine inconsistenten Werte quer durch den Code verteile.

**Akzeptanzkriterien:**
- [ ] CSS-Variablen definiert: Primary (#4F46E5), Teal, Coral, Green, Red, Yellow
- [ ] Schriftgrößen-Skala: xs (12px), sm (14px), base (16px), lg (18px), xl (20px)
- [ ] Spacing-Skala: 4px Raster (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Thomas: Mindestschriftgröße 16px für Fließtext

**Technische Tasks:**
- [ ] `TASK-40` Frontend: `src/styles/tokens.css` (CSS Custom Properties)
- [ ] `TASK-41` Frontend: `src/styles/global.css` (Reset + Base Styles)

**Größe:** S | **Priorität:** 🟡 SHOULD

---

#### US-12: Basis-Komponenten

> **Als** Entwickler  
> **möchte ich** vorgefertigte UI-Bausteine nutzen,  
> **damit** ich schnell konsistente Interfaces bauen kann.

**Akzeptanzkriterien:**
- [ ] `Button` (Varianten: primary, secondary, ghost; Größen: sm, md, lg)
- [ ] `Input` (Text, Password, Date; mit Label und Fehlerzustand)
- [ ] `Card` (Container mit Shadow und Padding)
- [ ] `Badge` (Status-Tags: grün, gelb, rot)
- [ ] `Spinner` (Lade-Animation)
- [ ] `Alert` (Erfolg, Warnung, Fehler)
- [ ] Alle Komponenten mit min. 44px Touch-Target (WCAG)

**Technische Tasks:**
- [ ] `TASK-42` Frontend: `src/components/ui/Button.jsx`
- [ ] `TASK-43` Frontend: `src/components/ui/Input.jsx`
- [ ] `TASK-44` Frontend: `src/components/ui/Card.jsx`
- [ ] `TASK-45` Frontend: `src/components/ui/Badge.jsx`
- [ ] `TASK-46` Frontend: `src/components/ui/Spinner.jsx`
- [ ] `TASK-47` Frontend: `src/components/ui/Alert.jsx`

**Größe:** M | **Priorität:** 🟡 SHOULD

---

## Zusammenfassung EPIC-01

| Feature | User Stories | Tasks | Status |
|---------|-------------|-------|--------|
| F-01 Authentifizierung | 4 (US-01 bis US-04) | 20 | 🔲 Offen |
| F-02 Nutzer-Profil | 2 (US-05 bis US-06) | 7 | 🔲 Offen |
| F-03 DSGVO & Consent | 2 (US-07 bis US-08) | 6 | 🔲 Offen |
| F-04 Navigation & Layout | 2 (US-09 bis US-10) | 6 | 🔲 Offen |
| F-05 Design System | 2 (US-11 bis US-12) | 8 | 🔲 Offen |
| **Gesamt** | **12** | **47** | |

**Geschätzte Dauer:** 2–3 Wochen (2 Entwickler)  
**Nächster Schritt:** US-01 (Registrierung) → TASK-01 Datenbank-Tabelle anlegen
