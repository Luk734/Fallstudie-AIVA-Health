// src/pages/modules/labs/MedicationEditPage.jsx — Medikament bearbeiten (US-19)
//
// Dünner Page-Wrapper für das MedicationForm im Edit-Modus.
// Lädt das bestehende Medikament per API und gibt es als Prop weiter.
//
// Route: /labs/medications/:id/edit
//
// Ablauf:
//   1. Medikament-ID aus der URL lesen (useParams)
//   2. Medikament-Daten von GET /api/medications/:id laden
//   3. MedicationForm mit medication-Prop rendern (= Edit-Modus)
//
// Während des Ladens → Spinner. Bei Fehlern → Alert.
//
// Pattern: Gleich wie AppointmentEditPage.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import MedicationForm from '../../../components/labs/MedicationForm';
import PageContainer from '../../../components/ui/PageContainer';
import Alert from '../../../components/ui/Alert';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';

export default function MedicationEditPage() {
  const { id } = useParams();       // Medikament-ID aus der URL
  const navigate = useNavigate();
  const { token } = useAuth();

  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Medikament laden ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchMedication() {
      try {
        const res = await fetch(`/api/medications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setError('Medikament nicht gefunden.');
          return;
        }

        if (!res.ok) {
          throw new Error('Medikament konnte nicht geladen werden.');
        }

        const data = await res.json();
        setMedication(data.medication);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMedication();
  }, [id, token]);

  // ── Loading-State ──────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer maxWidth="sm">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  // ── Fehler-State ───────────────────────────────────────────────────
  if (error) {
    return (
      <PageContainer maxWidth="sm">
        <Alert variant="error">{error}</Alert>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button variant="outline" onClick={() => navigate('/labs')}>
            ← Zurück zur Medikamentenliste
          </Button>
        </div>
      </PageContainer>
    );
  }

  // ── Erfolg: Formular mit vorausgefüllten Daten ─────────────────────
  return <MedicationForm medication={medication} />;
}
