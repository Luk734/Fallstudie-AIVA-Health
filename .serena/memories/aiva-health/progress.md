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

## Merge-History (main)
- merge: feat/auth-consent → US-01 bis US-08
- merge: feat/navigation-dashboard → US-09, US-10
- merge: feat/design-system → US-11, US-12
- merge: feat/termine-anzeigen → US-13 bis US-16
- merge: feat/vorsorge-erinnerungen → US-17 + Unified Care Page

## Tech-Stack
- Backend: Express + Prisma ORM + PostgreSQL (localhost:5433)
- Frontend: React + Vite (localhost:5173)
- Auth: JWT (bcrypt + jsonwebtoken)
- DB: Docker PostgreSQL Container "aiva-postgres"

## DB Models (Prisma)
- User (id, email, password, firstName, lastName, birthDate, gender, createdAt)
- Consent (id, userId, consentType, accepted, updatedAt)
- Appointment (id, userId, title, doctor, phone, location, datetime, notes, status, createdAt, updatedAt)
- Doctor (id, name, fachrichtung, telefon, adresse, createdAt)
- PreventionSchedule (id, type, description, gender, ageFrom, ageTo, frequencyMonths)
- UserPrevention (id, userId, preventionId, status [open/completed], completedAt)

## API-Endpunkte
- POST /api/auth/register, POST /api/auth/login
- GET/PUT /api/user/profile
- GET/POST /api/consent
- GET/POST /api/appointments, GET/PUT/DELETE /api/appointments/:id
- GET /api/doctors
- GET /api/prevention, PATCH /api/prevention/:id/status

## Frontend Routing (App.jsx)
- / → /dashboard (redirect)
- /login → LoginPage
- /consent → ConsentPage (PrivateRoute, ohne Nav)
- /dashboard → DashboardPage
- /profile → ProfilePage
- /datenschutz → PrivacySettingsPage
- /care → CarePage (unified: Termine + Vorsorge)
- /care/appointments/:id → AppointmentDetailPage
- /care/new → AppointmentCreatePage
- /care/appointments/:id/edit → AppointmentEditPage
- /labs → LabsPage (Platzhalter)
- /coach → CoachPage (Platzhalter)
- /family → FamilyPage (Platzhalter)

## Frontend Komponenten (care/)
- AppointmentCard.jsx — Termin-Karte (Datum, Titel, Arzt, Ort, Status-Badge)
- AppointmentDetail.jsx — Termin-Detailansicht
- AppointmentForm.jsx — Erstellen/Bearbeiten (mit Arzt-Dropdown, Validierung, ?title= Query-Param)
- PreventionCard.jsx — Vorsorge-Karte (Status-Toggle mit ConfirmDialog)

## Frontend Seiten (care/)
- CarePage.jsx — UNIFIED: 4 Sektionen (Vorsorge-Fortschritt, Anstehende Termine, Vorsorge gruppiert, Vergangene Termine)
- AppointmentDetailPage, AppointmentCreatePage, AppointmentEditPage

## Testdaten (Seed)
- Laura Müller (33, female, laura@example.com / Test1234!)
  - 3 Vorsorgen, 5 Termine (3 upcoming, 2 past)
- Thomas Wagner (56, male, thomas@example.com / Test1234!)
  - 6 Vorsorgen, Termine + Consents

## Nächste User Story: US-18 (Termin-Erinnerungen)
Branch: feat/termin-erinnerungen (bereits erstellt, noch leer)