// src/components/care/AppointmentDetail.jsx — Termin-Detail-Ansicht (US-14, TASK-54)
//
// Zeigt alle Details eines einzelnen Arzttermins an.
// Der User erreicht diese Komponente durch Klick auf eine AppointmentCard
// in der Termin-Liste (/care). Die Termin-ID kommt aus der URL.
//
// Layout:
//   ← Zurück-Button
//   Header mit Titel + Status-Badge
//   Info-Card: Datum, Arzt, Telefon, Ort
//   Notizen-Card (wenn vorhanden)
//   Action-Buttons: Karte öffnen, Bearbeiten, Stornieren
//
// Nutzt UI-Primitives aus US-12:
//   PageContainer, Card, Badge, Button, Alert, Spinner

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../ui/PageContainer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import '../../styles/components/care/AppointmentDetail.css';

// ── API-URL ──────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Status-Config (gleich wie in AppointmentCard) ────────────────────────
const STATUS_CONFIG = Object.freeze({
  scheduled: { variant: 'info', label: 'Geplant' },
  completed: { variant: 'optional', label: 'Abgeschlossen' },
  cancelled: { variant: 'warning', label: 'Abgesagt' },
});

// ── Datum-Formatierung ───────────────────────────────────────────────────
function formatDateTime(isoString) {
  const date = new Date(isoString);

  const dateStr = date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { dateStr, timeStr };
}

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // ── State ─────────────────────────────────────────────────────────────
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Termin laden ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchAppointment() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setError('Termin nicht gefunden.');
          return;
        }

        if (!res.ok) {
          throw new Error('Termin konnte nicht geladen werden.');
        }

        const data = await res.json();
        setAppointment(data.appointment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [id, token]);

  // ── Google Maps öffnen ────────────────────────────────────────────────
  // Öffnet den Standort in Google Maps in einem neuen Tab.
  // encodeURIComponent sorgt dafür, dass Sonderzeichen (ä, ö, ü, Leerzeichen)
  // in der URL korrekt kodiert werden.
  function handleOpenMap() {
    const query = encodeURIComponent(appointment.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  // ── Loading-State ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer maxWidth="sm">
        <div className="detail-center">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  // ── Error- / Not-Found-State ──────────────────────────────────────────
  if (error) {
    return (
      <PageContainer maxWidth="sm">
        <Alert variant="error">{error}</Alert>
        <Button variant="ghost" onClick={() => navigate('/care')} className="detail-back">
          ← Zurück zur Übersicht
        </Button>
      </PageContainer>
    );
  }

  // ── Detail-Ansicht ────────────────────────────────────────────────────
  const { dateStr, timeStr } = formatDateTime(appointment.datetime);
  const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.scheduled;

  return (
    <PageContainer maxWidth="sm">
      {/* ── Zurück-Button ──────────────────────────────────────────── */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/care')}
        className="detail-back"
      >
        ← Zurück zur Übersicht
      </Button>

      {/* ── Header: Titel + Status ─────────────────────────────────── */}
      <div className="detail-header">
        <h1 className="detail-header__title">{appointment.title}</h1>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      {/* ── Info-Card: Datum, Arzt, Telefon, Ort ───────────────────── */}
      <Card accent="care" padding="lg" shadow="md" className="detail-info">
        <div className="detail-info__row">
          <span className="detail-info__icon" aria-hidden="true">📅</span>
          <div>
            <span className="detail-info__label">Datum & Uhrzeit</span>
            <span className="detail-info__value">{dateStr}, {timeStr} Uhr</span>
          </div>
        </div>

        <div className="detail-info__row">
          <span className="detail-info__icon" aria-hidden="true">👨‍⚕️</span>
          <div>
            <span className="detail-info__label">Arzt / Praxis</span>
            <span className="detail-info__value">{appointment.doctor}</span>
          </div>
        </div>

        {appointment.phone && (
          <div className="detail-info__row">
            <span className="detail-info__icon" aria-hidden="true">📞</span>
            <div>
              <span className="detail-info__label">Telefon</span>
              <a
                href={`tel:${appointment.phone.replace(/\s|\//g, '')}`}
                className="detail-info__value detail-info__link"
              >
                {appointment.phone}
              </a>
            </div>
          </div>
        )}

        <div className="detail-info__row">
          <span className="detail-info__icon" aria-hidden="true">📍</span>
          <div>
            <span className="detail-info__label">Ort</span>
            <span className="detail-info__value">{appointment.location}</span>
          </div>
        </div>
      </Card>

      {/* ── Notizen-Card (wenn vorhanden) ──────────────────────────── */}
      {appointment.notes && (
        <Card padding="md" shadow="sm" className="detail-notes">
          <h2 className="detail-notes__title">📝 Notizen</h2>
          <p className="detail-notes__text">{appointment.notes}</p>
        </Card>
      )}

      {/* ── Action-Buttons ─────────────────────────────────────────── */}
      <div className="detail-actions">
        <Button variant="secondary" fullWidth onClick={handleOpenMap}>
          🗺️ In Karte öffnen
        </Button>

        {/* Bearbeiten + Stornieren: Buttons schon sichtbar,
            Logik kommt in US-15 (Termin anlegen) / US-16 (Termin bearbeiten).
            Bis dahin sind sie disabled mit Tooltip-Hinweis. */}
        <div className="detail-actions__row">
          <Button
            variant="primary"
            fullWidth
            disabled
            title="Kommt in einer zukünftigen Version"
          >
            ✏️ Bearbeiten
          </Button>
          <Button
            variant="danger"
            fullWidth
            disabled
            title="Kommt in einer zukünftigen Version"
          >
            ❌ Stornieren
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
