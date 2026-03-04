// src/components/labs/MedicationForm.jsx — Medikamenten-Formular (US-19, TASK-74)
//
// Wiederverwendbares Formular zum Erstellen UND Bearbeiten von Medikamenten.
//
// Props:
//   medication? — Wenn vorhanden: Edit-Modus (Felder vorausgefüllt, PUT statt POST)
//                 Wenn nicht: Create-Modus (leere Felder, POST)
//
// Features:
//   - Checkboxen für Einnahmezeiten (morgens/mittags/abends/nachts)
//   - 6 Farbkreise zur visuellen Erkennung
//   - Client-seitige Validierung (gleiche Regeln wie Backend)
//   - Loading-State beim Absenden
//   - Erfolg → Navigation zurück zu /labs
//
// Nutzt UI-Primitives aus US-12:
//   PageContainer, PageHeader, Card, Input, Button, Alert

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../ui/PageContainer';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import '../../styles/components/labs/MedicationForm.css';

// ── Einnahmezeiten-Optionen ──────────────────────────────────────────
// Jede Option hat einen Wert (value), ein Label und ein Emoji.
// value = wird als komma-separierter String an das Backend geschickt.
const TIME_OPTIONS = [
  { value: 'morgens',  label: 'Morgens',  emoji: '🌅' },
  { value: 'mittags',  label: 'Mittags',  emoji: '☀️' },
  { value: 'abends',   label: 'Abends',   emoji: '🌙' },
  { value: 'nachts',   label: 'Nachts',   emoji: '🌑' },
];

// ── Farboptionen ─────────────────────────────────────────────────────
// 6 vordefinierte Farben für die visuelle Erkennung.
// Jede Farbe wird als farbiger Kreis angezeigt.
// Die Colors müssen mit VALID_COLORS im Backend übereinstimmen!
const COLOR_OPTIONS = [
  { value: '#EF4444', label: 'Rot' },
  { value: '#F97316', label: 'Orange' },
  { value: '#EAB308', label: 'Gelb' },
  { value: '#10B981', label: 'Grün' },
  { value: '#3B82F6', label: 'Blau' },
  { value: '#8B5CF6', label: 'Violett' },
];

