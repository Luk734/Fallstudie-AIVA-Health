// src/pages/modules/care/AppointmentCreatePage.jsx — Termin erstellen (US-15)
//
// Dünner Page-Wrapper für das Termin-Formular.
// Die eigentliche Logik steckt in der AppointmentForm-Komponente.
// Dieses Pattern ist konsistent mit CarePage → AppointmentList
// und AppointmentDetailPage → AppointmentDetail.

import AppointmentForm from '../../../components/care/AppointmentForm';

export default function AppointmentCreatePage() {
  return <AppointmentForm />;
}
