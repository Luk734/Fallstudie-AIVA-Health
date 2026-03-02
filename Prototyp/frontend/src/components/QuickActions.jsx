// src/components/QuickActions.jsx — Schnellzugriff-Buttons (US-10, US-12 Refactor)
//
// Zeigt zwei prominente Buttons auf dem Dashboard:
//   1. "Check-in starten" → /coach   (AIVA Coach Modul)
//   2. "Termin buchen"    → /care    (AIVA Care Modul)
//
// US-12 Refactor:
//   Vorher: Eigene <button> mit komplettem CSS (padding, border-radius,
//           font-weight, cursor, transition) — alles dupliziert mit Button.
//           Außerdem hardcodierte Hover-Farben (#15803d, #1d4ed8) statt
//           Design Tokens → Verstoß gegen Token-Regel.
//   Nachher: <Button> liefert die Basis, CSS-Override nur für Modul-Farben.
//           Hover-Farben nutzen jetzt filter:brightness() statt Hardcodes.

import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import '../styles/components/QuickActions.css';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions" aria-label="Schnellzugriff">
      {/* Button liefert: padding, border-radius, font-weight, cursor, transition */}
      {/* CSS-Override liefert: Modul-spezifische Hintergrundfarbe + scale-Effekt */}
      <Button
        className="quick-action--coach"
        onClick={() => navigate('/coach')}
        fullWidth
      >
        <span className="quick-action__icon" aria-hidden="true">💚</span>
        Check-in starten
      </Button>

      <Button
        className="quick-action--care"
        onClick={() => navigate('/care')}
        fullWidth
      >
        <span className="quick-action__icon" aria-hidden="true">📅</span>
        Termin buchen
      </Button>
    </section>
  );
}
