// src/pages/core/DashboardPage.jsx — Dashboard / Startseite (US-10, US-12, US-13)
//
// Die zentrale Übersichtsseite der App. Zeigt dem User auf einen Blick:
//   1. Persönliche Begrüßung (tageszeitabhängig)
//   2. Nächster Termin (AIVA Care) — US-13: echte API-Daten
//   3. Täglicher Check-in Status (AIVA Coach)
//   4. Nächste Medikamenteneinnahme (AIVA Labs)
//   5. Quick-Action Buttons für die wichtigsten Aktionen
//
// US-12 Migration:
//   - .dashboard-profile-hint → <Alert variant="warning">
//   - .dashboard-profile-hint__btn → <Button variant="primary" size="sm">
//
// US-13 Integration:
//   - Mock-Termin → echte Daten von GET /api/appointments/upcoming

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GreetingCard from '../../components/GreetingCard';
import SummaryCard from '../../components/SummaryCard';
import QuickActions from '../../components/QuickActions';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import '../../styles/pages/core/DashboardPage.css';

// ── API-URL ──────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Mock-Daten (Coach + Labs — werden in späteren US ersetzt) ─────────────
const mockCheckin = {
  erledigt: false,
  letzter: 'Gestern, 18:30',
};

const mockMedikament = {
  name: 'Ibuprofen 400mg',
  uhrzeit: '14:00 Uhr',
  hinweis: 'Nach dem Essen einnehmen',
};

// ── Datum-Formatierung für Dashboard-Anzeige ──────────────────────────────
function formatTerminKurz(isoString) {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr}, ${timeStr} Uhr`;
}

export default function DashboardPage() {
  // user + logout aus dem AuthContext holen
  // user → Vornamen für Begrüßung + Avatar im Header
  // logout → wird vom Logout-Button im Header aufgerufen
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // ── Nächste Termine vom Backend laden (US-13) ────────────────────────────
  const [upcomingTermine, setUpcomingTermine] = useState([]);

  useEffect(() => {
    if (!token) return;

    async function fetchUpcoming() {
      try {
        const res = await fetch(`${API_URL}/api/appointments/upcoming?limit=3`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUpcomingTermine(data.appointments);
        }
      } catch {
        // Dashboard-Termin-Karte zeigt bei Fehler einfach den Fallback-Text
      }
    }

    fetchUpcoming();
  }, [token]);

  // ── Logout-Handler ───────────────────────────────────────────────────────
  // Token + User aus Context und localStorage löschen, dann zur Login-Seite.
  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="dashboard-page">
      {/* ── Dashboard-Header ─────────────────────────────────────────── */}
      {/* Dezente Leiste oben: App-Logo links, Action-Buttons rechts.     */}
      {/* Hier erreicht der User Profil, Datenschutz und Logout —         */}
      {/* Funktionen die NICHT in der Bottom-Nav sind.                    */}
      <header className="dashboard-header">
        <div className="dashboard-header__brand">
          <span className="dashboard-header__logo">🩺</span>
          <span className="dashboard-header__app-name">AIVA Health</span>
        </div>
        <div className="dashboard-header__actions">
          {/* Profil: Zeigt Avatar wenn vorhanden, sonst 👤 */}
          <button
            className="dashboard-header__btn"
            onClick={() => navigate('/profile')}
            title="Mein Profil"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profil"
                className="dashboard-header__avatar"
              />
            ) : (
              <span>👤</span>
            )}
          </button>
          {/* Datenschutz-Einstellungen */}
          <button
            className="dashboard-header__btn"
            onClick={() => navigate('/datenschutz')}
            title="Datenschutz-Einstellungen"
          >
            🔒
          </button>
          {/* Ausloggen */}
          <button
            className="dashboard-header__btn dashboard-header__btn--logout"
            onClick={handleLogout}
            title="Ausloggen"
          >
            🚪
          </button>
        </div>
      </header>

      {/* ── 1. Persönliche Begrüßung ─────────────────────────────────── */}
      {/* GreetingCard liest den Vornamen und zeigt z.B.                  */}
      {/* "Guten Morgen, Laura 👋" + das heutige Datum                   */}
      <GreetingCard firstName={user?.firstName} />

      {/* ── Profil-Hinweis (wenn noch kein Profil angelegt) ──────────── */}
      {/* Alert variant="warning" + Button — ersetzt .dashboard-profile-hint */}
      {!user?.firstName && (
        <Alert variant="warning" className="dashboard-profile-hint">
          <p>
            <strong>Tipp:</strong> Vervollständige dein Profil, damit
            AIVA Health dich persönlich begrüßen kann.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/profile')}
            className="dashboard-profile-hint__btn"
          >
            Profil anlegen →
          </Button>
        </Alert>
      )}

      {/* ── 2. Summary-Karten ────────────────────────────────────────── */}
      {/* Drei Karten in einem vertikalen Stack. Jede zeigt eine          */}
      {/* Zusammenfassung aus einem der drei Haupt-Module.                */}
      <div className="dashboard-cards">

        {/* ── Nächster Termin (AIVA Care) — US-13: echte Daten ────── */}
        <SummaryCard
          icon="📅"
          title="Nächster Termin"
          variant="care"
          actionLabel="Alle Termine"
          onAction={() => navigate('/care')}
        >
          {upcomingTermine.length > 0 ? (
            <>
              <p>
                <strong>{upcomingTermine[0].doctor}</strong> — {upcomingTermine[0].title}
              </p>
              <p>{formatTerminKurz(upcomingTermine[0].datetime)}</p>
              {upcomingTermine.length > 1 && (
                <p className="dashboard-cards__hint">
                  +{upcomingTermine.length - 1} weitere Termine
                </p>
              )}
            </>
          ) : (
            <p className="dashboard-cards__hint">Kein Termin geplant</p>
          )}
        </SummaryCard>

        {/* ── Täglicher Check-in (AIVA Coach) ──────────────────────── */}
        <SummaryCard
          icon={mockCheckin.erledigt ? '✅' : '💚'}
          title="Täglicher Check-in"
          variant="coach"
          actionLabel={mockCheckin.erledigt ? 'Ergebnis ansehen' : 'Jetzt ausfüllen'}
          onAction={() => navigate('/coach')}
        >
          {mockCheckin.erledigt ? (
            <p>Heute bereits ausgefüllt ✓</p>
          ) : (
            <>
              <p><strong>Noch nicht ausgefüllt</strong></p>
              <p className="dashboard-cards__hint">Letzter: {mockCheckin.letzter}</p>
            </>
          )}
        </SummaryCard>

        {/* ── Nächste Medikamenteneinnahme (AIVA Labs) ─────────────── */}
        <SummaryCard
          icon="💊"
          title="Nächste Einnahme"
          variant="labs"
          actionLabel="Medikamentenplan"
          onAction={() => navigate('/labs')}
        >
          <p>
            <strong>{mockMedikament.name}</strong> — {mockMedikament.uhrzeit}
          </p>
          <p className="dashboard-cards__hint">{mockMedikament.hinweis}</p>
        </SummaryCard>
      </div>

      {/* ── 3. Quick-Action Buttons ──────────────────────────────────── */}
      {/* Zwei prominente Buttons: "Check-in starten" + "Termin buchen"  */}
      <QuickActions />
    </div>
  );
}
