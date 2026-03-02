// src/components/ui/Spinner.jsx — Wiederverwendbare Spinner-Komponente (US-12, TASK-46)
//
// WARUM diese Komponente?
//   Der bestehende LoadingSpinner (src/components/LoadingSpinner.jsx) ist
//   NUR für den Vollbild-Ladescreen gedacht (100vh Overlay).
//   Aber wir brauchen Spinner auch:
//     - In Buttons ("Wird gespeichert..." + Drehanimation)
//     - In Karten (Daten werden geladen)
//     - In Seitenabschnitten (nicht die ganze Seite)
//
//   Der neue Spinner ist INLINE-FÄHIG mit wählbarer Größe.
//   Der alte LoadingSpinner bleibt für den Auth-Check bestehen (ändert sich nicht).
//
// VERWENDUNG:
//   <Spinner />                       → Standard (md, 32px)
//   <Spinner size="sm" />             → Klein (20px, z.B. in Buttons)
//   <Spinner size="lg" />             → Groß (48px, z.B. Seitenlade-Zustand)
//   <Spinner size="md" label="Profil wird geladen..." />  → Mit lesbarem Text
//
// PROPS erklärt:
//   size     (string)  — Größe des Spinners: 'sm' | 'md' | 'lg'
//   label    (string)  — Optionaler Text unter dem Spinner
//   className(string)  — Optionale zusätzliche CSS-Klassen
//
// ACCESSIBILITY:
//   role="status" teilt Screenreadern mit: "Hier passiert gerade etwas."
//   aria-label="Wird geladen" spricht den Spinner laut vor.
//   Der visuelle Text (label) ist optional — aria-label stellt sicher,
//   dass auch ohne Text der Zweck klar ist.

import '../../styles/components/ui/Spinner.css';

export default function Spinner({
  size = 'md',                    // Standard-Größe: medium (32px)
  label,                          // Optionaler Text (z.B. "Wird geladen...")
  className = '',                 // Zusätzliche CSS-Klassen
}) {
  const classes = [
    'spinner',
    `spinner--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="status" aria-label={label || 'Wird geladen'}>
      {/* ── Der drehende Kreis ──────────────────────────────────────── */}
      {/* Ein leerer <div> der per CSS als Kreis mit animierter Border  */}
      {/* dargestellt wird. aria-hidden="true" weil es rein dekorativ ist. */}
      <div className="spinner__circle" aria-hidden="true" />

      {/* ── Optionaler Text ─────────────────────────────────────────── */}
      {label && <p className="spinner__label">{label}</p>}
    </div>
  );
}
