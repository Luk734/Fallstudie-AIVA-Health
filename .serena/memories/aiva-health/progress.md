# AIVA Health — Entwicklungsfortschritt
Stand: 27.02.2026

## Aktueller Branch
`feat/database-setup` (noch nicht in main gemergt)

## Abgeschlossene User Stories
- ✅ US-01 Registrierung → `POST /api/auth/register`
- ✅ US-02 Login → `POST /api/auth/login`

## Nächste User Story
**US-03 — Logout + Auth-Middleware** (Backend FERTIG, Frontend offen)

### US-03 Backend — ABGESCHLOSSEN ✅
Commit: `feat(auth): add JWT middleware and GET /api/auth/me endpoint (US-03 backend)`

Erstellt/geändert:
- NEU: `src/middleware/auth.middleware.js` — prüft JWT im Authorization-Header
- GEÄNDERT: `src/controllers/auth.controller.js` — getMe() Funktion hinzugefügt
- GEÄNDERT: `src/routes/auth.routes.js` — GET /me Route mit Middleware eingebunden

Getestete Szenarien (alle ✅):
- Test 1: Login → Token erhalten
- Test 2: GET /api/auth/me mit gültigem Token → User-Daten zurück
- Test 3: GET /api/auth/me ohne Token → 401 "Zugriff verweigert"
- Test 4: GET /api/auth/me mit gefälschtem Token → 401 "Token ungültig"

### US-03 Frontend — ABGESCHLOSSEN ✅
Commit: `feat(auth): add logout, AuthContext, PrivateRoute, LoginPage, DashboardPage (US-03 frontend)`

Erstellt/geändert:
- NEU: `frontend/src/contexts/AuthContext.jsx` — login()/logout() mit localStorage
- NEU: `frontend/src/components/PrivateRoute.jsx` — kein Token → redirect /login
- NEU: `frontend/src/pages/LoginPage.jsx` — Formular + fetch() an /api/auth/login
- NEU: `frontend/src/pages/DashboardPage.jsx` — Logout-Button oben rechts
- GEÄNDERT: `frontend/src/App.jsx` — BrowserRouter + Routes + PrivateRoute
- react-router-dom installiert

## ✅ US-03 KOMPLETT ABGESCHLOSSEN

## ✅ US-04 KOMPLETT ABGESCHLOSSEN
Commit: `feat(auth): add token validation on app start with loading spinner (US-04)`

Geändert/erstellt:
- GEÄNDERT: `frontend/src/contexts/AuthContext.jsx` — useEffect + isLoading State
- GEÄNDERT: `frontend/src/components/PrivateRoute.jsx` — zeigt Spinner wenn isLoading
- NEU: `frontend/src/components/LoadingSpinner.jsx` — Vollbild-Spinner Komponente
- NEU: `frontend/src/components/LoadingSpinner.css` — CSS-Animation (spin)

## Nächste User Story
**US-05 — Profil anlegen** (F-02 Nutzerprofil)
Backend: Prisma-Migration — users-Tabelle um firstName, lastName, birthDate erweitern
Frontend: Profil-Formular