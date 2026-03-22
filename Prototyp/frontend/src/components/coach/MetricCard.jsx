// src/components/coach/MetricCard.jsx — Generische Metriken-Karte (US-27, TASK-107)
//
// Wiederverwendbare Karte zur Anzeige einer einzelnen Gesundheitsmetrik.
// Wird 3x verwendet: Schritte, Herzfrequenz, Schlaf.
//
// Props:
//   icon    (string)  — Emoji/Icon für die Metrik (z.B. "🚶", "❤️", "😴")
//   label   (string)  — Bezeichnung (z.B. "Schritte")
//   value   (string)  — Formatierter Hauptwert (z.B. "8.432")
//   unit    (string)  — Einheit (z.B. "Schritte", "bpm", "Stunden")
//   subtext (string?) — Optionaler Zusatztext (z.B. "Min 58 · Max 142")
//   color   (string?) — Akzentfarbe für den linken Rand (CSS-Variable)

import '../../styles/components/coach/MetricCard.css';

export default function MetricCard({ icon, label, value, unit, subtext, color }) {
  return (
    <div
      className="metric-card"
      style={color ? { borderLeftColor: color } : undefined}
    >
      <div className="metric-card__icon">{icon}</div>
      <div className="metric-card__content">
        <span className="metric-card__label">{label}</span>
        <div className="metric-card__value-row">
          <span className="metric-card__value">{value}</span>
          <span className="metric-card__unit">{unit}</span>
        </div>
        {subtext && (
          <span className="metric-card__subtext">{subtext}</span>
        )}
      </div>
    </div>
  );
}
