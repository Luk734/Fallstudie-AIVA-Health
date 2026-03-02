// src/components/QuickActions.jsx — Schnellzugriff-Buttons (US-10)
//
// Zeigt zwei prominente Buttons auf dem Dashboard:
//   1. "Check-in starten" → /coach   (AIVA Coach Modul)
//   2. "Termin buchen"    → /care    (AIVA Care Modul)
//
// Warum eine eigene Komponente?
//   Die QuickActions könnten direkt in der DashboardPage stehen, aber als
//   eigene Komponente sind sie:
//   - Wiederverwendbar (z.B. auch auf anderen Seiten)
//   - Testbar (isoliert testbar ohne das gesamte Dashboard)
//   - Übersichtlich (DashboardPage bleibt schlank)
//
// useNavigate() erklärt:
//   React Router stellt diesen Hook bereit, um programmatisch zwischen
//   Seiten zu wechseln. navigate('/care') hat den gleichen Effekt wie ein
//   Klick auf einen <Link to="/care"> — nur eben als Funktion aufrufbar.

import { useNavigate } from 'react-router-dom';
import '../styles/components/QuickActions.css';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions" aria-label="Schnellzugriff">
      <button
        className="quick-actions__btn quick-actions__btn--coach"
        onClick={() => navigate('/coach')}
      >
        <span className="quick-actions__btn-icon" aria-hidden="true">💚</span>
        Check-in starten
      </button>

      <button
        className="quick-actions__btn quick-actions__btn--care"
        onClick={() => navigate('/care')}
      >
        <span className="quick-actions__btn-icon" aria-hidden="true">📅</span>
        Termin buchen
      </button>
    </section>
  );
}
