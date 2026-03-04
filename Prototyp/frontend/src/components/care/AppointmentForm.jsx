// src/components/care/AppointmentForm.jsx — Termin-Formular (US-15, TASK-57)
//
// Wiederverwendbares Formular zum Erstellen (und später Bearbeiten) von Terminen.
//
// Features:
//   - Arzt-Auswahl aus DB-Liste (GET /api/doctors) + "Anderer Arzt" Option
//   - Bei Arzt-Auswahl → Telefon + Ort werden automatisch eingetragen
//   - Felder dennoch manuell editierbar
//   - Client-seitige Validierung (gleiche Regeln wie Backend)
//   - Loading-State beim Absenden
//   - Erfolg → Navigation zurück zu /care
//   - Fehler → Alert mit Fehlermeldung
//
// Nutzt UI-Primitives aus US-12:
//   PageContainer, PageHeader, Card, Input, Button, Alert, Spinner

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../ui/PageContainer';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import '../../styles/components/care/AppointmentForm.css';

// ── API-URL ──────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // ── Arztliste aus der Datenbank ─────────────────────────────────────
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // ── Formular-State ──────────────────────────────────────────────────
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // ── UI-State ────────────────────────────────────────────────────────
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Ärzte laden ─────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch(`${API_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.doctors);
        }
      } catch {
        // Arztliste nicht verfügbar → User kann manuell eingeben
      } finally {
        setDoctorsLoading(false);
      }
    }

    fetchDoctors();
  }, [token]);

  // ── Arzt-Auswahl Handler ────────────────────────────────────────────
  // Wenn ein Arzt aus dem Dropdown gewählt wird, füllen wir automatisch
  // Name, Telefon und Ort ins Formular ein. "Anderer Arzt" (value="custom")
  // leert die Felder, damit der User sie manuell eingeben kann.
  function handleDoctorSelect(e) {
    const value = e.target.value;
    setSelectedDoctorId(value);

    if (value === 'custom' || value === '') {
      // "Anderer Arzt" oder nichts gewählt → Felder leeren
      setDoctor('');
      setPhone('');
      setLocation('');
      return;
    }

    // Arzt aus der Liste finden und Felder befüllen
    const selected = doctors.find((d) => d.id === parseInt(value));
    if (selected) {
      setDoctor(selected.name);
      setPhone(selected.phone || '');
      setLocation(selected.location);
    }
  }

  // ── Client-seitige Validierung ──────────────────────────────────────
  // Gleiche Regeln wie im Backend, damit der User sofort Feedback bekommt
  // ohne auf den Server warten zu müssen.
  function validate() {
    const newErrors = {};

    if (!title.trim() || title.trim().length < 2) {
      newErrors.title = 'Titel muss mindestens 2 Zeichen lang sein.';
    }
    if (title.trim().length > 100) {
      newErrors.title = 'Titel darf maximal 100 Zeichen lang sein.';
    }
    if (!doctor.trim()) {
      newErrors.doctor = 'Arzt/Praxis ist ein Pflichtfeld.';
    }
    if (!location.trim()) {
      newErrors.location = 'Ort ist ein Pflichtfeld.';
    }
    if (!date) {
      newErrors.date = 'Datum ist ein Pflichtfeld.';
    }
    if (!time) {
      newErrors.time = 'Uhrzeit ist ein Pflichtfeld.';
    }

    // Datum + Uhrzeit zusammenbauen und prüfen ob es in der Zukunft liegt
    if (date && time) {
      const datetime = new Date(`${date}T${time}`);
      if (isNaN(datetime.getTime())) {
        newErrors.date = 'Ungültiges Datum.';
      } else if (datetime < new Date()) {
        newErrors.date = 'Der Termin darf nicht in der Vergangenheit liegen.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Formular absenden ───────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    // Client-seitige Validierung
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Datum + Uhrzeit zu ISO-String zusammenbauen
      const datetime = new Date(`${date}T${time}`).toISOString();

      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          doctor: doctor.trim(),
          phone: phone.trim() || null,
          location: location.trim(),
          datetime,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        // Backend gibt entweder { errors: [...] } oder { error: '...' } zurück
        if (data.errors) {
          setServerError(data.errors.join(' '));
        } else {
          setServerError(data.error || 'Termin konnte nicht erstellt werden.');
        }
        return;
      }

      // Erfolg → zurück zur Termin-Liste
      navigate('/care');
    } catch {
      setServerError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Mindestdatum: heute (damit der native Datepicker keine Vergangenheit erlaubt)
  const today = new Date().toISOString().split('T')[0];

  return (
    <PageContainer maxWidth="sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/care')}
        className="appointment-form__back"
      >
        ← Zurück zur Übersicht
      </Button>

      <PageHeader
        title="Neuer Termin"
        subtitle="Erstelle einen neuen Arzttermin"
      />

      {/* ── Fehlermeldung vom Server ───────────────────────────────── */}
      {serverError && (
        <Alert variant="error" className="appointment-form__alert">
          {serverError}
        </Alert>
      )}

      <Card accent="care" padding="lg" shadow="md">
        <form onSubmit={handleSubmit} className="appointment-form" noValidate>

          {/* ── Arzt-Auswahl (Dropdown) ──────────────────────────────── */}
          <div className="input-group">
            <label htmlFor="doctor-select" className="input-group__label">
              Arzt / Praxis auswählen <span className="input-group__required">*</span>
            </label>
            {doctorsLoading ? (
              <div className="appointment-form__loading">
                <Spinner size="sm" /> Ärzte werden geladen...
              </div>
            ) : (
              <select
                id="doctor-select"
                className="input-group__field appointment-form__select"
                value={selectedDoctorId}
                onChange={handleDoctorSelect}
              >
                <option value="">— Bitte wählen —</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty}
                  </option>
                ))}
                <option value="custom">✏️ Anderer Arzt (manuell eingeben)</option>
              </select>
            )}
          </div>

          {/* ── Arztname (editierbar) ────────────────────────────────── */}
          <Input
            label="Arzt / Praxis"
            required
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            error={errors.doctor}
            placeholder="z.B. Dr. Müller"
          />

          {/* ── Titel ────────────────────────────────────────────────── */}
          <Input
            label="Titel / Grund"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="z.B. Zahnarzt-Kontrolle"
          />

          {/* ── Datum + Uhrzeit (nebeneinander) ──────────────────────── */}
          <div className="appointment-form__row">
            <Input
              label="Datum"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              min={today}
            />
            <Input
              label="Uhrzeit"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              error={errors.time}
            />
          </div>

          {/* ── Telefon ──────────────────────────────────────────────── */}
          <Input
            label="Telefon (optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="z.B. 089 / 123 4567"
          />

          {/* ── Ort ──────────────────────────────────────────────────── */}
          <Input
            label="Ort / Adresse"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
            placeholder="z.B. Hauptstr. 12, München"
          />

          {/* ── Notizen ──────────────────────────────────────────────── */}
          <div className="input-group">
            <label htmlFor="notes" className="input-group__label">
              Notizen (optional)
            </label>
            <textarea
              id="notes"
              className="input-group__field appointment-form__textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z.B. Befunde mitbringen, nüchtern erscheinen..."
              rows={3}
            />
          </div>

          {/* ── Submit-Button ────────────────────────────────────────── */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
          >
            📅 Termin erstellen
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
