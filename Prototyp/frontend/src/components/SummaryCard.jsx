// src/components/SummaryCard.jsx — Generische Übersichtskarte (US-10, TASK-39, US-12 Refactor)
//
// Diese Komponente ist WIEDERVERWENDBAR — sie kann überall eingesetzt werden,
// wo eine kompakte Information mit Icon, Titel und Inhalt dargestellt werden soll.
//
// Auf dem Dashboard wird sie 3× verwendet:
//   1. Nächster Termin (AIVA Care)      → variant="care"
//   2. Täglicher Check-in (AIVA Coach)  → variant="coach"
//   3. Nächste Einnahme (AIVA Labs)     → variant="labs"
//
// US-12 Refactor:
//   Vorher: Eigenes CSS für background, border-radius, box-shadow, padding,
//           border-left, hover-Effekt, Button-Styling (~50 Zeilen dupliziert).
//   Nachher: <Card> liefert die Karten-Basis, <Button> den Action-Button.
//   SummaryCard bleibt als Feature-Komponente (Header/Footer/Icon-Logik),
//   nutzt aber intern die UI-Primitives statt eigenes CSS.
//
// Props erklärt:
//   icon        (string)   — Emoji oder Symbol, z.B. "📅"
//   title       (string)   — Überschrift der Karte, z.B. "Nächster Termin"
//   children    (ReactNode)— Beliebiger Inhalt innerhalb der Karte
//   actionLabel (string?)  — Optionaler Button-Text, z.B. "Anzeigen"
//   onAction    (function?)— Optionaler Klick-Handler für den Button
//   variant     (string?)  — Optionale Farbvariante: "care" | "coach" | "labs"
//                            Wird als accent-Prop an Card weitergereicht.

import Card from './ui/Card';
import Button from './ui/Button';
import '../styles/components/SummaryCard.css';

export default function SummaryCard({ icon, title, children, actionLabel, onAction, variant }) {
  return (
    // Card liefert: background, border-radius, box-shadow, padding, accent, hover
    // → Kein eigenes CSS mehr für diese Basis-Eigenschaften nötig.
    <Card
      as="article"
      accent={variant}       // "care" → blauer Akzent-Rand links
      hoverable              // Leichter Schatten + Anheben bei Hover
      padding="md"            // 24px Innenabstand
      shadow="md"             // Mittlerer Schatten
      className="summary-card"
    >
      {/* ── Kopfzeile: Icon + Titel ────────────────────────────────── */}
      <div className="summary-card__header">
        <span className="summary-card__icon" aria-hidden="true">{icon}</span>
        <h2 className="summary-card__title">{title}</h2>
      </div>

      {/* ── Inhalt: Beliebiger Content via children ────────────────── */}
      <div className="summary-card__body">
        {children}
      </div>

      {/* ── Optionaler Action-Button ───────────────────────────────── */}
      {/* Button variant="secondary" ersetzt die eigene .summary-card__action */}
      {actionLabel && (
        <div className="summary-card__footer">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}
