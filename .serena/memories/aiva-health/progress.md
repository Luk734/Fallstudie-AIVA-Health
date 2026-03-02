# AIVA Health - Entwicklungsfortschritt
Stand: 02.03.2026

## Aktueller Branch: feat/basis-komponenten (2 Commits, noch nicht gemerged)

## Abgeschlossene User Stories (alle in main gemerged und gepusht)
- US-01 bis US-11 (Registrierung, Login, Logout, Session, Profil, DSGVO, Navigation, Dashboard, Tokens)

## US-12 Basis-Komponenten: IMPLEMENTIERT (noch nicht gemerged)
Branch: feat/basis-komponenten
Commits:
- 9fc1e1f feat(US-12): add UI component library + migrate all pages
- e9af395 refactor(US-12): migrate SummaryCard + QuickActions to UI primitives

### 8 UI-Komponenten in src/components/ui/ + src/styles/components/ui/
1. Button (primary/secondary/ghost/danger/success, sm/md/lg, fullWidth, loading)
2. Input (label + error + useId() Accessibility)
3. Card (polymorphes "as" Prop, padding/shadow/accent care/coach/labs/family/success/danger)
4. Badge (required/optional/info/warning)
5. Spinner (inline sm/md/lg, role="status")
6. Alert (error/success/info/warning, role="alert")
7. PageHeader (title + subtitle) - Bonus
8. PageContainer (maxWidth sm/md/lg) - Bonus

### Alle 5 Pages migriert (dupliziertes CSS entfernt)
- LoginPage: Button, Input, Alert, Card
- ConsentPage: PageContainer, PageHeader, Card, Alert, Badge, Button
- ProfilePage: PageContainer, PageHeader, Card, Alert, Input, Button, Spinner
- PrivacySettingsPage: PageContainer, PageHeader, Alert, Badge, Card, Button, Spinner
- DashboardPage: Alert, Button

### Feature-Komponenten refactored
- SummaryCard: Nutzt intern Card + Button (kein eigenes Card-CSS mehr)
- QuickActions: Nutzt intern Button + CSS-Override (hardcodierte Farben gefixt)
- GreetingCard, LoadingSpinner, AppLayout, NavItem, PrivateRoute: Nicht betroffen

### Noch zu tun
- Branch in main mergen: git checkout main; git merge --no-ff feat/basis-komponenten

## Nächste User Story: US-13 (Termine anzeigen) — Research DONE
### Codebase-Stand für US-13 Planung:
- Prisma Schema: NUR User + Consent. KEIN appointments Table vorhanden.
- Backend: 3 Route-Dateien (auth, user, consent), 3 Controller, 1 Middleware (auth)
- Server.js: Routes unter /api/auth, /api/users, /api/consents
- Frontend Routing: /dashboard, /care, /labs, /coach, /family, /profile, /datenschutz
- CarePage: Nur Platzhalter (🚧) in src/pages/modules/care/
- DashboardPage: Header + Greeting + SummaryCards (hardcodiert) + QuickActions
- SummaryCard: Generisch (icon, title, children, actionLabel, onAction, variant=care/coach/labs)
- US-13 Tasks: TASK-48 (DB), TASK-49 (GET all), TASK-50 (GET upcoming 3), TASK-51 (AppointmentList), TASK-52 (AppointmentCard)