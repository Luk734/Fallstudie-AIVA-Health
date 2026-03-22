// src/components/coach/MoodTrend.jsx — Durchschnittswerte (US-25, TASK-99)
//
// Zeigt die Ø-moodScores der letzten 7 und 30 Tage als Kennzahlen.
// Die Daten kommen vom Backend (GET /api/checkins → averages).
//
// Darstellung:
//   ┌──────────────┬──────────────┐
//   │ Ø 7 Tage     │ Ø 30 Tage    │
//   │ 4.2 😊       │ 3.8 🙂       │
//   └──────────────┴──────────────┘
//
// Wenn noch keine Daten → "–" anzeigen.
//
// Props:
//   refreshKey (number) — Wird nach neuem Check-in erhöht → re-fetch

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/coach/MoodTrend.css';

// ── Score → Emoji-Mapping ────────────────────────────────────────────
// Gerundeter Durchschnittswert wird auf den nächsten Integer gemappt.
const MOOD_EMOJI = Object.freeze({
  1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '😄',
});

export default function MoodTrend({ refreshKey }) {
  const { token } = useAuth();
  const [averages, setAverages] = useState({ last7: null, last30: null });
  const [loading, setLoading] = useState(true);

  // ── Durchschnitte vom Backend laden ──────────────────────────────
  // GET /api/checkins (ohne from/to → Default letzte 30 Tage)
  // Die Response enthält das averages-Objekt.
  useEffect(() => {
    async function fetchAverages() {
      try {
        const res = await fetch('/api/checkins', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAverages(data.averages || { last7: null, last30: null });
      } catch (err) {
        console.error('MoodTrend: Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAverages();
  }, [token, refreshKey]);

  // ── Emoji aus gerundetem Score ableiten ───────────────────────────
  function emojiForScore(score) {
    if (score === null) return '';
    const rounded = Math.round(score);
    return MOOD_EMOJI[Math.min(5, Math.max(1, rounded))] || '';
  }

  // ── Einzelne Kennzahl-Karte rendern ──────────────────────────────
  function renderCard(label, value) {
    return (
      <div className="mood-trend-card">
        <span className="mood-trend-label">{label}</span>
        {loading ? (
          <span className="mood-trend-value mood-trend-value--loading">…</span>
        ) : value !== null ? (
          <div className="mood-trend-value-row">
            <span className="mood-trend-value">{value.toFixed(1)}</span>
            <span className="mood-trend-emoji">{emojiForScore(value)}</span>
          </div>
        ) : (
          <span className="mood-trend-value mood-trend-value--empty">–</span>
        )}
      </div>
    );
  }

  return (
    <div className="mood-trend">
      {renderCard('Ø 7 Tage', averages.last7)}
      {renderCard('Ø 30 Tage', averages.last30)}
    </div>
  );
}
