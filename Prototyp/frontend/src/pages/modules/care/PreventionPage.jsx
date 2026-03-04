// src/pages/modules/care/PreventionPage.jsx — Vorsorge-Kalender (US-17)
//
// Zeigt alle GKV-Vorsorgeuntersuchungen, die zum Alter und Geschlecht
// des eingeloggten Users passen — als übersichtlichen Kalender mit:
//   - Fortschrittsbalken (X von Y erledigt)
//   - Gruppierung nach Häufigkeit (Jährlich, Alle 2 Jahre, etc.)
//   - PreventionCards mit ConfirmDialog + Termin-Verknüpfung
//
// REDESIGN-ENTSCHEIDUNG:
//   Vorher: Tabs (Alle/Offen/Erledigt) — umständlich, viel Klicken.
//   Jetzt:  Alle Vorsorgen immer sichtbar, gruppiert nach Häufigkeit.
//           Fortschrittsbalken gibt Gesamtüberblick auf einen Blick.
//
// Datenfluss:
//   1. Seite lädt → GET /api/prevention (Backend filtert nach Alter+Geschlecht)
//   2. Frontend gruppiert die Vorsorgen nach frequencyMonths
//   3. User klickt "Als erledigt markieren" → ConfirmDialog → PATCH
//   4. User klickt "Termin anlegen" → Navigation zu /care/new?title=...

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

// ── Häufigkeit → Gruppen-Label ────────────────────────────────────────────
// Wandelt frequencyMonths in einen menschenlesbaren Gruppen-Titel um.
// Gleiche Logik wie in PreventionCard, aber hier als Section-Header genutzt.
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
// Input:  [{...frequencyMonths: 12}, {...frequencyMonths: 24}, {...frequencyMonths: 12}]
// Output: [{ label: "Jährlich", months: 12, items: [...] }, { label: "Alle 2 Jahre", ... }]
//
// Sortierung: Häufigste zuerst (12 Monate vor 24 vor 36 etc.)
// So sieht der User zuerst die Vorsorgen, die am öftesten fällig sind.
function groupByFrequency(preventions) {
  // 1. Map aufbauen: frequencyMonths → Array von Vorsorgen
  const groups = new Map();
  for (const p of preventions) {
    const key = p.frequencyMonths;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(p);
  }

  // 2. In Array umwandeln und nach Häufigkeit sortieren (niedrigste Monate zuerst)
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([months, items]) => ({
      label: getFrequencyLabel(months),
      months,
      items,
    }));
}

export default function PreventionPage() {
  // ── State ─────────────────────────────────────────────────────────────
  const [preventions, setPreventions] = useState([]);   // Alle Vorsorgen vom Backend
  const [loading, setLoading] = useState(true);         // Lade-Zustand
  const [error, setError] = useState(null);             // Fehlermeldung
  const [togglingId, setTogglingId] = useState(null);   // Welche Karte wird gerade gespeichert?

  // Token für authentifizierte API-Calls
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── Vorsorgen vom Backend laden ────────────────────────────────────────
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
  // Wird vom ConfirmDialog in PreventionCard aufgerufen (nach Bestätigung).
  async function handleToggleStatus(userPreventionId, newStatus) {
    setTogglingId(userPreventionId);
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

      // Lokalen State aktualisieren (kein erneuter GET nötig)
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
      setTogglingId(null);
    }
  }

  // ── Fortschritts-Berechnung ───────────────────────────────────────────
  // Werden oben im Fortschrittsbalken angezeigt.
  const total = preventions.length;
  const completedCount = preventions.filter((p) => p.status === 'completed').length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // ── Vorsorgen nach Häufigkeit gruppieren ──────────────────────────────
  const groups = groupByFrequency(preventions);

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

      {/* ── Content: Loading / Error / Kalender ──────────────────── */}
      {loading && <Spinner text="Vorsorge-Daten werden geladen..." />}

      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && preventions.length === 0 && (
        <Alert variant="info">
          Keine Vorsorgeuntersuchungen für dein Profil gefunden.
          Bitte stelle sicher, dass Geburtsdatum und Geschlecht im Profil hinterlegt sind.
        </Alert>
      )}

      {!loading && !error && preventions.length > 0 && (
        <>
          {/* ── Fortschrittsbalken ─────────────────────────────────── */}
          {/* Zeigt visuell wie viele Vorsorgen erledigt sind.          */}
          {/* Die Breite des grünen Balkens = completedCount / total.   */}
          <div className="prevention-progress">
            <div className="prevention-progress__header">
              <span className="prevention-progress__label">Dein Fortschritt</span>
              <span className="prevention-progress__count">
                {completedCount} von {total} erledigt
              </span>
            </div>
            <div className="prevention-progress__bar">
              <div
                className="prevention-progress__fill"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label={`${completedCount} von ${total} Vorsorgen erledigt`}
              />
            </div>
            {completedCount === total && (
              <p className="prevention-progress__complete">
                🎉 Alle Vorsorgen erledigt — großartig!
              </p>
            )}
          </div>

          {/* ── Gruppierte Vorsorge-Karten ─────────────────────────── */}
          {/* Jede Gruppe hat einen dekorativen Section-Header           */}
          {/* ("Jährlich", "Alle 2 Jahre" etc.) und darunter die Karten. */}
          {groups.map((group) => (
            <section key={group.months} className="prevention-group">
              {/* Gruppen-Header mit Linie */}
              <div className="prevention-group__header">
                <span className="prevention-group__label">
                  🔄 {group.label}
                </span>
                <span className="prevention-group__count">
                  {group.items.length} {group.items.length === 1 ? 'Untersuchung' : 'Untersuchungen'}
                </span>
              </div>

              {/* Karten in dieser Gruppe */}
              <div className="prevention-group__cards">
                {group.items.map((prevention) => (
                  <PreventionCard
                    key={prevention.id}
                    prevention={prevention}
                    onToggleStatus={handleToggleStatus}
                    loading={togglingId === prevention.userPreventionId}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </PageContainer>
  );
}
