// src/pages/ConsentPage.jsx — DSGVO-Einwilligungen beim Onboarding (US-07)
//
// Diese Seite wird nach der Registrierung angezeigt — BEVOR der User
// zum Profil oder Dashboard kommt. Ohne die Pflicht-Einwilligungen
// kann die App nicht genutzt werden (DSGVO Art. 6 + Art. 9).
//
// 3 Checkboxen:
//   1. Nutzungsbedingungen & Datenschutzerklärung (PFLICHT)
//   2. Verarbeitung von Gesundheitsdaten (PFLICHT)
//   3. Anonymisierte Daten für Produktverbesserung (OPTIONAL)
//
// Ablauf:
//   1. User setzt die Checkboxen
//   2. Klick auf "Weiter"
//   3. POST /api/consents → Backend validiert + speichert
//   4. Erfolg → Weiterleitung zu /profile (Onboarding geht weiter)
//
// Neue React-Konzepte hier:
//   - Checkboxen (checked + onChange mit Boolean statt String)
//   - target="_blank" + rel="noopener noreferrer" (sicheres Öffnen in neuem Tab)
//   - Berechneter disabled-State (Button nur klickbar wenn Pflicht-Checkboxen an)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ConsentPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ConsentPage() {
  const { token, updateConsents } = useAuth();
  const navigate = useNavigate();

  // ── Checkbox-State ──────────────────────────────────────────────────────
  // Jede Checkbox hat ihren eigenen Boolean-State.
  // Anders als Textfelder (useState('')): Checkboxen nutzen true/false.
  //
  // Pflicht-Checkboxen starten als false → User muss aktiv zustimmen (Opt-In).
  // Das ist DSGVO-konform: vorausgefüllte Checkboxen wären NICHT erlaubt!
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [healthDataAccepted, setHealthDataAccepted] = useState(false);
  const [analyticsAccepted, setAnalyticsAccepted] = useState(false);

  // ── UI-State ────────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Berechneter Wert: Sind alle Pflicht-Checkboxen gesetzt? ─────────────
  // Diese Variable wird bei JEDEM Render neu berechnet.
  // Kein useState nötig, weil sich der Wert direkt aus den anderen States ergibt.
  // Solange nicht beide Pflicht-Checkboxen an sind, bleibt der Button deaktiviert.
  const canProceed = termsAccepted && healthDataAccepted;

  // ── handleSubmit: Einwilligungen ans Backend senden ─────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ── POST /api/consents ─────────────────────────────────────────────
      // Wir schicken alle 3 Einwilligungen als Array.
      // Das Backend erwartet: { consents: [ { consentType, granted }, ... ] }
      const response = await fetch(`${API_URL}/api/consents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consents: [
            { consentType: 'terms', granted: termsAccepted },
            { consentType: 'health_data', granted: healthDataAccepted },
            { consentType: 'analytics', granted: analyticsAccepted },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Speichern der Einwilligungen.');
        return;
      }

      // ── Erfolg: Weiter zum Profil (nächster Onboarding-Schritt) ────────
      // Zuerst den AuthContext informieren, dass die Consents jetzt erteilt sind.
      // Ohne das würde PrivateRoute den User sofort wieder zu /consent
      // zurückleiten, weil hasConsents noch false wäre.
      updateConsents(true);
      navigate('/profile');
    } catch {
      setError('Server nicht erreichbar. Läuft das Backend?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="consent-page">
      <div className="consent-container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="consent-header">
          <h1 className="consent-title">🔒 Datenschutz & Einwilligungen</h1>
          <p className="consent-subtitle">
            Deine Gesundheitsdaten gehören dir. Bitte lies die folgenden Punkte
            sorgfältig durch und entscheide, welche Datenverarbeitung du erlaubst.
          </p>
        </header>

        {/* ── Fehlermeldung ──────────────────────────────────────────────── */}
        {error && <div className="consent-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="consent-form">

          {/* ── Checkbox 1: Nutzungsbedingungen (PFLICHT) ────────────────── */}
          {/* "label" umschließt die Checkbox → Klick auf den Text aktiviert  */}
          {/* sie ebenfalls. Das verbessert die Usability.                     */}
          <label className="consent-checkbox-label consent-required">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="consent-checkbox"
            />
            <span className="consent-checkbox-text">
              Ich habe die{' '}
              {/* target="_blank": Öffnet in neuem Tab.                        */}
              {/* rel="noopener noreferrer": Sicherheit — verhindert dass die  */}
              {/* neue Seite auf window.opener zugreifen kann.                 */}
              <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
                Datenschutzerklärung
              </a>{' '}
              und die{' '}
              <a href="/nutzungsbedingungen" target="_blank" rel="noopener noreferrer">
                Nutzungsbedingungen
              </a>{' '}
              gelesen und akzeptiere diese.
              <span className="consent-badge consent-badge-required">Pflicht</span>
            </span>
          </label>

          {/* ── Checkbox 2: Gesundheitsdaten (PFLICHT) ───────────────────── */}
          {/* DSGVO Art. 9: Gesundheitsdaten sind "besondere Kategorien"      */}
          {/* personenbezogener Daten. Dafür brauchen wir eine AUSDRÜCKLICHE  */}
          {/* Einwilligung — getrennt von den allgemeinen AGB.                */}
          <label className="consent-checkbox-label consent-required">
            <input
              type="checkbox"
              checked={healthDataAccepted}
              onChange={(e) => setHealthDataAccepted(e.target.checked)}
              className="consent-checkbox"
            />
            <span className="consent-checkbox-text">
              Ich willige ein, dass AIVA Health meine Gesundheitsdaten
              (Termine, Medikamente, Laborwerte, Befinden) verarbeitet,
              um mir personalisierte Empfehlungen zu geben.
              <span className="consent-badge consent-badge-required">Pflicht</span>
            </span>
          </label>

          {/* ── Checkbox 3: Analytics (OPTIONAL) ─────────────────────────── */}
          {/* Diese Einwilligung ist freiwillig. Der User kann sie weglassen  */}
          {/* und trotzdem die App nutzen. Das entspricht dem DSGVO-Prinzip   */}
          {/* der Datenminimierung.                                           */}
          <label className="consent-checkbox-label">
            <input
              type="checkbox"
              checked={analyticsAccepted}
              onChange={(e) => setAnalyticsAccepted(e.target.checked)}
              className="consent-checkbox"
            />
            <span className="consent-checkbox-text">
              Ich erlaube die anonymisierte Nutzung meiner Daten zur
              Verbesserung von AIVA Health.
              <span className="consent-badge consent-badge-optional">Optional</span>
            </span>
          </label>

          {/* ── Info-Box ─────────────────────────────────────────────────── */}
          <div className="consent-info">
            <p>
              <strong>Hinweis:</strong> Du kannst deine Einwilligungen jederzeit
              in den Einstellungen widerrufen. Bei Widerruf der
              Gesundheitsdaten-Verarbeitung werden die personalisierten
              Funktionen deaktiviert.
            </p>
          </div>

          {/* ── Button ───────────────────────────────────────────────────── */}
          {/* disabled={!canProceed || loading}:                               */}
          {/* Der Button ist NICHT klickbar wenn:                               */}
          {/*   - Pflicht-Checkboxen noch nicht gesetzt (!canProceed)           */}
          {/*   - Gerade gespeichert wird (loading)                            */}
          <button
            type="submit"
            disabled={!canProceed || loading}
            className="consent-submit-btn"
          >
            {loading ? 'Wird gespeichert...' : 'Weiter →'}
          </button>

          {/* Hinweis unter dem Button wenn Pflicht-Checkboxen fehlen */}
          {!canProceed && (
            <p className="consent-hint">
              Bitte akzeptiere die beiden Pflicht-Einwilligungen um fortzufahren.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
