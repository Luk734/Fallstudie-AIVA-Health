// src/components/ui/ConfirmDialog.jsx — Bestätigungsdialog (US-16, TASK-62)
//
// WARUM diese Komponente?
//   Aktionen wie "Termin stornieren" oder "Daten löschen" brauchen eine
//   Bestätigung, damit der User nicht versehentlich etwas Unwiderrufliches tut.
//   Statt window.confirm() (das nativ und nicht stylebar ist) verwenden wir
//   einen eigenen Dialog mit dem nativen HTML <dialog>-Element.
//
// VERWENDUNG:
//   <ConfirmDialog
//     open={showDialog}
//     title="Termin stornieren?"
//     message="Möchtest du diesen Termin wirklich absagen?"
//     confirmLabel="Ja, stornieren"
//     cancelLabel="Abbrechen"
//     variant="danger"
//     onConfirm={handleDelete}
//     onCancel={() => setShowDialog(false)}
//     loading={deleting}
//   />
//
// PROPS erklärt:
//   open          (boolean)  — Ob der Dialog sichtbar ist
//   title         (string)   — Überschrift (z.B. "Termin stornieren?")
//   message       (string)   — Beschreibung / Warnung
//   confirmLabel  (string)   — Text für den Bestätigungs-Button
//   cancelLabel   (string)   — Text für den Abbrechen-Button
//   variant       (string)   — 'danger' | 'primary' für den Bestätigungs-Button
//   onConfirm     (function) — Callback wenn User bestätigt
//   onCancel      (function) — Callback wenn User abbricht
//   loading       (boolean)  — Lade-Zustand für den Bestätigungs-Button
//
// ACCESSIBILITY (WCAG 2.1 AA):
//   - Nutzt das native <dialog>-Element (eingebauter Focus-Trap)
//   - ESC-Taste schließt den Dialog automatisch (Browser-Standard)
//   - aria-labelledby + aria-describedby für Screen-Reader
//   - Fokus geht automatisch auf den Dialog (autofocus not needed with showModal)

import { useRef, useEffect } from 'react';
import Button from './Button';
import '../../styles/components/ui/ConfirmDialog.css';

export default function ConfirmDialog({
  open = false,
  title = 'Bestätigung',
  message = 'Bist du sicher?',
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}) {
  // ── Referenz auf das <dialog>-Element ─────────────────────────────────
  const dialogRef = useRef(null);

  // ── Dialog öffnen/schließen basierend auf open-Prop ───────────────────
  // showModal() öffnet den Dialog als Modal:
  //   - Automatischer Focus-Trap (Tab-Taste bleibt im Dialog)
  //   - Hintergrund wird mit ::backdrop verdunkelt
  //   - ESC-Taste schließt den Dialog (Browser-natives Verhalten)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // ── Klick auf Backdrop schließt den Dialog ────────────────────────────
  // Das native <dialog>-Element sendet ein "click"-Event, wenn man auf
  // den Backdrop (::backdrop) klickt. Wir nutzen das, um den Dialog
  // bei Klick außerhalb zu schließen — genau wie man es von Modals kennt.
  function handleDialogClick(e) {
    // Nur wenn direkt auf den Dialog (= Backdrop) geklickt wurde,
    // nicht wenn auf den Inhalt geklickt wurde.
    if (e.target === dialogRef.current) {
      onCancel?.();
    }
  }

  // ── ESC-Taste abfangen ────────────────────────────────────────────────
  // Der Browser schließt <dialog> automatisch bei ESC.
  // Wir müssen aber auch unseren React-State synchron halten (onCancel).
  function handleCancel(e) {
    e.preventDefault(); // Browser-Default (Dialog sofort schließen) verhindern
    onCancel?.();       // Stattdessen: über React-State schließen
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      onClick={handleDialogClick}
      onCancel={handleCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div className="confirm-dialog__content">
        {/* ── Titel ──────────────────────────────────────────────────── */}
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>

        {/* ── Nachricht ──────────────────────────────────────────────── */}
        <p id="confirm-dialog-message" className="confirm-dialog__message">
          {message}
        </p>

        {/* ── Buttons ────────────────────────────────────────────────── */}
        <div className="confirm-dialog__actions">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
