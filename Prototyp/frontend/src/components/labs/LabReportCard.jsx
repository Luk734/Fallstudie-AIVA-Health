// src/components/labs/LabReportCard.jsx — Einzelne Laborbefund-Karte (US-22, TASK-87)
//
// Zeigt einen Laborbefund als kompakte Karte an:
//   🔬 Titel (z.B. "Großes Blutbild")
//   Labor + Arzt
//   Datum + Anzahl Parameter
//   Klick auf Karte → Detail-Seite (/labs/reports/:id)
//
// Props:
//   report (object) — Der Befund aus der API:
//     { id, title, labName, doctorName, reportDate, notes, _count: { values: N } }
//
// Nutzt UI-Primitives aus US-12: Card, Badge

import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import '../../styles/components/labs/LabReportCard.css';

// ── Datum-Formatierung ───────────────────────────────────────────────
// "2026-01-15T00:00:00.000Z" → "15.01.2026"
function formatDate(isoString) {
  if (!isoString) return '–';
  return new Date(isoString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function LabReportCard({ report }) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      accent="labs"
      className="lab-report-card"
      onClick={() => navigate(`/labs/reports/${report.id}`)}
    >
      <div className="lab-report-card__content">
        {/* ── Obere Zeile: Titel + Datum ──────────────────────────── */}
        <div className="lab-report-card__header">
          <h3 className="lab-report-card__title">
            🔬 {report.title}
          </h3>
          <span className="lab-report-card__date">
            {formatDate(report.reportDate)}
          </span>
        </div>

        {/* ── Mittlere Zeile: Labor + Arzt ────────────────────────── */}
        <p className="lab-report-card__info">
          {report.labName} · {report.doctorName}
        </p>

        {/* ── Untere Zeile: Anzahl Parameter + ggf. Hinweis ──────── */}
        <div className="lab-report-card__footer">
          <Badge variant="labs">
            {report._count?.values || 0} Parameter
          </Badge>
          {report.notes && (
            <span className="lab-report-card__notes-hint" title={report.notes}>
              📝 Notiz
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
