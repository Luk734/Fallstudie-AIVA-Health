// src/components/coach/WearableMetrics.jsx — Wearable-Metriken Übersicht (US-27, TASK-107)
//
// Container-Komponente, die die aktuellsten Wearable-Daten anzeigt.
// Ruft GET /api/metrics/latest auf und rendert 3 MetricCards:
//   🚶 Schritte (mit Tausender-Formatierung)
//   ❤️ Herzfrequenz (Ø + Min/Max als Subtext)
//   😴 Schlaf (Stunden + Qualitäts-Badge)
//
// Zeigt einen „Demo-Daten"-Hinweis an (Akzeptanzkriterium 4).
//
// Props:
//   refreshKey (number) — Trigger für Re-Fetch (gleiche Logik wie StreakBadge)

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from './MetricCard';
import '../../styles/components/coach/WearableMetrics.css';

// ── Schlafqualität übersetzen ─────────────────────────────────────
// Die DB speichert englische Werte, wir zeigen deutsche Labels.
const SLEEP_QUALITY_LABELS = {
  poor: 'Schlecht',
  fair: 'Mäßig',
  good: 'Gut',
  excellent: 'Sehr gut',
};

export default function WearableMetrics({ refreshKey }) {
  const { token } = useAuth();
  const [metric, setMetric] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Metriken vom Backend laden ───────────────────────────────────
  // Wird beim Mount UND wenn refreshKey sich ändert erneut aufgerufen.
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/metrics/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMetric(data.metric);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Wearable-Metriken:', err);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchMetrics();
  }, [token, refreshKey]);

  // ── Loading-Zustand ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="wearable-metrics">
        <h2 className="wearable-metrics__heading">⌚ Wearable-Daten</h2>
        <p className="wearable-metrics__loading">Lade Daten…</p>
      </div>
    );
  }

  // ── Keine Daten vorhanden ────────────────────────────────────────
  if (!metric) {
    return (
      <div className="wearable-metrics">
        <h2 className="wearable-metrics__heading">⌚ Wearable-Daten</h2>
        <p className="wearable-metrics__empty">
          Noch keine Wearable-Daten verfügbar. Die Daten werden täglich
          automatisch aktualisiert.
        </p>
      </div>
    );
  }

  // ── Werte formatieren ────────────────────────────────────────────
  // Schritte mit Tausender-Punkt (z.B. 8432 → "8.432")
  const stepsFormatted = metric.steps.toLocaleString('de-DE');

  // Schlafqualitäts-Label (deutsch)
  const sleepLabel = SLEEP_QUALITY_LABELS[metric.sleepQuality] || metric.sleepQuality;

  // Datum formatieren (für den Untertitel)
  const dateFormatted = new Date(metric.date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="wearable-metrics">
      <h2 className="wearable-metrics__heading">⌚ Wearable-Daten</h2>
      <p className="wearable-metrics__date">Daten vom {dateFormatted}</p>

      <div className="wearable-metrics__grid">
        {/* ── Schritte ──────────────────────────────────────────── */}
        <MetricCard
          icon="🚶"
          label="Schritte"
          value={stepsFormatted}
          unit="Schritte"
          color="var(--color-coach)"
        />

        {/* ── Herzfrequenz ──────────────────────────────────────── */}
        <MetricCard
          icon="❤️"
          label="Herzfrequenz"
          value={`Ø ${metric.heartRateAvg}`}
          unit="bpm"
          subtext={`Min ${metric.heartRateMin} · Max ${metric.heartRateMax}`}
          color="var(--color-coral)"
        />

        {/* ── Schlaf ────────────────────────────────────────────── */}
        <MetricCard
          icon="😴"
          label="Schlaf"
          value={`${metric.sleepHours}`}
          unit="Stunden"
          subtext={`Qualität: ${sleepLabel}`}
          color="var(--color-primary)"
        />
      </div>

      {/* ── Demo-Hinweis (Akzeptanzkriterium 4) ─────────────────── */}
      <div className="wearable-metrics__demo-hint">
        <span className="wearable-metrics__demo-icon">ℹ️</span>
        <span>Demo-Daten – echte Wearable-Integration folgt in einer späteren Version.</span>
      </div>
    </div>
  );
}
