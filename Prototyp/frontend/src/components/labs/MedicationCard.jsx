// src/components/labs/MedicationCard.jsx — Einzelne Medikamenten-Karte (US-19, TASK-76)
//
// Zeigt ein Medikament als kompakte Karte an:
//   Farbiger linker Rand (Medikament-Farbe)
//   Name + Wirkstoff + Dosierung
//   Einnahmezeiten als Emoji-Badges (🌅 ☀️ 🌙 🌑)
//   Bearbeiten-Button (→ /labs/medications/:id/edit)
//   Deaktivieren-Button (soft-delete)
//
// Props:
//   medication (object) — Das Medikament aus der API:
//     { id, name, substance, dosage, times, color, active, startDate, endDate, notes }
//   onDeactivate (function) — Callback nach Deaktivierung (Liste aktualisieren)
//
// Nutzt UI-Primitives aus US-12:
//   Card, Badge, Button

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import '../../styles/components/labs/MedicationCard.css';

// ── Einnahmezeiten → Emoji-Mapping ──────────────────────────────────
// Gleiche Zuordnung wie in MedicationForm.jsx.
const TIME_EMOJI = Object.freeze({
  morgens: '🌅',
  mittags: '☀️',
  abends:  '🌙',
  nachts:  '🌑',
});

// ── Einnahmezeit → Label ─────────────────────────────────────────────
const TIME_LABEL = Object.freeze({
  morgens: 'Morgens',
  mittags: 'Mittags',
  abends:  'Abends',
  nachts:  'Nachts',
});

// ── Datum-Formatierung ───────────────────────────────────────────────
// "2026-03-01T00:00:00.000Z" → "01.03.2026"
function formatDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function MedicationCard({ medication, onDeactivate }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  // State für den Bestätigungs-Dialog
  const [showConfirm, setShowConfirm] = useState(false);
  // Loading-State für den Deaktivieren-Button
  const [deactivating, setDeactivating] = useState(false);

  const {
    id,
    name,
    substance,
    dosage,
    times,     // Komma-separierter String: "morgens,abends"
    color,
    startDate,
    endDate,
    notes,
  } = medication;

  // times-String in Array aufteilen: "morgens,abends" → ["morgens", "abends"]
  const timeList = times ? times.split(',') : [];

  // ── Deaktivieren-Handler ─────────────────────────────────────────
  // PATCH /api/medications/:id/deactivate → soft-delete
  async function handleDeactivate() {
    setDeactivating(true);
    try {
      const res = await fetch(`/api/medications/${id}/deactivate`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Fehler beim Deaktivieren');

      // Eltern-Komponente benachrichtigen → Liste aktualisieren
      onDeactivate?.(id);
    } catch (err) {
      console.error('Deaktivieren fehlgeschlagen:', err);
    } finally {
      setDeactivating(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <Card
        as="article"
        accent="labs"
        padding="md"
        shadow="sm"
        className="medication-card"
        /* Farbiger linker Rand über CSS Custom Property */
        style={{ '--med-color': color }}
      >
        {/* ── Farbiger Streifen links ─────────────────────────────── */}
        <div
          className="medication-card__color-stripe"
          aria-hidden="true"
        />

        {/* ── Inhalt ──────────────────────────────────────────────── */}
        <div className="medication-card__content">

          {/* ── Header: Name + Dosierung ──────────────────────────── */}
          <div className="medication-card__header">
            <div>
              <h3 className="medication-card__name">{name}</h3>
              {substance && (
                <span className="medication-card__substance">
                  Wirkstoff: {substance}
                </span>
              )}
            </div>
            <span className="medication-card__dosage">{dosage}</span>
          </div>

          {/* ── Einnahmezeiten als Badges ─────────────────────────── */}
          <div className="medication-card__times">
            {timeList.map((t) => (
              <Badge key={t} variant="info">
                <span className="medication-card__time-emoji">
                  {TIME_EMOJI[t] || '💊'}
                </span>
                {' '}
                {TIME_LABEL[t] || t}
              </Badge>
            ))}
          </div>

          {/* ── Datum-Bereich (wenn vorhanden) ────────────────────── */}
          {(startDate || endDate) && (
            <div className="medication-card__dates">
              {startDate && (
                <span>📅 Seit {formatDate(startDate)}</span>
              )}
              {endDate && (
                <span>→ Bis {formatDate(endDate)}</span>
              )}
            </div>
          )}

          {/* ── Notizen (wenn vorhanden) ──────────────────────────── */}
          {notes && (
            <p className="medication-card__notes">📝 {notes}</p>
          )}

          {/* ── Aktions-Buttons ───────────────────────────────────── */}
          <div className="medication-card__actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/labs/medications/${id}/edit`)}
            >
              ✏️ Bearbeiten
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={deactivating}
            >
              🗑️ Deaktivieren
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Bestätigungs-Dialog ──────────────────────────────────── */}
      <ConfirmDialog
        open={showConfirm}
        title="Medikament deaktivieren?"
        message={`Möchten Sie "${name}" wirklich deaktivieren? Das Medikament wird nicht gelöscht, sondern nur als inaktiv markiert.`}
        confirmLabel="Deaktivieren"
        cancelLabel="Abbrechen"
        variant="danger"
        onConfirm={handleDeactivate}
        onCancel={() => setShowConfirm(false)}
        loading={deactivating}
      />
    </>
  );
}
