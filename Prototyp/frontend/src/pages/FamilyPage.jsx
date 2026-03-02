// src/pages/FamilyPage.jsx — Platzhalter für das AIVA Family Modul (US-09)
//
// Dieses Modul wird später folgende Features enthalten:
//   - Familienkonto erstellen (US-29)
//   - Profil wechseln (US-30)
//   - Kind-Profil anlegen (US-31)
//   - U-Untersuchungen (US-32)
//   - Impfplan (US-33)
//   - Partner-Zugriff (US-34)
//
// Aktuell nur Platzhalter für die Navigation.

import './FamilyPage.css';

export default function FamilyPage() {
  return (
    <div className="family-page">
      <div className="family-container">
        <h1 className="family-heading">👨‍👩‍👧 AIVA Family</h1>
        <p className="family-description">
          Familienkonto, Kinderprofile & Partner-Zugriff — Gesundheit für die
          ganze Familie.
        </p>
        <div className="family-placeholder">
          <span className="family-placeholder-icon">🚧</span>
          <p>Dieses Modul wird in den nächsten Stories implementiert.</p>
        </div>
      </div>
    </div>
  );
}
