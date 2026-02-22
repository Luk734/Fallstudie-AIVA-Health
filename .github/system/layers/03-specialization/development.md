# Layer 3a: Development Specialization

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: Developer, UX Designer

---

## Convention-Referenzen

### Frontend Patterns & Best Practices
→ See [Convention 14: Frontend](../../conventions/fullstack/14-frontend.md)

### TypeScript Patterns & Best Practices
→ See [Convention 01: Code Structure](../../conventions/code-architecture/01-code-structure.md)

### Component Library & Design Tokens
→ See [Convention 18: Design System](../../conventions/other/18-design-system.md)

### TDD für Frontend, Testing Integration
→ See [Convention 12: Testing Strategy](../../conventions/process-quality/12-testing-strategy.md)

---

## Health-App UI Patterns

### Patient Dashboard Component
```typescript
// Beispiel: PatientDashboard — Tech-agnostisch (TypeScript)
interface PatientDashboardProps {
  patient: Patient;
  appointments: Appointment[];
  medications: Medication[];
  vitals: VitalSignReading[];
}

// Struktur eines Health-Dashboard
const PatientDashboard = ({ patient, appointments, medications, vitals }: PatientDashboardProps) => {
  // Sortierte nächste Termine
  const upcomingAppointments = appointments
    .filter(a => a.scheduledAt > new Date())
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    .slice(0, 3);

  // Überfällige Medikamente hervorheben
  const overdueMedications = medications
    .filter(m => m.nextDueAt < new Date() && !m.taken);

  // Abnormale Vitalwerte
  const abnormalVitals = vitals.filter(v => v.isAbnormal);

  return {
    upcomingAppointments,
    overdueMedications,
    abnormalVitals,
    hasUrgentItems: overdueMedications.length > 0 || abnormalVitals.length > 0
  };
};
```

### Medication Reminder Component
```typescript
interface MedicationReminderProps {
  medication: Medication;
  onTake: (medicationId: string) => void;
  onSnooze: (medicationId: string, minutes: number) => void;
  onSkip: (medicationId: string, reason: string) => void;
}

// Thomas (56) braucht große, klare Buttons
// Laura (32) braucht schnelle Swipe-Actions
```

### Vital Sign Chart
```typescript
interface VitalSignChartProps {
  readings: VitalSignReading[];
  type: 'heartRate' | 'bloodPressure' | 'weight' | 'bloodSugar';
  timeRange: '7d' | '30d' | '90d' | '1y';
  referenceRange: { min: number; max: number };
}

// Abnormale Werte visuell hervorheben (rot)
// Referenzbereich als grüne Zone
// Thomas muss Werte auf einen Blick verstehen
```

---

## AIVA Health Design Tokens

```typescript
// AIVA Health Design Tokens (eigenes Design System)
export const aivaTokens = {
  colors: {
    // Primärfarben (Health & Trust)
    primary: 'var(--aiva-color-primary)',         // Beruhigendes Blau
    primaryLight: 'var(--aiva-color-primary-light)',
    primaryDark: 'var(--aiva-color-primary-dark)',
    
    // Sekundärfarben (Vitalität & Gesundheit) 
    secondary: 'var(--aiva-color-secondary)',       // Frisches Grün
    
    // Status-Farben (Health-spezifisch)
    normal: 'var(--aiva-color-normal)',             // Grün — Werte im Normbereich
    warning: 'var(--aiva-color-warning)',           // Gelb — Werte grenzwertig
    critical: 'var(--aiva-color-critical)',         // Rot — Werte abnormal
    overdue: 'var(--aiva-color-overdue)',           // Orange — Medikament überfällig
    
    // Module-Farben
    care: 'var(--aiva-module-care)',                // AIVA Care
    coach: 'var(--aiva-module-coach)',              // AIVA Coach
    labs: 'var(--aiva-module-labs)',                 // AIVA Labs
    family: 'var(--aiva-module-family)',             // AIVA Family
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  typography: {
    // Thomas-freundlich: Mindestens 16px
    fontSizeBase: '16px',
    fontSizeLg: '18px',
    fontSizeXl: '24px',
    fontSizeHeading: '32px',
    lineHeight: 1.5,
  },
  
  accessibility: {
    minTouchTarget: '48px',    // WCAG 2.1 AA
    focusRingWidth: '3px',
    focusRingColor: 'var(--aiva-color-primary)',
    highContrastMode: true,
  },
};
```

