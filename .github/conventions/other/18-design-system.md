# Convention 18 — AIVA Health Design System

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Design Tokens, Component Library, Accessibility, Visual Language.  
> **Geladen von:** UX-Designer Agent, Developer Agent

---

## Design Philosophy

AIVA Health ist ein **Gesundheitsassistent** — das Design muss:

1. **Vertrauen ausstrahlen** (medizinischer Kontext)
2. **Barrierearm sein** (Thomas: 56, Bluthochdruck, größere Schrift)
3. **Klar & beruhigend** wirken (keine aggressiven Farben)
4. **Konsistent** über alle 4 Module sein

---

## Design Tokens

### Farben

```css
/* === Primary === */
--aiva-primary-50:  #E8F5E9;   /* Lightest Green */
--aiva-primary-100: #C8E6C9;
--aiva-primary-200: #A5D6A7;
--aiva-primary-300: #81C784;
--aiva-primary-400: #66BB6A;
--aiva-primary-500: #4CAF50;   /* Main Brand — "Gesundheitsgrün" */
--aiva-primary-600: #43A047;
--aiva-primary-700: #388E3C;
--aiva-primary-800: #2E7D32;
--aiva-primary-900: #1B5E20;   /* Darkest */

/* === Secondary (Calm Blue) === */
--aiva-secondary-50:  #E3F2FD;
--aiva-secondary-100: #BBDEFB;
--aiva-secondary-300: #64B5F6;
--aiva-secondary-500: #2196F3;  /* Main Secondary */
--aiva-secondary-700: #1976D2;
--aiva-secondary-900: #0D47A1;

/* === Semantic Colors === */
--aiva-success:  #4CAF50;     /* Normaler Wert */
--aiva-warning:  #FF9800;     /* Leicht erhöht / Aufmerksamkeit */
--aiva-danger:   #F44336;     /* Kritisch / Arzt aufsuchen */
--aiva-info:     #2196F3;     /* Nächster Termin / Info */

/* === Neutral === */
--aiva-neutral-50:  #FAFAFA;
--aiva-neutral-100: #F5F5F5;
--aiva-neutral-200: #EEEEEE;
--aiva-neutral-300: #E0E0E0;
--aiva-neutral-500: #9E9E9E;
--aiva-neutral-700: #616161;
--aiva-neutral-900: #212121;

/* === Background === */
--aiva-bg-primary:   #FFFFFF;
--aiva-bg-secondary: #F5F7FA;
--aiva-bg-card:      #FFFFFF;
--aiva-bg-overlay:   rgba(0, 0, 0, 0.5);
```

### Modul-Farben (Akzente)

| Modul | Primärfarbe | Verwendung |
|-------|-------------|------------|
| AIVA Care | `#4CAF50` (Grün) | Termine, Vorsorge |
| AIVA Labs | `#2196F3` (Blau) | Befunde, Medikation |
| AIVA Coach | `#FF9800` (Orange) | Empfehlungen, Check-In |
| AIVA Family | `#9C27B0` (Lila) | Familienkonto |

---

### Typografie

```css
/* === Font Family === */
--aiva-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--aiva-font-mono:   'JetBrains Mono', 'Fira Code', monospace;

/* === Font Sizes (rem-based, 1rem = 16px) === */
--aiva-text-xs:   0.75rem;    /* 12px */
--aiva-text-sm:   0.875rem;   /* 14px */
--aiva-text-base: 1rem;       /* 16px — Minimum für Thomas */
--aiva-text-lg:   1.125rem;   /* 18px */
--aiva-text-xl:   1.25rem;    /* 20px */
--aiva-text-2xl:  1.5rem;     /* 24px */
--aiva-text-3xl:  1.875rem;   /* 30px */
--aiva-text-4xl:  2.25rem;    /* 36px */

/* === Line Heights === */
--aiva-leading-tight:  1.25;
--aiva-leading-normal: 1.5;    /* Standard — gut lesbar */
--aiva-leading-relaxed: 1.75;  /* Für lange Texte */

/* === Font Weights === */
--aiva-font-normal:   400;
--aiva-font-medium:   500;
--aiva-font-semibold: 600;
--aiva-font-bold:     700;
```

> **Accessibility-Regel**: Minimale Schriftgröße ist **16px** (`1rem`). Nie kleiner!  
> (Persona Thomas: 56 Jahre, braucht gut lesbare Schrift)

---

### Spacing

```css
/* === 4px Grid System === */
--aiva-space-0:  0;
--aiva-space-1:  0.25rem;   /* 4px */
--aiva-space-2:  0.5rem;    /* 8px */
--aiva-space-3:  0.75rem;   /* 12px */
--aiva-space-4:  1rem;      /* 16px */
--aiva-space-5:  1.25rem;   /* 20px */
--aiva-space-6:  1.5rem;    /* 24px */
--aiva-space-8:  2rem;      /* 32px */
--aiva-space-10: 2.5rem;    /* 40px */
--aiva-space-12: 3rem;      /* 48px */
--aiva-space-16: 4rem;      /* 64px */
```

