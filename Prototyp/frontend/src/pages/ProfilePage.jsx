// src/pages/ProfilePage.jsx — Profil anlegen / bearbeiten (US-05)
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
// Neue React-Konzepte hier:
//   - useEffect mit Daten laden (API-Call beim Seitenaufruf)
//   - Kontrollierte Formular-Inputs (jedes Feld = eigener useState)
//   - Bedingte CSS-Klassen (für Avatar-Auswahl)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Avatar-Liste ──────────────────────────────────────────────────────────────
// Die Bilder liegen in public/avatars/ (Vite serviert sie als statische Dateien).
// Jeder Eintrag hat:
//   - id: wird als key in der Liste und für Vergleiche genutzt
//   - src: der URL-Pfad, der direkt als <img src="..."> verwendet wird
//   - alt: Alternativtext für Barrierefreiheit (Screenreader)
const AVATARS = [
  { id: 'avatar-1', src: '/avatars/avatar-1.jpg', alt: 'Avatar 1' },
  { id: 'avatar-2', src: '/avatars/avatar-2.jpg', alt: 'Avatar 2' },
  { id: 'avatar-3', src: '/avatars/avatar-3.jpg', alt: 'Avatar 3' },
  { id: 'avatar-4', src: '/avatars/avatar-4.jpg', alt: 'Avatar 4' },
  { id: 'avatar-5', src: '/avatars/avatar-5.jpg', alt: 'Avatar 5' },
  { id: 'avatar-6', src: '/avatars/avatar-6.webp', alt: 'Avatar 6' },
];

// ── Geschlechter-Optionen ─────────────────────────────────────────────────────
// value = was ans Backend gesendet wird (englisch, lowercase)
// label = was der User im Dropdown sieht (deutsch)
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
  // Jedes Formularfeld hat seinen eigenen State.
  // Das nennt man "kontrollierte Inputs" — React kontrolliert den Wert,
  // nicht der Browser. Vorteil: wir können jederzeit auf den aktuellen
  // Wert zugreifen und Validierung machen.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // ── UI-State ────────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Daten laden beim Start

  // ── useEffect: Profil beim Seitenaufruf laden ──────────────────────────────
  // Wenn der User die Seite öffnet, holen wir seine aktuellen Profildaten
  // aus dem Backend. Falls er schon mal Daten eingegeben hat, werden die
  // Formularfelder damit vorausgefüllt.
  //
  // Das leere Array [] als zweites Argument heißt:
  // "Führe diesen Effekt nur EINMAL aus — beim ersten Rendern der Komponente."
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

        // Vorhandene Daten in die Formularfelder setzen.
        // Das "|| ''" stellt sicher, dass null-Werte zu leeren Strings werden.
        // (React mag es nicht wenn ein Input von undefined zu einem Wert wechselt)
        setFirstName(u.firstName || '');
        setLastName(u.lastName || '');
        setGender(u.gender || '');
        setAvatarUrl(u.avatarUrl || '');

        // Geburtsdatum: Backend liefert ISO-String "1990-05-15T00:00:00.000Z"
        // Input type="date" erwartet "1990-05-15" (nur Datum, ohne Zeit)
        // .split('T')[0] schneidet alles ab dem 'T' ab.
        if (u.birthDate) {
          setBirthDate(u.birthDate.split('T')[0]);
        }

      } catch (err) {
        console.error('Profil laden fehlgeschlagen:', err);
      } finally {
        setPageLoading(false); // Ladevorgang abgeschlossen
      }
    }

    loadProfile();
  }, []); // [] = nur einmal beim Mounten ausführen

  // ── handleSubmit: Profil speichern ──────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();    // Kein Browser-Reload
    setError('');          // Alte Meldungen zurücksetzen
    setSuccess('');
    setLoading(true);

    try {
      // ── PUT-Request an Backend ──────────────────────────────────────────
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // JWT für Authentifizierung
        },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDate: birthDate || null,  // Leerer String → null für Backend
          gender: gender || null,
          avatarUrl: avatarUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Fehler vom Backend (z.B. "Vorname ist ein Pflichtfeld")
        setError(data.error || 'Fehler beim Speichern.');
        return;
      }

      // ── Erfolg! ──────────────────────────────────────────────────────
      // 1. AuthContext aktualisieren (damit Dashboard den neuen Namen zeigt)
      updateUser(data.user);

      // 2. Erfolgsmeldung kurz anzeigen, dann zum Dashboard navigieren
      setSuccess('Profil gespeichert!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // 1 Sekunde warten, damit der User die Meldung sieht

    } catch {
      setError('Server nicht erreichbar. Läuft das Backend?');
    } finally {
      setLoading(false);
    }
  }

  // ── Ladebildschirm ─────────────────────────────────────────────────────────
  // Während die Profildaten geladen werden, zeigen wir einen simplen Text.
  if (pageLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p className="profile-loading">Profil wird geladen...</p>
        </div>
      </div>
    );
  }

  // ── Render: Das Profil-Formular ─────────────────────────────────────────────
  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="profile-header">
          <h1 className="profile-title">🩺 Mein Profil</h1>
          <p className="profile-subtitle">
            Erzähl uns etwas über dich — so können wir AIVA Health personalisieren.
          </p>
        </header>

        {/* ── Fehlermeldung ──────────────────────────────────────────────── */}
        {error && <div className="profile-error">⚠️ {error}</div>}

        {/* ── Erfolgsmeldung ─────────────────────────────────────────────── */}
        {success && <div className="profile-success">✅ {success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">

          {/* ── Avatar-Auswahl ───────────────────────────────────────────── */}
          {/* Statt Datei-Upload: 6 vordefinierte Bilder zum Anklicken.     */}
          {/* Das ist die MVP-Lösung laut User Story (Platzhalter-Avatar).   */}
          <fieldset className="profile-fieldset">
            <legend className="profile-legend">Avatar wählen</legend>
            <div className="profile-avatar-grid">
              {AVATARS.map((avatar) => (
                // Für jedes Avatar-Bild rendern wir einen klickbaren Container.
                // Wenn der User draufklickt, wird avatarUrl auf den src gesetzt.
                // Die CSS-Klasse "selected" gibt dem gewählten Avatar einen Rahmen.
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

          {/* ── Vorname (Pflicht) ─────────────────────────────────────────── */}
          <label className="profile-label">
            Vorname <span className="profile-required">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Dein Vorname"
            required
            className="profile-input"
          />

          {/* ── Nachname (optional) ──────────────────────────────────────── */}
          <label className="profile-label">Nachname</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Dein Nachname"
            className="profile-input"
          />

          {/* ── Geburtsdatum (optional) ──────────────────────────────────── */}
          {/* type="date" zeigt den nativen Datumspicker des Browsers.       */}
          {/* Das reicht für den MVP (TASK-24: Datumspicker-Komponente).      */}
          <label className="profile-label">Geburtsdatum</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="profile-input"
          />

          {/* ── Geschlecht (optional) ────────────────────────────────────── */}
          {/* <select> = Dropdown-Menü. Jede <option> ist ein Eintrag.       */}
          {/* Der value von <select> bestimmt welche Option ausgewählt ist.   */}
          <label className="profile-label">Geschlecht #GIG</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="profile-input"
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* ── Buttons ──────────────────────────────────────────────────── */}
          <div className="profile-actions">
            <button type="submit" disabled={loading} className="profile-save-btn">
              {loading ? 'Wird gespeichert...' : 'Profil speichern'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="profile-skip-btn"
            >
              Überspringen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
