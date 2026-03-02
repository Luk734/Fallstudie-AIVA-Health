# AIVA Health - Entwicklungsfortschritt
Stand: 02.03.2026

## Aktueller Branch: feat/dashboard (bereit zum Merge nach main)

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
- US-10 Dashboard (Home) ← NEU

## Git-Historie (main)
- e065b11 merge: feat/haupt-navigation into main (US-09)
- 2d2529f merge: feat/dsgvo-consent into main (US-07 + US-08)
- 09582ba merge: feat/user-profile into main (US-05 + US-06)
- 99d1e93 merge: feat/database-setup into main (US-01 bis US-04)

## Git (feat/dashboard)
- 181b84c feat(dashboard): US-10 Dashboard mit Greeting, SummaryCards und QuickActions

## US-10 Neue Komponenten
- GreetingCard.jsx + CSS — Tageszeitabhaengige Begruessung (Morgen/Mahlzeit/Nachmittag/Abend)
- SummaryCard.jsx + CSS — Generische Karte (icon, title, children, actionLabel, variant: care/coach/labs)
- QuickActions.jsx + CSS — Check-in starten + Termin buchen Buttons
- DashboardPage.jsx + CSS — Komplett umgebaut mit Mock-Daten

## Frontend Ordnerstruktur
```
src/
  components/   AppLayout, NavItem, LoadingSpinner, PrivateRoute, GreetingCard, SummaryCard, QuickActions
  contexts/     AuthContext.jsx
  pages/auth/   LoginPage, ConsentPage
  pages/core/   DashboardPage, ProfilePage, PrivacySettingsPage
  pages/modules/ care/, labs/, coach/, family/ (Platzhalter)
  styles/       parallele Struktur zu pages/ + components/
```

## Architektur
- Backend: Express + Prisma + PostgreSQL (Port 3001)
- Frontend: React 19 + Vite + React Router (Port 5173)
- DB: PostgreSQL Port 5433 (aiva_health / aiva_user / aiva_password)

## Patterns
- Conventional Commits + Feature-Branch-Workflow (feat/xxx -> main --no-ff)
- Student lernt React - ausfuehrliche Kommentare
- Erst planen, dann nach User-Go implementieren
- CSS in separatem styles/ Ordner