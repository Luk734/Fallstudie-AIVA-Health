// src/pages/core/DashboardPage.jsx — Dashboard / Startseite
//
// Die zentrale Übersichtsseite der App. Zeigt dem User auf einen Blick:
//   1. Persönliche Begrüßung (tageszeitabhängig)
//   2. Nächster Termin (AIVA Care) — echte API-Daten (US-13)
//   3. Täglicher Check-in Status (AIVA Coach) — echte API-Daten (US-24)
//   4. Nächste Medikamenteneinnahme (AIVA Labs) — echte API-Daten (US-19/20)
//   5. Wearable-Metriken (AIVA Coach) — echte API-Daten (US-27)
//   6. Quick-Action Buttons für die wichtigsten Aktionen
//
// Alle Karten laden ihre Daten beim Mount via useEffect vom Backend.
// Bei Fehlern wird ein Fallback-Text angezeigt (kein Crash).

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

// ── Mood-Emoji-Mapping (wie in MoodTrend.jsx) ────────────────────────────────
const MOOD_EMOJI = { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '😄' };

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
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // ── State für alle Dashboard-Karten ──────────────────────────────────────
  const [upcomingTermine, setUpcomingTermine] = useState([]);
  const [todayCheckin, setTodayCheckin] = useState(null);     // null = noch nicht geladen
  const [streak, setStreak] = useState(0);
  const [medToday, setMedToday] = useState(null);             // null = noch nicht geladen
  const [latestMetric, setLatestMetric] = useState(null);     // null = noch nicht geladen

  // ── Alle Daten parallel vom Backend laden ────────────────────────────────
  // Ein einziger useEffect für alle API-Calls (unabhängig voneinander).
  // Promise.allSettled: Wenn ein Call fehlschlägt, laufen die anderen weiter.
  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // 1. Nächste Termine (US-13)
    fetch(`${API_URL}/api/appointments?time=upcoming&limit=3`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setUpcomingTermine(data.appointments); })
      .catch(() => {});

    // 2. Heutiger Check-in (US-24)
    fetch(`${API_URL}/api/checkins/today`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setTodayCheckin(data.checkin || false); })
      .catch(() => { setTodayCheckin(false); });

    // 3. Check-in-Streak (US-24)
    fetch(`${API_URL}/api/checkins/streak`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStreak(data.streak); })
      .catch(() => {});

    // 4. Heutige Medikamente (US-19/20)
    fetch(`${API_URL}/api/medications/today`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setMedToday(data); })
      .catch(() => { setMedToday({ entries: [], progress: { taken: 0, total: 0, percent: 0 } }); });

    // 5. Aktuellste Wearable-Metriken (US-27)
    fetch(`${API_URL}/api/metrics/latest`, { headers })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setLatestMetric(data.metric); })
      .catch(() => {});
  }, [token]);

  // ── Nächste ausstehende Medikamenten-Einnahme finden ─────────────────────
  const nextPending = medToday?.entries?.find((e) => e.status === 'pending');

  return (
    <div className="dashboard-page">
      {/* ── 1. Persönliche Begrüßung ─────────────────────────────────── */}
      <GreetingCard firstName={user?.firstName} />

      {/* ── Profil-Hinweis (wenn noch kein Profil angelegt) ──────────── */}
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
      <div className="dashboard-cards">

        {/* ── Nächster Termin (AIVA Care) — echte Daten (US-13) ──── */}
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

        {/* ── Täglicher Check-in (AIVA Coach) — echte Daten (US-24) ── */}
        <SummaryCard
          icon={todayCheckin ? '✅' : '💚'}
          title="Täglicher Check-in"
          variant="coach"
          actionLabel={todayCheckin ? 'Zum Coach' : 'Jetzt ausfüllen'}
          onAction={() => navigate('/coach')}
        >
          {todayCheckin ? (
            <>
              <p>
                <strong>Heute: {MOOD_EMOJI[todayCheckin.moodScore]} {
                  ['', 'Schlecht', 'Mittelmäßig', 'Okay', 'Gut', 'Super'][todayCheckin.moodScore]
                }</strong>
              </p>
              {todayCheckin.note && (
                <p className="dashboard-cards__hint">„{todayCheckin.note}"</p>
              )}
            </>
          ) : (
            <>
              <p><strong>Noch nicht ausgefüllt</strong></p>
              {streak > 0 && (
                <p className="dashboard-cards__hint">🔥 {streak} Tage Streak — nicht abreißen!</p>
              )}
            </>
          )}
        </SummaryCard>

        {/* ── Medikamente (AIVA Labs) — echte Daten (US-19/20) ────── */}
        <SummaryCard
          icon="💊"
          title="Medikamente heute"
          variant="labs"
          actionLabel="Medikamentenplan"
          onAction={() => navigate('/labs')}
        >
          {medToday === null ? (
            <p className="dashboard-cards__hint">Lade…</p>
          ) : medToday.progress.total === 0 ? (
            <p className="dashboard-cards__hint">Keine Medikamente hinterlegt</p>
          ) : medToday.progress.taken === medToday.progress.total ? (
            <p><strong>✅ Alle {medToday.progress.total} Einnahmen erledigt</strong></p>
          ) : (
            <>
              {nextPending && (
                <p>
                  <strong>{nextPending.medicationName} {nextPending.dosage}</strong> — {nextPending.scheduledTime}
                </p>
              )}
              <p className="dashboard-cards__hint">
                {medToday.progress.taken}/{medToday.progress.total} eingenommen ({medToday.progress.percent}%)
              </p>
            </>
          )}
        </SummaryCard>

        {/* ── Wearable-Metriken (AIVA Coach) — echte Daten (US-27) ── */}
        <SummaryCard
          icon="⌚"
          title="Wearable-Daten"
          variant="coach"
          actionLabel="Alle Metriken"
          onAction={() => navigate('/coach')}
        >
          {latestMetric ? (
            <>
              <p>
                <strong>🚶 {latestMetric.steps.toLocaleString('de-DE')}</strong> Schritte
                {' · '}
                <strong>❤️ Ø {latestMetric.heartRateAvg}</strong> bpm
              </p>
              <p className="dashboard-cards__hint">
                😴 {latestMetric.sleepHours}h Schlaf · Demo-Daten
              </p>
            </>
          ) : (
            <p className="dashboard-cards__hint">Noch keine Wearable-Daten</p>
          )}
        </SummaryCard>
      </div>

      {/* ── 3. Quick-Action Buttons ──────────────────────────────────── */}
      <QuickActions />
    </div>
  );
}
