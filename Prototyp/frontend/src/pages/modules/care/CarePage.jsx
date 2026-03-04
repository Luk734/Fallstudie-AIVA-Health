// src/pages/modules/care/CarePage.jsx — AIVA Care Modul (US-13)
//
// Dieses Modul zeigt die Termin-Übersicht.
// Die eigentliche Logik steckt in der AppointmentList-Komponente.
// CarePage ist nur der "Rahmen" (Seite), der die Komponente einbettet.
//
// Zukünftige Erweiterungen (in späteren User Stories):
//   - Termin erstellen/bearbeiten (US-15, US-16)
//   - Vorsorge-Kalender (US-17)
//   - Termin-Erinnerungen (US-18)

import AppointmentList from '../../../components/care/AppointmentList';

export default function CarePage() {
  return <AppointmentList />;
}
