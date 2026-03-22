// src/pages/ProfilePage.jsx — Profil anlegen / bearbeiten (US-05, US-12 Migration)
//
// Diese Seite wird nach der Registrierung angezeigt (Onboarding)
// oder wenn der User über das Dashboard sein Profil bearbeiten will.
//
// Felder (laut Akzeptanzkriterien):
//   - Vorname (Pflicht)
//   - Nachname (optional)
//   - Geburtsdatum (optional)
//   - Geschlecht (optional: m/w/d/keine Angabe)
//   - Avatar-Auswahl (6 vordefinierte Bilder)
//
// Ablauf:
//   1. Beim Laden: GET /api/users/profile → vorhandene Daten ins Formular laden
//   2. User füllt Formular aus / ändert Daten
//   3. Klick auf "Speichern"
//   4. PUT /api/users/profile → Backend validiert & speichert
//   5. Erfolg → AuthContext aktualisieren → Weiterleitung zum Dashboard
//
// US-12 Migration:
//   - .profile-page + .profile-container → <PageContainer>
//   - .profile-header/title/subtitle → <PageHeader>
//   - .profile-error/success → <Alert variant="error/success">
//   - .profile-form → <Card as="form">
//   - .profile-label + .profile-input → <Input>
//   - .profile-save-btn → <Button variant="primary">
//   - .profile-skip-btn → <Button variant="ghost">
//   - .profile-loading → <Spinner>

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import '../../styles/pages/core/ProfilePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Avatar-Liste ──────────────────────────────────────────────────────────────
// Die Bilder liegen in public/avatars/ (Vite serviert sie als statische Dateien).
// 8 thematische SVG-Avatare passend zum Gesundheits-Thema der App.
const AVATARS = [
  { id: 'avatar-1', src: '/avatars/avatar-1.svg', alt: 'Herz & Puls' },
  { id: 'avatar-2', src: '/avatars/avatar-2.svg', alt: 'Fitness & Laufen' },
  { id: 'avatar-3', src: '/avatars/avatar-3.svg', alt: 'Stethoskop & Medizin' },
  { id: 'avatar-4', src: '/avatars/avatar-4.svg', alt: 'Yoga & Meditation' },
  { id: 'avatar-5', src: '/avatars/avatar-5.svg', alt: 'Ernährung & Apfel' },
  { id: 'avatar-6', src: '/avatars/avatar-6.svg', alt: 'Mental Health' },
  { id: 'avatar-7', src: '/avatars/avatar-7.svg', alt: 'Vorsorge & Schutz' },
  { id: 'avatar-8', src: '/avatars/avatar-8.svg', alt: 'Familie & Zusammen' },
];

// ── Geschlechter-Optionen ─────────────────────────────────────────────────────
const GENDER_OPTIONS = [
  { value: '',            label: 'Bitte wählen...' },
  { value: 'male',        label: 'Männlich' },
  { value: 'female',      label: 'Weiblich' },
  { value: 'diverse',     label: 'Divers' },
  { value: 'unspecified', label: 'Keine Angabe' },
];

export default function ProfilePage() {
  const { token, updateUser } = useAuth();
  const navigate = useNavigate();

  // ── Formular-State ──────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // ── UI-State ────────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ── useEffect: Profil beim Seitenaufruf laden ──────────────────────────────
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Profil konnte nicht geladen werden');
        }

        const data = await response.json();
        const u = data.user;

        setFirstName(u.firstName || '');
        setLastName(u.lastName || '');
        setGender(u.gender || '');
        setAvatarUrl(u.avatarUrl || '');

        if (u.birthDate) {
          setBirthDate(u.birthDate.split('T')[0]);
        }

      } catch (err) {
        console.error('Profil laden fehlgeschlagen:', err);
      } finally {
        setPageLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ── handleSubmit: Profil speichern ──────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDate: birthDate || null,
          gender: gender || null,
          avatarUrl: avatarUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Speichern.');
        return;
      }

      updateUser(data.user);
      setSuccess('Profil gespeichert!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch {
      setError('Server nicht erreichbar. Läuft das Backend?');
    } finally {
      setLoading(false);
    }
  }

  // ── Ladebildschirm: Spinner statt einfachen Text ───────────────────────────
  if (pageLoading) {
    return (
      <PageContainer>
        <div className="profile-loading-container">
          <Spinner size="lg" label="Profil wird geladen..." />
        </div>
      </PageContainer>
    );
  }

  // ── Render: Das Profil-Formular ─────────────────────────────────────────────
  return (
    <PageContainer>

      {/* ── PageHeader: Ersetzt .profile-header/title/subtitle ─────── */}
      <PageHeader
        title="🩺 Mein Profil"
        subtitle="Erzähl uns etwas über dich — so können wir AIVA Health personalisieren."
      />

      {/* ── Alerts: Ersetzen .profile-error und .profile-success ──── */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* ── Card als Formular: Ersetzt .profile-form ──────────────── */}
      <Card as="form" padding="lg" shadow="md" className="profile-form" onSubmit={handleSubmit}>

        {/* ── Avatar-Auswahl (bleibt seiten-spezifisch) ──────────── */}
        <fieldset className="profile-fieldset">
          <legend className="profile-legend">Avatar wählen</legend>
          <div className="profile-avatar-grid">
            {AVATARS.map((avatar) => (
              <button
                type="button"
                key={avatar.id}
                className={`profile-avatar-btn ${
                  avatarUrl === avatar.src ? 'selected' : ''
                }`}
                onClick={() => setAvatarUrl(avatar.src)}
                aria-label={avatar.alt}
              >
                <img
                  src={avatar.src}
                  alt={avatar.alt}
                  className="profile-avatar-img"
                />
              </button>
            ))}
          </div>
        </fieldset>

        {/* ── Input: Ersetzt .profile-label + .profile-input ──────── */}
        <Input
          label="Vorname"
          required
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Dein Vorname"
        />

        <Input
          label="Nachname"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Dein Nachname"
        />

        <Input
          label="Geburtsdatum"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        {/* ── Select: Bleibt vorerst manuell (kein eigener UI-Select) ── */}
        {/* Für den MVP reicht ein normales <select> mit Input-Styling.   */}
        <div className="input-group">
          <label className="input-group__label">Geschlecht</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-group__field"
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Buttons: Ersetzen .profile-save-btn + .profile-skip-btn ── */}
        <div className="profile-actions">
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {loading ? 'Wird gespeichert...' : 'Profil speichern'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            Überspringen
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
