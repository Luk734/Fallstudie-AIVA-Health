# AIVA Health - Entwicklungsfortschritt
Stand: 04.03.2026

## Aktueller Branch: feat/vorsorge-erinnerungen (ab main)

## Abgeschlossene User Stories (alle in main gemerged)
- US-01 Registrierung
- US-02 Login
- US-03 Logout
- US-04 Session-Persistenz
- US-05 Profil anlegen
- US-06 Profil bearbeiten
- US-07 Einwilligungen Onboarding
- US-08 Einwilligungen verwalten
- US-09 Haupt-Navigation (AppLayout + BottomNav)
- US-10 Dashboard
- US-11 Farben + Typografie (Design Tokens)
- US-12 Basis-Komponenten (8 UI-Primitives + Migration)
- US-13 Termine anzeigen (AppointmentList + Card + Tabs)
- US-14 Termin-Detail (AppointmentDetail + Phone)
- US-15 Termin anlegen (Doctor DB + Form + Validation)
- US-16 Termin bearbeiten + stornieren (PUT/DELETE + ConfirmDialog)

## Zusaetzliche Refactorings (in main)
- AppHeader global in AppLayout (aus DashboardPage extrahiert)
- /upcoming Endpoint konsolidiert zu ?time=upcoming&limit=N
- AppointmentDetail als Komponente (Page ist duenner Wrapper)
- ConfirmDialog fuer Logout + DSGVO-Consent-Widerruf

## Git-Historie
- main: alle US-01 bis US-16 gemerged
- feat/vorsorge-erinnerungen: neuer Branch, noch leer

## Codestruktur
### Backend (Express + Prisma + PostgreSQL localhost:5433)
- Prisma Models: User, Consent, Appointment, Doctor
- Controller: auth, user, consent, appointment (GET/POST/PUT/DELETE), doctor
- Routes: auth, user, consent, appointment, doctor
- server.js bindet alle unter /api/* ein
- Seed: 1 User, 3 Consents, 8 Doctors, 5 Appointments

### Frontend (React + Vite localhost:5173)
- components/ui/ (9): Alert, Badge, Button, Card, ConfirmDialog, Input, PageContainer, PageHeader, Spinner
- components/care/: AppointmentList, AppointmentCard, AppointmentDetail, AppointmentForm
- components/: AppHeader, AppLayout, PrivateRoute
- pages/auth/: LoginPage, ConsentPage
- pages/core/: DashboardPage, ProfilePage, PrivacySettingsPage
- pages/modules/care/: CarePage, AppointmentDetailPage, AppointmentCreatePage, AppointmentEditPage
- pages/modules/: LabsPage, CoachPage, FamilyPage (Platzhalter)
- contexts/: AuthContext
- styles/: tokens.css + komponentenspezifische CSS

### Routes in App.jsx
/, /login, /consent, /dashboard, /profile, /datenschutz,
/care, /care/appointments/:id, /care/new, /care/appointments/:id/edit,
/labs, /coach, /family

## Naechste User Story: US-17 (Vorsorge-Kalender anzeigen)
- TASK-63: DB prevention_schedules (type, age_from, age_to, gender, frequency_months)
- TASK-64: GET /api/prevention (gefiltert nach Alter + Geschlecht)
- Statische GKV-Leistungskatalog-Daten
- Status setzbar: Offen / Erledigt
- Danach: US-18 (Termin-Erinnerungen)