// src/components/SummaryCard.jsx — Generische Übersichtskarte (US-10, TASK-39)
//
// Diese Komponente ist WIEDERVERWENDBAR — sie kann überall eingesetzt werden,
// wo eine kompakte Information mit Icon, Titel und Inhalt dargestellt werden soll.
//
// Auf dem Dashboard wird sie 3× verwendet:
//   1. Nächster Termin (AIVA Care)      → variant="care"
//   2. Täglicher Check-in (AIVA Coach)  → variant="coach"
//   3. Nächste Einnahme (AIVA Labs)     → variant="labs"
//
// Props erklärt:
//   icon        (string)   — Emoji oder Symbol, z.B. "📅"
//   title       (string)   — Überschrift der Karte, z.B. "Nächster Termin"
//   children    (ReactNode)— Beliebiger Inhalt innerhalb der Karte
//   actionLabel (string?)  — Optionaler Button-Text, z.B. "Anzeigen"
//   onAction    (function?)— Optionaler Klick-Handler für den Button
//   variant     (string?)  — Optionale Farbvariante: "care" | "coach" | "labs"
//                            Steuert die Akzentfarbe des linken Randes.
//                            Wenn nicht angegeben → Standard-Blau.
//
// Children-Pattern:
//   In React kann man beliebigen Inhalt ZWISCHEN die öffnenden und schließenden
//   Tags einer Komponente schreiben. Dieser Inhalt kommt als `children` Prop an:
//     <SummaryCard icon="📅" title="Termin">
//       <p>Dr. Müller — 10:00 Uhr</p>     ← das ist children
//     </SummaryCard>

import '../styles/components/SummaryCard.css';

export default function SummaryCard({ icon, title, children, actionLabel, onAction, variant }) {
  // CSS-Klasse dynamisch zusammenbauen:
  // Basis: "summary-card"
  // Mit Variante: "summary-card summary-card--care"
  // Die Variante steuert die Akzentfarbe (siehe CSS).
  const cardClass = `summary-card${variant ? ` summary-card--${variant}` : ''}`;

  return (
    <article className={cardClass}>
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
      {/* Wird NUR gerendert wenn actionLabel angegeben ist.           */}
      {/* Das && Pattern: Wenn links true → rechts rendern, sonst nix. */}
      {actionLabel && (
        <div className="summary-card__footer">
          <button className="summary-card__action" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      )}
    </article>
  );
}
