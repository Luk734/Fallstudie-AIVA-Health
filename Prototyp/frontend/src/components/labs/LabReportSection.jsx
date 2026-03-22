// src/components/labs/LabReportSection.jsx — Laborbefund-Liste (US-22, TASK-87)
//
// Eigenständige Section-Komponente, die in LabsPage eingebettet wird.
// Ähnlich wie MedicationTodaySection: lädt Daten selbstständig und
// rendert eine Liste von LabReportCards.
//
// Datenabruf:
//   GET /api/labs → alle Laborbefunde des Users (neueste zuerst)
//
// States:
//   loading  → Spinner anzeigen
//   error    → Fehlermeldung
//   reports  → Array von Befunden → LabReportCard pro Eintrag
//   leer     → Hinweis "Noch keine Laborbefunde"

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import LabReportCard from './LabReportCard';

export default function LabReportSection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // ── Laborbefunde laden ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/labs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Laborbefunde konnten nicht geladen werden.');

        const data = await res.json();
        setReports(data.reports);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [token]);

  // ── Ladeindikator ──────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="labs-page__section">
        <h2 className="labs-page__section-title">🔬 Laborbefunde</h2>
        <div className="labs-page__spinner">
          <Spinner size="md" />
        </div>
      </section>
    );
  }

  // ── Fehlermeldung ──────────────────────────────────────────────────
  if (error) {
    return (
      <section className="labs-page__section">
        <h2 className="labs-page__section-title">🔬 Laborbefunde</h2>
        <Alert variant="error">{error}</Alert>
      </section>
    );
  }

  // ── Leerer Zustand ─────────────────────────────────────────────────
  if (reports.length === 0) {
    return (
      <section className="labs-page__section">
        <h2 className="labs-page__section-title">🔬 Laborbefunde</h2>
        <div className="labs-page__empty">
          <span className="labs-page__empty-icon">🔬</span>
          <p>Noch keine Laborbefunde vorhanden.</p>
        </div>
      </section>
    );
  }

  // ── Befund-Liste ───────────────────────────────────────────────────
  return (
    <section className="labs-page__section">
      <h2 className="labs-page__section-title">
        🔬 Laborbefunde ({reports.length})
      </h2>
      <div className="labs-page__grid">
        {reports.map((report) => (
          <LabReportCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  );
}
