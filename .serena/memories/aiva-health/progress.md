# AIVA Health - Entwicklungsfortschritt
Stand: 04.03.2026

## Aktueller Branch: feat/termin-erinnerungen (von main abgezweigt)

## Abgeschlossene User Stories (alle in main gemerged)
- US-01 Registrierung
- US-02 Login
- US-03 Logout
- US-04 Session-Persistenz
- US-05 Profil anlegen
- US-06 Profil bearbeiten
- US-07 Einwilligungen Onboarding (DSGVO)
- US-08 Einwilligungen verwalten
- US-09 Haupt-Navigation (Bottom-Nav + AppLayout)
- US-10 Dashboard
- US-11 Farben + Typografie (Design Tokens)
- US-12 Basis-Komponenten (Card, Badge, Button, Input, Alert, Spinner, ConfirmDialog, PageContainer, PageHeader)
- US-13 Termine anzeigen (Termin-Übersicht)
- US-14 Termin-Detail
- US-15 Termin anlegen
- US-16 Termin bearbeiten + ConfirmDialog
- US-17 Vorsorge-Kalender (GKV, PreventionSchedule/UserPrevention)

## In Arbeit (auf feat/termin-erinnerungen Branch)
- US-18 Termin-Erinnerungen - FERTIG (committed, noch nicht gemerged)

## Merge-History (main)
- merge: feat/auth-consent -> US-01 bis US-08
- merge: feat/navigation-dashboard -> US-09, US-10
- merge: feat/design-system -> US-11, US-12
- merge: feat/termine-anzeigen -> US-13 bis US-16
- merge: feat/vorsorge-erinnerungen -> US-17 + Unified Care Page

## Tech-Stack
- Backend: Express + Prisma ORM + PostgreSQL (localhost:5433)
- Frontend: React + Vite (localhost:5173)
- Auth: JWT (bcrypt + jsonwebtoken)
- DB: Docker PostgreSQL Container aiva-postgres

## DB Models (Prisma)
- User, Consent, Appointment, Doctor, PreventionSchedule, UserPrevention
- Notification (id, userId, type, title, message, relatedId, read, createdAt) NEU US-18

## API-Endpunkte (NEU US-18)
- GET /api/notifications
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/read-all

## Frontend (NEU US-18)
- NotificationBell.jsx im AppHeader (Polling 60s, Badge-Zaehler)
- NotificationsPage.jsx unter /notifications
- Cron-Job (node-cron) alle 15 Min fuer 24h + 1h Erinnerungen

## Naechste User Story: US-19 (Medikament hinzufuegen) - AIVA Labs Modul