---

### Border Radius

```css
--aiva-radius-none: 0;
--aiva-radius-sm:   0.25rem;  /* 4px — Subtle */
--aiva-radius-md:   0.5rem;   /* 8px — Cards */
--aiva-radius-lg:   0.75rem;  /* 12px — Modals */
--aiva-radius-xl:   1rem;     /* 16px — Large Cards */
--aiva-radius-full: 9999px;   /* Pills, Avatars */
```

---

### Shadows

```css
--aiva-shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);
--aiva-shadow-md:  0 4px 6px rgba(0, 0, 0, 0.07);
--aiva-shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1);
--aiva-shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.1);
```

---

## Component Library

### Atomic Design Hierarchy

```
atoms/
  Button, Input, Badge, Icon, Avatar, Spinner
molecules/
  FormField, SearchBar, VitalSignBadge, MedicationItem, NotificationToast
organisms/
  AppointmentCard, LabResultPanel, MedicationList, VitalSignChart,
  ConsentDialog, NavigationBar, HealthDashboard
templates/
  DashboardLayout, DetailLayout, FormLayout, OnboardingLayout
pages/
  CareOverview, LabsDetail, CoachCheckIn, FamilyManagement
```

### Button Variants

```
┌──────────────────────────────────────────────────┐
│  [████ Primary ████]  — Hauptaktion              │
│  [░░░░ Secondary ░░░]  — Sekundäre Aktion        │
│  [     Tertiary    ]  — Text-only Link            │
│  [████ Danger ████ ]  — Löschen / Kritisch        │
│  [████ Success ████]  — Bestätigen / Speichern    │
└──────────────────────────────────────────────────┘
```

**Sizing**:

| Size | Height | Padding | Font Size | Touch Target |
|------|--------|---------|-----------|-------------|
| sm | 32px | 12px 16px | 14px | 44px min |
| md | 40px | 12px 20px | 16px | 44px min |
| lg | 48px | 16px 24px | 18px | 48px |

> **Accessibility**: Alle Buttons haben min. **44px Touch Target** (WCAG 2.5.5)

---

### Health-Specific Components

#### VitalSignBadge

```
┌─────────────────────────┐
│  ❤️  Blutdruck           │
│  127/82 mmHg            │
│  ●  Leicht erhöht       │
│  Letzte Messung: 14:30  │
└─────────────────────────┘
```

**Farb-Kodierung:**

| Status | Farbe | Bedeutung |
|--------|-------|-----------|
| Normal | `--aiva-success` | Im Normbereich |
| Leicht erhöht | `--aiva-warning` | Beobachten |
| Kritisch | `--aiva-danger` | Arzt aufsuchen |
| Keine Daten | `--aiva-neutral-300` | Messung fehlt |

#### MedicationCard

```
┌─────────────────────────────────────┐
│  💊  Ramipril 5mg                   │
│  1x täglich, morgens                │
│  ■■■■■■■■□□ 80% Compliance         │
│  Nächste Einnahme: 08:00            │
│  [Eingenommen ✓]  [Übersprungen]    │
└─────────────────────────────────────┘
```

#### AppointmentCard

```
┌─────────────────────────────────────┐
│  📅  Vorsorgeuntersuchung           │
│  Dr. Müller — Hausarzt              │
│  Mi, 15.02.2026 — 10:00 Uhr        │
│  Status: Bestätigt ●               │
│  [Details]  [Absagen]               │
└─────────────────────────────────────┘
```

#### ConsentDialog

```
┌─────────────────────────────────────┐
│  🔒  Datenzugriff erforderlich      │
│                                     │
│  AIVA Coach möchte auf Ihre         │
│  Vitaldaten zugreifen, um           │
│  personalisierte Empfehlungen       │
│  zu erstellen.                      │
│                                     │
│  Betroffene Daten:                  │
│  • Blutdruckwerte                   │
│  • Herzfrequenz                     │
│                                     │
│  ℹ️  Sie können die Einwilligung     │
│  jederzeit unter Einstellungen      │
│  widerrufen.                        │
│                                     │
│  [Ablehnen]  [████ Zustimmen ████]  │
└─────────────────────────────────────┘
```

---

## Accessibility Standards

### WCAG AA Compliance (Minimum)

