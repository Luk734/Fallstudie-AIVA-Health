// src/App.jsx — Einstiegspunkt der React-App (Routing-Konfiguration)
//
// BrowserRouter: Aktiviert das URL-basierte Routing.
//   Intern verwendet er die History-API des Browsers, um URLs zu verwalten
//   ohne die Seite neu zu laden. Das macht React zu einer SPA (Single Page App).
//
// Routes + Route: Definieren welche Komponente bei welcher URL angezeigt wird.
//
// Struktur:
//   /           → Weiterleitung zu /dashboard (oder /login wenn ausgeloggt)
//   /login      → LoginPage (öffentlich)
//   /dashboard  → DashboardPage (geschützt durch PrivateRoute)
//   /profile    → ProfilePage (geschützt durch PrivateRoute) ← NEU (US-05)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    // AuthProvider umhüllt ALLES → jede Komponente kann useAuth() verwenden
    <AuthProvider>
      {/* BrowserRouter aktiviert das Routing */}
      <BrowserRouter>
        <Routes>
          {/* Wurzel-URL: direkt zu /dashboard weiterleiten */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Öffentliche Route: Login-Seite */}
          <Route path="/login" element={<LoginPage />} />

          {/* Geschützte Route: Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Geschützte Route: Profil (US-05 + US-06) */}
          {/* Hierhin kommt der User nach der Registrierung (Onboarding) */}
          {/* oder wenn er im Dashboard auf "Profil bearbeiten" klickt */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
