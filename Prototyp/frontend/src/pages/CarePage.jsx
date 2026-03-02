// src/pages/CarePage.jsx — Platzhalter für das AIVA Care Modul (US-09)
//
// Dieses Modul wird später folgende Features enthalten:
//   - Terminübersicht (US-13)
//   - Termin erstellen/bearbeiten (US-15, US-16)
//   - Vorsorge-Kalender (US-17)
//   - Termin-Erinnerungen (US-18)
//
// Aktuell ist es nur ein Platzhalter, damit die Navigation
// bereits funktioniert und man zwischen den Tabs wechseln kann.

import './CarePage.css';

export default function CarePage() {
  return (
    <div className="care-page">
      <div className="care-container">
        <h1 className="care-heading">📅 AIVA Care</h1>
        <p className="care-description">
          Termine, Vorsorge & Erinnerungen — hier entsteht bald dein
          persönlicher Gesundheitskalender.
        </p>
        <div className="care-placeholder">
          <span className="care-placeholder-icon">🚧</span>
          <p>Dieses Modul wird in den nächsten Stories implementiert.</p>
        </div>
      </div>
    </div>
  );
}
