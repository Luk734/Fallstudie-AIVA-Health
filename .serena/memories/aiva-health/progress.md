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

## Nächste anstehende User Story: US-22

**US-22: Laborbefunde anzeigen** (Feature F-12 AIVA Labs)
- Laborbefunde als Liste anzeigen
- Neues Prisma-Model `LabResult` nötig (+ Migration)
- Neuer Controller + Routes + Frontend-Seite
- Akzeptanzkriterien: siehe planning/user-stories/US-22_laborbefunde-anzeigen.md

Danach: US-23 (Laborwert verstehen / Referenzbereiche)

## Architektur-Überblick

- **Backend**: Express.js + Prisma ORM + PostgreSQL (Port 3001)
- **Frontend**: React (Vite) + React Router (Port 5173)
- **Auth**: JWT-Token basiert (bcrypt, 7 Tage Gültigkeit)
- **DB**: PostgreSQL auf localhost:5433
- **Test-User**: laura@example.com / thomas@example.com (PW: Test1234!)
- **Vite-Proxy**: `/api` → `http://localhost:3001` (vite.config.js)
- **Cron**: node-cron, alle 15 Min → Termin-Erinnerungen + Medikamenten-Erinnerungen

## Wichtige Patterns

- **CRUD-Pattern**: Prisma Model → Controller → Routes → Components → Page → App.jsx Route
- **Soft-Delete**: active-Flag statt echtem Löschen (DSGVO)
- **Conventional Commits**: feat(modul): US-XX Beschreibung
- **Notification-System**: Cron alle 15 Min → DB-Notification → Frontend pollt alle 60s (NotificationBell)
- **Zurück-Button**: `<Button variant="ghost" size="sm">` mit `navigate(-1)` oder expliziter Route
- **Studi-Projekt**: Immer erklären was/warum geändert wird, bevor Code geschrieben wird
- **Design-Tokens**: CSS-Variablen aus US-11 werden überall genutzt
- **UI-Primitives**: Card, Badge, Button, Alert, Spinner, PageContainer, PageHeader aus US-12

## Bekannte Hinweise

- **Frontend .env**: `VITE_API_URL=http://localhost:3001` (ist in .gitignore, bei frischem Clone manuell erstellen)
- **Seed**: `npx prisma db seed` ändert User-IDs → danach neu einloggen
- **Test-Notifications**: 4 Test-Notifications für Thomas manuell erstellt (22.03.2026) — 2 ungelesene Medikamenten-Erinnerungen, 1 gelesene, 1 Termin-Erinnerung

## Letzte Session: US-21 (22.03.2026)

Geänderte Dateien:
- `backend/src/config/cron.js` — `generateMedicationReminders()` + `startReminderCron()` erweitert
- `frontend/src/pages/core/NotificationsPage.jsx` — Icon-Logik (📅/💊/🔔), Quick-Action-Button, Zurück-Button, typ-abhängige Navigation
- `frontend/src/styles/pages/core/NotificationsPage.css` — .notifications-back, .notification-item__quick-take

Letzter Commit: `cba2e25 feat(labs): US-21 Medikamenten-Erinnerung (Cron + Notifications + Quick-Action)`
