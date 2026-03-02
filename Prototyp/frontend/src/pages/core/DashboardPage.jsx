// src/pages/DashboardPage.jsx — Geschützte Hauptseite (US-03 + US-05)
//
// Diese Seite ist NUR für eingeloggte Nutzer zugänglich.
// PrivateRoute in App.jsx sorgt dafür, dass Nicht-Eingeloggte
// automatisch zur Login-Seite weitergeleitet werden.
//
// US-05 ergänzt: Personalisierte Begrüßung mit Vorname + Profil-Link.
// Wenn der User noch kein Profil hat (firstName fehlt), zeigen wir
// einen Hinweis, dass er sein Profil vervollständigen soll.

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/core/DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Logout-Handler ───────────────────────────────────────────────────────────
  function handleLogout() {
    logout();           // Token aus Context + localStorage löschen
    navigate('/login'); // Zur Login-Seite navigieren
  }

  // ── Begrüßungstext ──────────────────────────────────────────────────────────
  // Wenn der User einen Vornamen hat → "Hallo, Julian!"
  // Wenn nicht → "Willkommen!" (noch kein Profil ausgefüllt)
  const greeting = user?.firstName
    ? `Hallo, ${user.firstName}!`
    : 'Willkommen!';

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ── Header mit Profil-Link + Logout-Button ───────────────────── */}
        <header className="dashboard-header">
          <div className="dashboard-header-brand">
            <span className="dashboard-logo">🩺</span>
            <span className="dashboard-app-name">AIVA Health</span>
          </div>
          <div className="dashboard-header-actions">
            {/* Profil-Button: öffnet die ProfilePage */}
            <button
              onClick={() => navigate('/profile')}
              className="dashboard-profile-btn"
            >
              {/* Wenn Avatar vorhanden → Bild zeigen, sonst Emoji */}
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profil"
                  className="dashboard-profile-avatar"
                />
              ) : (
                <span>👤</span>
              )}
              Profil
            </button>
            {/* Datenschutz-Button: öffnet die Consent-Verwaltung (US-08) */}
            <button
              onClick={() => navigate('/datenschutz')}
              className="dashboard-privacy-btn"
            >
              🔒 Datenschutz
            </button>
            <button onClick={handleLogout} className="dashboard-logout-btn">
              Ausloggen
            </button>
          </div>
        </header>

        {/* ── Willkommens-Bereich ──────────────────────────────────────── */}
        <main className="dashboard-main">
          <div className="dashboard-card">
            <h1 className="dashboard-heading">{greeting}</h1>
            <p className="dashboard-email">📧 {user?.email}</p>

            {/* Wenn noch kein Profil ausgefüllt → Hinweis anzeigen */}
            {!user?.firstName && (
              <div className="dashboard-profile-hint">
                <p>
                  <strong>Tipp:</strong> Vervollständige dein Profil, damit
                  AIVA Health dich persönlich ansprechen kann.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="dashboard-profile-cta"
                >
                  Profil anlegen →
                </button>
              </div>
            )}

            {/* Wenn Profil vorhanden → kurze Zusammenfassung */}
            {user?.firstName && (
              <div className="dashboard-profile-summary">
                <p className="dashboard-info">
                  Dein Profil ist eingerichtet. Du kannst es jederzeit über den
                  Button oben rechts bearbeiten.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
