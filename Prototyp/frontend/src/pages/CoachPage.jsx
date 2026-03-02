// src/pages/CoachPage.jsx — Platzhalter für das AIVA Coach Modul (US-09)
//
// Dieses Modul wird später folgende Features enthalten:
//   - Befinden-Check-in (US-24)
//   - Check-in-Verlauf (US-25)
//   - Tages-Empfehlung (US-26)
//   - Wearable-Metriken (US-27)
//   - Metriken-Dashboard (US-28)
//
// Aktuell nur Platzhalter für die Navigation.

import './CoachPage.css';

export default function CoachPage() {
  return (
    <div className="coach-page">
      <div className="coach-container">
        <h1 className="coach-heading">💪 AIVA Coach</h1>
        <p className="coach-description">
          Tägliches Check-in, KI-Empfehlungen & Wearable-Daten — dein
          persönlicher Gesundheitscoach.
        </p>
        <div className="coach-placeholder">
          <span className="coach-placeholder-icon">🚧</span>
          <p>Dieses Modul wird in den nächsten Stories implementiert.</p>
        </div>
      </div>
    </div>
  );
}
