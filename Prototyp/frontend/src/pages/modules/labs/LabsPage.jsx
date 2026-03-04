// src/pages/modules/labs/LabsPage.jsx — AIVA Labs: Medikamenten-Liste (US-19)
//
// Zeigt alle aktiven Medikamente des Nutzers als MedicationCard-Liste an.
// Bietet einen "Medikament hinzufügen"-Button und eine optionale Umschaltung
// auf "Alle anzeigen" (inkl. deaktivierte).
//
// Datenabruf:
//   GET /api/medications         → nur aktive (Standard)
//   GET /api/medications?active=all → auch deaktivierte
//
// Kinder-Komponente: MedicationCard (Bearbeiten + Deaktivieren pro Karte)
//
// Spätere Erweiterungen (Platzhalter-Sektionen):
//   - Laborbefunde (US-22)
//   - Medikamenten-Erinnerung (US-21)

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PageContainer from '../../../components/ui/PageContainer';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Spinner from '../../../components/ui/Spinner';
import MedicationCard from '../../../components/labs/MedicationCard';
import '../../../styles/pages/modules/labs/LabsPage.css';

export default function LabsPage() {
  // ── State ──────────────────────────────────────────────────────────
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // auch deaktivierte zeigen?

  const { token } = useAuth();
  const navigate = useNavigate();

  // ── Medikamente laden ──────────────────────────────────────────────
  // useCallback sorgt dafür, dass die Funktion sich nicht bei jedem Render
  // neu erstellt. So kann sie sicher als useEffect-Dependency dienen.
  const fetchMedications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = showAll ? '?active=all' : '';
      const res = await fetch(`/api/medications${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Medikamente konnten nicht geladen werden.');

      const data = await res.json();
      setMedications(data.medications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, showAll]);

  // Bei Mount und wenn showAll sich ändert: neu laden
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  // ── Callback: Medikament wurde deaktiviert ─────────────────────────
  // Entfernt die Karte aus der aktuellen Liste (ohne Reload).
  function handleDeactivate(id) {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }

  // ── Aktive vs. deaktivierte Medikamente trennen ────────────────────
  const activeMeds = medications.filter((m) => m.active);
  const inactiveMeds = medications.filter((m) => !m.active);

  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title="💊 Medikamente"
        subtitle="Deine aktuelle Medikamentenliste"
      />

      {/* ── Aktions-Leiste ─────────────────────────────────────────── */}
      <div className="labs-page__actions">
        <Button onClick={() => navigate('/labs/medications/new')}>
          + Medikament hinzufügen
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Nur aktive' : 'Alle anzeigen'}
        </Button>
      </div>

      {/* ── Fehlermeldung ──────────────────────────────────────────── */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* ── Ladeindikator ──────────────────────────────────────────── */}
      {loading && (
        <div className="labs-page__spinner">
          <Spinner size="lg" />
        </div>
      )}

      {/* ── Leerer Zustand ─────────────────────────────────────────── */}
      {!loading && !error && medications.length === 0 && (
        <div className="labs-page__empty">
          <span className="labs-page__empty-icon">💊</span>
          <p>Noch keine Medikamente erfasst.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/labs/medications/new')}
          >
            Jetzt erstes Medikament hinzufügen
          </Button>
        </div>
      )}

      {/* ── Aktive Medikamente ─────────────────────────────────────── */}
      {!loading && activeMeds.length > 0 && (
        <section className="labs-page__section">
          <h2 className="labs-page__section-title">
            Aktive Medikamente ({activeMeds.length})
          </h2>
          <div className="labs-page__grid">
            {activeMeds.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Deaktivierte Medikamente (nur bei "Alle anzeigen") ─────── */}
      {!loading && showAll && inactiveMeds.length > 0 && (
        <section className="labs-page__section labs-page__section--inactive">
          <h2 className="labs-page__section-title">
            Deaktiviert ({inactiveMeds.length})
          </h2>
          <div className="labs-page__grid">
            {inactiveMeds.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Platzhalter: Laborbefunde (US-22) ─────────────────────── */}
      <section className="labs-page__section labs-page__placeholder">
        <h2 className="labs-page__section-title">🔬 Laborbefunde</h2>
        <div className="labs-page__placeholder-box">
          <span>🚧</span>
          <p>Kommt in einer späteren Story (US-22).</p>
        </div>
      </section>
    </PageContainer>
  );
}
