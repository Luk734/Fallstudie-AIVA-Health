# AIVA Health - Entwicklungsfortschritt
Stand: 01.03.2026

## Aktueller Branch: feat/haupt-navigation (frisch erstellt, noch keine Aenderungen)

## Abgeschlossene User Stories
- US-01 Registrierung
- US-02 Login
- US-03 Logout
- US-04 Session-Persistenz
- US-05 Profil anlegen
- US-06 Profil bearbeiten
- US-07 Einwilligungen beim Onboarding (DSGVO)
- US-08 Einwilligungen verwalten/widerrufen

## Git-Historie (main)
- 2d2529f merge: feat/dsgvo-consent into main (US-07 + US-08)
- 09582ba merge: feat/user-profile into main (US-05 + US-06)
- 99d1e93 merge: feat/database-setup into main (US-01 bis US-04)

## Naechste User Story: US-09 Haupt-Navigation
- Bottom-Navigation mit 5 Tabs: Home, Care, Labs, Coach, Family
- Aktiver Tab visuell hervorgehoben (Farbe + Unterstrich)
- Navigation in allen geschuetzten Seiten sichtbar
- Barrierefreiheit: Icons und Text mind. 16px, Touch-Target mind. 44x44px
- Tasks: TASK-34 (Router Setup), TASK-35 (AppLayout), TASK-36 (NavItem)

## Danach: US-10 Dashboard (Home)
- Persoenliche Begruessung, naechster Termin, Check-in-Status, Medikamente
- Quick-Action Buttons
- Tasks: TASK-37 (Dashboard), TASK-38 (GreetingCard), TASK-39 (SummaryCard)

## Architektur-Uebersicht

### Backend (Express + Prisma + PostgreSQL)
- server.js: Entry point, CORS, Routes mounten
- prisma/schema.prisma: User + Consent Modelle
- src/controllers: auth, user, consent
- src/routes: auth, user, consent (alle JWT-geschuetzt ausser register/login)
- src/middleware/auth.middleware.js: JWT-Validierung

### Frontend (React 19 + Vite + React Router)
- App.jsx: Routing - /, /login, /consent, /dashboard, /profile, /datenschutz
- contexts/AuthContext.jsx: token, user, hasConsents, login, logout, updateConsents
- components/PrivateRoute.jsx: Auth + Consent Guard
- components/LoadingSpinner.jsx
- pages: LoginPage, ConsentPage, DashboardPage, ProfilePage, PrivacySettingsPage

### Wichtige Patterns
- AuthContext: Zentraler State fuer Auth + Consent-Status
- PrivateRoute: Prueft token UND hasConsents, redirect zu /login oder /consent
- Conventional Commits + Feature-Branch-Workflow (feat/xxx -> main mit --no-ff)

## Ports
- Backend: 3001
- Frontend: 5173
- PostgreSQL: 5433 (db: aiva_health, user: aiva_user, pw: aiva_password)

## Hinweise fuer naechste Session
- Fuer US-09: AppLayout-Komponente erstellen die Bottom-Nav + children rendert
- Alle geschuetzten Routes in AppLayout wrappen
- NavItem mit useLocation fuer Active-State
- Icons: Emoji oder einfache SVG Icons (kein Icon-Library noetig fuer MVP)
- Der User ist Student und lernt React - ausfuehrliche Kommentare beibehalten