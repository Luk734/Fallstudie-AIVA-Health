// src/pages/modules/labs/LabReportDetailPage.jsx — Laborbefund-Detail (US-22, TASK-87)
//
// Zeigt einen einzelnen Laborbefund mit allen Messwerten an.
// Erreichbar über: /labs/reports/:id (Klick auf LabReportCard)
//
// Layout:
//   PageHeader mit Zurück-Button + Befund-Titel
//   Info-Card: Labor, Arzt, Datum, Notizen
//   Werte-Tabelle: Parameter | Wert | Einheit | Referenzbereich
//
// Datenabruf:
//   GET /api/labs/:id → Befund mit allen Laborwerten (values)
//
// Die Referenzbereiche werden hier als Text angezeigt (z.B. "12.0 – 16.0").
// US-23 wird diese später durch eine Ampel-/Skala-Komponente ersetzen.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PageContainer from '../../../components/ui/PageContainer';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Alert from '../../../components/ui/Alert';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import LabValueGauge from '../../../components/labs/LabValueGauge';
import LabValueHistory from '../../../components/labs/LabValueHistory';
import labExplanations from '../../../data/labExplanations.json';
import '../../../styles/pages/modules/labs/LabReportDetailPage.css';

// ── Datum-Formatierung ───────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '–';
  return new Date(isoString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ── Wert-Status bestimmen (für US-23 vorbereitet) ────────────────────
// Gibt zurück, ob ein Wert im Normalbereich liegt.
// Wird aktuell für CSS-Klassen genutzt (farbige Zelle).
function getValueStatus(value, min, max) {
  if (min == null || max == null) return 'unknown';
  if (value < min) return 'low';
  if (value > max) return 'high';
  return 'normal';
}

export default function LabReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // US-23: Welche Zeilen sind aufgeklappt? (Set von LabValue-IDs)
  const [expandedIds, setExpandedIds] = useState(new Set());

  // ── Befund laden ───────────────────────────────────────────────────
  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/labs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error('Laborbefund nicht gefunden.');
          throw new Error('Befund konnte nicht geladen werden.');
        }

        const data = await res.json();
        setReport(data.report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id, token]);

  // ── Ladeindikator ──────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer maxWidth="md">
        <div className="lab-detail__spinner">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  // ── Fehler ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <PageContainer maxWidth="md">
        <Alert variant="error">{error}</Alert>
        <Button variant="outline" onClick={() => navigate('/labs')}>
          ← Zurück zur Übersicht
        </Button>
      </PageContainer>
    );
  }

  if (!report) return null;

  // ── Zähler: Auffällige Werte ───────────────────────────────────────
  const abnormalCount = report.values.filter(
    (v) => getValueStatus(v.value, v.referenceMin, v.referenceMax) !== 'normal'
      && getValueStatus(v.value, v.referenceMin, v.referenceMax) !== 'unknown'
  ).length;

  return (
    <PageContainer maxWidth="md">
      {/* ── Header mit Zurück-Button ────────────────────────────────── */}
      <PageHeader
        title={`🔬 ${report.title}`}
        subtitle={formatDate(report.reportDate)}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/labs')}
        className="lab-detail__back-btn"
      >
        ← Zurück
      </Button>

      {/* ── Info-Card: Labor, Arzt, Notizen ─────────────────────────── */}
      <Card className="lab-detail__info-card">
        <div className="lab-detail__info-grid">
          <div className="lab-detail__info-item">
            <span className="lab-detail__info-label">Labor</span>
            <span className="lab-detail__info-value">{report.labName}</span>
          </div>
          <div className="lab-detail__info-item">
            <span className="lab-detail__info-label">Arzt</span>
            <span className="lab-detail__info-value">{report.doctorName}</span>
          </div>
          <div className="lab-detail__info-item">
            <span className="lab-detail__info-label">Datum</span>
            <span className="lab-detail__info-value">{formatDate(report.reportDate)}</span>
          </div>
          <div className="lab-detail__info-item">
            <span className="lab-detail__info-label">Parameter</span>
            <span className="lab-detail__info-value">
              {report.values.length} Werte
              {abnormalCount > 0 && (
                <Badge variant="warning" className="lab-detail__abnormal-badge">
                  {abnormalCount} auffällig
                </Badge>
              )}
            </span>
          </div>
        </div>
        {report.notes && (
          <div className="lab-detail__notes">
            <span className="lab-detail__info-label">📝 Notizen</span>
            <p className="lab-detail__notes-text">{report.notes}</p>
          </div>
        )}
      </Card>

      {/* ── Werte-Tabelle mit aufklappbarer Detail-Ansicht (US-23) ──── */}
      {/* Jede Zeile zeigt: Parameter, Wert, Einheit, Referenz, Status  */}
      {/* Klick auf eine Zeile klappt die Detail-Ansicht auf:           */}
      {/*   → LabValueGauge (Ampel-Skala mit Pfeil)                     */}
      {/*   → LabValueHistory (Mini-Balkendiagramm, letzte 3 Werte)     */}
      {/*   → Erklärungstext aus labExplanations.json                   */}
      <section className="lab-detail__values-section">
        <h2 className="lab-detail__section-title">Laborwerte</h2>
        <p className="lab-detail__section-hint">
          Tippe auf einen Wert für Details und Erklärung
        </p>
        <div className="lab-detail__table-wrapper">
          <table className="lab-detail__table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th className="lab-detail__th-right">Wert</th>
                <th>Einheit</th>
                <th>Referenz</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.values.map((val) => {
                const status = getValueStatus(val.value, val.referenceMin, val.referenceMax);
                const isExpanded = expandedIds.has(val.id);
                const explanation = labExplanations[val.parameter] || null;

                return (
                  <>
                    {/* ── Kompakte Zeile (klickbar) ────────────────── */}
                    <tr
                      key={val.id}
                      className={`lab-detail__row lab-detail__row--${status} lab-detail__row--clickable ${isExpanded ? 'lab-detail__row--expanded' : ''}`}
                      onClick={() => {
                        setExpandedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(val.id)) next.delete(val.id);
                          else next.add(val.id);
                          return next;
                        });
                      }}
                    >
                      <td className="lab-detail__param">
                        {isExpanded ? '▾' : '▸'} {val.parameter}
                      </td>
                      <td className="lab-detail__value">{val.value}</td>
                      <td className="lab-detail__unit">{val.unit}</td>
                      <td className="lab-detail__reference">
                        {val.referenceMin != null && val.referenceMax != null
                          ? `${val.referenceMin} – ${val.referenceMax}`
                          : '–'}
                      </td>
                      <td className="lab-detail__status">
                        {status === 'normal' && <span className="lab-detail__status-dot lab-detail__status-dot--normal">●</span>}
                        {status === 'high' && <span className="lab-detail__status-dot lab-detail__status-dot--high">▲</span>}
                        {status === 'low' && <span className="lab-detail__status-dot lab-detail__status-dot--low">▼</span>}
                        {status === 'unknown' && <span className="lab-detail__status-dot lab-detail__status-dot--unknown">–</span>}
                      </td>
                    </tr>

                    {/* ── Aufklappbare Detail-Zeile (US-23) ────────── */}
                    {isExpanded && (
                      <tr key={`${val.id}-detail`} className="lab-detail__expand-row">
                        <td colSpan={5} className="lab-detail__expand-cell">
                          {/* Ampel-Skala mit Pfeil-Marker */}
                          <LabValueGauge
                            value={val.value}
                            min={val.referenceMin}
                            max={val.referenceMax}
                            unit={val.unit}
                            parameter={val.parameter}
                            explanation={explanation}
                          />
                          {/* Mini-Verlaufsdiagramm (letzte 3 Werte) */}
                          <LabValueHistory
                            parameter={val.parameter}
                            token={token}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Legende (erweitert mit Grenzwertig) ─────────────────────── */}
      <div className="lab-detail__legend">
        <span className="lab-detail__legend-item">
          <span className="lab-detail__status-dot lab-detail__status-dot--normal">●</span> Normal
        </span>
        <span className="lab-detail__legend-item">
          <span className="lab-detail__status-dot lab-detail__status-dot--high">▲</span> Erhöht
        </span>
        <span className="lab-detail__legend-item">
          <span className="lab-detail__status-dot lab-detail__status-dot--low">▼</span> Erniedrigt
        </span>
      </div>

      {/* ── Hinweis: Keine ärztliche Beratung ──────────────────────── */}
      <div className="lab-detail__disclaimer">
        <p>⚕️ Diese Erklärungen dienen der Orientierung und ersetzen keine ärztliche Beratung. Besprich auffällige Werte immer mit deinem Arzt.</p>
      </div>
    </PageContainer>
  );
}
