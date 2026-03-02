# AIVA Health - Entwicklungsfortschritt
Stand: 02.03.2026

## Aktueller Branch: feat/basis-komponenten (von main, noch keine Commits)

## Abgeschlossene User Stories (alle in main gemerged und gepusht)
- US-01 Registrierung
- US-02 Login
- US-03 Logout
- US-04 Session-Persistenz
- US-05 Profil anlegen
- US-06 Profil bearbeiten
- US-07 Einwilligungen beim Onboarding (DSGVO)
- US-08 Einwilligungen verwalten/widerrufen
- US-09 Haupt-Navigation (Bottom-Nav mit 5 Tabs)
- US-10 Dashboard (Home) mit GreetingCard, SummaryCards, QuickActions
- US-11 Farben und Typografie (Design Tokens in tokens.css)

## Naechste User Story: US-12 Basis-Komponenten
Branch: feat/basis-komponenten
Feature: F-05 Design System
Akzeptanzkriterien:
- Button (primary, secondary, ghost; sm, md, lg)
- Input (Text, Password, Date; Label + Fehlerzustand)
- Card (Container mit Shadow und Padding)
- Badge (Status-Tags: gruen, gelb, rot, blau)
- Spinner (Lade-Animation) -- existiert bereits als LoadingSpinner
- Alert (Erfolg gruen, Warnung gelb, Fehler rot)
- Alle mind. 44x44px Touch-Target (WCAG 2.1 AA)
Tasks: TASK-42 bis TASK-47 (Button, Input, Card, Badge, Spinner, Alert)
Zielordner: src/components/ui/
CSS-Ordner: src/styles/components/ui/

## Git-Historie (main, alles gepusht zu origin)
- b350f1f merge: feat/design-tokens into main (US-11)
- 3cd8cdb merge: feat/dashboard into main (US-10)
- e065b11 merge: feat/haupt-navigation into main (US-09)
- 2d2529f merge: feat/dsgvo-consent into main (US-07 + US-08)
- 09582ba merge: feat/user-profile into main (US-05 + US-06)
- 99d1e93 merge: feat/database-setup into main (US-01 bis US-04)

## Design Tokens (tokens.css)
- Primary: #4F46E5 (Indigo), Primary-dark: #3730A3, Primary-light: #EEF2FF
- Module: care #2563EB, coach #16A34A, labs #7C3AED, family #EC4899
- Slate-Palette: 50-900 (Graustufen)
- Erweitert: amber, blue, green, red Abstufungen fuer Badges/Alerts
- Spacing: --space-1 (4px) bis --space-16 (64px)
- Font: --font-xs (12px) bis --font-3xl (30px)
- Radien: --radius-sm (6px), md (8px), lg (12px), xl (16px), full (9999px)
- Shadows: --shadow-sm, md, lg, nav
- Transitions: --transition-fast (0.15s), normal (0.2s), slow (0.3s)
- Layout: --nav-height (64px), --max-width-page (600px), --min-touch-target (44px)

## Architektur
- Backend: Express + Prisma + PostgreSQL (Port 3001)
- Frontend: React 19 + Vite + React Router (Port 5173 oder 5174)
- DB: PostgreSQL Port 5433 (aiva_health / aiva_user / aiva_password)
- CSS Custom Properties (Design Tokens) in tokens.css
- Conventional Commits + Feature-Branch-Workflow (feat/xxx -> main --no-ff)
- Uni-Projekt: Jeden Schritt erklaeren, erst Plan zeigen, dann nach Go implementieren

## Frontend Ordnerstruktur
```
src/
  components/   AppLayout, NavItem, LoadingSpinner, PrivateRoute, GreetingCard, SummaryCard, QuickActions
  contexts/     AuthContext.jsx
  pages/auth/   LoginPage, ConsentPage
  pages/core/   DashboardPage, ProfilePage, PrivacySettingsPage
  pages/modules/ care/, labs/, coach/, family/ (Platzhalter)
  styles/
    tokens.css, global.css
    components/  AppLayout, NavItem, LoadingSpinner, GreetingCard, SummaryCard, QuickActions (.css)
    pages/auth/  ConsentPage, LoginPage (.css)
    pages/core/  DashboardPage, ProfilePage, PrivacySettingsPage (.css)
    pages/modules/ care/CarePage, coach/CoachPage, labs/LabsPage, family/FamilyPage (.css)
```

## Wichtige Hinweise fuer US-12
- LoadingSpinner existiert bereits, kann als Spinner-Basis wiederverwendet werden
- Bestehende Seiten nutzen bereits Card-aehnliche Patterns (login-card, consent-form, profile-form)
- Diese sollten NACH Erstellung der ui/Card Komponente schrittweise migriert werden
- Button-Varianten koennen sofort in bestehenden Seiten getestet werden
- Alle Tokens sind bereits definiert, UI-Komponenten muessen nur var(--token) nutzen