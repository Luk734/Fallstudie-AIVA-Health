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

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

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

          {/* Geschützte Route: PrivateRoute prüft ob Token vorhanden */}
          {/* Wenn kein Token → automatisch zu /login */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
