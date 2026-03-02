// src/App.jsx — Einstiegspunkt der React-App (Routing-Konfiguration)
//
// BrowserRouter: Aktiviert das URL-basierte Routing.
//   Intern verwendet er die History-API des Browsers, um URLs zu verwalten
//   ohne die Seite neu zu laden. Das macht React zu einer SPA (Single Page App).
//
// Routes + Route: Definieren welche Komponente bei welcher URL angezeigt wird.
//
// US-09: AppLayout wrapping
//   Alle geschützten Seiten (außer /login und /consent) werden jetzt von
//   <AppLayout> umhüllt. AppLayout rendert die Bottom-Navigation, sodass
//   sie auf JEDER geschützten Seite sichtbar ist — ohne Code-Duplizierung.
//
//   /login und /consent bekommen KEIN AppLayout, weil:
//   - /login: Der User ist noch nicht eingeloggt → keine App-Navigation
//   - /consent: Onboarding-Pflicht → User soll zuerst zustimmen
//
// Routing-Struktur:
//   /              → Weiterleitung zu /dashboard
//   /login         → LoginPage (öffentlich, OHNE Navigation)
//   /consent       → ConsentPage (geschützt, OHNE Navigation)
//   /dashboard     → AppLayout > DashboardPage (geschützt, MIT Navigation)
//   /profile       → AppLayout > ProfilePage (geschützt, MIT Navigation)
//   /datenschutz   → AppLayout > PrivacySettingsPage (geschützt, MIT Navigation)
//   /care          → AppLayout > CarePage (geschützt, MIT Navigation)
//   /labs          → AppLayout > LabsPage (geschützt, MIT Navigation)
//   /coach         → AppLayout > CoachPage (geschützt, MIT Navigation)
//   /family        → AppLayout > FamilyPage (geschützt, MIT Navigation)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import ConsentPage from './pages/ConsentPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PrivacySettingsPage from './pages/PrivacySettingsPage';
import CarePage from './pages/CarePage';
import LabsPage from './pages/LabsPage';
import CoachPage from './pages/CoachPage';
import FamilyPage from './pages/FamilyPage';

export default function App() {
  return (
    // AuthProvider umhüllt ALLES → jede Komponente kann useAuth() verwenden
    <AuthProvider>
      {/* BrowserRouter aktiviert das Routing */}
      <BrowserRouter>
        <Routes>
          {/* Wurzel-URL: direkt zu /dashboard weiterleiten */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Öffentliche Route: Login-Seite (OHNE Bottom-Navigation) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Geschützte Route: DSGVO-Einwilligungen (US-07) */}
          {/* OHNE Bottom-Navigation — Onboarding-Pflicht-Station */}
          <Route
            path="/consent"
            element={
              <PrivateRoute>
                <ConsentPage />
              </PrivateRoute>
            }
          />

          {/* ── Geschützte Routen MIT Bottom-Navigation (US-09) ──────── */}
          {/* Alle folgenden Seiten werden von AppLayout umhüllt.         */}
          {/* AppLayout rendert: <main>{Seite}</main> + <nav>BottomNav</nav> */}

          {/* Dashboard / Home-Tab */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Profil (US-05 + US-06) — erreichbar über Header-Button */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Datenschutz-Einstellungen (US-08) — Consent-Verwaltung */}
          <Route
            path="/datenschutz"
            element={
              <PrivateRoute>
                <AppLayout>
                  <PrivacySettingsPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Care — Termine, Vorsorge, Erinnerungen */}
          <Route
            path="/care"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CarePage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Labs — Laborbefunde, Medikamente */}
          <Route
            path="/labs"
            element={
              <PrivateRoute>
                <AppLayout>
                  <LabsPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Coach — Check-in, Empfehlungen, Wearables */}
          <Route
            path="/coach"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CoachPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Family — Familienkonto, Kinderprofile */}
          <Route
            path="/family"
            element={
              <PrivateRoute>
                <AppLayout>
                  <FamilyPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
