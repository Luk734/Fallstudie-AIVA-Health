// src/pages/core/DashboardPage.jsx — Dashboard / Startseite (US-10)
//
// Die zentrale Übersichtsseite der App. Zeigt dem User auf einen Blick:
//   1. Persönliche Begrüßung (tageszeitabhängig)
//   2. Nächster Termin (AIVA Care)
//   3. Täglicher Check-in Status (AIVA Coach)
//   4. Nächste Medikamenteneinnahme (AIVA Labs)
//   5. Quick-Action Buttons für die wichtigsten Aktionen
//
// Warum Mock-Daten?
//   Die Module Care, Coach und Labs sind noch nicht implementiert.
//   Deshalb simulieren wir die Daten als Konstanten direkt in dieser Datei.
//   Später werden diese durch echte API-Calls ersetzt (z.B. useSWR oder useEffect).
//
// Warum kein eigener Header mehr?
//   Seit US-09 haben wir die Bottom-Navigation (AppLayout).
//   Profil, Datenschutz und Logout sind über die Navigation erreichbar.
//   → Der alte Header mit Buttons ist überflüssig geworden.

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GreetingCard from '../../components/GreetingCard';
import SummaryCard from '../../components/SummaryCard';
import QuickActions from '../../components/QuickActions';
import '../../styles/pages/core/DashboardPage.css';

// ── Mock-Daten ────────────────────────────────────────────────────────────────
// Diese Daten simulieren, was später von den Backend-APIs kommen wird.
// Sie stehen AUSSERHALB der Komponente, damit sie nicht bei jedem Render
// neu erstellt werden (Performance-Optimierung bei statischen Daten).

const mockTermin = {
  arzt: 'Dr. Müller',
  fachrichtung: 'Hausarzt',
  datum: 'Mo, 3. Mär 2026',
  uhrzeit: '10:00 Uhr',
};

const mockCheckin = {
  erledigt: false,           // Noch nicht ausgefüllt
  letzter: 'Gestern, 18:30', // Letzter Check-in
};

const mockMedikament = {
  name: 'Ibuprofen 400mg',
  uhrzeit: '14:00 Uhr',
  hinweis: 'Nach dem Essen einnehmen',
};

export default function DashboardPage() {
  // user aus dem AuthContext holen — wir brauchen den Vornamen für die Begrüßung
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      {/* ── 1. Persönliche Begrüßung ─────────────────────────────────── */}
      {/* GreetingCard liest den Vornamen und zeigt z.B.                  */}
      {/* "Guten Morgen, Laura 👋" + das heutige Datum                   */}
      <GreetingCard firstName={user?.firstName} />

      {/* ── Profil-Hinweis (wenn noch kein Profil angelegt) ──────────── */}
      {/* Zeigt einen freundlichen Hinweis mit Link zur Profilseite.      */}
      {/* Verschwindet sobald der User seinen Vornamen eingetragen hat.   */}
      {!user?.firstName && (
        <div className="dashboard-profile-hint">
          <p>
            <strong>Tipp:</strong> Vervollständige dein Profil, damit
            AIVA Health dich persönlich begrüßen kann.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="dashboard-profile-hint__btn"
          >
            Profil anlegen →
          </button>
        </div>
      )}

      {/* ── 2. Summary-Karten ────────────────────────────────────────── */}
      {/* Drei Karten in einem vertikalen Stack. Jede zeigt eine          */}
      {/* Zusammenfassung aus einem der drei Haupt-Module.                */}
      <div className="dashboard-cards">

        {/* ── Nächster Termin (AIVA Care) ───────────────────────────── */}
        <SummaryCard
          icon="📅"
          title="Nächster Termin"
          variant="care"
          actionLabel="Alle Termine"
          onAction={() => navigate('/care')}
        >
          <p>
            <strong>{mockTermin.arzt}</strong> — {mockTermin.fachrichtung}
          </p>
          <p>{mockTermin.datum}, {mockTermin.uhrzeit}</p>
        </SummaryCard>

        {/* ── Täglicher Check-in (AIVA Coach) ──────────────────────── */}
        <SummaryCard
          icon={mockCheckin.erledigt ? '✅' : '💚'}
          title="Täglicher Check-in"
          variant="coach"
          actionLabel={mockCheckin.erledigt ? 'Ergebnis ansehen' : 'Jetzt ausfüllen'}
          onAction={() => navigate('/coach')}
        >
          {mockCheckin.erledigt ? (
            <p>Heute bereits ausgefüllt ✓</p>
          ) : (
            <>
              <p><strong>Noch nicht ausgefüllt</strong></p>
              <p className="dashboard-cards__hint">Letzter: {mockCheckin.letzter}</p>
            </>
          )}
        </SummaryCard>

        {/* ── Nächste Medikamenteneinnahme (AIVA Labs) ─────────────── */}
        <SummaryCard
          icon="💊"
          title="Nächste Einnahme"
          variant="labs"
          actionLabel="Medikamentenplan"
          onAction={() => navigate('/labs')}
        >
          <p>
            <strong>{mockMedikament.name}</strong> — {mockMedikament.uhrzeit}
          </p>
          <p className="dashboard-cards__hint">{mockMedikament.hinweis}</p>
        </SummaryCard>
      </div>

      {/* ── 3. Quick-Action Buttons ──────────────────────────────────── */}
      {/* Zwei prominente Buttons: "Check-in starten" + "Termin buchen"  */}
      <QuickActions />
    </div>
  );
}
