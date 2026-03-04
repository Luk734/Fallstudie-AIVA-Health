// src/pages/modules/care/CarePage.jsx — Unified AIVA Care Kalender (US-13 + US-17)
//
// EINE Seite zeigt ALLES: Termine + Vorsorge-Untersuchungen gemeinsam.
//
// REDESIGN-ENTSCHEIDUNG:
//   Vorher: Zwei getrennte Seiten → /care (Termine mit Tabs) + /care/prevention (Vorsorge)
//   Jetzt:  Eine einzige scrollbare Seite mit 4 klar getrennten Sektionen.
//           Kein Tab-Wechsel nötig → alles auf einen Blick.
//
// Layout (von oben nach unten):
//   ┌──────────────────────────────────────────────┐
//   │ 📅 AIVA Care                    [＋ Termin]  │  ← Header + Action
//   ├──────────────────────────────────────────────┤
//   │ Vorsorge-Fortschritt: ████████░░░ 3/6        │  ← Progress Bar
//   ├──────────────────────────────────────────────┤
//   │ 📋 Anstehende Termine                        │  ← Upcoming Appointments
//   │   [AppointmentCard] [AppointmentCard] ...     │
//   ├──────────────────────────────────────────────┤
//   │ 🏥 Vorsorge-Untersuchungen                   │  ← Preventions (grouped)
//   │   Jährlich (3 Untersuchungen)                 │
//   │     [PreventionCard] [PreventionCard] ...     │
//   │   Alle 2 Jahre (2 Untersuchungen)             │
//   │     [PreventionCard] ...                      │
//   ├──────────────────────────────────────────────┤
//   │ 📁 Vergangene Termine                        │  ← Past Appointments
//   │   [AppointmentCard] ...                       │
//   └──────────────────────────────────────────────┘
//
// Datenfluss:
//   1. Seite lädt → 3 parallele API-Calls:
//      - GET /api/appointments?time=upcoming (anstehende Termine)
//      - GET /api/appointments?time=past (vergangene Termine)
//      - GET /api/prevention (Vorsorge gefiltert nach Alter+Geschlecht)
//   2. Alle 3 Datensätze werden in getrenntem State gehalten
//   3. Vorsorge → gruppiert nach frequencyMonths
//   4. Status-Toggle → PATCH /api/prevention/:id/status (mit ConfirmDialog)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PageContainer from '../../../components/ui/PageContainer';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Spinner from '../../../components/ui/Spinner';
import AppointmentCard from '../../../components/care/AppointmentCard';
import PreventionCard from '../../../components/care/PreventionCard';
import '../../../styles/pages/modules/care/CarePage.css';

// ── API-URL ──────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Häufigkeits-Gruppen-Label ─────────────────────────────────────────────
// Wandelt frequencyMonths in einen menschenlesbaren Section-Header um.
function getFrequencyLabel(months) {
  if (months >= 999) return 'Einmalig';
  if (months === 6) return 'Halbjährlich';
  if (months === 12) return 'Jährlich';
  if (months === 24) return 'Alle 2 Jahre';
  if (months === 36) return 'Alle 3 Jahre';
  const years = months / 12;
  if (Number.isInteger(years)) return `Alle ${years} Jahre`;
  return `Alle ${months} Monate`;
}

// ── Vorsorgen nach Häufigkeit gruppieren ──────────────────────────────────
// Input:  [{...frequencyMonths: 12}, {...frequencyMonths: 24}]
// Output: [{ label: "Jährlich", months: 12, items: [...] }, ...]
// Sortierung: Häufigste zuerst (12 vor 24 vor 36 etc.)
function groupByFrequency(preventions) {
  const groups = new Map();
  for (const p of preventions) {
    const key = p.frequencyMonths;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([months, items]) => ({
      label: getFrequencyLabel(months),
      months,
      items,
    }));
}

