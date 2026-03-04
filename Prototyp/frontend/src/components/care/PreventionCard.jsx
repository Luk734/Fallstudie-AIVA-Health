// src/components/care/PreventionCard.jsx — Einzelne Vorsorge-Karte (US-17, TASK-66)
//
// Zeigt eine GKV-Vorsorgeuntersuchung als Karte an:
//   🏥 Name der Untersuchung (z.B. "Hautkrebs-Screening")
//   📝 Kurzbeschreibung (was wird gemacht?)
//   🔄 Häufigkeit (z.B. "Alle 2 Jahre")
//   ✅ Status-Badge (Offen / Erledigt)
//   🔘 Button zum Status-Wechsel
//
// Nutzt die UI-Primitives aus US-12:
//   - Card (accent="care") → Basis-Karte mit blauem Akzent-Rand
//   - Badge → Status-Anzeige (open = gelb, completed = grün)
//   - Button → Status umschalten
//
// PROPS:
//   prevention (object) — Vorsorge-Objekt aus der API:
//     { id, type, description, frequencyMonths, userPreventionId, status, completedAt }
//   onToggleStatus (function) — Callback wenn der User den Status ändert:
//     onToggleStatus(userPreventionId, neuerStatus)
//   loading (boolean) — Wird gerade gespeichert? (Button deaktivieren)

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import '../../styles/components/care/PreventionCard.css';

// ── Status → Badge-Mapping ────────────────────────────────────────────────
// "open" → gelbes / warning Badge ("Offen")
// "completed" → grünes Badge ("Erledigt")
const STATUS_CONFIG = Object.freeze({
  open: { variant: 'warning', label: '⏳ Offen' },
  completed: { variant: 'optional', label: '✅ Erledigt' },
});

// ── Häufigkeit menschenlesbar formatieren ─────────────────────────────────
// frequencyMonths → deutscher Text
// Beispiel: 12 → "Jährlich", 24 → "Alle 2 Jahre", 999 → "Einmalig"
function formatFrequency(months) {
  if (months >= 999) return 'Einmalig';
  if (months === 12) return 'Jährlich';
  if (months === 24) return 'Alle 2 Jahre';
  if (months === 36) return 'Alle 3 Jahre';
  if (months === 6) return 'Halbjährlich';

  // Fallback für andere Werte (z.B. 120 Monate = 10 Jahre)
  const years = months / 12;
  if (Number.isInteger(years)) return `Alle ${years} Jahre`;
  return `Alle ${months} Monate`;
}

// ── Datum formatieren ─────────────────────────────────────────────────────
// ISO-String → "4. März 2026"
function formatDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PreventionCard({ prevention, onToggleStatus, loading }) {
  const { type, description, frequencyMonths, userPreventionId, status, completedAt } = prevention;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.open;

  // Neuer Status = das Gegenteil des aktuellen
  const newStatus = status === 'completed' ? 'open' : 'completed';
  const buttonLabel = status === 'completed' ? 'Wieder öffnen' : 'Als erledigt markieren';

  return (
    <Card
      as="article"
      accent="care"
      padding="md"
      shadow="sm"
      className="prevention-card"
    >
      {/* ── Header: Titel + Status-Badge ─────────────────────────── */}
      <div className="prevention-card__header">
        <h3 className="prevention-card__title">{type}</h3>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      {/* ── Beschreibung ─────────────────────────────────────────── */}
      <p className="prevention-card__description">{description}</p>

      {/* ── Metadaten: Häufigkeit + ggf. Erledigt-Datum ──────────── */}
      <div className="prevention-card__meta">
        <span className="prevention-card__frequency">
          🔄 {formatFrequency(frequencyMonths)}
        </span>
        {completedAt && (
          <span className="prevention-card__completed-date">
            📅 Erledigt am {formatDate(completedAt)}
          </span>
        )}
      </div>

      {/* ── Action: Status umschalten ────────────────────────────── */}
      <div className="prevention-card__action">
        <Button
          variant={status === 'completed' ? 'secondary' : 'success'}
          size="sm"
          loading={loading}
          onClick={() => onToggleStatus(userPreventionId, newStatus)}
        >
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
}
