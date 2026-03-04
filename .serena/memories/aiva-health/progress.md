# AIVA Health - Entwicklungsfortschritt
Stand: 04.03.2026

## Aktueller Branch: feat/vorsorge-erinnerungen

## Abgeschlossene User Stories (alle in main gemerged)
- US-01 bis US-16 (siehe vorheriger Stand)

## US-17 Vorsorge-Kalender ✅ IMPLEMENTIERT (noch nicht in main)
Branch: feat/vorsorge-erinnerungen
Commit: feat(US-17): Vorsorge-Kalender mit GKV-Leistungskatalog

### Was wurde gemacht:
- TASK-63: Prisma Models PreventionSchedule + UserPrevention
- TASK-64: GET /api/prevention + PATCH /:id/status Controller + Routes
- TASK-65: GKV-Seed (10 Vorsorgen) + Thomas Wagner (56, male) als 2. User
- TASK-66: PreventionPage + PreventionCard + CSS + Route /care/prevention

### Neue Dateien:
- backend/prisma/migrations/..._add_prevention_tables/migration.sql
- backend/src/controllers/prevention.controller.js
- backend/src/routes/prevention.routes.js
- frontend/src/components/care/PreventionCard.jsx
- frontend/src/pages/modules/care/PreventionPage.jsx
- frontend/src/styles/components/care/PreventionCard.css
- frontend/src/styles/pages/modules/care/PreventionPage.css

### Geaenderte Dateien:
- backend/prisma/schema.prisma (2 neue Models + User-Relation)
- backend/prisma/seed.js (Thomas User + GKV-Daten + UserPrevention)
- backend/server.js (Prevention Route eingebunden)
- frontend/src/App.jsx (Route /care/prevention)
- frontend/src/pages/modules/care/CarePage.jsx (Vorsorge-Button)

### Testdaten:
- Laura (33, female): 3 Vorsorgen (Check-up, Zahnarzt, Gynäkologie)
- Thomas (56, male): 6 Vorsorgen (Check-up, Hautkrebs, Zahnarzt, Stuhltest, Koloskopie, Prostata)
- Thomas Login: thomas@example.com / Test1234!

### DB-Schema (neu):
- prevention_schedules: id, type, description, gender, age_from, age_to, frequency_months
- user_preventions: id, user_id, prevention_id, status (open/completed), completed_at

### API-Endpunkte (neu):
- GET /api/prevention (JWT) → Gefilterte Vorsorgen nach Alter+Geschlecht
- PATCH /api/prevention/:id/status (JWT) → Status toggle

### Frontend-Routes:
/care → CarePage (Termine + Vorsorge unified, KEIN separater PreventionPage mehr)

## Codestruktur (aktualisiert)
### Backend Models: User, Consent, Appointment, Doctor, PreventionSchedule, UserPrevention
### Backend Controllers: auth, user, consent, appointment, doctor, prevention
### Backend Routes: auth, user, consent, appointment, doctor, prevention

### Frontend components/care/:
AppointmentCard, AppointmentDetail, AppointmentForm, PreventionCard
(AppointmentList GELÖSCHT — Logik in CarePage integriert)

### Frontend pages/modules/care/:
CarePage (unified: Termine + Vorsorge), AppointmentDetailPage, AppointmentCreatePage, AppointmentEditPage
(PreventionPage GELÖSCHT — Logik in CarePage integriert)

## Naechste User Story: US-18 (Termin-Erinnerungen)