| Kriterium | Anforderung | Persona |
|-----------|-------------|---------|
| Kontrast Text | ≥ 4.5:1 | Thomas |
| Kontrast Large Text | ≥ 3:1 | Thomas |
| Touch Target | ≥ 44×44px | Beide |
| Schriftgröße Minimum | 16px | Thomas |
| Focus-Indikatoren | Sichtbar (3px Outline) | Beide |
| Keyboard Navigation | Vollständig | Thomas |
| Screen Reader | ARIA Labels | Beide |
| Farbunabhängig | Icons + Text neben Farbe | Thomas |

### Contrast Check Results

| Kombination | Ratio | Pass? |
|-------------|-------|-------|
| Primary (#4CAF50) on White | 3.2:1 | ⚠️ Nur Large Text |
| Primary-800 (#2E7D32) on White | 5.9:1 | ✅ AA |
| Neutral-900 (#212121) on White | 16.1:1 | ✅ AAA |
| Danger (#F44336) on White | 4.0:1 | ⚠️ Nur Large Text |
| Primary (#4CAF50) on Neutral-900 | 5.0:1 | ✅ AA |

> **Regel**: Für **Text** auf weißem Background verwende `primary-800` statt `primary-500`.  
> Für **Icons / Badges** ist `primary-500` akzeptabel (large text ratio).

---

## Responsive Breakpoints

```css
--aiva-breakpoint-sm:  640px;   /* Mobile landscape */
--aiva-breakpoint-md:  768px;   /* Tablet portrait */
--aiva-breakpoint-lg:  1024px;  /* Tablet landscape / Desktop */
--aiva-breakpoint-xl:  1280px;  /* Desktop wide */
```

### Layout Grid

| Breakpoint | Columns | Gutter | Margin |
|-----------|---------|--------|--------|
| < 640px | 4 | 16px | 16px |
| 640-768px | 8 | 20px | 24px |
| 768-1024px | 8 | 24px | 32px |
| > 1024px | 12 | 24px | auto (max 1200px) |

---

## Iconography

### Icon System

- **Style**: Outline (Lucide Icons als Basis)
- **Stroke**: 1.5px
- **Size Grid**: 16 / 20 / 24 / 32 px
- **Health-Icons**: Custom-Set für medizinische Symbole

### Module Icons

| Modul | Icon | Bedeutung |
|-------|------|-----------|
| AIVA Care | 📅 `calendar-heart` | Termine & Vorsorge |
| AIVA Labs | 🔬 `flask-conical` | Befunde & Medikation |
| AIVA Coach | 💪 `heart-pulse` | Empfehlungen & Check-In |
| AIVA Family | 👨‍👩‍👧 `users` | Familienkonto |

---

## Motion & Animation

```css
/* === Timing === */
--aiva-duration-fast:    150ms;  /* Hover, Focus */
--aiva-duration-normal:  250ms;  /* Transitions */
--aiva-duration-slow:    350ms;  /* Page Transitions */

/* === Easing === */
--aiva-ease-in:      cubic-bezier(0.4, 0, 1, 1);
--aiva-ease-out:     cubic-bezier(0, 0, 0.2, 1);
--aiva-ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Rules

1. **Prefer `prefers-reduced-motion`**: Immer respektieren
2. **Keine blinkenden Elemente** (Epilepsie-Risiko)
3. **Subtile Transitions** (250ms max für UI-Feedback)
4. **Loading States**: Skeleton statt Spinner wo möglich

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode (Post-MVP)

> Dark Mode ist **Post-MVP** — aber Design Tokens sind so strukturiert,  
> dass ein späterer Dark Mode einfach hinzugefügt werden kann.

```css
/* Vorbereitung: Alle Farben über CSS Variables */
[data-theme="dark"] {
  --aiva-bg-primary:   #121212;
  --aiva-bg-secondary: #1E1E1E;
  --aiva-bg-card:      #1E1E1E;
  --aiva-neutral-900:  #FAFAFA;
  --aiva-neutral-700:  #E0E0E0;
  /* ... weitere Overrides */
}
```

---

## Naming Conventions (BEM)

```css
/* Block */
.aiva-button { }
.aiva-vital-badge { }

/* Element */
.aiva-button__icon { }
.aiva-vital-badge__value { }

/* Modifier */
.aiva-button--primary { }
.aiva-button--danger { }
.aiva-vital-badge--critical { }
```

### Prefix Rule

Alle AIVA Design System Klassen beginnen mit `aiva-`:

```
aiva-[block]__[element]--[modifier]
```

---

## Cross-References

- **Frontend Convention** → [Convention 14: Frontend](../fullstack/14-frontend.md)
- **Personas** → [Context: Personas](../../context/personas.md)
- **Development Layer** → [Layer 03: Development](../../system/layers/03-specialization/development.md)
- **MVP Conventions** → [Convention 17: MVP](../other/17-mvp-conventions.md)