export default function CarePage() {
  // ── State: Termine ──────────────────────────────────────────────────
  const [upcoming, setUpcoming] = useState([]);          // Anstehende Termine
  const [past, setPast] = useState([]);                   // Vergangene Termine
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  // ── State: Vorsorge ─────────────────────────────────────────────────
  const [preventions, setPreventions] = useState([]);     // Alle Vorsorge-Einträge
  const [preventionsLoading, setPreventionsLoading] = useState(true);
  const [preventionsError, setPreventionsError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);     // Welche Karte wird gerade gespeichert?

  // ── Auth + Navigation ───────────────────────────────────────────────
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── Daten laden (3 parallele Requests) ──────────────────────────────
  // Alle 3 Anfragen starten gleichzeitig → schneller als nacheinander.
  useEffect(() => {
    async function loadAll() {
      setAppointmentsLoading(true);
      setPreventionsLoading(true);
      setAppointmentsError(null);
      setPreventionsError(null);

      const headers = { Authorization: `Bearer ${token}` };

      // 3 Requests parallel starten
      const [upcomingRes, pastRes, preventionRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/appointments?time=upcoming`, { headers }),
        fetch(`${API_URL}/api/appointments?time=past`, { headers }),
        fetch(`${API_URL}/api/prevention`, { headers }),
      ]);

      // ── Anstehende Termine auswerten ──────────────────────────────
      if (upcomingRes.status === 'fulfilled' && upcomingRes.value.ok) {
        const data = await upcomingRes.value.json();
        setUpcoming(data.appointments || []);
      } else {
        setAppointmentsError('Termine konnten nicht geladen werden.');
      }

      // ── Vergangene Termine auswerten ──────────────────────────────
      if (pastRes.status === 'fulfilled' && pastRes.value.ok) {
        const data = await pastRes.value.json();
        setPast(data.appointments || []);
      } else if (!appointmentsError) {
        setAppointmentsError('Vergangene Termine konnten nicht geladen werden.');
      }

      // ── Vorsorge auswerten ────────────────────────────────────────
      if (preventionRes.status === 'fulfilled' && preventionRes.value.ok) {
        const data = await preventionRes.value.json();
        setPreventions(data);
      } else {
        setPreventionsError('Vorsorge-Daten konnten nicht geladen werden.');
      }

      setAppointmentsLoading(false);
      setPreventionsLoading(false);
    }

    loadAll();
  }, [token]);

  // ── Vorsorge-Status umschalten ─────────────────────────────────────
  // Wird von PreventionCard über ConfirmDialog aufgerufen.
  async function handleToggleStatus(userPreventionId, newStatus) {
    setTogglingId(userPreventionId);
    setPreventionsError(null);

    try {
      const res = await fetch(`${API_URL}/api/prevention/${userPreventionId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status konnte nicht geändert werden.');
      const updated = await res.json();

      // Lokalen State patchen (kein erneuter Fetch nötig)
      setPreventions((prev) =>
        prev.map((p) =>
          p.userPreventionId === userPreventionId
            ? { ...p, status: updated.status, completedAt: updated.completedAt }
            : p
        )
      );
    } catch (err) {
      setPreventionsError(err.message);
    } finally {
      setTogglingId(null);
    }
  }

  // ── Berechnete Werte ───────────────────────────────────────────────
  const totalPreventions = preventions.length;
  const completedPreventions = preventions.filter((p) => p.status === 'completed').length;
  const progressPercent = totalPreventions > 0
    ? Math.round((completedPreventions / totalPreventions) * 100)
    : 0;
  const preventionGroups = groupByFrequency(preventions);

  // ── Gesamt-Ladezustand ─────────────────────────────────────────────
  const isLoading = appointmentsLoading && preventionsLoading;

  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title="📅 AIVA Care"
        subtitle="Deine Termine und Vorsorge-Untersuchungen auf einen Blick"
      />

      {/* ── Neuer Termin Button ──────────────────────────────────── */}
      <Button
        variant="primary"
        onClick={() => navigate('/care/new')}
        className="care-page__create-btn"
      >
        ＋ Neuer Termin
      </Button>

      {/* ── Globaler Loading-State ───────────────────────────────── */}
      {isLoading && <Spinner text="Daten werden geladen..." />}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SEKTION 1: Vorsorge-Fortschritt                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {!preventionsLoading && !preventionsError && preventions.length > 0 && (
        <section className="care-section">
          <div className="care-section__header">
            <h2 className="care-section__title">🏥 Vorsorge-Fortschritt</h2>
          </div>

          {/* Fortschrittsbalken */}
          <div className="care-progress">
            <div className="care-progress__header">
              <span className="care-progress__label">Dein Stand</span>
              <span className="care-progress__count">
                {completedPreventions} von {totalPreventions} erledigt
              </span>
            </div>
            <div className="care-progress__bar">
              <div
                className="care-progress__fill"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={completedPreventions}
                aria-valuemin={0}
                aria-valuemax={totalPreventions}
                aria-label={`${completedPreventions} von ${totalPreventions} Vorsorgen erledigt`}
              />
            </div>
            {completedPreventions === totalPreventions && (
              <p className="care-progress__complete">
                🎉 Alle Vorsorgen erledigt — großartig!
              </p>
            )}
          </div>
        </section>
      )}
      {!preventionsLoading && preventionsError && (
        <Alert variant="error">{preventionsError}</Alert>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SEKTION 2: Anstehende Termine                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {!appointmentsLoading && (
        <section className="care-section">
          <div className="care-section__header">
            <h2 className="care-section__title">📋 Anstehende Termine</h2>
            <span className="care-section__count">
              {upcoming.length} {upcoming.length === 1 ? 'Termin' : 'Termine'}
            </span>
          </div>

          {appointmentsError && <Alert variant="error">{appointmentsError}</Alert>}

          {!appointmentsError && upcoming.length === 0 && (
            <Alert variant="info">
              <strong>Kein Termin geplant.</strong> Erstelle deinen ersten Termin über den Button oben.
            </Alert>
          )}

          {!appointmentsError && upcoming.length > 0 && (
            <div className="care-card-list">
              {upcoming.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onClick={() => navigate(`/care/appointments/${apt.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SEKTION 3: Vorsorge-Untersuchungen (gruppiert)            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {!preventionsLoading && !preventionsError && preventions.length > 0 && (
        <section className="care-section">
          <div className="care-section__header">
            <h2 className="care-section__title">🏥 Vorsorge-Untersuchungen</h2>
            <span className="care-section__count">
              {totalPreventions} {totalPreventions === 1 ? 'Untersuchung' : 'Untersuchungen'}
            </span>
          </div>

          {/* Gruppen nach Häufigkeit */}
          {preventionGroups.map((group) => (
            <div key={group.months} className="care-prevention-group">
              <div className="care-prevention-group__header">
                <span className="care-prevention-group__label">
                  🔄 {group.label}
                </span>
                <span className="care-prevention-group__count">
                  {group.items.length} {group.items.length === 1 ? 'Untersuchung' : 'Untersuchungen'}
                </span>
              </div>

              <div className="care-card-list">
                {group.items.map((prevention) => (
                  <PreventionCard
                    key={prevention.id}
                    prevention={prevention}
                    onToggleStatus={handleToggleStatus}
                    loading={togglingId === prevention.userPreventionId}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SEKTION 4: Vergangene Termine                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {!appointmentsLoading && !appointmentsError && past.length > 0 && (
        <section className="care-section care-section--muted">
          <div className="care-section__header">
            <h2 className="care-section__title">📁 Vergangene Termine</h2>
            <span className="care-section__count">
              {past.length} {past.length === 1 ? 'Termin' : 'Termine'}
            </span>
          </div>

          <div className="care-card-list">
            {past.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onClick={() => navigate(`/care/appointments/${apt.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
