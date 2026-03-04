// src/pages/modules/care/AppointmentDetailPage.jsx — Termin-Detail (US-14)
//
// Dieses Modul zeigt die Termin-Detail-Ansicht.
// Die eigentliche Logik steckt in der AppointmentDetail-Komponente.
// AppointmentDetailPage ist nur der "Rahmen" (Seite), der die Komponente einbettet.
//
// Zukünftige Erweiterungen (in späteren User Stories):
//   - Termin bearbeiten (US-16)

import AppointmentDetail from '../../../components/care/AppointmentDetail';

export default function AppointmentDetailPage() {
  return <AppointmentDetail />;
}
