// src/components/labs/LabValueGauge.jsx — Ampel-Skala für Laborwerte (US-23, TASK-88)
//
// Zeigt einen Laborwert als horizontale Skala mit farbigen Zonen:
//   🔴 Rot (links)  → deutlich unter Referenzbereich
//   🟡 Gelb         → knapp unter Referenzbereich (innerhalb 10% Toleranz)
//   🟢 Grün (Mitte) → im Normalbereich
//   🟡 Gelb         → knapp über Referenzbereich (innerhalb 10% Toleranz)
//   🔴 Rot (rechts) → deutlich über Referenzbereich
//
// Ein dreieckiger Pfeil-Marker (▼) zeigt die Position des aktuellen Werts.
// Unter der Skala steht ein Erklärungstext aus labExplanations.json.
//
// Props:
//   value        – der gemessene Wert (z.B. 14.2)
//   min          – untere Grenze Referenzbereich (z.B. 12.0)
//   max          – obere Grenze Referenzbereich (z.B. 16.0)
//   unit         – Einheit (z.B. "g/dL")
//   parameter    – Name des Parameters (z.B. "Hämoglobin")
//   explanation  – Objekt aus labExplanations.json { description, lowHint, highHint }

import './LabValueGauge.css';

export default function LabValueGauge({ value, min, max, unit, parameter, explanation }) {
  // Wenn keine Referenzwerte vorhanden → kein Gauge möglich
  if (min == null || max == null) {
    return (
      <div className="lab-gauge lab-gauge--unknown">
        <span className="lab-gauge__no-ref">Kein Referenzbereich verfügbar</span>
      </div>
    );
  }

  // ── Status berechnen ─────────────────────────────────────────────
  // Toleranzzone: 10% des Referenzbereichs als "Grenzwertig" (Gelb)
  const range = max - min;
  const tolerance = range * 0.1;

  let status = 'normal';
  if (value < min - tolerance) status = 'low';
  else if (value < min) status = 'borderline-low';
  else if (value > max + tolerance) status = 'high';
  else if (value > max) status = 'borderline-high';

  // ── Pfeil-Position berechnen ─────────────────────────────────────
  // Die Skala reicht von (min - 20% des range) bis (max + 20% des range).
  // So hat der Pfeil auch bei Werten außerhalb des Bereichs Platz.
  const scaleMin = min - range * 0.2;
  const scaleMax = max + range * 0.2;
  const scaleRange = scaleMax - scaleMin;

  // Position in Prozent (0% = ganz links, 100% = ganz rechts)
  // Clamp zwischen 2% und 98%, damit der Pfeil nicht abgeschnitten wird
  let position = ((value - scaleMin) / scaleRange) * 100;
  position = Math.max(2, Math.min(98, position));

  // ── Ampel-Emoji für schnelle Erkennung ───────────────────────────
  const statusEmoji = {
    'low': '🔴',
    'borderline-low': '🟡',
    'normal': '🟢',
    'borderline-high': '🟡',
    'high': '🔴',
  }[status];

  const statusLabel = {
    'low': 'Zu niedrig',
    'borderline-low': 'Grenzwertig niedrig',
    'normal': 'Im Normalbereich',
    'borderline-high': 'Grenzwertig hoch',
    'high': 'Zu hoch',
  }[status];

  // ── Hinweistext basierend auf Status ─────────────────────────────
  let hint = null;
  if (explanation) {
    if (status === 'low' || status === 'borderline-low') {
      hint = explanation.lowHint;
    } else if (status === 'high' || status === 'borderline-high') {
      hint = explanation.highHint;
    }
  }

  return (
    <div className={`lab-gauge lab-gauge--${status}`}>
      {/* ── Status-Zeile: Emoji + Label ─────────────────────────────── */}
      <div className="lab-gauge__status-row">
        <span className="lab-gauge__emoji">{statusEmoji}</span>
        <span className="lab-gauge__status-label">{statusLabel}</span>
      </div>

      {/* ── Skala mit farbigen Zonen ────────────────────────────────── */}
      <div className="lab-gauge__scale">
        {/* Rote Zone links (unter Referenz) */}
        <div className="lab-gauge__zone lab-gauge__zone--low" />
        {/* Gelbe Zone links (Grenzbereich) */}
        <div className="lab-gauge__zone lab-gauge__zone--borderline-low" />
        {/* Grüne Zone (Normalbereich) */}
        <div className="lab-gauge__zone lab-gauge__zone--normal" />
        {/* Gelbe Zone rechts (Grenzbereich) */}
        <div className="lab-gauge__zone lab-gauge__zone--borderline-high" />
        {/* Rote Zone rechts (über Referenz) */}
        <div className="lab-gauge__zone lab-gauge__zone--high" />

        {/* Pfeil-Marker an der berechneten Position */}
        <div
          className="lab-gauge__marker"
          style={{ left: `${position}%` }}
          title={`${value} ${unit}`}
        >
          <span className="lab-gauge__marker-arrow">▼</span>
          <span className="lab-gauge__marker-value">{value}</span>
        </div>
      </div>

      {/* ── Referenzbereich-Beschriftung ─────────────────────────────── */}
      <div className="lab-gauge__ref-labels">
        <span className="lab-gauge__ref-min">{min} {unit}</span>
        <span className="lab-gauge__ref-label">Referenzbereich</span>
        <span className="lab-gauge__ref-max">{max} {unit}</span>
      </div>

      {/* ── Erklärungstext (aus labExplanations.json) ────────────────── */}
      {explanation && (
        <div className="lab-gauge__explanation">
          <p className="lab-gauge__description">
            ℹ️ {explanation.description}
          </p>
          {hint && (
            <p className="lab-gauge__hint">
              💡 {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
