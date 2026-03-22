# AIVA Health — Fortschritt (Stand: 22.03.2026)

## Implementierte User Stories

| US | Thema | Status |
|----|-------|--------|
| US-01–04 | Auth, Login, Logout, Session | ✅ |
| US-05+06 | Profil anlegen & bearbeiten | ✅ |
| US-07+08 | DSGVO Consent Onboarding & Verwaltung | ✅ |
| US-09 | Haupt-Navigation (Bottom-Nav) | ✅ |
| US-10 | Dashboard | ✅ |
| US-11 | Design Tokens (CSS-Variablen) | ✅ |
| US-12 | Basis-Komponenten (UI Library) | ✅ |
| US-13–16 | Termine (Anzeigen, Detail, Anlegen, Bearbeiten) | ✅ |
| US-17 | Vorsorge-Kalender (GKV-Katalog) | ✅ |
| US-18 | Termin-Erinnerungen (Notifications) | ✅ |
| US-19 | Medikament hinzufügen (CRUD) | ✅ |
| US-20 | Einnahme bestätigen (MedicationLog) | ✅ |
| US-21 | Medikamenten-Erinnerung (Cron + Quick-Action) | ✅ |
| US-22 | Laborbefunde anzeigen (Liste + Detail) | ✅ |
| US-23 | Laborwert verstehen (Ampel + History + Erklärungen) | ✅ |

## Nächste anstehende User Stories: US-24, US-27, US-28

**US-24: Befinden eintragen** (Feature F-14, MUST, Größe M)
- Check-in mit 5-stufiger Emoji-Skala, eröffnet Coach-Modul
- Neue DB-Tabelle checkins, neue API-Endpunkte

**US-27: Wearable-Metriken** (Feature F-16, SHOULD, Größe M)
- Mock-Gesundheitsdaten (Schritte, Herzfrequenz, Schlaf)
- Neue DB-Tabelle health_metrics + Cron-Job für Mock-Daten

**US-28: Metriken-Dashboard** (Feature F-17, COULD, Größe M)
- Coach-Dashboard mit Kacheln + Mini-Charts + Ampel

## Architektur-Überblick

- **Backend**: Express.js + Prisma ORM + PostgreSQL (Port 3001)
- **Frontend**: React (Vite) + React Router (Port 5173)
- **Auth**: JWT-Token basiert (bcrypt, 7 Tage Gültigkeit)
- **DB**: PostgreSQL auf localhost:5433
- **Test-User**: laura@example.com / thomas@example.com (PW: Test1234!)
- **Vite-Proxy**: `/api` → `http://localhost:3001` (vite.config.js)
- **Cron**: node-cron, alle 15 Min → Termin + Medikamenten-Erinnerungen

## DB-Modelle (Prisma)

User, Consent, Appointment, Doctor, PreventionSchedule, UserPrevention, Notification, Medication, MedicationLog, LabReport, LabValue, LabExplanation

## API-Routen

/api/auth, /api/users, /api/consents, /api/appointments, /api/doctors, /api/prevention, /api/notifications, /api/medications, /api/labs (inkl. /explanations, /history/:parameter)

## Wichtige Patterns

- **Branch-Workflow**: `feat/feature-name` → merge in main
- **CSS-Konvention**: CSS-Dateien IMMER in `styles/`, NIE neben Komponenten
- **Daten-Konvention**: Alle Daten in DB + Seed, KEINE JSON-Dateien im Frontend
- **Studi-Projekt**: Immer erklären was/warum geändert wird
- **Neustart**: Stop node → prisma generate → node server.js → npx vite --host
- **Prisma DLL-Lock**: Vor prisma generate alle Node-Prozesse beenden

## Letzte Session: US-23 (22.03.2026)

Branch: feat/laborwert-visualisierung → merged in main
Commit: `2de03eb`

Neue Dateien: LabValueGauge.jsx+CSS, LabValueHistory.jsx+CSS, LabExplanation DB-Modell
Geänderte: lab.controller.js, lab.routes.js, LabReportDetailPage.jsx+CSS, schema.prisma, seed.js

**Hinweis:** LabValueHistory braucht ≥2 Werte pro Parameter. Seed hat je nur 1 → History leer.
