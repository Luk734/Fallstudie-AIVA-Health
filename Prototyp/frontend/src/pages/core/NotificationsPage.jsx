// src/pages/core/NotificationsPage.jsx — Benachrichtigungs-Übersicht (US-18)
//
// Zeigt alle In-App-Benachrichtigungen des Users an.
//
// ── Layout ───────────────────────────────────────────────────────────
//   PageContainer > PageHeader + "Alle gelesen"-Button + Benachrichtigungs-Liste
//
// ── Verhalten ────────────────────────────────────────────────────────
//   - Ungelesene haben einen farbigen linken Rand und fetten Titel
//   - Klick auf eine Benachrichtigung:
//       1. PATCH /api/notifications/:id/read (als gelesen markieren)
//       2. Navigation zum Termin (/care/appointments/:relatedId)
//   - "Alle als gelesen": PATCH /api/notifications/read-all
//   - Loading-State: Spinner während des Ladens
//   - Empty-State: Hinweis wenn keine Benachrichtigungen vorhanden
//
// ── Verwendete Komponenten ───────────────────────────────────────────
//   PageContainer → Äußere Hülle (max-width, Padding, Zentrierung)
//   PageHeader    → Überschrift + Untertitel
//   Card          → Jede Benachrichtigung als Karte
//   Spinner       → Lade-Animation
//   Alert         → Fehlermeldung bei API-Fehler

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import '../../styles/pages/core/NotificationsPage.css';

export default function NotificationsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── States ──────────────────────────────────────────────────────────
  // notifications: Array aller Benachrichtigungen (vom Server)
  // loading: true während der API-Request läuft → Spinner anzeigen
  // error: Fehlermeldung falls der Request fehlschlägt
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Benachrichtigungen laden ────────────────────────────────────────
  // useEffect mit [] → läuft nur EINMAL nach dem ersten Render.
  // Ruft GET /api/notifications auf und speichert das Ergebnis im State.
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Fehler beim Laden');

        const data = await res.json();
        // data.notifications = Array der Benachrichtigungen
        setNotifications(data.notifications);
      } catch (err) {
        setError('Benachrichtigungen konnten nicht geladen werden.');
      } finally {
        // finally wird IMMER ausgeführt — egal ob Erfolg oder Fehler.
        // Damit verschwindet der Spinner in beiden Fällen.
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [token]);

  // ── Handler: Eine Benachrichtigung als gelesen markieren + navigieren ──
  // Wird aufgerufen wenn der User auf eine Benachrichtigung klickt.
  //
  // Ablauf:
  //   1. PATCH /api/notifications/:id/read → Backend markiert als gelesen
  //   2. State lokal aktualisieren (read: true) → UI reagiert sofort
  //   3. Wenn relatedId vorhanden → zum Termin navigieren
  async function handleNotificationClick(notification) {
    // Nur PATCH senden wenn noch ungelesen
    if (!notification.read) {
      try {
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });

        // State lokal aktualisieren (optimistisch)
        // map() erstellt ein neues Array → React erkennt die Änderung
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      } catch (err) {
        // Fehler ignorieren — Navigation trotzdem durchführen
      }
    }

    // Zum Termin navigieren (wenn Bezug vorhanden)
    if (notification.relatedId) {
      navigate(`/care/appointments/${notification.relatedId}`);
    }
  }

  // ── Handler: ALLE als gelesen markieren ─────────────────────────────
  // Wird aufgerufen wenn der User den "Alle gelesen"-Button drückt.
  async function handleMarkAllRead() {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      // State lokal aktualisieren: alle auf read: true setzen
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      setError('Konnte nicht alle als gelesen markieren.');
    }
  }

  // ── Hilfsfunktion: Datum formatieren ────────────────────────────────
  // Zeigt an, wie lange die Benachrichtigung her ist.
  // Beispiele: "vor 5 Minuten", "vor 2 Stunden", "vor 3 Tagen"
  //
  // Die Logik: Differenz in Millisekunden berechnen und dann
  // in die passende Einheit umrechnen.
  function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;                          // Differenz in Millisekunden
    const diffMin = Math.floor(diffMs / (1000 * 60));   // → Minuten
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // → Stunden
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // → Tage

    if (diffMin < 1) return 'gerade eben';
    if (diffMin < 60) return `vor ${diffMin} Min.`;
    if (diffHrs < 24) return `vor ${diffHrs} Std.`;
    return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
  }

  // ── Ungelesene zählen (für "Alle gelesen"-Button) ──────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <PageContainer>
      <PageHeader
        title="🔔 Benachrichtigungen"
        subtitle="Deine Termin-Erinnerungen und Hinweise"
      />

      {/* ── Fehler-Anzeige ──────────────────────────────────────── */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* ── Lade-Animation ──────────────────────────────────────── */}
      {loading && <Spinner />}

      {/* ── Leerer Zustand ──────────────────────────────────────── */}
      {/* Wird nur angezeigt wenn: nicht laden UND keine Notifications */}
      {!loading && notifications.length === 0 && (
        <Card>
          <p className="notifications-empty">
            ✅ Keine Benachrichtigungen — du bist auf dem neuesten Stand!
          </p>
        </Card>
      )}

      {/* ── "Alle gelesen"-Button ───────────────────────────────── */}
      {/* Nur anzeigen wenn es ungelesene gibt */}
      {!loading && unreadCount > 0 && (
        <button
          className="notifications-mark-all"
          onClick={handleMarkAllRead}
        >
          ✓ Alle als gelesen markieren ({unreadCount})
        </button>
      )}

      {/* ── Benachrichtigungs-Liste ─────────────────────────────── */}
      <div className="notifications-list">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            hoverable
            className={`notification-item ${!notification.read ? 'notification-item--unread' : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="notification-item__content">
              {/* ── Icon: Typ-abhängig ────────────────────────────── */}
              {/* Im MVP nur Termin-Erinnerungen → Kalender-Emoji */}
              <span className="notification-item__icon">
                {notification.type.includes('appointment') ? '📅' : '🔔'}
              </span>

              {/* ── Text-Bereich ──────────────────────────────────── */}
              <div className="notification-item__text">
                <p className="notification-item__title">
                  {notification.title}
                  {/* Ungelesen-Punkt: kleiner blauer Kreis */}
                  {!notification.read && (
                    <span className="notification-item__dot" />
                  )}
                </p>
                <p className="notification-item__message">
                  {notification.message}
                </p>
                <p className="notification-item__time">
                  {formatTimeAgo(notification.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
