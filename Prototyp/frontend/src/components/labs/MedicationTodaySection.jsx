// src/components/labs/MedicationTodaySection.jsx — Tages-Übersicht (US-20)
//
// Zeigt die heutigen Einnahmen als kompakte Sektion an:
//   1. Fortschritts-Balken: "3 von 5 Einnahmen (60%)"
//   2. Einnahme-Zeilen gruppiert nach Tageszeit (Morgens → Nachts)
//   3. Leerer Zustand: "Keine Einnahmen für heute 🎉"
//
// Wird von LabsPage als erste Sektion eingebunden.
// Lädt die Daten selbstständig per GET /api/medications/today.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import MedicationTodayCard from './MedicationTodayCard';
import '../../styles/components/labs/MedicationTodaySection.css';

// ── Tageszeiten-Gruppierung ──────────────────────────────────────────
// Wir gruppieren die Einnahmen nach Tageszeit und zeigen jede Gruppe
// mit einer Überschrift an: "🌅 Morgens", "☀️ Mittags" etc.
const TIME_GROUPS = [
  { key: 'morgens', label: 'Morgens',  emoji: '🌅' },
  { key: 'mittags', label: 'Mittags',  emoji: '☀️' },
  { key: 'abends',  label: 'Abends',   emoji: '🌙' },
  { key: 'nachts',  label: 'Nachts',   emoji: '🌑' },
];

export default function MedicationTodaySection() {
  const { token } = useAuth();

  const [data, setData] = useState(null);       // API-Response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Daten laden: GET /api/medications/today ─────────────────────────
  const fetchToday = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/medications/today', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Einnahmen konnten nicht geladen werden.');

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  // ── Callback: Status geändert → Daten neu laden ────────────────────
  // Wird von MedicationTodayCard aufgerufen nach take/skip.
  function handleStatusChange() {
    fetchToday();
  }

  // ── Loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="medication-today">
        <div className="medication-today__spinner">
          <Spinner size="md" />
        </div>
      </section>
    );
  }

  // ── Fehler ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="medication-today">
        <Alert variant="error">{error}</Alert>
      </section>
    );
  }

  // ── Keine Medikamente → kein Abschnitt anzeigen ────────────────────
  if (!data || data.entries.length === 0) {
    return null;
  }

  const { progress, entries } = data;

  // ── Einnahmen nach Tageszeit gruppieren ─────────────────────────────
  // Ergebnis: { morgens: [entry, entry], abends: [entry] }
  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.scheduledTime]) {
      grouped[entry.scheduledTime] = [];
    }
    grouped[entry.scheduledTime].push(entry);
  }

  return (
    <section className="medication-today">
      {/* ── Header: Titel + Datum ──────────────────────────────────── */}
      <div className="medication-today__header">
        <h2 className="medication-today__title">📋 Heutige Einnahmen</h2>
        <span className="medication-today__date">
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </div>

      {/* ── Fortschritts-Balken ────────────────────────────────────── */}
      <div className="medication-today__progress">
        <div className="medication-today__progress-bar">
          <div
            className="medication-today__progress-fill"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <span className="medication-today__progress-text">
          {progress.taken} von {progress.total} eingenommen
          {progress.percent === 100 && ' ✨'}
        </span>
      </div>

      {/* ── Gruppierte Einnahme-Zeilen ─────────────────────────────── */}
      {TIME_GROUPS.map((group) => {
        const groupEntries = grouped[group.key];
        if (!groupEntries || groupEntries.length === 0) return null;

        return (
          <div key={group.key} className="medication-today__group">
            <h3 className="medication-today__group-title">
              {group.emoji} {group.label}
            </h3>
            <div className="medication-today__group-list">
              {groupEntries.map((entry) => (
                <MedicationTodayCard
                  key={`${entry.medicationId}-${entry.scheduledTime}`}
                  entry={entry}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
