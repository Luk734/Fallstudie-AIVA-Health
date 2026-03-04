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
//   /notifications → AppLayout > NotificationsPage (geschützt, MIT Navigation)
//   /care          → AppLayout > CarePage (geschützt, MIT Navigation)
//   /labs          → AppLayout > LabsPage (geschützt, MIT Navigation)
//   /coach         → AppLayout > CoachPage (geschützt, MIT Navigation)
//   /family        → AppLayout > FamilyPage (geschützt, MIT Navigation)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
// Auth-Pages (Login, Onboarding)
import LoginPage from './pages/auth/LoginPage';
import ConsentPage from './pages/auth/ConsentPage';
// Core-Pages (Dashboard, Profil, Datenschutz, Benachrichtigungen)
import DashboardPage from './pages/core/DashboardPage';
import ProfilePage from './pages/core/ProfilePage';
import PrivacySettingsPage from './pages/core/PrivacySettingsPage';
import NotificationsPage from './pages/core/NotificationsPage';
// Modul-Pages (Care, Labs, Coach, Family)
import CarePage from './pages/modules/care/CarePage';
import AppointmentDetailPage from './pages/modules/care/AppointmentDetailPage';
import AppointmentCreatePage from './pages/modules/care/AppointmentCreatePage';
import AppointmentEditPage from './pages/modules/care/AppointmentEditPage';
import LabsPage from './pages/modules/labs/LabsPage';
import MedicationCreatePage from './pages/modules/labs/MedicationCreatePage';
import MedicationEditPage from './pages/modules/labs/MedicationEditPage';
import CoachPage from './pages/modules/coach/CoachPage';
import FamilyPage from './pages/modules/family/FamilyPage';

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

          {/* Benachrichtigungen (US-18) — Termin-Erinnerungen */}
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <AppLayout>
                  <NotificationsPage />
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

          {/* AIVA Care — Termin-Detail (US-14) */}
          <Route
            path="/care/appointments/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <AppointmentDetailPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Care — Neuen Termin erstellen (US-15) */}
          <Route
            path="/care/new"
            element={
              <PrivateRoute>
                <AppLayout>
                  <AppointmentCreatePage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Care — Termin bearbeiten (US-16) */}
          <Route
            path="/care/appointments/:id/edit"
            element={
              <PrivateRoute>
                <AppLayout>
                  <AppointmentEditPage />
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

          {/* AIVA Labs — Neues Medikament erstellen (US-19) */}
          <Route
            path="/labs/medications/new"
            element={
              <PrivateRoute>
                <AppLayout>
                  <MedicationCreatePage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* AIVA Labs — Medikament bearbeiten (US-19) */}
          <Route
            path="/labs/medications/:id/edit"
            element={
              <PrivateRoute>
                <AppLayout>
                  <MedicationEditPage />
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
