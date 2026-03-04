// src/pages/modules/labs/MedicationCreatePage.jsx — Medikament erstellen (US-19)
//
// Dünner Page-Wrapper für das MedicationForm im Create-Modus.
// Die eigentliche Logik steckt in der MedicationForm-Komponente.
//
// Route: /labs/medications/new
//
// Pattern: Gleich wie AppointmentCreatePage (dünner Wrapper).
// → MedicationForm erkennt am Fehlen der medication-Prop, dass es
//   sich um den Create-Modus handelt (POST statt PUT).

import MedicationForm from '../../../components/labs/MedicationForm';

export default function MedicationCreatePage() {
  return <MedicationForm />;
}
