// src/components/ui/Card.jsx — Wiederverwendbare Card-Komponente (US-12, TASK-44)
//
// WARUM diese Komponente?
//   Fast jede Seite hat einen "Karten"-Container:
//     - LoginPage: .login-card (Shadow + Padding + weißer Hintergrund)
//     - ConsentPage: .consent-form (gleicher Aufbau!)
//     - ProfilePage: .profile-form (gleicher Aufbau!)
//     - PrivacySettingsPage: .privacy-consent-card (+ farbiger linker Rand)
//     - SummaryCard: .summary-card (+ farbiger linker Rand)
//   Alle teilen das gleiche Grundmuster:
//     background: weiß, border-radius: 12px, box-shadow, padding.
//
// VERWENDUNG:
//   <Card>Einfache Karte mit Standardwerten</Card>
//   <Card padding="lg" shadow="lg">Große Karte</Card>
//   <Card accent="care">Karte mit blauem Akzent-Rand links</Card>
//   <Card as="form" onSubmit={handleSubmit}>Formular als Karte</Card>
//
// PROPS erklärt:
//   children   (ReactNode) — Der Inhalt der Karte
//   padding    (string)    — Innenabstand: 'sm' | 'md' | 'lg' (Standard: 'md')
//   shadow     (string)    — Schattenstärke: 'sm' | 'md' | 'lg' (Standard: 'md')
//   accent     (string)    — Farbiger linker Rand: 'care' | 'coach' | 'labs' | 'family'
//   hoverable  (boolean)   — Hover-Effekt (leichter Schatten + Anheben)
//   className  (string)    — Zusätzliche CSS-Klassen
//   as         (string)    — HTML-Element: 'div' | 'form' | 'article' | 'section'
//   ...rest    — Alle weiteren Props (onClick, onSubmit, style, etc.)

import '../../styles/components/ui/Card.css';

export default function Card({
  children,
  padding = 'md',            // Standard-Padding: mittlere Größe
  shadow = 'md',             // Standard-Schatten: mittlere Stärke
  accent,                    // Optionaler Akzent-Rand (care/coach/labs/family)
  hoverable = false,         // Standard: kein Hover-Effekt
  className = '',            // Optionale zusätzliche Klassen
  as: Element = 'div',       // Standard: <div>, kann zu <form>, <article> etc. geändert werden
  ...rest                    // onClick, onSubmit, etc.
}) {
  // ── CSS-Klassen zusammenbauen ────────────────────────────────────────
  //
  // "as: Element = 'div'" ist ein Rename beim Destructuring:
  //   Die Prop heißt "as" (wie in styled-components üblich),
  //   aber intern nennen wir sie "Element" (mit Großbuchstabe,
  //   weil React JSX-Elemente mit Großbuchstabe als Komponenten
  //   interpretiert, kleine als HTML-Tags).
  //
  //   <Card as="form"> → Element = "form" → <form className="card ...">
  const classes = [
    'card',
    `card--padding-${padding}`,
    `card--shadow-${shadow}`,
    accent && `card--accent-${accent}`,
    hoverable && 'card--hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
}
