# AIVA Health — Fortschritt (Stand: 22.03.2026)

## Implementierte User Stories

| US | Thema | Status | Branch |
|----|-------|--------|--------|
| US-01–04 | Auth, Login, Logout, Session | ✅ | feat/database-setup |
| US-05+06 | Profil anlegen & bearbeiten | ✅ | feat/user-profile |
| US-07+08 | DSGVO Consent Onboarding & Verwaltung | ✅ | feat/dsgvo-consent |
| US-09 | Haupt-Navigation (Bottom-Nav) | ✅ | feat/haupt-navigation |
| US-10 | Dashboard | ✅ | feat/dashboard |
| US-11 | Design Tokens (CSS-Variablen) | ✅ | feat/design-tokens |
| US-12 | Basis-Komponenten (UI Library) | ✅ | feat/basis-komponenten |
| US-13–16 | Termine (Anzeigen, Detail, Anlegen, Bearbeiten) | ✅ | feat/termine-anzeigen |
| US-17 | Vorsorge-Kalender (GKV-Katalog) | ✅ | feat/vorsorge-erinnerungen |
| US-18 | Termin-Erinnerungen (Notifications) | ✅ | feat/termin-erinnerungen |
| US-19 | Medikament hinzufügen (CRUD) | ✅ | feat/medikamenten-liste |
| US-20 | Einnahme bestätigen (MedicationLog) | ✅ | feat/einnahme-bestaetigen |

## Nächste anstehende User Story: US-21

**US-21: Medikamenten-Erinnerung** (Feature F-11)
- Automatische Erinnerung bei Einnahmezeiten
- Baut auf US-20 (MedicationLog) + US-18 (Notification-System) auf

## Architektur-Überblick

- **Backend**: Express.js + Prisma ORM + PostgreSQL (Port 3001)
- **Frontend**: React (Vite) + React Router (Port 5173)
- **Auth**: JWT-Token basiert (bcrypt Passwort-Hash)
- **DB**: PostgreSQL auf localhost:5433
- **Test-User**: laura@example.com / thomas@example.com (PW: Test1234!)

## Zuletzt geänderte Dateien (US-20)

### Backend
- `schema.prisma` — Neues MedicationLog-Model + Relationen
- `seed.js` — Test-Logs für Thomas (morgens=taken, abends=pending)
- `medication.controller.js` — 4 neue Handler: getTodayMedications, takeMedication, skipMedication, getMedicationHistory
- `medication.routes.js` — /today, /history, /:id/take, /:id/skip

### Frontend
- `MedicationTodayCard.jsx` — Einnahme-Zeile mit ✅/⏭️ Buttons
- `MedicationTodaySection.jsx` — Tagesübersicht mit Fortschrittsbalken
- `LabsPage.jsx` — TodaySection als erste Sektion eingebunden
- CSS: MedicationTodayCard.css, MedicationTodaySection.css

## Wichtige Patterns

- **CRUD-Pattern**: Prisma Model → Controller → Routes → Form+Card Komponenten → Page → App.jsx Route
- **Soft-Delete**: active-Flag statt echtem Löschen (DSGVO)
- **Conventional Commits**: feat(modul): US-XX Beschreibung
- **Design-Tokens**: CSS-Variablen aus US-11 werden überall genutzt
- **UI-Primitives**: Card, Badge, Button, Alert etc. aus US-12
- **Auth**: Alle API-Calls mit `Authorization: Bearer ${token}` Header
