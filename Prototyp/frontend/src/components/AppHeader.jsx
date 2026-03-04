// src/components/AppHeader.jsx — Globaler App-Header (aus DashboardPage extrahiert)
//
// Dezente Leiste oben auf JEDER geschützten Seite:
//   Links:  App-Logo + Name ("🩺 AIVA Health")
//   Rechts: Profil (👤), Benachrichtigungen (🔔), Datenschutz (🔒), Logout (🚪)
//
// Vorher war dieser Header NUR in DashboardPage.jsx eingebettet.
// Problem: Auf allen anderen Seiten (/care, /labs, /coach, /family, /profile)
// fehlte er komplett — der User hatte dort keinen Zugang zu Profil/Logout.
//
// Lösung: Header als eigene Komponente extrahieren und im AppLayout einbauen.
// AppLayout umhüllt ALLE geschützten Seiten → Header erscheint überall.
//
// Verwendet:
//   useAuth()     → user (Avatar, Name), logout (Token löschen)
//   useNavigate() → Navigation zu /profile und /datenschutz

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDialog from './ui/ConfirmDialog';
import NotificationBell from './NotificationBell';
import '../styles/components/AppHeader.css';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Logout-Bestätigung (ConfirmDialog) ───────────────────────────────
  // Statt sofort auszuloggen, fragen wir zuerst nach — damit ein
  // versehentlicher Tap auf 🚪 nicht zum ungewollten Logout führt.
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">🩺</span>
        <span className="app-header__app-name">AIVA Health</span>
      </div>
      <div className="app-header__actions">
        {/* Profil: Zeigt Avatar wenn vorhanden, sonst 👤 */}
        <button
          className="app-header__btn"
          onClick={() => navigate('/profile')}
          title="Mein Profil"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profil"
              className="app-header__avatar"
            />
          ) : (
            <span>👤</span>
          )}
        </button>
        {/* Benachrichtigungen: Glocke mit Badge-Zähler (US-18) */}
        <NotificationBell />
        {/* Datenschutz-Einstellungen */}
        <button
          className="app-header__btn"
          onClick={() => navigate('/datenschutz')}
          title="Datenschutz-Einstellungen"
        >
          🔒
        </button>
        {/* Ausloggen */}
        <button
          className="app-header__btn app-header__btn--logout"
          onClick={() => setShowLogoutDialog(true)}
          title="Ausloggen"
        >
          🚪
        </button>
      </div>

      {/* ── Logout-Bestätigung ───────────────────────────────────── */}
      <ConfirmDialog
        open={showLogoutDialog}
        title="Abmelden?"
        message="Möchtest du dich wirklich von AIVA Health abmelden?"
        confirmLabel="Ja, abmelden"
        cancelLabel="Abbrechen"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </header>
  );
}
