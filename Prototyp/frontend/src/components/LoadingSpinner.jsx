// src/components/LoadingSpinner.jsx — Vollbild-Ladeindikator
//
// Wird angezeigt während AuthContext prüft ob der gespeicherte
// JWT-Token noch gültig ist. Ohne diesen Spinner würde die App
// kurz die Login-Seite aufblitzen lassen bevor sie merkt,
// dass der User eigentlich eingeloggt ist ("Flash of unauthenticated content").

import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner-circle" />
      <p className="spinner-text">Sitzung wird geprüft…</p>
    </div>
  );
}
