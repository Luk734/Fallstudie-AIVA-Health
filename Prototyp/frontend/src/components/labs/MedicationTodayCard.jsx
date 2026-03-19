// src/components/labs/MedicationTodayCard.jsx — Einzelne Einnahme-Zeile (US-20)
//
// Zeigt eine einzelne Einnahme an (z.B. "Ramipril 5mg morgens"):
//   ✅ → Einnahme bestätigen (POST /:id/take)
//   ⏭️ → Einnahme überspringen (POST /:id/skip)
//   Bei status "taken" → Zeile ist grün + durchgestrichen + Zeitstempel
//   Bei status "skipped" → Zeile ist grau + "Übersprungen"-Label
//   Bei status "pending" → Zeile ist normal + beide Aktions-Buttons
//
// Props:
//   entry (object) — Ein Eintrag aus GET /api/medications/today:
//     { medicationId, medicationName, dosage, color, scheduledTime, status, takenAt }
//   onStatusChange (function) — Callback nach Statusänderung (Liste aktualisieren)

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/labs/MedicationTodayCard.css';

// ── Einnahmezeiten → Emoji-Mapping ──────────────────────────────────
const TIME_EMOJI = Object.freeze({
  morgens: '🌅',
  mittags: '☀️',
  abends:  '🌙',
  nachts:  '🌑',
});

// ── Einnahmezeit → Label ─────────────────────────────────────────────
const TIME_LABEL = Object.freeze({
  morgens: 'Morgens',
  mittags: 'Mittags',
  abends:  'Abends',
  nachts:  'Nachts',
});

export default function MedicationTodayCard({ entry, onStatusChange }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    medicationId,
    medicationName,
    dosage,
    color,
    scheduledTime,
    status,
    takenAt,
  } = entry;

  // ── Einnahme bestätigen ──────────────────────────────────────────
  // POST /api/medications/:id/take { scheduledTime }
  async function handleTake() {
    setLoading(true);
    try {
      const res = await fetch(`/api/medications/${medicationId}/take`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scheduledTime }),
      });
      if (!res.ok) throw new Error('Fehler beim Bestätigen');
      onStatusChange?.();
    } catch (err) {
      console.error('Einnahme bestätigen fehlgeschlagen:', err);
    } finally {
      setLoading(false);
    }
  }

  // ── Einnahme überspringen ────────────────────────────────────────
  // POST /api/medications/:id/skip { scheduledTime }
  async function handleSkip() {
    setLoading(true);
    try {
      const res = await fetch(`/api/medications/${medicationId}/skip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scheduledTime }),
      });
      if (!res.ok) throw new Error('Fehler beim Überspringen');
      onStatusChange?.();
    } catch (err) {
      console.error('Einnahme überspringen fehlgeschlagen:', err);
    } finally {
      setLoading(false);
    }
  }

  // ── Zeitstempel der Einnahme formatieren ─────────────────────────
  // "2026-03-19T07:15:00Z" → "07:15 Uhr"
  function formatTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' Uhr';
  }

  // CSS-Klasse basierend auf Status
  const statusClass = `medication-today-card--${status}`;

  return (
    <div className={`medication-today-card ${statusClass}`} style={{ '--med-color': color }}>
      {/* ── Farbiger Punkt (Medikament-Farbe) ─────────────────────── */}
      <div className="medication-today-card__dot" aria-hidden="true" />

      {/* ── Info: Name + Dosierung + Zeit ─────────────────────────── */}
      <div className="medication-today-card__info">
        <span className="medication-today-card__name">
          {medicationName}
          <span className="medication-today-card__dosage"> {dosage}</span>
        </span>
        <span className="medication-today-card__time">
          {TIME_EMOJI[scheduledTime] || '💊'} {TIME_LABEL[scheduledTime] || scheduledTime}
        </span>
      </div>

      {/* ── Status-Anzeige / Aktions-Buttons ──────────────────────── */}
      <div className="medication-today-card__actions">
        {status === 'taken' && (
          <span className="medication-today-card__status medication-today-card__status--taken">
            ✅ {formatTime(takenAt)}
          </span>
        )}

        {status === 'skipped' && (
          <span className="medication-today-card__status medication-today-card__status--skipped">
            ⏭️ Übersprungen
          </span>
        )}

        {status === 'pending' && (
          <>
            <button
              className="medication-today-card__btn medication-today-card__btn--take"
              onClick={handleTake}
              disabled={loading}
              title="Einnahme bestätigen"
            >
              ✅
            </button>
            <button
              className="medication-today-card__btn medication-today-card__btn--skip"
              onClick={handleSkip}
              disabled={loading}
              title="Einnahme überspringen"
            >
              ⏭️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
