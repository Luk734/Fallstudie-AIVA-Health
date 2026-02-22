# Convention 14 — Frontend

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Frontend-Patterns, Component Architecture, State Management für AIVA Health.  
> **Geladen von:** Developer Agent, UX-Designer Agent

---

## Component Architecture

### Atomic Design (Empfehlung)

```
Atoms       → Button, Input, Icon, Badge
Molecules   → FormField, MedicationCard, VitalSignBadge
Organisms   → AppointmentList, MedicationDashboard, CheckInForm
Templates   → DashboardLayout, ProfileLayout
Pages       → DashboardPage, AppointmentsPage, LabResultsPage
```

### Component Patterns

```typescript
// ✅ Functional Components mit klaren Props
interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  compact?: boolean;
}

function AppointmentCard({ 
  appointment, 
  onCancel, 
  onReschedule, 
  compact = false 
}: AppointmentCardProps) {
  return (
    <div className={`appointment-card ${compact ? 'appointment-card--compact' : ''}`}>
      <h3>{appointment.provider}</h3>
      <time dateTime={appointment.date.toISOString()}>
        {formatDate(appointment.date)}
      </time>
      {appointment.status === 'BOOKED' && (
        <div className="appointment-card__actions">
          {onReschedule && <Button variant="secondary" onClick={() => onReschedule(appointment.id)}>Verschieben</Button>}
          {onCancel && <Button variant="danger" onClick={() => onCancel(appointment.id)}>Absagen</Button>}
        </div>
      )}
    </div>
  );
}
```

---

## State Management

### Local State (Preferred)

```typescript
// ✅ Einfacher lokaler State für Component-spezifische Daten
function CheckInForm() {
  const [mood, setMood] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await checkInService.submit({ mood, notes });
    } finally {
      setIsSubmitting(false);
    }
  }
}
```

### Global State (Nur wenn nötig)

Nur für cross-module shared State:

| State | Scope | Beispiel |
|-------|-------|----------|
| Auth/User | Global | Aktueller Patient, Login-Status |
| Consent | Global | Aktive Consents |
| Notifications | Global | Unread Count, Push-Status |
| Appointments | Module (Care) | Termin-Liste |
| Medications | Module (Labs) | Medikamenten-Liste |

```typescript
// ✅ Context für Auth (global)
interface AuthContextType {
  patient: Patient | null;
  isAuthenticated: boolean;
  consent: ConsentScope[];
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

---

## Accessibility (A11y)

### AIVA Health Anforderungen

Thomas Wagner (56) hat Bluthochdruck und braucht:

| Anforderung | Umsetzung |
|-------------|-----------|
| **Lesbarkeit** | Min. 16px Base Font, 1.5 Line Height |
| **Kontrast** | WCAG AA (4.5:1 Text, 3:1 Large Text) |
| **Touch Targets** | Min. 44x44px |
| **Keyboard Navigation** | Alle interaktiven Elemente erreichbar |
| **Screen Reader** | Semantisches HTML, ARIA Labels |
| **Farben** | Nicht als einziges Unterscheidungsmerkmal |

### Implementierung

```typescript
// ✅ Accessible Vital Sign Display
function VitalSignDisplay({ vitalSign }: { vitalSign: VitalSign }) {
  const status = getVitalSignStatus(vitalSign.type, vitalSign.value);
  
  return (
    <div 
      className={`vital-sign vital-sign--${status}`}
      role="status"
      aria-label={`${vitalSign.type}: ${vitalSign.value} ${vitalSign.unit}, Status: ${status}`}
    >
      <span className="vital-sign__value">{vitalSign.value}</span>
      <span className="vital-sign__unit">{vitalSign.unit}</span>
      {/* Icon + Text, nicht nur Farbe! */}
      <StatusIndicator status={status} />
    </div>
  );
}

// ✅ Accessible Status (Icon + Text + Farbe)
function StatusIndicator({ status }: { status: 'normal' | 'borderline' | 'abnormal' }) {
  const icons = { normal: '✓', borderline: '⚠', abnormal: '!' };
  const labels = { normal: 'Normal', borderline: 'Grenzwertig', abnormal: 'Auffällig' };
  
  return (
    <span className={`status status--${status}`} aria-hidden="false">
      <span className="status__icon">{icons[status]}</span>
      <span className="status__label">{labels[status]}</span>
    </span>
  );
}
```

---

## Responsive Design

### AIVA Health Breakpoints

```css
/* Mobile First */
:root {
  --breakpoint-sm: 480px;   /* Small phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}

/* Usage */
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--aiva-spacing-md);
}

@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

---

## Performance Best Practices

- **Lazy Loading**: Module/Seiten per Code Splitting
- **Image Optimization**: WebP, Lazy Load für Bilder
- **Bundle Size**: Max 200KB initial (gzip) für MVP
- **Caching**: Service Worker für Offline-Basics
- **Debounce**: Sucheingaben, Resize Events (300ms)

---

## Cross-References

- **Design System** → [Convention 18: Design System](../other/18-design-system.md)
- **Development Layer** → [Layer 03: Development](../../system/layers/03-specialization/development.md)
- **Personas** → [Context: Personas](../../context/personas.md) (Thomas Accessibility)
