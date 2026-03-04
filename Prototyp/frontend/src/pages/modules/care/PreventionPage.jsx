// src/pages/modules/care/PreventionPage.jsx — Vorsorge-Kalender (US-17, TASK-66)
//
// Zeigt alle GKV-Vorsorgeuntersuchungen, die zum Alter und Geschlecht
// des eingeloggten Users passen. Jede Vorsorge wird als PreventionCard
// angezeigt mit Status (offen/erledigt) und Toggle-Button.
//
// Features:
//   - Automatische Filterung nach Profil (Alter + Geschlecht)
//   - Status-Badges (Offen → gelb, Erledigt → grün)
//   - Status per Klick umschalten (API-Call an PATCH /api/prevention/:id/status)
//   - Filter-Tabs: Alle / Offen / Erledigt
//   - Loading-State (Spinner)
//   - Error-State (Alert mit hilfreicher Meldung)
//   - Zurück-Button zur Care-Übersicht
//
// Datenfluss:
//   1. Seite lädt → GET /api/prevention (Backend filtert nach Alter+Geschlecht)
//   2. User klickt "Als erledigt markieren" → PATCH /api/prevention/:id/status
//   3. Lokaler State wird aktualisiert (kein erneuter GET nötig)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PageContainer from '../../../components/ui/PageContainer';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Spinner from '../../../components/ui/Spinner';
import PreventionCard from '../../../components/care/PreventionCard';
import '../../../styles/pages/modules/care/PreventionPage.css';

// ── API-URL aus Umgebungsvariablen ────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Filter-Tabs ───────────────────────────────────────────────────────────
// Drei Ansichten: Alle Vorsorgen, nur offene, nur erledigte.
const FILTERS = Object.freeze({
  ALL: 'all',
  OPEN: 'open',
  COMPLETED: 'completed',
});

export default function PreventionPage() {
  // ── State ─────────────────────────────────────────────────────────────
  const [preventions, setPreventions] = useState([]);   // Alle Vorsorgen vom Backend
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);  // Aktiver Filter-Tab
  const [loading, setLoading] = useState(true);         // Lade-Zustand
  const [error, setError] = useState(null);             // Fehlermeldung
  const [togglingId, setTogglingId] = useState(null);   // Welche Karte wird gerade gespeichert?

  // Token für authentifizierte API-Calls
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── Vorsorgen vom Backend laden ────────────────────────────────────────
  // Einmal beim Mounten der Seite. Das Backend filtert bereits nach
  // Alter + Geschlecht, wir bekommen nur die PASSSENDEN Vorsorgen.
  useEffect(() => {
    async function fetchPreventions() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/prevention`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Vorsorge-Daten konnten nicht geladen werden.');
        }

        const data = await res.json();
        setPreventions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPreventions();
  }, [token]);

  // ── Status einer Vorsorge umschalten ──────────────────────────────────
  // Wird aufgerufen wenn der User auf "Als erledigt markieren" oder
  // "Wieder öffnen" klickt.
  //
  // Ablauf:
  //   1. PATCH Request an /api/prevention/:id/status
  //   2. Bei Erfolg: lokalen State aktualisieren (kein erneuter GET nötig!)
  //   3. Bei Fehler: Error anzeigen
  //
  // Optimistisches Update wäre hier auch möglich, aber bei einem
  // Study-Projekt ist explizites Warten auf die Server-Antwort klarer.
  async function handleToggleStatus(userPreventionId, newStatus) {
    setTogglingId(userPreventionId);  // Loading-State für diese Karte
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/prevention/${userPreventionId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Status konnte nicht geändert werden.');
      }

      const updated = await res.json();

      // ── Lokalen State aktualisieren ─────────────────────────────
      // Wir ersetzen nur den einen Eintrag im Array.
      // map() erstellt ein NEUES Array (React erkennt die Änderung).
      setPreventions((prev) =>
        prev.map((p) =>
          p.userPreventionId === userPreventionId
            ? { ...p, status: updated.status, completedAt: updated.completedAt }
            : p
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId(null);  // Loading-State aufheben
    }
  }

  // ── Vorsorgen nach aktuellem Filter filtern ───────────────────────────
  // Das Filtern passiert im Frontend (die Daten sind schon da).
  // Bei "all" werden alle angezeigt, sonst nur offene/erledigte.
  const filteredPreventions = activeFilter === FILTERS.ALL
    ? preventions
    : preventions.filter((p) => p.status === activeFilter);

  // Zähler für die Tab-Labels (z.B. "Offen (3)")
  const openCount = preventions.filter((p) => p.status === 'open').length;
  const completedCount = preventions.filter((p) => p.status === 'completed').length;

  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title="🏥 Vorsorge-Kalender"
        subtitle="Deine GKV-Vorsorgeuntersuchungen auf einen Blick"
      />

      {/* ── Zurück-Button ────────────────────────────────────────── */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/care')}
        className="prevention-page__back-btn"
      >
        ← Zurück zu Termine
      </Button>

      {/* ── Filter-Tabs ──────────────────────────────────────────── */}
      {/* Drei Buttons als Tabs: Alle / Offen / Erledigt */}
      {/* Die Zähler zeigen, wie viele Vorsorgen in jeder Kategorie sind. */}
      <div className="prevention-tabs" role="tablist">
        <Button
          variant="ghost"
          size="sm"
          className={`prevention-tabs__tab ${activeFilter === FILTERS.ALL ? 'prevention-tabs__tab--active' : ''}`}
          onClick={() => setActiveFilter(FILTERS.ALL)}
          role="tab"
          aria-selected={activeFilter === FILTERS.ALL}
        >
          Alle ({preventions.length})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`prevention-tabs__tab ${activeFilter === FILTERS.OPEN ? 'prevention-tabs__tab--active' : ''}`}
          onClick={() => setActiveFilter(FILTERS.OPEN)}
          role="tab"
          aria-selected={activeFilter === FILTERS.OPEN}
        >
          Offen ({openCount})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`prevention-tabs__tab ${activeFilter === FILTERS.COMPLETED ? 'prevention-tabs__tab--active' : ''}`}
          onClick={() => setActiveFilter(FILTERS.COMPLETED)}
          role="tab"
          aria-selected={activeFilter === FILTERS.COMPLETED}
        >
          Erledigt ({completedCount})
        </Button>
      </div>

      {/* ── Content: Loading / Error / Empty / Liste ─────────────── */}
      {loading && <Spinner text="Vorsorge-Daten werden geladen..." />}

      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && filteredPreventions.length === 0 && (
        <Alert variant="info">
          {activeFilter === FILTERS.ALL
            ? 'Keine Vorsorgeuntersuchungen für dein Profil gefunden. Bitte stelle sicher, dass Geburtsdatum und Geschlecht im Profil hinterlegt sind.'
            : activeFilter === FILTERS.OPEN
              ? 'Alle Vorsorgen erledigt! 🎉'
              : 'Noch keine Vorsorge als erledigt markiert.'}
        </Alert>
      )}

      {!loading && !error && filteredPreventions.length > 0 && (
        <div className="prevention-list">
          {filteredPreventions.map((prevention) => (
            <PreventionCard
              key={prevention.id}
              prevention={prevention}
              onToggleStatus={handleToggleStatus}
              loading={togglingId === prevention.userPreventionId}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
