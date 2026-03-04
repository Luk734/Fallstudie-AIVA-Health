# AIVA Health - Entwicklungsfortschritt
Stand: 04.03.2026

## Aktueller Branch: feat/termine-anzeigen (noch nicht gemerged)

## Abgeschlossene User Stories (in main)
- US-01 bis US-12

## US-13 Termine anzeigen: IMPLEMENTIERT (im Branch)
## US-14 Termin-Detail: IMPLEMENTIERT (im Branch)
## US-15 Termin anlegen: IMPLEMENTIERT (im Branch, committed 831dd0c)
## US-16 Termin bearbeiten und loeschen: IMPLEMENTIERT (im Branch, noch nicht committed)
- Backend: PUT /api/appointments/:id, DELETE /api/appointments/:id (Soft Delete)
- Frontend: AppointmentForm mit appointment Prop (Edit-Modus), ConfirmDialog, AppointmentEditPage
- Route /care/appointments/:id/edit, Detail-Buttons aktiviert

## components/ui/ (9): Alert, Badge, Button, Card, ConfirmDialog, Input, PageContainer, PageHeader, Spinner

## Naechste: US-17 (Vorsorge-Kalender)