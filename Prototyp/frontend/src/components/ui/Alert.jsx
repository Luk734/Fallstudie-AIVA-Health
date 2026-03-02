// src/components/ui/Alert.jsx — Wiederverwendbare Alert-Komponente (US-12, TASK-47)
//
// WARUM diese Komponente?
//   JEDE Seite hat eigene Error/Success-Meldungen mit identischem CSS:
//     LoginPage:           .login-error          (rot)
//     ConsentPage:         .consent-error         (rot)
//     ProfilePage:         .profile-error + .profile-success (rot + grün)
//     PrivacySettingsPage: .privacy-error + .privacy-success (rot + grün)
//     ConsentPage:         .consent-info          (blau)
//   → 7 Instanzen mit dupliziertem CSS (~42 Zeilen).
//
//   Mit dieser Komponente:
//     {error && <Alert variant="error">{error}</Alert>}
//     {success && <Alert variant="success">{success}</Alert>}
//
// VERWENDUNG:
//   <Alert variant="error">Server nicht erreichbar.</Alert>
//   <Alert variant="success">Profil gespeichert!</Alert>
//   <Alert variant="info">Du kannst deine Einwilligung jederzeit widerrufen.</Alert>
//   <Alert variant="warning">Deine Sitzung läuft bald ab.</Alert>
//
// PROPS erklärt:
//   variant   (string)    — Typ: 'error' | 'success' | 'info' | 'warning'
//   children  (ReactNode) — Der Inhalt der Meldung
//   className (string)    — Optionale zusätzliche CSS-Klassen
//
// ACCESSIBILITY:
//   role="alert" teilt Screenreadern sofort mit: "Achtung, wichtige Meldung!"
//   Screenreader lesen Inhalte mit role="alert" AUTOMATISCH vor,
//   auch wenn der User gerade in einem Formularfeld tippt.
//   Das nennt man eine "Live Region" — ideal für Fehler und Erfolgs-Meldungen.

import '../../styles/components/ui/Alert.css';

// ── Icons pro Variante ────────────────────────────────────────────────────
// Emoji-basiert (kein Icon-Library nötig für den MVP).
// object.freeze() verhindert versehentliche Änderungen zur Laufzeit.
const ICONS = Object.freeze({
  error:   '⚠️',
  success: '✅',
  info:    'ℹ️',
  warning: '⚡',
});

export default function Alert({
  variant = 'info',           // Standard: blaues Info-Alert
  children,                   // Der Meldungstext
  className = '',             // Optionale zusätzliche Klassen
}) {
  const classes = [
    'alert',
    `alert--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="alert">
      {/* ── Icon: Visueller Indikator ────────────────────────────────── */}
      {/* aria-hidden="true" weil das Emoji nur dekorativ ist.            */}
      {/* Der Screenreader liest stattdessen den Text (children).         */}
      <span className="alert__icon" aria-hidden="true">
        {ICONS[variant]}
      </span>

      {/* ── Inhalt: Die eigentliche Meldung ──────────────────────────── */}
      <div className="alert__content">
        {children}
      </div>
    </div>
  );
}
