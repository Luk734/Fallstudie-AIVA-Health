// src/components/labs/LabValueHistory.jsx — Mini-Verlaufsdiagramm (US-23, TASK-89)
//
// Zeigt die letzten 3 Messungen eines Laborparameters als vertikale Balken.
// Thomas kann so auf einen Blick erkennen: "Wird mein Wert besser oder schlechter?"
//
// Daten kommen vom Backend: GET /api/labs/history/:parameter
// (liefert die letzten 3 Werte desselben Parameters aus verschiedenen Befunden)
//
// Layout:
//   ┌─────────────────────────┐
//   │ 📊 Verlauf              │
//   │  ┃   ┃           ┃     │
//   │  ┃   ┃     ┃     ┃     │
//   │  ┃   ┃     ┃     ┃     │
//   │ Jan  Mär   Jun         │
//   └─────────────────────────┘
//
// Props:
//   parameter – Name des Parameters (z.B. "Hämoglobin")
//   token     – JWT-Token für den API-Aufruf

import { useState, useEffect } from 'react';
import '../../styles/components/labs/LabValueHistory.css';

// Kurzes Datum: "15.01.26"
function formatShortDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

// Status (Ampelfarbe) für CSS-Klasse bestimmen
function getBarStatus(value, min, max) {
  if (min == null || max == null) return 'unknown';
  const tolerance = (max - min) * 0.1;
  if (value < min - tolerance) return 'low';
  if (value < min) return 'borderline';
  if (value > max + tolerance) return 'high';
  if (value > max) return 'borderline';
  return 'normal';
}

export default function LabValueHistory({ parameter, token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        // Parameter-Name URL-encodieren (z.B. "GOT (AST)" → "GOT%20%28AST%29")
        const encoded = encodeURIComponent(parameter);
        const res = await fetch(`/api/labs/history/${encoded}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          // Daten kommen neueste-zuerst → für Anzeige umdrehen (älteste links)
          setHistory(data.history.reverse());
        }
      } catch {
        // Stille Fehlerbehandlung — History ist optional
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [parameter, token]);

  // Nicht anzeigen, wenn weniger als 2 Werte (kein Verlauf sichtbar)
  if (loading || history.length < 2) return null;

  // ── Balken-Höhe berechnen ──────────────────────────────────────
  // Der größte Wert bekommt 100% Höhe, die anderen proportional.
  const maxValue = Math.max(...history.map((h) => h.value));
  const minValue = Math.min(...history.map((h) => h.value));
  // Mindestens 20% Höhe, damit auch kleine Unterschiede sichtbar sind
  const valueRange = maxValue - minValue || 1;

  return (
    <div className="lab-history">
      <span className="lab-history__title">📊 Verlauf</span>
      <div className="lab-history__chart">
        {history.map((entry, i) => {
          // Balkenhöhe: Minimum 25%, Maximum 100%
          const heightPercent = 25 + ((entry.value - minValue) / valueRange) * 75;
          const status = getBarStatus(entry.value, entry.referenceMin, entry.referenceMax);

          return (
            <div key={i} className="lab-history__bar-group">
              <span className="lab-history__bar-value">{entry.value}</span>
              <div
                className={`lab-history__bar lab-history__bar--${status}`}
                style={{ height: `${heightPercent}%` }}
                title={`${entry.value} ${entry.unit} – ${entry.reportTitle}`}
              />
              <span className="lab-history__bar-date">
                {formatShortDate(entry.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
