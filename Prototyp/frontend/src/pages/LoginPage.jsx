// src/pages/LoginPage.jsx — Login-Formular
//
// Diese Seite ist öffentlich zugänglich (kein Token nötig).
// Sie zeigt ein Formular mit E-Mail + Passwort und sendet es an das Backend.
//
// Ablauf:
//   1. Nutzer gibt E-Mail und Passwort ein
//   2. Klick auf "Einloggen"
//   3. POST /api/auth/login → Backend prüft Daten
//   4a. Erfolg → login() aus AuthContext aufrufen → Weiterleitung zu /dashboard
//   4b. Fehler → Fehlermeldung anzeigen
//
// import.meta.env.VITE_API_URL erklärt:
//   Vite liest beim Build die Datei .env (im frontend-Ordner).
//   Nur Variablen mit dem Präfix VITE_ werden ins Frontend eingebaut.
//   Das Backend hat eine eigene .env mit Secrets (JWT_SECRET etc.) —
//   die ist nie im Browser sichtbar.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

// Liest VITE_API_URL aus frontend/.env
// Fallback auf localhost falls .env fehlt
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Programmatische Navigation (ohne <a>-Tag)

  // Formular-State: Speichert was der Nutzer gerade tippt
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI-State: Fehlermeldung und Lade-Indikator
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── handleSubmit: Formular absenden ─────────────────────────────────────────
  // "async" weil wir auf die Backend-Antwort warten müssen.
  async function handleSubmit(e) {
    e.preventDefault(); // Verhindert Browser-Standardverhalten (Seite neu laden)
    setError('');        // Alte Fehlermeldung zurücksetzen
    setLoading(true);    // Lade-Indikator einschalten

    try {
      // ── Anfrage ans Backend ──────────────────────────────────────────────
      // fetch() ist die Browser-native HTTP-Bibliothek.
      // Wir schicken E-Mail + Passwort als JSON im Request-Body.
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Antwort als JSON parsen

      if (!response.ok) {
        // HTTP-Status 4xx oder 5xx → Fehler vom Backend anzeigen
        setError(data.error || 'Unbekannter Fehler');
        return;
      }

      // ── Erfolg: login() aufrufen ─────────────────────────────────────────
      // login() speichert Token + User in Context UND localStorage.
      // Danach leitet navigate() zu /dashboard weiter.
      login(data.token, data.user);
      navigate('/dashboard');
    } catch {
      // Netzwerk-Fehler (Backend nicht erreichbar)
      setError('Server nicht erreichbar. Läuft das Backend?');
    } finally {
      setLoading(false); // Lade-Indikator in jedem Fall ausschalten
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">🩺 AIVA Health</h1>
        <h2 className="login-subtitle">Einloggen</h2>

        {/* Fehlermeldung — wird nur angezeigt wenn error nicht leer ist */}
        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.com"
            required
            className="login-input"
          />

          <label className="login-label">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="login-input"
          />

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Wird eingeloggt...' : 'Einloggen'}
          </button>
        </form>

        <p className="login-hint">
          Test-Account: <code>julian@example.com</code> / <code>sicher123</code>
        </p>
      </div>
    </div>
  );
}
