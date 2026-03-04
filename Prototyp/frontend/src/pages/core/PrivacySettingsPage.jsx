// src/pages/PrivacySettingsPage.jsx — Einwilligungen verwalten (US-08, US-12 Migration)
//
// Diese Seite zeigt dem User alle seine erteilten Einwilligungen an
// und erlaubt ihm, OPTIONALE Einwilligungen zu widerrufen.
//
// DSGVO Art. 7 Abs. 3:
//   "Die betroffene Person hat das Recht, ihre Einwilligung jederzeit
//    zu widerrufen. Der Widerruf der Einwilligung muss so einfach wie
//    die Erteilung der Einwilligung sein."
//
// US-12 Migration:
//   - .privacy-page + .privacy-container → <PageContainer>
//   - .privacy-header/title/subtitle → <PageHeader>
//   - .privacy-error/success → <Alert>
//   - .privacy-badge-required/optional → <Badge>
//   - .privacy-consent-card → <Card>
//   - .privacy-toggle-btn → <Button danger/success>
//   - .privacy-back-btn → <Button secondary>
//   - .privacy-loading → <Spinner>

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import '../../styles/pages/core/PrivacySettingsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Labels & Beschreibungen für jeden Consent-Typ ─────────────────────────
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

  // ── Confirm-Dialog für Widerruf (DSGVO-Sicherheit) ─────────────────────
  // Widerruf einer Einwilligung kann weitreichende Folgen haben
  // (z.B. Gesundheitsdaten-Löschung). Daher Bestätigung per Dialog.
  const [revokeTarget, setRevokeTarget] = useState(null);

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

  // ── Widerruf-Anfrage: Bei Widerruf erst bestätigen, bei Erteilen direkt ──
  function requestToggle(consent, info) {
    if (consent.granted) {
      // Widerruf → ConfirmDialog zeigen
      setRevokeTarget({ id: consent.id, label: info.label });
    } else {
      // Erteilen → keine Bestätigung nötig, direkt ausführen
      handleToggle(consent.id, consent.granted);
    }
  }

  // ── handleToggle: Einzelne Einwilligung ändern ──────────────────────────
  async function handleToggle(consentId, currentGranted) {
    setError('');
    setSuccess('');
    setRevokeTarget(null); // Dialog schließen

    const newGranted = !currentGranted;

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

      setConsents((prev) =>
        prev.map((c) => (c.id === consentId ? data.consent : c))
      );

      setSuccess(
        newGranted
          ? 'Einwilligung erteilt.'
          : 'Einwilligung widerrufen.'
      );

      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Server nicht erreichbar.');
    }
  }

  // ── Ladebildschirm: Spinner statt einfachen Text ───────────────────────
  if (pageLoading) {
    return (
      <PageContainer maxWidth="lg">
        <div className="privacy-loading-container">
          <Spinner size="lg" label="Einwilligungen werden geladen..." />
        </div>
      </PageContainer>
    );
  }

  // ── Datum formatieren ───────────────────────────────────────────────────
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
    <PageContainer maxWidth="lg">

      {/* ── PageHeader: Ersetzt .privacy-header/title/subtitle ────── */}
      <PageHeader
        title="🔒 Datenschutz-Einstellungen"
        subtitle="Hier kannst du deine Einwilligungen einsehen und optionale Einwilligungen jederzeit widerrufen."
      />

      {/* ── Alerts: Ersetzen .privacy-error und .privacy-success ──── */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* ── Consent-Liste ──────────────────────────────────────────── */}
      <div className="privacy-consent-list">
        {consents.map((consent) => {
          const info = CONSENT_INFO[consent.consentType] || {
            label: consent.consentType,
            description: '',
            required: false,
          };

          return (
            <Card
              key={consent.id}
              padding="md"
              accent={consent.granted ? 'success' : 'danger'}
              className={`privacy-consent-card ${
                consent.granted ? 'granted' : 'revoked'
              }`}
            >
              {/* ── Kopfzeile: Label + Badge ──────────────────────── */}
              <div className="privacy-consent-header">
                <h3 className="privacy-consent-label">{info.label}</h3>
                <Badge variant={info.required ? 'required' : 'optional'}>
                  {info.required ? 'Pflicht' : 'Optional'}
                </Badge>
              </div>

              {/* ── Beschreibung ──────────────────────────────────── */}
              <p className="privacy-consent-desc">{info.description}</p>

              {/* ── Status + Zeitstempel ──────────────────────────── */}
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

              {/* ── Toggle-Button: Button danger/success statt eigener Klasse */}
              {!info.required && (
                <Button
                  variant={consent.granted ? 'danger' : 'success'}
                  size="sm"
                  onClick={() => requestToggle(consent, info)}
                >
                  {consent.granted ? 'Widerrufen' : 'Erteilen'}
                </Button>
              )}

              {/* Hinweis für Pflicht-Consents */}
              {info.required && (
                <p className="privacy-consent-hint">
                  Diese Einwilligung ist für die Nutzung der App erforderlich
                  und kann nicht widerrufen werden.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* ── Zurück-Button: Button secondary statt .privacy-back-btn ── */}
      <Button
        variant="secondary"
        onClick={() => navigate('/dashboard')}
        className="privacy-back-btn"
      >
        ← Zurück zum Dashboard
      </Button>

      {/* ── ConfirmDialog für Widerruf ─────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(revokeTarget)}
        title="Einwilligung widerrufen?"
        message={`Möchtest du die Einwilligung „${revokeTarget?.label}" wirklich widerrufen? Bereits gespeicherte Daten können dadurch gelöscht werden.`}
        confirmLabel="Ja, widerrufen"
        cancelLabel="Abbrechen"
        variant="danger"
        onConfirm={() => {
          if (revokeTarget) {
            handleToggle(revokeTarget.id, true);
          }
        }}
        onCancel={() => setRevokeTarget(null)}
      />
    </PageContainer>
  );
}
