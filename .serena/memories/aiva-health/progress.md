# AIVA Health - Entwicklungsfortschritt
Stand: 02.03.2026

## Aktueller Branch: feat/dashboard (frisch erstellt von main)

## Abgeschlossene User Stories
- US-01 Registrierung
- US-02 Login
- US-03 Logout
- US-04 Session-Persistenz
- US-05 Profil anlegen
- US-06 Profil bearbeiten
- US-07 Einwilligungen beim Onboarding (DSGVO)
- US-08 Einwilligungen verwalten/widerrufen
- US-09 Haupt-Navigation (Bottom-Nav mit 5 Tabs)

## Git-Historie (main)
- e065b11 merge: feat/haupt-navigation into main (US-09)
- 2d2529f merge: feat/dsgvo-consent into main (US-07 + US-08)
- 09582ba merge: feat/user-profile into main (US-05 + US-06)
- 99d1e93 merge: feat/database-setup into main (US-01 bis US-04)

## Naechste User Story: US-10 Dashboard (Home)
### Akzeptanzkriterien:
- Persoenliche Begruessung: "Guten Morgen, Laura"
- Naechster Termin (aus AIVA Care) - Platzhalter/Mock
- Heutiger Check-in-Status (aus AIVA Coach) - Platzhalter/Mock
- Naechste Medikamenteneinnahme (aus AIVA Labs) - Platzhalter/Mock
- Quick-Action Buttons: "Check-in", "Termin buchen"

### Tasks:
- TASK-37: Dashboard-Seite (existiert bereits als DashboardPage in pages/core/)
- TASK-38: GreetingCard-Komponente (Name aus AuthContext)
- TASK-39: SummaryCard-Komponente (generisch, wiederverwendbar)

## Frontend Ordnerstruktur (nach Refactoring)
```
src/
  pages/
    auth/         LoginPage, ConsentPage
    core/         DashboardPage, ProfilePage, PrivacySettingsPage
    modules/
      care/       CarePage (Platzhalter)
      labs/       LabsPage (Platzhalter)
      coach/      CoachPage (Platzhalter)
      family/     FamilyPage (Platzhalter)
  styles/
    pages/        (parallele Struktur zu pages/)
      auth/       LoginPage.css, ConsentPage.css
      core/       DashboardPage.css, ProfilePage.css, PrivacySettingsPage.css
      modules/    care/, labs/, coach/, family/ (je eine .css)
    components/   AppLayout.css, NavItem.css, LoadingSpinner.css
  components/     AppLayout, NavItem, LoadingSpinner, PrivateRoute (nur JSX)
  contexts/       AuthContext.jsx
```

## Architektur
### Backend: Express + Prisma + PostgreSQL (Port 3001)
- server.js, prisma/schema.prisma (User + Consent)
- src/controllers: auth, user, consent
- src/routes: auth, user, consent
- src/middleware: auth.middleware.js (JWT)

### Frontend: React 19 + Vite + React Router (Port 5173)
- App.jsx: Routing mit AppLayout-Wrapping fuer geschuetzte Seiten
- AuthContext: token, user, hasConsents, login, logout, updateConsents
- PrivateRoute: Auth + Consent Guard
- AppLayout: main + fixierte Bottom-Nav (5 NavItems)
- NavItem: NavLink mit auto Active-State

### Routing:
- / -> redirect /dashboard
- /login -> LoginPage (OHNE Nav)
- /consent -> ConsentPage (OHNE Nav)
- /dashboard, /profile, /datenschutz -> AppLayout > Page (MIT Nav)
- /care, /labs, /coach, /family -> AppLayout > ModulePage (MIT Nav)

### DB: PostgreSQL Port 5433 (aiva_health / aiva_user / aiva_password)

## Wichtige Patterns
- Conventional Commits + Feature-Branch-Workflow (feat/xxx -> main mit --no-ff)
- Student lernt React - ausfuehrliche Kommentare + Erklaerungen bei jedem Schritt
- Erst planen, dann nach User-Go implementieren
- CSS in separatem styles/ Ordner (nicht neben JSX)