// src/components/ui/Button.jsx — Wiederverwendbare Button-Komponente (US-12, TASK-42)
//
// WARUM diese Komponente?
//   Bisher hat JEDE Seite eigene Button-Styles definiert:
//   LoginPage → .login-button, ConsentPage → .consent-submit-btn,
//   ProfilePage → .profile-save-btn + .profile-skip-btn, etc.
//   Das führt zu ~100 Zeilen dupliziertem CSS.
//   Diese Komponente zentralisiert ALLE Buttons an einer Stelle.
//
// VERWENDUNG:
//   <Button variant="primary">Speichern</Button>
//   <Button variant="secondary" size="sm">Abbrechen</Button>
//   <Button variant="ghost" onClick={handleBack}>← Zurück</Button>
//   <Button variant="danger" size="sm">Widerrufen</Button>
//   <Button variant="success" size="sm">Erteilen</Button>
//   <Button variant="primary" fullWidth loading>Wird gespeichert...</Button>
//
// PROPS erklärt:
//   variant   (string)  — Visuelle Variante: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
//   size      (string)  — Größe: 'sm' | 'md' | 'lg'
//   fullWidth (boolean) — Wenn true: Button nimmt volle Breite ein (width: 100%)
//   loading   (boolean) — Wenn true: Button zeigt Lade-Zustand (disabled + Cursor)
//   children  (ReactNode) — Der Text/Inhalt des Buttons (zwischen <Button>...</Button>)
//   ...rest   — Alle weiteren HTML-Attribute werden an das <button> weitergeleitet
//               (z.B. onClick, disabled, type, title, className)
//
// CSS-KLASSEN-SYSTEM (BEM-inspiriert):
//   .btn              — Basis-Styles (Reset, Cursor, Transition, Touch-Target)
//   .btn--primary     — Variante: Indigo-Hintergrund, weißer Text
//   .btn--secondary   — Variante: Rahmen, transparenter Hintergrund
//   .btn--ghost       — Variante: Kein Rahmen, nur Text
//   .btn--danger      — Variante: Roter Hintergrund (für Widerruf, Löschen)
//   .btn--success     — Variante: Grüner Hintergrund (für Erteilen, Bestätigen)
//   .btn--sm          — Größe: Klein (für Badges, Inline-Aktionen)
//   .btn--md          — Größe: Standard (für die meisten Buttons)
//   .btn--lg          — Größe: Groß (für Haupt-Aktionen wie Submit)
//   .btn--full-width  — Modifier: Volle Breite
//   .btn--loading     — Modifier: Lade-Zustand
//
// WCAG 2.1 AA:
//   - Minimale Touch-Target-Größe: 44×44px (via min-height im CSS)
//   - Fokus-Ring ist sichtbar (outline + box-shadow)
//   - Disabled-State hat reduzierte Opazität + cursor: not-allowed

import '../../styles/components/ui/Button.css';

export default function Button({
  variant = 'primary',    // Standard-Variante: primary (Indigo)
  size = 'md',            // Standard-Größe: medium
  fullWidth = false,      // Standard: nicht volle Breite
  loading = false,        // Standard: kein Lade-Zustand
  children,               // Der Inhalt des Buttons (Text, Icons, etc.)
  className = '',         // Optionale zusätzliche CSS-Klassen von außen
  disabled,               // HTML disabled-Attribut
  type = 'button',        // Standard: 'button' statt 'submit' (sicherer Default)
  ...rest                 // Alle anderen Props (onClick, title, aria-label, etc.)
}) {
  // ── CSS-Klassen dynamisch zusammenbauen ──────────────────────────────
  //
  // Template-Literal mit bedingter Klassen-Logik:
  //   'btn'                   → immer dabei (Basis-Styles)
  //   `btn--${variant}`       → z.B. 'btn--primary' oder 'btn--danger'
  //   `btn--${size}`          → z.B. 'btn--sm' oder 'btn--lg'
  //   'btn--full-width'       → nur wenn fullWidth === true
  //   'btn--loading'          → nur wenn loading === true
  //   className               → zusätzliche Klassen von außen
  //
  // .filter(Boolean) entfernt leere Strings und undefined-Werte
  // .join(' ') verbindet alles mit Leerzeichen zu einem CSS-Klassen-String
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    className,
  ]
    .filter(Boolean)  // Entfernt falsy-Werte (false, '', undefined, null)
    .join(' ');       // Verbindet zu: "btn btn--primary btn--md"

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}  // Auch bei loading deaktivieren
      {...rest}                        // onClick, title, aria-label, etc.
    >
      {children}
    </button>
  );
}
