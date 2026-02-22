# AIVA Health — Die 4 Module

> Extrahiert aus [AIVA_Context.md](../AIVA_Context.md) — Referenz für Feature-Planung und DDD Bounded Contexts.

---

## Modul-Übersicht

| Modul | Bounded Context | Hauptzweck | Primäre Persona |
|-------|----------------|------------|----------------|
| AIVA Care | Terminmanagement | Arzttermine & Vorsorge | Laura (vergisst Termine) |
| AIVA Coach | Empfehlungen | Tägliche Check-ins & Tipps | Laura (Stress, Balance) |
| AIVA Labs | Befunde & Medikation | Laborwerte & Medikamente | Thomas (Bluthochdruck) |
| AIVA Family | Familienkonto | Familien- & Kinderverwaltung | Laura (Kind, 2 Jahre) |

---

## 🩺 AIVA Care — Terminmanagement & Vorsorge-Reminder

### Funktionen
- Kalenderansicht mit markierten Gesundheitsterminen
- „+ Neue Erinnerung" hinzufügen
- **Verknüpfung mit Doctolib** für direkte Terminbuchung

### Vorsorge-Erinnerungen
- Darmvorsorge ab 50 Jahren
- Hautkrebsvorsorge ab 35 Jahren
- Weitere gesetzliche Vorsorgeleistungen
- U-Untersuchungen für Kinder (via AIVA Family)

### DDD Bounded Context
```
Aggregates: Appointment, Doctor, PreventionSchedule, Reminder
Domain Events: AppointmentScheduled, AppointmentCancelled, ReminderSent, PreventionDue
External Integration: Doctolib API (Mock → Real)
```

### User Stories (Beispiele)
- Als Laura möchte ich einen Hausarzt-Termin in 3 Klicks buchen
- Als Thomas möchte ich an die Darmvorsorge erinnert werden (ab 50)
- Als Laura möchte ich U7-Termin für mein Kind im Kalender sehen

---

## 💪 AIVA Coach — Handlungsempfehlungen & Check-ins

### Personalisierte Empfehlungen
1. **Stress reduzieren** — Stressmanagement-Plan erstellen
2. **Schlaf verbessern** — Schlafphasen analysieren, Belastungsphasen reduzieren
3. **Erholung einplanen** — Entspannungsphasen durch Daten-basierte Vorschläge

### Täglicher Check-in
- „Wie fühlst du dich heute?"
- Emoji-Auswahl (5 Stufen: sehr schlecht bis sehr gut)
- Button „Check-in speichern"

### Reporting
- Monatlichen Health-Report erstellen lassen
- Trend-Analyse über Zeit (Schlaf, Stress, Aktivität)

### DDD Bounded Context
```
Aggregates: DailyCheckIn, Recommendation, HealthGoal, MonthlyReport
Domain Events: CheckInCompleted, RecommendationGenerated, GoalAchieved, ReportGenerated
External Integration: Wearable APIs (Apple Health, Google Fit, Fitbit)
```

### User Stories (Beispiele)
- Als Laura möchte ich morgens einen 10-Sekunden-Check-in machen
- Als Thomas möchte ich verstehen, warum mein Stresslevel erhöht ist
- Als Laura möchte ich meinen monatlichen Health-Report als PDF

---

## 🔬 AIVA Labs — Befunde & Medikationsmanagement

### Befundverwaltung
- Monatliche Health-Reports (z.B. April 2026)
- Arztdokumentation: z.B. Dr. Müller (Hausarzt)
- Laborbefunde abrufen mit Kontakt-Button
- Ergebnisdaten mit Diagramm-Visualisierung

### Medikation
- Medikamenten-Plan mit Dosierung und Einnahmezeiten
- Einnahmehinweise: z.B. „Bitte 1 Tablette morgens einnehmen"
- Verknüpfung mit Arzt/Praxis (über Doctolib)
- **Erinnerungen**: CRITICAL für Thomas (Bluthochdruck-Medikament)

### DDD Bounded Context
```
Aggregates: LabResult, Medication, MedicationReminder, Prescription
Domain Events: LabResultReceived, MedicationTaken, MedicationMissed, PrescriptionUpdated
External Integration: ePA/FHIR API (gematik), eRezept
```

### User Stories (Beispiele)
- Als Thomas möchte ich meine Cholesterin-Werte im Verlauf sehen
- Als Thomas möchte ich um 8:00 an Ramipril 5mg erinnert werden
- Als Laura möchte ich den Befund meines Kindes einscannen

---

## 👨‍👩‍👧‍👦 AIVA Family — Familienkonto & Kinder-Management

### Familienmitglieder verwalten
- „+ Neues Mitglied hinzufügen"
- Parentkontrolle / Kindersicherung
- Gesundheitsdaten teilen (mit Consent)
- Kinderuntersuchungen (U1-U11) tracking

### DDD Bounded Context
```
Aggregates: FamilyAccount, FamilyMember, ChildProfile, SharingPermission
Domain Events: MemberAdded, ChildProfileCreated, DataShared, ConsentGranted
External Integration: U-Untersuchungs-Kalender (gesetzlich vorgegeben)
```

### User Stories (Beispiele)
- Als Laura möchte ich ein Familienkonto mit meinem Partner teilen
- Als Laura möchte ich U7-Untersuchung für mein Kind (2 Jahre) tracken
- Als Thomas möchte ich meiner Frau Zugriff auf meine Medikamentenliste geben

---

## App-Screens (UI-Referenz)

### Startseite
- Vier Hauptbereiche: Wearables, Gesundheit, ePA, Erinnerungen
- Call-to-Action: „Jetzt starten"
- Sicherheit: Profil-Verifizierung per Personalausweis, Login per FaceID/TouchID

### Gesundheitsübersicht (Dashboard)
- **Smart Alerts**: z.B. „Dein Stresslevel scheint erhöht – Entspanne dich mit Meditation"
- **Gesundheitsmetriken**: Herzfrequenz (72 bpm), Schlaf (7h 42m), HRV (52 ms), Aktivität (5.312 Schritte)
- **KI-Empfehlungen**: z.B. „Termin bei Hausärztin buchen" basierend auf Herzwerten
- **Erinnerungen**: Medikament nehmen (09:00), Vorsorgeuntersuchung (02. Mai)
- **Navigation (Bottom Bar)**: Übersicht, Analyse, Plus (Hauptaktion), Vorsorge, Mehr

---

## Cross-Modul Abhängigkeiten

```
Core Platform (Auth, Patient, Consent, Notifications)
├── AIVA Care (benötigt: Patient-Profil, Notifications)
├── AIVA Coach (benötigt: Patient-Profil, Wearable-Daten)
├── AIVA Labs (benötigt: Patient-Profil, Notifications)
└── AIVA Family (benötigt: AIVA Care + Patient-Profil, Consent-System)
```

**Empfohlene Implementierungsreihenfolge**:
1. Core Platform → 2. AIVA Care → 3. AIVA Labs → 4. AIVA Coach → 5. AIVA Family