**Vollständiges Design System**: Siehe [Convention 18: AIVA Health Design System](../../conventions/other/18-design-system.md)

---

## Health-App Integration Patterns

### Wearable Data Sync
```typescript
// Wearable-Integration Pattern (Apple Health, Google Fit, Fitbit)
interface WearableDataSync {
  syncVitalSigns(source: WearableSource): Promise<VitalSignReading[]>;
  getLastSyncTimestamp(source: WearableSource): Promise<Date | null>;
  requestPermissions(dataTypes: HealthDataType[]): Promise<PermissionResult>;
}

type WearableSource = 'apple_health' | 'google_fit' | 'fitbit' | 'garmin';
type HealthDataType = 'heartRate' | 'steps' | 'sleep' | 'bloodPressure' | 'weight';

// MVP: Mock-Implementation
class MockWearableSync implements WearableDataSync {
  async syncVitalSigns(source: WearableSource): Promise<VitalSignReading[]> {
    console.log(`[MOCK] Syncing from ${source}`);
    return mockVitalSigns;
    // TODO: Post-MVP — echte Apple Health / Google Fit API
  }
}
```

### Doctolib Integration (AIVA Care)
```typescript
// Doctolib-Integration für Terminmanagement
interface DoctolibIntegration {
  searchDoctors(specialty: MedicalSpecialty, location: GeoLocation): Promise<Doctor[]>;
  getAvailableSlots(doctorId: string, dateRange: DateRange): Promise<TimeSlot[]>;
  bookAppointment(slot: TimeSlot, patient: Patient): Promise<Appointment>;
  cancelAppointment(appointmentId: string): Promise<void>;
}

// MVP: Mock-Implementation
class MockDoctolibService implements DoctolibIntegration {
  async searchDoctors(): Promise<Doctor[]> {
    return mockDoctors;
    // TODO: Post-MVP — echte Doctolib API
  }
}
```

### ePA Integration (AIVA Labs)
```typescript
// Elektronische Patientenakte (ePA) Integration
interface EPAIntegration {
  fetchLabResults(patientId: string): Promise<LabResult[]>;
  fetchMedications(patientId: string): Promise<Medication[]>;
  fetchVaccinations(patientId: string): Promise<Vaccination[]>;
  uploadDocument(patientId: string, document: HealthDocument): Promise<void>;
}

// MVP: Mock-Implementation
class MockEPAService implements EPAIntegration {
  async fetchLabResults(): Promise<LabResult[]> {
    return mockLabResults;
    // TODO: Post-MVP — echte ePA/FHIR API
  }
}
```

---

## Component Patterns

### Health Data Display
```typescript
// Pattern: Vital Sign mit Referenzbereich
interface VitalSignDisplayProps {
  label: string;
  value: number;
  unit: string;
  referenceRange: { min: number; max: number };
  trend?: 'rising' | 'falling' | 'stable';
}

// Pattern: Medication Card
interface MedicationCardProps {
  medication: Medication;
  isDue: boolean;
  isOverdue: boolean;
  onTake: () => void;
  onSnooze: () => void;
}

// Pattern: Appointment Card
interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule: () => void;
  onCancel: () => void;
  onAddToCalendar: () => void;
}
```

---

## Rapid Prototyping

### Health-App Prototype Pattern
```typescript
// Minimal viable component for AIVA Health Prototyping
const mockAppointments: Appointment[] = [
  { 
    id: '1', 
    doctorName: 'Dr. Müller', 
    specialty: 'Hausarzt',
    scheduledAt: new Date('2026-03-15T10:00:00'),
    reminderSent: false 
  },
  { 
    id: '2', 
    doctorName: 'Dr. Schmidt', 
    specialty: 'Kardiologie',
    scheduledAt: new Date('2026-03-20T14:30:00'),
    reminderSent: true 
  },
];

// Prototype: Hardcoded data, no error handling, no tests
// Ziel: User Flow validieren, nicht Production-Code
```
