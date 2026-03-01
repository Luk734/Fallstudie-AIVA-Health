# AIVA Health - Entwicklungsfortschritt
Stand: 01.03.2026

## Aktueller Branch: feat/dsgvo-consent

## Abgeschlossene User Stories
- US-01 bis US-06 (Auth + Profil)
- US-07 Einwilligungen beim Onboarding (DSGVO) - FERTIG
- US-08 Einwilligungen verwalten/widerrufen - FERTIG

## US-07 Details
- Backend: Consent-Modell in Prisma, Migration, controller + routes
- Frontend: ConsentPage.jsx/css, App.jsx Route
- API: POST + GET /api/consents (getestet + funktioniert)

## US-08 Details
- Backend: PATCH /api/consents/:id (Ownership-Check, Pflicht-Consent-Schutz)
- Frontend: PrivacySettingsPage.jsx/css (Consent-Karten, Toggle, Status-Anzeige)
- DashboardPage: Datenschutz-Button im Header navigiert zu /datenschutz
- App.jsx: Route /datenschutz -> PrivacySettingsPage

## Bugfix: Consent-Check zentralisiert
- AuthContext: hasConsents State + checkConsents() + updateConsents()
- PrivateRoute: Prueft hasConsents, redirect zu /consent wenn false
- LoginPage: Vereinfacht (kein inline Consent-Check mehr)
- ConsentPage: Ruft updateConsents(true) nach POST auf

## Backend-Dateien
server.js, prisma/schema.prisma (User+Consent), auth/user/consent controller+routes

## Frontend-Dateien
App.jsx (Routes: /,/login,/consent,/dashboard,/profile,/datenschutz)
AuthContext.jsx (token, user, hasConsents, login, logout, updateConsents)
PrivateRoute (auth + consent guard), LoadingSpinner
LoginPage, ConsentPage, DashboardPage, ProfilePage, PrivacySettingsPage (je .jsx+.css)

## Naechste: US-09 Haupt-Navigation

## Ports: Backend 3001, Frontend 5173, DB 5433