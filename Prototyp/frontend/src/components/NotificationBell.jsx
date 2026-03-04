// src/components/NotificationBell.jsx — Benachrichtigungs-Glocke (US-18, TASK-70)
//
// Zeigt ein Glocken-Icon (🔔) im AppHeader an.
// Wenn es ungelesene Benachrichtigungen gibt, wird ein roter Badge-Zähler
// über der Glocke angezeigt (z.B. "3").
//
// ── Polling-Strategie ────────────────────────────────────────────────
// Die Komponente fragt alle 60 Sekunden den Server nach neuen
// Benachrichtigungen. Das nennt man "Polling".
// Alternative wäre WebSocket (Echtzeit), aber für ein MVP ist Polling
// einfacher und völlig ausreichend.
//
// ── useEffect mit setInterval ────────────────────────────────────────
// useEffect() läuft nach dem ersten Render und bei Dependency-Änderungen.
// Darin starten wir ein setInterval (Timer), der alle 60 Sekunden
// die API aufruft. Die Cleanup-Funktion (return) räumt den Timer auf,
// wenn die Komponente unmountet wird — sonst läuft er ewig weiter!
//
// ── Warum ein eigener State statt Context? ───────────────────────────
// Für den MVP reicht ein lokaler State in dieser Komponente.
// Wenn später andere Komponenten den unreadCount brauchen, könnten
// wir einen NotificationContext erstellen (wie AuthContext).

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/components/NotificationBell.css';

// Polling-Intervall: 60 Sekunden (in Millisekunden)
// Nicht zu häufig → Server nicht überlasten
// Nicht zu selten → User soll Erinnerungen zeitnah sehen
const POLL_INTERVAL = 60 * 1000;

export default function NotificationBell() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── State: Anzahl ungelesener Benachrichtigungen ──────────────────
  // 0 = keine ungelesenen → kein Badge sichtbar
  // > 0 = Badge mit Zahl wird über der Glocke angezeigt
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Funktion: Ungelesene vom Server abrufen ───────────────────────
  // Wird beim ersten Render aufgerufen und danach alle 60 Sekunden.
  // Falls der Request fehlschlägt (z.B. Server offline), fangen wir
  // den Fehler ab und loggen ihn — die App crasht nicht.
  async function fetchUnreadCount() {
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return; // Stille Fehlerbehandlung (Badge bleibt bei 0)

      const data = await res.json();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      // Netzwerkfehler → ignorieren (Badge bleibt beim letzten Wert)
      console.warn('NotificationBell: Polling fehlgeschlagen', err.message);
    }
  }

  // ── Effect: Polling starten ───────────────────────────────────────
  // Dependency: [token] → wird neu gestartet wenn sich der Token ändert
  // (z.B. nach Login/Logout)
  useEffect(() => {
    // Sofort beim Mount einmal abrufen
    fetchUnreadCount();

    // Timer starten: alle POLL_INTERVAL Millisekunden erneut abrufen
    const intervalId = setInterval(fetchUnreadCount, POLL_INTERVAL);

    // Cleanup: Timer stoppen wenn Komponente unmountet wird
    // Ohne das würde der Timer weiterlaufen und Fehler verursachen,
    // weil setUnreadCount auf einer unmounteten Komponente aufgerufen wird.
    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <button
      className="app-header__btn notification-bell"
      onClick={() => navigate('/notifications')}
      title="Benachrichtigungen"
    >
      {/* Glocken-Emoji */}
      <span className="notification-bell__icon">🔔</span>

      {/* Badge: Nur anzeigen wenn ungelesene > 0 */}
      {/* Wenn unreadCount 0 ist, wird {false} gerendert → React zeigt nichts an */}
      {unreadCount > 0 && (
        <span className="notification-bell__badge">
          {/* Bei mehr als 9: "9+" anzeigen (spart Platz) */}
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
