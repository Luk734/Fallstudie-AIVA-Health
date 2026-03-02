// src/components/care/AppointmentCard.jsx — Einzelne Termin-Karte (US-13, TASK-52)
//
// Zeigt einen Arzttermin als kompakte Karte an:
//   📅 Datum + Uhrzeit
//   Titel (z.B. "Zahnarzt-Kontrolle")
//   👨‍⚕️ Arzt · 📍 Ort
//   Status-Badge (Geplant / Abgeschlossen / Abgesagt)
//
// Nutzt die UI-Primitives aus US-12:
//   - Card (accent="care", hoverable) → Basis-Karte
//   - Badge → Status-Anzeige
//
// Props:
//   appointment (object) — Das Termin-Objekt aus der API:
//     { id, title, doctor, location, datetime, notes, status }
//   onClick     (function?) — Optionaler Klick-Handler (für spätere Detail-Ansicht)

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import '../../styles/components/care/AppointmentCard.css';

// ── Status → Badge-Mapping ────────────────────────────────────────────────
// Object.freeze verhindert versehentliche Änderungen zur Laufzeit.
// Jeder Status bekommt eine Badge-Variante und einen deutschen Label-Text.
const STATUS_CONFIG = Object.freeze({
  scheduled: { variant: 'info', label: 'Geplant' },
  completed: { variant: 'optional', label: 'Abgeschlossen' },
  cancelled: { variant: 'warning', label: 'Abgesagt' },
});

// ── Datum-Formatierung ────────────────────────────────────────────────────
// Wir nutzen die native Intl.DateTimeFormat API — keine externe Library nötig.
// Beispiel: "2026-03-15T10:30:00Z" → "Sa, 15. März 2026" + "10:30 Uhr"
function formatDate(isoString) {
  const date = new Date(isoString);

  const dateStr = date.toLocaleDateString('de-DE', {
    weekday: 'short',
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

export default function AppointmentCard({ appointment, onClick }) {
  const { title, doctor, location, datetime, status } = appointment;
  const { dateStr, timeStr } = formatDate(datetime);
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled;

  return (
    <Card
      as="article"
      accent="care"
      hoverable={!!onClick}
      padding="md"
      shadow="sm"
      className="appointment-card"
      onClick={onClick}
    >
      {/* ── Datum + Uhrzeit ──────────────────────────────────────── */}
      <div className="appointment-card__datetime">
        <span className="appointment-card__date">📅 {dateStr}</span>
        <span className="appointment-card__time">{timeStr} Uhr</span>
      </div>

      {/* ── Titel ────────────────────────────────────────────────── */}
      <h3 className="appointment-card__title">{title}</h3>

      {/* ── Arzt + Ort ───────────────────────────────────────────── */}
      <div className="appointment-card__details">
        <span className="appointment-card__doctor">👨‍⚕️ {doctor}</span>
        <span className="appointment-card__separator">·</span>
        <span className="appointment-card__location">📍 {location}</span>
      </div>

      {/* ── Status-Badge ─────────────────────────────────────────── */}
      <div className="appointment-card__footer">
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>
    </Card>
  );
}
