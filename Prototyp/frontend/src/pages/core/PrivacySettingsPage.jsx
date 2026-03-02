// src/pages/PrivacySettingsPage.jsx — Einwilligungen verwalten (US-08)
//
// Diese Seite zeigt dem User alle seine erteilten Einwilligungen an
// und erlaubt ihm, OPTIONALE Einwilligungen zu widerrufen.
//
// DSGVO Art. 7 Abs. 3:
//   "Die betroffene Person hat das Recht, ihre Einwilligung jederzeit
//    zu widerrufen. Der Widerruf der Einwilligung muss so einfach wie
//    die Erteilung der Einwilligung sein."
//
// Ablauf:
//   1. Beim Laden: GET /api/consents → alle Einwilligungen des Users laden
//   2. Jede Einwilligung wird als Karte mit Status (erteilt/widerrufen) angezeigt
//   3. Optionale Einwilligungen haben einen Toggle-Button
//   4. Klick auf Toggle → PATCH /api/consents/:id → Status ändern
//   5. Pflicht-Einwilligungen zeigen nur den Status (kein Widerruf möglich)
//
// Neue React-Konzepte hier:
//   - Daten nach dem Laden transformieren (map über Array)
//   - Optimistisches UI-Update (State ändern BEVOR Backend antwortet)
//   - Datum formatieren mit toLocaleDateString()

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/core/PrivacySettingsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Labels & Beschreibungen für jeden Consent-Typ ─────────────────────────
// So müssen wir diese Texte nicht im JSX hardcoden.
// Das Backend schickt nur den technischen Key (z.B. "terms"),
// hier übersetzen wir ihn in menschenlesbare Texte.
const CONSENT_INFO = {
  terms: {
    label: 'Nutzungsbedingungen & Datenschutzerklärung',
    description: 'Akzeptanz der allgemeinen Nutzungsbedingungen und der Datenschutzerklärung.',
    required: true,
  },
  health_data: {
    label: 'Verarbeitung von Gesundheitsdaten',
    description: 'Einwilligung zur Verarbeitung deiner Gesundheitsdaten (Termine, Medikamente, Laborwerte, Befinden) für personalisierte Empfehlungen.',
    required: true,
  },
  analytics: {
    label: 'Anonymisierte Daten für Produktverbesserung',
    description: 'Erlaubnis zur anonymisierten Nutzung deiner Daten zur Verbesserung von AIVA Health.',
    required: false,
  },
};

export default function PrivacySettingsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── State ───────────────────────────────────────────────────────────────
  const [consents, setConsents] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── useEffect: Consents beim Seitenaufruf laden ─────────────────────────
  useEffect(() => {
    async function loadConsents() {
      try {
        const response = await fetch(`${API_URL}/api/consents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Einwilligungen konnten nicht geladen werden.');
        }

        const data = await response.json();
        setConsents(data.consents);
      } catch (err) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    loadConsents();
  }, [token]);

  // ── handleToggle: Einzelne Einwilligung ändern ──────────────────────────
  // Wird aufgerufen wenn der User einen Toggle-Button klickt.
  // Sendet PATCH /api/consents/:id mit dem neuen granted-Wert.
  async function handleToggle(consentId, currentGranted) {
    setError('');
    setSuccess('');

    const newGranted = !currentGranted; // Toggle: true → false, false → true

    try {
      const response = await fetch(`${API_URL}/api/consents/${consentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ granted: newGranted }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Fehler beim Aktualisieren.');
        return;
      }

      // ── State aktualisieren ─────────────────────────────────────────
      // Wir ersetzen den geänderten Consent im Array.
      // .map() erstellt ein neues Array: für den geänderten Eintrag nehmen
      // wir die Daten aus der Server-Antwort, für alle anderen die
      // bestehenden Daten.
      setConsents((prev) =>
        prev.map((c) => (c.id === consentId ? data.consent : c))
      );

      setSuccess(
        newGranted
          ? 'Einwilligung erteilt.'
          : 'Einwilligung widerrufen.'
      );

      // Erfolgsmeldung nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Server nicht erreichbar.');
    }
  }

  // ── Ladebildschirm ─────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="privacy-page">
        <div className="privacy-container">
          <p className="privacy-loading">Einwilligungen werden geladen...</p>
        </div>
      </div>
    );
  }

  // ── Datum formatieren ───────────────────────────────────────────────────
  // Wandelt ISO-String "2026-03-01T12:29:44.189Z" in "01.03.2026, 13:29"
  // Locale 'de-DE' sorgt für deutsches Datumsformat.
  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="privacy-page">
      <div className="privacy-container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="privacy-header">
          <h1 className="privacy-title">🔒 Datenschutz-Einstellungen</h1>
          <p className="privacy-subtitle">
            Hier kannst du deine Einwilligungen einsehen und optionale
            Einwilligungen jederzeit widerrufen.
          </p>
        </header>

        {/* ── Meldungen ──────────────────────────────────────────────────── */}
        {error && <div className="privacy-error">⚠️ {error}</div>}
        {success && <div className="privacy-success">✅ {success}</div>}

        {/* ── Consent-Liste ──────────────────────────────────────────────── */}
        <div className="privacy-consent-list">
          {consents.map((consent) => {
            // Info-Objekt für diesen Consent-Typ laden
            const info = CONSENT_INFO[consent.consentType] || {
              label: consent.consentType,
              description: '',
              required: false,
            };

            return (
              <div
                key={consent.id}
                className={`privacy-consent-card ${
                  consent.granted ? 'granted' : 'revoked'
                }`}
              >
                {/* ── Kopfzeile: Label + Badge ────────────────────────────── */}
                <div className="privacy-consent-header">
                  <h3 className="privacy-consent-label">{info.label}</h3>
                  <span
                    className={`privacy-badge ${
                      info.required ? 'privacy-badge-required' : 'privacy-badge-optional'
                    }`}
                  >
                    {info.required ? 'Pflicht' : 'Optional'}
                  </span>
                </div>

                {/* ── Beschreibung ──────────────────────────────────────── */}
                <p className="privacy-consent-desc">{info.description}</p>

                {/* ── Status + Zeitstempel ──────────────────────────────── */}
                <div className="privacy-consent-status">
                  <span
                    className={`privacy-status-dot ${
                      consent.granted ? 'active' : 'inactive'
                    }`}
                  />
                  <span className="privacy-status-text">
                    {consent.granted ? 'Erteilt' : 'Widerrufen'} am{' '}
                    {formatDate(consent.grantedAt)}
                  </span>
                </div>

                {/* ── Toggle-Button (nur für optionale Consents) ─────────── */}
                {/* Pflicht-Consents zeigen keinen Button — sie können       */}
                {/* nicht widerrufen werden (s. Backend-Validierung).         */}
                {!info.required && (
                  <button
                    onClick={() => handleToggle(consent.id, consent.granted)}
                    className={`privacy-toggle-btn ${
                      consent.granted ? 'privacy-toggle-revoke' : 'privacy-toggle-grant'
                    }`}
                  >
                    {consent.granted ? 'Widerrufen' : 'Erteilen'}
                  </button>
                )}

                {/* Hinweis für Pflicht-Consents */}
                {info.required && (
                  <p className="privacy-consent-hint">
                    Diese Einwilligung ist für die Nutzung der App erforderlich
                    und kann nicht widerrufen werden.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Zurück-Button ──────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/dashboard')}
          className="privacy-back-btn"
        >
          ← Zurück zum Dashboard
        </button>
      </div>
    </div>
  );
}
