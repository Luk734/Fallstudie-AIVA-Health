// src/components/care/AppointmentList.jsx — Termin-Liste mit Tabs (US-13, TASK-51)
//
// Zentrale Termin-Übersichtsseite im AIVA Care Modul.
// Zeigt alle Termine des Users in zwei Tab-Ansichten:
//   1. "Anstehend" → zukünftige Termine (status=scheduled, aufsteigend)
//   2. "Verlauf"   → vergangene Termine (absteigend, alle Status)
//
// Features:
//   - Tab-Navigation (Anstehend / Verlauf)
//   - Loading-State (Spinner)
//   - Error-State (Alert)
//   - Empty-State ("Kein Termin geplant")
//   - Liste von AppointmentCards
//
// Nutzt UI-Primitives aus US-12:
//   PageContainer, PageHeader, Button (für Tabs), Alert, Spinner

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageContainer from '../ui/PageContainer';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import AppointmentCard from './AppointmentCard';
import '../../styles/components/care/AppointmentList.css';

// ── API-URL aus Umgebungsvariablen ────────────────────────────────────────
// Gleicher Ansatz wie in AuthContext: VITE_API_URL oder Fallback.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Tabs als Konstante (kein Magic String) ────────────────────────────────
const TABS = Object.freeze({
  UPCOMING: 'upcoming',
  PAST: 'past',
});

export default function AppointmentList() {
  // ── State ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(TABS.UPCOMING);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token aus AuthContext für authentifizierte API-Calls
  const { token } = useAuth();  const navigate = useNavigate();
  // ── Daten laden bei Tab-Wechsel ────────────────────────────────────────
  // useEffect wird ausgeführt wenn sich activeTab ändert.
  // So werden bei Tab-Wechsel automatisch die richtigen Daten geladen.
  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_URL}/api/appointments?time=${activeTab}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error('Termine konnten nicht geladen werden.');
        }

        const data = await res.json();
        setAppointments(data.appointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [activeTab, token]);

  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title="📅 Meine Termine"
        subtitle="Verwalte deine Arzttermine und Vorsorgeuntersuchungen"
      />

      {/* ── Tab-Navigation ──────────────────────────────────────────── */}
      {/* Zwei ghost-Buttons als Tabs. Der aktive Tab bekommt eine extra CSS-Klasse */}
      {/* für die visuelle Hervorhebung (Unterstrich + stärkere Farbe). */}
      <div className="appointment-tabs" role="tablist">
        <Button
          variant="ghost"
          size="sm"
          className={`appointment-tabs__tab ${activeTab === TABS.UPCOMING ? 'appointment-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab(TABS.UPCOMING)}
          role="tab"
          aria-selected={activeTab === TABS.UPCOMING}
        >
          Anstehend
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`appointment-tabs__tab ${activeTab === TABS.PAST ? 'appointment-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab(TABS.PAST)}
          role="tab"
          aria-selected={activeTab === TABS.PAST}
        >
          Verlauf
        </Button>
      </div>

      {/* ── Inhalt ──────────────────────────────────────────────────── */}
      <div className="appointment-content" role="tabpanel">
        {/* Loading-State */}
        {loading && (
          <div className="appointment-content__center">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error-State */}
        {!loading && error && (
          <Alert variant="error">{error}</Alert>
        )}

        {/* Empty-State */}
        {!loading && !error && appointments.length === 0 && (
          <Alert variant="info">
            {activeTab === TABS.UPCOMING ? (
              <>
                <strong>Kein Termin geplant</strong> — soll ich dir helfen?
                <br />
                Erstelle deinen ersten Termin über den Button unten.
              </>
            ) : (
              'Noch keine vergangenen Termine vorhanden.'
            )}
          </Alert>
        )}

        {/* Termin-Liste */}
        {!loading && !error && appointments.length > 0 && (
          <div className="appointment-list">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onClick={() => navigate(`/care/appointments/${apt.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
