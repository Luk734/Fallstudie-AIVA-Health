// src/components/coach/StreakBadge.jsx — Streak-Anzeige (US-24, TASK-96)
//
// Zeigt die aktuelle Check-in-Streak an:
//   🔥 7 Tage in Folge!    (wenn streak > 0)
//   Starte deine Streak!   (wenn streak = 0)
//
// API-Call:
//   GET /api/checkins/streak → { streak: number }
//
// Props:
//   refreshKey (number) — Wird von CoachPage erhöht, wenn ein neuer
//     Check-in gespeichert wurde. Dadurch wird die Streak neu geladen.
//     (React re-fetched im useEffect wenn sich der Key ändert.)

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/coach/StreakBadge.css';

export default function StreakBadge({ refreshKey }) {
  const { token } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Streak vom Backend laden ─────────────────────────────────────
  // Wird beim Mount UND wenn refreshKey sich ändert (neuer Check-in)
  // erneut aufgerufen.
  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/checkins/streak', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStreak(data.streak);
      } catch (err) {
        console.error('StreakBadge: Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStreak();
  }, [token, refreshKey]);

  if (loading) return null;

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className={`streak-badge ${streak > 0 ? 'streak-badge--active' : ''}`}>
      {streak > 0 ? (
        <>
          <span className="streak-fire">🔥</span>
          <span className="streak-text">
            <strong>{streak}</strong> {streak === 1 ? 'Tag' : 'Tage'} in Folge
          </span>
        </>
      ) : (
        <span className="streak-text streak-text--empty">
          Starte heute deine Streak! 💪
        </span>
      )}
    </div>
  );
}
