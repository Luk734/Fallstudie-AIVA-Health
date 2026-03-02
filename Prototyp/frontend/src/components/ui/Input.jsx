// src/components/ui/Input.jsx — Wiederverwendbare Input-Komponente (US-12, TASK-43)
//
// WARUM diese Komponente?
//   Bisher waren Label und Input immer getrennt:
//     <label className="login-label">E-Mail</label>
//     <input className="login-input" ... />
//   Das hat 2 Probleme:
//   1. CSS war dupliziert (login-label ≡ profile-label, login-input ≡ profile-input)
//   2. Kein htmlFor/id-Verknüpfung → schlecht für Screenreader (Accessibility)
//
//   Diese Komponente fasst Label + Input + optionale Fehlermeldung zusammen:
//     <Input label="E-Mail" type="email" error="Ungültige E-Mail" ... />
//
// VERWENDUNG:
//   <Input
//     label="Vorname"          — Text über dem Eingabefeld
//     required                 — Zeigt rotes * neben dem Label
//     error="Pflichtfeld"      — Roter Rahmen + Fehlermeldung unter dem Feld
//     value={name}             — Kontrollierter Wert (React-State)
//     onChange={(e) => set(e.target.value)}
//   />
//
// PROPS erklärt:
//   label     (string)    — Beschriftung über dem Eingabefeld
//   error     (string)    — Fehlermeldung (wenn vorhanden: roter Rahmen + Text)
//   required  (boolean)   — Zeigt rotes * neben dem Label UND setzt HTML required
//   id        (string)    — Optionale explizite ID; wird automatisch generiert wenn nicht angegeben
//   className (string)    — Optionale zusätzliche CSS-Klasse für den Wrapper
//   ...rest   — Alle weiteren Props gehen an das <input>-Element
//               (type, value, onChange, placeholder, disabled, min, max, etc.)
//
// ACCESSIBILITY:
//   - <label htmlFor={id}> verknüpft Label mit Input → Screenreader lesen das Label vor
//   - aria-invalid="true" bei Fehlern → Screenreader melden "ungültige Eingabe"
//   - aria-describedby → verknüpft die Fehlermeldung mit dem Input

import { useId } from 'react';
import '../../styles/components/ui/Input.css';

export default function Input({
  label,                        // Beschriftung über dem Feld
  error,                        // Fehlermeldung (optional)
  required = false,             // Pflichtfeld-Markierung
  id: externalId,               // Optionale explizite ID
  className = '',               // Zusätzliche CSS-Klassen
  ...rest                       // type, value, onChange, placeholder, etc.
}) {
  // ── useId(): React 18+ Hook für eindeutige IDs ──────────────────────
  //
  // WARUM?
  //   Jedes <input> braucht eine einzigartige ID, damit <label htmlFor>
  //   es finden kann. Aber wenn wir die ID manuell setzen müssten
  //   (z.B. id="vorname"), könnten Duplikate entstehen wenn die
  //   Komponente mehrfach auf einer Seite verwendet wird.
  //
  //   useId() generiert automatisch eine einzigartige ID pro Instanz:
  //   ":r0:", ":r1:", ":r2:", etc.
  //   So kann man <Input> beliebig oft verwenden ohne ID-Konflikte.
  //
  // Falls eine explizite ID von außen übergeben wird (externalId),
  // nutzen wir diese stattdessen.
  const generatedId = useId();
  const inputId = externalId || generatedId;

  // ── Error-ID für aria-describedby ────────────────────────────────────
  // Wenn ein Fehler vorhanden ist, verknüpfen wir die Fehlermeldung
  // über aria-describedby mit dem Input. So liest ein Screenreader:
  // "Vorname, Textfeld, Pflichtfeld, ungültige Eingabe, Bitte Vorname eingeben"
  const errorId = `${inputId}-error`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`.trim()}>
      {/* ── Label ──────────────────────────────────────────────────────── */}
      {/* htmlFor={inputId} verknüpft das Label mit dem Input.             */}
      {/* Klick auf das Label fokussiert automatisch das Eingabefeld.      */}
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}

      {/* ── Eingabefeld ────────────────────────────────────────────────── */}
      {/* ...rest enthält type, value, onChange, placeholder, etc.          */}
      {/* Bei einem Fehler: roter Rahmen (via CSS) + aria-invalid          */}
      <input
        id={inputId}
        className="input-group__field"
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />

      {/* ── Fehlermeldung ──────────────────────────────────────────────── */}
      {/* Wird nur gerendert wenn `error` einen nicht-leeren String enthält */}
      {error && (
        <p id={errorId} className="input-group__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
