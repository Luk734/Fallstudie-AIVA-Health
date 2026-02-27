// src/pages/DashboardPage.jsx — Geschützte Hauptseite (Demo für US-03)
//
// Diese Seite ist NUR für eingeloggte Nutzer zugänglich.
// PrivateRoute in App.jsx sorgt dafür, dass Nicht-Eingeloggte
// automatisch zur Login-Seite weitergeleitet werden.
//
// Kernfunktion hier: Der Logout-Button.
//   1. logout() aus AuthContext aufrufen
//      → löscht Token + User aus Context UND localStorage
//   2. navigate('/login') → Weiterleitung zur Login-Seite
//
// Nach dem Logout: Wenn jemand /dashboard in die URL tippt,
// greift PrivateRoute → kein Token → redirect zu /login.
// Das ist das vierte Akzeptanzkriterium aus US-03.

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Logout-Handler ───────────────────────────────────────────────────────────
  function handleLogout() {
    logout();           // Token aus Context + localStorage löschen
    navigate('/login'); // Zur Login-Seite navigieren
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ── Header mit Logout-Button ─────────────────────────────────── */}
        <header className="dashboard-header">
          <div className="dashboard-header-brand">
            <span className="dashboard-logo">🩺</span>
            <span className="dashboard-app-name">AIVA Health</span>
          </div>
          <button onClick={handleLogout} className="dashboard-logout-btn">
            Ausloggen
          </button>
        </header>

        {/* ── Willkommens-Bereich ──────────────────────────────────────── */}
        <main className="dashboard-main">
          <div className="dashboard-card">
            <h1 className="dashboard-heading">Willkommen zurück!</h1>
            <p className="dashboard-email">📧 {user?.email}</p>
            <p className="dashboard-info">
              Du bist eingeloggt. Dein JWT-Token liegt sicher im{' '}
              <code>localStorage</code> des Browsers.
            </p>
            <p className="dashboard-info">
              Klicke auf <strong>Ausloggen</strong> (oben rechts), um den Token
              zu löschen und zur Login-Seite zurückzukehren.
            </p>
          </div>

          {/* ── Info-Box: Was passiert beim Logout ──────────────────────── */}
          <div className="dashboard-info-box">
            <h2 className="dashboard-info-title">Was passiert beim Ausloggen?</h2>
            <ol className="dashboard-list">
              <li><code>logout()</code> wird aufgerufen</li>
              <li><code>localStorage.removeItem('aiva_token')</code></li>
              <li><code>localStorage.removeItem('aiva_user')</code></li>
              <li>React-State auf <code>null</code> gesetzt</li>
              <li>Weiterleitung zu <code>/login</code></li>
              <li>Versuch <code>/dashboard</code> direkt aufzurufen → PrivateRoute leitet wieder zu <code>/login</code></li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
