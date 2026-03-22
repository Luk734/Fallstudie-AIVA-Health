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

## Nächste anstehende User Story: US-23 oder US-24

**US-23: Laborwert verstehen** (Feature F-13, SHOULD, Größe M)
- Ampel-System: Normal/Grenzwertig/Auffällig
- Skala-Visualisierung mit Pfeil-Marker (LabValueGauge)
- Mini-Diagramm Verlauf letzte 3 Messungen (LabValueHistory)
- Erklärungstexte für Parameter in verständlicher Sprache (JSON)
- Baut direkt auf US-22 auf (gleiche DB-Struktur)

**US-24: Befinden eintragen** (Feature F-14, MUST, Größe M)
- Check-in mit 5-stufiger Emoji-Skala, eröffnet Coach-Modul
- Neue DB-Tabelle checkins, neue API-Endpunkte
- Höchste Priorität (MUST) unter den offenen Stories

## Architektur-Überblick

- **Backend**: Express.js + Prisma ORM + PostgreSQL (Port 3001)
- **Frontend**: React (Vite) + React Router (Port 5173)
- **Auth**: JWT-Token basiert (bcrypt, 7 Tage Gültigkeit)
- **DB**: PostgreSQL auf localhost:5433
- **Test-User**: laura@example.com / thomas@example.com (PW: Test1234!)
- **Vite-Proxy**: `/api` → `http://localhost:3001` (vite.config.js)
- **Cron**: node-cron, alle 15 Min → Termin + Medikamenten-Erinnerungen

## DB-Modelle (Prisma)

User, Consent, Appointment, Doctor, PreventionSchedule, UserPrevention, Notification, Medication, MedicationLog, LabReport, LabValue

## API-Routen

/api/auth, /api/users, /api/consents, /api/appointments, /api/doctors, /api/prevention, /api/notifications, /api/medications, /api/labs

## Wichtige Patterns

- **Branch-Workflow**: `feat/feature-name` → merge in main mit `merge: feat/... (US-XX ...)`
- **CRUD-Pattern**: Prisma Model → Controller → Routes → Components → Page → App.jsx Route
- **Studi-Projekt**: Immer erklären was/warum geändert wird, bevor Code geschrieben wird
- **Neustart**: `Stop-Process -Name node -Force` → `npx prisma generate` → `node server.js` (backend/) → `npx vite --host` (frontend/)
- **Prisma DLL-Lock**: Vor `npx prisma generate` alle Node-Prozesse beenden

## Letzte Session: US-22 (22.03.2026)

Branch: feat/laborbefunde → merged in main
Commit: `63bab6e merge: feat/laborbefunde (US-22 Laborbefunde anzeigen)`

Neue Dateien: lab.controller.js, lab.routes.js, LabReportCard.jsx, LabReportSection.jsx, LabReportDetailPage.jsx + CSS
Geänderte: schema.prisma (+LabReport +LabValue), seed.js (+3 Befunde/18 Werte für Thomas), server.js, App.jsx, LabsPage.jsx
