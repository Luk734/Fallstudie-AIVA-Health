# AIVA Health - Entwicklungsfortschritt
Stand: 04.03.2026

## Aktueller Branch: feat/termine-anzeigen (noch nicht gemerged)

## Abgeschlossene User Stories (in main)
- US-01 bis US-12 (Registrierung, Login, Logout, Session, Profil, DSGVO, Navigation, Dashboard, Tokens, Basis-Komponenten)

## US-13 Termine anzeigen: IMPLEMENTIERT (im Branch)
- Prisma: Appointment-Modell, Migration, Seed (5 Beispieltermine)
- Backend: GET /api/appointments (mit ?time, ?status, ?limit Filtern), GET /:id
- Frontend: AppointmentList (Tabs: Anstehend/Verlauf), AppointmentCard, AppointmentDetail
- Routing: /care, /care/appointments/:id

## US-14 Termin-Detail: IMPLEMENTIERT (im Branch)
- Phone-Feld ergänzt
- AppointmentDetail als Komponente in components/care/
- AppointmentDetailPage als dünner Wrapper

## US-15 Termin anlegen: IMPLEMENTIERT (im Branch)
- Prisma: Doctor-Modell, Migration (add-doctors-table), Seed (8 Beispielärzte)
- Backend: GET /api/doctors (doctor.controller + doctor.routes)
- Backend: POST /api/appointments mit Validierung (Pflichtfelder, Datum nicht in Vergangenheit)
- Frontend: AppointmentForm-Komponente (Arzt-Dropdown aus DB, Auto-Fill, Validation)
- Frontend: AppointmentCreatePage (Wrapper), Route /care/new in App.jsx
- AppointmentList: "+ Neuer Termin" Button ergänzt

## Refactorings (im Branch, noch nicht committed):
- AppHeader aus DashboardPage extrahiert → in AppLayout (global sichtbar)
- /api/appointments/upcoming entfernt → ?time=upcoming&limit=3 reicht
- AppointmentDetailPage → dünner Wrapper (Logik in AppointmentDetail-Komponente)

## Codestruktur:
### Backend
- Prisma: User, Consent, Appointment, Doctor
- Controller: auth, user, consent, appointment, doctor
- Routes: auth, user, consent, appointment, doctor
- server.js bindet alle unter /api/* ein

### Frontend components/care/
- AppointmentList.jsx (Tabs, API-Fetching)
- AppointmentCard.jsx (einzelne Karte)
- AppointmentDetail.jsx (Detail-Ansicht)
- AppointmentForm.jsx (Create-Formular mit Arzt-Dropdown)

### Frontend components/ (global)
- AppHeader.jsx (Logo + Profil/Datenschutz/Logout)
- AppLayout.jsx (Header + Main + BottomNav)

### Nächste User Story: US-16 (Termin bearbeiten & löschen)
- TASK-59: PUT /api/appointments/:id
- TASK-60: DELETE /api/appointments/:id (Soft Delete)
- TASK-61: Edit-Formular (AppointmentForm wiederverwenden)
- TASK-62: ConfirmDialog-Komponente