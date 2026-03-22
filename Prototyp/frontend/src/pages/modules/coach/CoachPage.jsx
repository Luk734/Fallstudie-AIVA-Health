// src/pages/modules/coach/CoachPage.jsx — AIVA Coach Modul
//
// Dieses Modul enthält:
//   ✅ Befinden-Check-in (US-24) — Emoji-Auswahl + Notiz + Streak
//   ✅ Check-in-Verlauf (US-25) — Kalender-Ansicht + Trends
//   🔲 Tages-Empfehlung (US-26)
//   ✅ Wearable-Metriken (US-27) — Schritte, Herzfrequenz, Schlaf (Mock)
//   🔲 Metriken-Dashboard (US-28)
//
// State-Architektur:
//   refreshKey (number) wird bei jedem neuen Check-in hochgezählt.
//   StreakBadge, MoodTrend und MoodCalendar haben refreshKey als
//   Dependency in useEffect → werden nach Check-in automatisch aktualisiert.

import { useState } from 'react';
import CheckInCard from '../../../components/coach/CheckInCard';
import StreakBadge from '../../../components/coach/StreakBadge';
import MoodTrend from '../../../components/coach/MoodTrend';
import MoodCalendar from '../../../components/coach/MoodCalendar';
import WearableMetrics from '../../../components/coach/WearableMetrics';
import '../../../styles/pages/modules/coach/CoachPage.css';

export default function CoachPage() {
  // refreshKey wird bei jedem Check-in hochgezählt.
  // Das triggert ein Re-Fetch in StreakBadge, MoodTrend und MoodCalendar.
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCheckinDone() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="coach-page">
      <div className="coach-container">
        <h1 className="coach-heading">💪 AIVA Coach</h1>
        <p className="coach-description">
          Tägliches Check-in, KI-Empfehlungen & Wearable-Daten — dein
          persönlicher Gesundheitscoach.
        </p>

        {/* ── US-24: Befinden-Check-in ───────────────────────────── */}
        <StreakBadge refreshKey={refreshKey} />
        <CheckInCard onCheckinDone={handleCheckinDone} />

        {/* ── US-25: Check-in-Verlauf ────────────────────────────── */}
        <MoodTrend refreshKey={refreshKey} />
        <MoodCalendar refreshKey={refreshKey} />

        {/* ── US-27: Wearable-Metriken ─────────────────────────── */}
        <WearableMetrics refreshKey={refreshKey} />

        {/* ── Platzhalter für kommende Features ────────────────── */}
        <div className="coach-placeholder">
          <span className="coach-placeholder-icon">🚧</span>
          <p>Weitere Features (Empfehlungen, Metriken-Dashboard) kommen in den nächsten Stories.</p>
        </div>
      </div>
    </div>
  );
}
