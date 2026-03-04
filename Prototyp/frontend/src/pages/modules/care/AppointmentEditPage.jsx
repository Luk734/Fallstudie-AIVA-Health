// src/pages/modules/care/AppointmentEditPage.jsx — Termin bearbeiten (US-16)
//
// Dünner Page-Wrapper für das AppointmentForm im Edit-Modus.
// Lädt den bestehenden Termin per API und gibt ihn als Prop weiter.
//
// Route: /care/appointments/:id/edit
//
// Ablauf:
//   1. Termin-ID aus der URL lesen (useParams)
//   2. Termin-Daten von GET /api/appointments/:id laden
//   3. AppointmentForm mit appointment-Prop rendern
//
// Während des Ladens wird ein Spinner angezeigt.
// Bei Fehlern (z.B. 404) wird eine Alert-Meldung gezeigt.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AppointmentForm from '../../../components/care/AppointmentForm';
import PageContainer from '../../../components/ui/PageContainer';
import Alert from '../../../components/ui/Alert';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';

// ── API-URL ──────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AppointmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Termin laden ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchAppointment() {
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

        // Nur geplante Termine dürfen bearbeitet werden
        if (data.appointment.status !== 'scheduled') {
          setError('Nur geplante Termine können bearbeitet werden.');
          return;
        }

        setAppointment(data.appointment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [id, token]);

  // ── Loading-State ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer maxWidth="sm">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  // ── Error-State ───────────────────────────────────────────────────────
  if (error) {
    return (
      <PageContainer maxWidth="sm">
        <Alert variant="error">{error}</Alert>
        <Button
          variant="ghost"
          onClick={() => navigate(`/care/appointments/${id}`)}
          style={{ marginTop: '1rem' }}
        >
          ← Zurück zum Termin
        </Button>
      </PageContainer>
    );
  }

  // ── Formular im Edit-Modus rendern ────────────────────────────────────
  return <AppointmentForm appointment={appointment} />;
}
