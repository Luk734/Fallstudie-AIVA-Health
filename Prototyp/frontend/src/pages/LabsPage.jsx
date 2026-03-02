// src/pages/LabsPage.jsx — Platzhalter für das AIVA Labs Modul (US-09)
//
// Dieses Modul wird später folgende Features enthalten:
//   - Laborbefunde anzeigen (US-22)
//   - Laborwert verstehen / Referenzbereiche (US-23)
//   - Medikamenten-Liste (US-19)
//   - Medikamenten-Erinnerung (US-21)
//
// Aktuell nur Platzhalter für die Navigation.

import './LabsPage.css';

export default function LabsPage() {
  return (
    <div className="labs-page">
      <div className="labs-container">
        <h1 className="labs-heading">🔬 AIVA Labs</h1>
        <p className="labs-description">
          Laborbefunde, Medikamente & Interaktionsprüfung — dein digitales
          Gesundheitslabor.
        </p>
        <div className="labs-placeholder">
          <span className="labs-placeholder-icon">🚧</span>
          <p>Dieses Modul wird in den nächsten Stories implementiert.</p>
        </div>
      </div>
    </div>
  );
}
