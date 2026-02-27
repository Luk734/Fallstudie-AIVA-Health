# AIVA Health — Entwicklungsfortschritt
Stand: 27.02.2026

## Aktueller Branch
`feat/user-profile`

## Abgeschlossene User Stories
- ✅ US-01 Registrierung
- ✅ US-02 Login
- ✅ US-03 Logout + Auth-Middleware
- ✅ US-04 Session-Persistenz

## US-05 — Profil anlegen: KOMPLETT ✅

### Backend
- Prisma-Schema: 5 Profil-Felder (firstName, lastName, birthDate, gender, avatarUrl)
- Migration: add_profile_fields
- NEU: src/controllers/user.controller.js — getProfile() + updateProfile()
- NEU: src/routes/user.routes.js — GET + PUT /api/users/profile
- GEÄNDERT: server.js — userRoutes eingebunden
- GEÄNDERT: auth.controller.js — getMe/login/register liefern Profil-Felder mit

### Frontend
- NEU: src/pages/ProfilePage.jsx — Formular mit Avatar-Auswahl, Validierung, API-Calls
- NEU: src/pages/ProfilePage.css — Styling (Avatar-Grid, Formular, Buttons)
- GEÄNDERT: src/App.jsx — Route /profile als PrivateRoute
- GEÄNDERT: src/pages/DashboardPage.jsx — Personalisierte Begrüßung + Profil-Button
- GEÄNDERT: src/pages/DashboardPage.css — Neue Styles für Header-Actions, Profil-Hint
- GEÄNDERT: src/contexts/AuthContext.jsx — updateUser() Funktion hinzugefügt
- Avatare: 6 Bilder in public/avatars/ (avatar-1.jpg bis avatar-6.webp)

### Tests (Backend ✅)
- Login liefert Profil-Felder mit
- PUT mit avatarUrl funktioniert
- Alle Validierungen (Vorname Pflicht, Gender Whitelist) funktionieren

### Noch nicht committet!

## Nächste User Story: US-06 — Profil bearbeiten
(Ist quasi schon abgedeckt: PUT Endpunkt + ProfilePage laden bestehende Daten)

## Wichtige Infos
- Backend: Port 3001, DB: Port 5433
- Frontend: Port 5174 (5173 war belegt)
- VITE_API_URL=http://localhost:3001 in Prototyp/frontend/.env
