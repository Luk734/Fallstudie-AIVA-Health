// src/pages/modules/care/CarePage.jsx — AIVA Care Modul (US-13, US-17)
//
// Hauptseite des Care-Moduls. Zeigt die Termin-Übersicht
// und einen Link zum Vorsorge-Kalender.
//
// US-17: Link zum Vorsorge-Kalender hinzugefügt.
//   Der User kann von hier aus zur Vorsorge-Seite navigieren,
//   die seine GKV-Vorsorgeuntersuchungen nach Alter + Geschlecht zeigt.

import { useNavigate } from 'react-router-dom';
import AppointmentList from '../../../components/care/AppointmentList';
import Button from '../../../components/ui/Button';

export default function CarePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Vorsorge-Kalender Button (US-17) */}
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/care/prevention')}
        >
          🏥 Vorsorge-Kalender
        </Button>
      </div>

      {/* Termin-Übersicht (US-13) */}
      <AppointmentList />
    </>
  );
}