export default function MedicationForm({ medication: existingMedication }) {
  const navigate = useNavigate();
  const { token } = useAuth();

  // ── Edit-Modus erkennen ─────────────────────────────────────────────
  // Wenn ein medication-Prop übergeben wird, füllen wir die Felder vor.
  const isEditMode = Boolean(existingMedication);

  // ── Formular-State ──────────────────────────────────────────────────
  // Jedes Feld hat einen eigenen State. Im Edit-Modus werden die
  // Werte des bestehenden Medikaments als Initialdaten genommen.
  const [name, setName] = useState(existingMedication?.name || '');
  const [substance, setSubstance] = useState(existingMedication?.substance || '');
  const [dosage, setDosage] = useState(existingMedication?.dosage || '');
  const [startDate, setStartDate] = useState(
    existingMedication?.startDate
      ? new Date(existingMedication.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]   // Standard: heute
  );
  const [endDate, setEndDate] = useState(
    existingMedication?.endDate
      ? new Date(existingMedication.endDate).toISOString().split('T')[0]
      : ''
  );
  const [color, setColor] = useState(existingMedication?.color || '#3B82F6');
  const [leafletUrl, setLeafletUrl] = useState(existingMedication?.leafletUrl || '');
  const [notes, setNotes] = useState(existingMedication?.notes || '');

  // ── Einnahmezeiten als Set ──────────────────────────────────────────
  // Set statt Array, weil wir effizient prüfen müssen ob ein Wert
  // enthalten ist (has() statt includes()). Wird bei Checkbox-Toggle
  // per add()/delete() modifiziert.
  const [selectedTimes, setSelectedTimes] = useState(() => {
    if (existingMedication?.times) {
      return new Set(existingMedication.times.split(','));
    }
    return new Set();
  });

  // ── UI-States ───────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Handler: Einnahmezeit togglen ───────────────────────────────────
  // Klick auf eine Checkbox → Zeit hinzufügen oder entfernen.
  // Wichtig: Wir erstellen ein NEUES Set (new Set(prev)), weil React
  // Änderungen am selben Objekt nicht als State-Update erkennt.
  function toggleTime(timeValue) {
    setSelectedTimes((prev) => {
      const next = new Set(prev);
      if (next.has(timeValue)) {
        next.delete(timeValue);
      } else {
        next.add(timeValue);
      }
      return next;
    });
  }

  // ── Handler: Formular absenden ──────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();     // Standard-Formular-Submit verhindern (Seite neu laden)
    setError('');

    // ── Client-seitige Validierung ──────────────────────────────────
    if (!name.trim()) {
      return setError('Bitte gib den Medikamentennamen ein.');
    }
    if (!dosage.trim()) {
      return setError('Bitte gib die Dosierung ein (z.B. "5mg").');
    }
    if (selectedTimes.size === 0) {
      return setError('Bitte wähle mindestens eine Einnahmezeit.');
    }
    if (!startDate) {
      return setError('Bitte gib ein Startdatum an.');
    }

    setLoading(true);

    try {
      // ── times: Set → komma-separierter String ──────────────────────
      // Das Backend erwartet "morgens,abends" als String.
      // Array.from(selectedTimes) wandelt das Set in ein Array um,
      // .join(',') verbindet die Elemente mit Komma.
      const timesString = Array.from(selectedTimes).join(',');

      // ── Request-Body zusammenbauen ─────────────────────────────────
      const body = {
        name: name.trim(),
        substance: substance.trim() || null,
        dosage: dosage.trim(),
        times: timesString,
        startDate,
        endDate: endDate || null,
        color,
        leafletUrl: leafletUrl.trim() || null,
        notes: notes.trim() || null,
      };

      // ── API-Call: POST (neu) oder PUT (bearbeiten) ─────────────────
      const url = isEditMode
        ? `/api/medications/${existingMedication.id}`
        : '/api/medications';

      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.join(', ') || data.error || 'Unbekannter Fehler');
      }

      // Erfolg → zurück zur Labs-Seite
      navigate('/labs');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <PageContainer>
      <PageHeader
        title={isEditMode ? '💊 Medikament bearbeiten' : '💊 Neues Medikament'}
        subtitle={isEditMode
          ? 'Passe die Angaben an'
          : 'Trage dein Medikament mit Dosierung und Einnahmezeiten ein'
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Card as="form" onSubmit={handleSubmit} padding="lg">
        {/* ── Name + Dosierung (nebeneinander auf Desktop) ──────── */}
        <div className="medication-form__row">
          <Input
            label="Medikamentenname *"
            placeholder="z.B. Ramipril"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Dosierung *"
            placeholder="z.B. 5mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>

        {/* ── Wirkstoff (optional) ──────────────────────────────── */}
        <Input
          label="Wirkstoff / Gruppe"
          placeholder="z.B. ACE-Hemmer (optional)"
          value={substance}
          onChange={(e) => setSubstance(e.target.value)}
        />

        {/* ── Einnahmezeiten (Checkboxen) ───────────────────────── */}
        {/* Jede Option ist ein Button, der den Zustand togglet.     */}
        {/* Ausgewählte Buttons erhalten die Klasse --active.        */}
        <div className="medication-form__section">
          <label className="medication-form__label">Einnahmezeiten *</label>
          <div className="medication-form__times">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"       // type="button" → kein Form-Submit bei Klick!
                className={`medication-form__time-btn ${
                  selectedTimes.has(option.value) ? 'medication-form__time-btn--active' : ''
                }`}
                onClick={() => toggleTime(option.value)}
              >
                <span className="medication-form__time-emoji">{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Datum-Felder (nebeneinander) ──────────────────────── */}
        <div className="medication-form__row">
          <Input
            label="Startdatum *"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Enddatum (optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* ── Farbwahl ──────────────────────────────────────────── */}
        {/* 6 farbige Kreise, der ausgewählte hat einen Ring herum. */}
        <div className="medication-form__section">
          <label className="medication-form__label">Farbe</label>
          <div className="medication-form__colors">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`medication-form__color-btn ${
                  color === c.value ? 'medication-form__color-btn--selected' : ''
                }`}
                style={{ backgroundColor: c.value }}
                onClick={() => setColor(c.value)}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* ── Beipackzettel-Link (optional) ─────────────────────── */}
        <Input
          label="Beipackzettel-Link"
          type="url"
          placeholder="https://... (optional)"
          value={leafletUrl}
          onChange={(e) => setLeafletUrl(e.target.value)}
        />

        {/* ── Notizen (optional) ────────────────────────────────── */}
        <div className="medication-form__section">
          <label className="medication-form__label">Notizen</label>
          <textarea
            className="medication-form__textarea"
            placeholder="z.B. Vor dem Essen einnehmen (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* ── Submit-Buttons ────────────────────────────────────── */}
        <div className="medication-form__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/labs')}
          >
            Abbrechen
          </Button>
          <Button type="submit" loading={loading}>
            {isEditMode ? 'Speichern' : 'Medikament hinzufügen'}
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
