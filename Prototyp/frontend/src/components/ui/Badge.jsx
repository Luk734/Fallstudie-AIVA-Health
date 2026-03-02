// src/components/ui/Badge.jsx — Wiederverwendbare Badge-Komponente (US-12, TASK-45)
//
// WARUM diese Komponente?
//   Bisher waren Badges in ConsentPage und PrivacySettingsPage dupliziert:
//     <span className="consent-badge consent-badge-required">Pflicht</span>
//     <span className="privacy-badge privacy-badge-required">Pflicht</span>
//   Identischer CSS-Code an 2 Stellen. Mit dieser Komponente:
//     <Badge variant="required">Pflicht</Badge>
//     <Badge variant="optional">Optional</Badge>
//
// VERWENDUNG:
//   <Badge variant="required">Pflicht</Badge>    → Rotes Badge
//   <Badge variant="optional">Optional</Badge>   → Grünes Badge
//   <Badge variant="info">Neu</Badge>            → Blaues Badge
//   <Badge variant="warning">Ausstehend</Badge>  → Gelbes Badge
//
// PROPS erklärt:
//   variant   (string)    — Farbvariante: 'required' | 'optional' | 'info' | 'warning'
//   children  (ReactNode) — Der Text des Badges (z.B. "Pflicht", "Optional")
//   className (string)    — Optionale zusätzliche CSS-Klassen

import '../../styles/components/ui/Badge.css';

export default function Badge({
  variant = 'info',         // Standard: blaues Info-Badge
  children,                 // Der Text (z.B. "Pflicht")
  className = '',           // Optionale zusätzliche Klassen
}) {
  const classes = [
    'badge',
    `badge--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
}
