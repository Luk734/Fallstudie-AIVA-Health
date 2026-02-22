# AIVA Health — Roadmap & Traction

> Extrahiert aus [AIVA_Context.md](../AIVA_Context.md) — Referenz für Planner & Orchestrator.

---

## Traction-Ziele

| Ziel | Kanäle | Kennzahl | Wert |
|------|--------|----------|------|
| Bekanntheit aufbauen | App Store, Content Marketing, Social Media | App-Store-Impressionen | ~10.000/Monat |
| Nutzer gewinnen | App Store, Content, KV-Kooperationen | Downloads | 1.000/Monat |
| Aktive Nutzung | In-App-Onboarding, Push, Erinnerungen | Weekly Active Users | ~40% der Downloads |
| Umsatz generieren | In-App-Upgrades, KV-Kooperationen | Conversion Free → Premium | ~5-10% |

---

## Marketing & Sales Funnel

```
AWARENESS (100%)
↓ Nutzer sehen AIVA Health erstmals
↓ Kanäle: App Store, Content, Krankenversicherungen
↓
INTERESSE (10-15%)
↓ App wird heruntergeladen, Nutzer registrieren sich
↓ Nutzung: Gesundheitsübersicht, Erinnerungen
↓
KAUFABSICHT (40% der Registrierungen)
↓ Nutzer zeigen Kaufabsicht
↓
KAUF (5-10%)
↓ Premium-Funktionen oder Teilnahme an Programmen
```

---

## Empfohlene Entwicklungs-Roadmap (MVP)

### Phase 1: Core Platform (Wochen 1-3)
**Fokus**: Grundlagen für alle Module

- [ ] Authentifizierung (Registrierung, Login, Biometrie-Mock)
- [ ] Patient-Profil (Name, Geburtsdatum, Geschlecht, Kontakt)
- [ ] Consent-Management (DSGVO-konforme Einwilligungen)
- [ ] Notification-Skeleton (Push-Mock, In-App-Benachrichtigungen)
- [ ] Base Design System (AIVA Health Tokens, Core Components)

**GitHub Milestone**: `MVP - Core Platform`

### Phase 2: AIVA Care MVP (Wochen 3-5)
**Fokus**: Terminmanagement für Laura

- [ ] Termin-Übersicht (nächste 3 Termine)
- [ ] Termin buchen (Mock-Doctolib)
- [ ] Termin-Erinnerung (Push-Mock)
- [ ] Vorsorge-Kalender (Basis: gesetzliche Leistungen)

**GitHub Milestone**: `MVP - AIVA Care`

### Phase 3: AIVA Labs MVP (Wochen 5-7)
**Fokus**: Medikation für Thomas

- [ ] Medikamenten-Liste (Name, Dosierung, Frequenz)
- [ ] Medikamenten-Reminder (Push-Mock, Critical Feature!)
- [ ] Laborbefund-Anzeige (Mock-ePA)
- [ ] Referenzbereich-Visualisierung (Normal/Grenzwertig/Abnormal)

**GitHub Milestone**: `MVP - AIVA Labs`

### Phase 4: AIVA Coach MVP (Wochen 7-9)
**Fokus**: Tägliche Begleitung

- [ ] Täglicher Check-in (5 Stufen)
- [ ] Basis-Empfehlungen (regelbasiert, kein ML für MVP)
- [ ] Wearable-Daten anzeigen (Mock-Daten)
- [ ] Health-Metriken Dashboard (Herzfrequenz, Schlaf, Schritte)

**GitHub Milestone**: `MVP - AIVA Coach`

### Phase 5: AIVA Family MVP (Wochen 9-11)
**Fokus**: Familien-Features für Laura

- [ ] Familienkonto erstellen
- [ ] Familienmitglied einladen
- [ ] Kind-Profil anlegen (U-Untersuchungen)
- [ ] Daten-Sharing mit Consent

**GitHub Milestone**: `MVP - AIVA Family`

### Phase 6: Integration & Polish (Wochen 11+)
**Fokus**: Qualität und Auslieferung

- [ ] Echte API-Integrationen (Priorität: Wearables)
- [ ] Performance-Optimierung
- [ ] E2E Test Suite
- [ ] Accessibility Audit (Thomas-Verifikation)
- [ ] App Store Submission vorbereiten

**GitHub Milestone**: `MVP - Release`

---

## Post-MVP Backlog (v2.0+)

### High Priority
- Echte Doctolib-API Integration
- Echte ePA/FHIR Integration
- Echte Apple Health / Google Fit SDKs
- KI-basierte Empfehlungen (ML statt Regeln)
- Video-Konsultation

### Medium Priority
- Krankenkassen-Kooperationen (B2B)
- Erweiterte Familienfeatures
- Premium/Premium+ Monetarisierung
- Social Features (Community)

### Low Priority
- Tablet-Optimierung
- Wearable-App (Apple Watch / WearOS)
- Multi-Sprach-Support
- Gamification (Streaks, Achievements)

---

## Release-Strategie

### MVP Release
- **Target**: 8-11 Wochen nach Start
- **Platform**: iOS + Android (oder PWA für MVP)
- **Rollout**: Closed Beta (50 Tester) → Open Beta → Public

### Metriken für Go/No-Go
- ✅ Alle MUST-Features implementiert
- ✅ 0 Critical Bugs
- ✅ DSGVO-Compliance bestätigt
- ✅ 60% Test Coverage (MVP Gate)
- ✅ Accessibility Basis-Check bestanden

---

## Schlüsselpartner für Roadmap

| Partner | Relevanz | Phase |
|---------|----------|-------|
| Doctolib | Terminbuchungs-API | Post-MVP (Mock in MVP) |
| Apple / Google | HealthKit / Fit API | Post-MVP (Mock in MVP) |
| gematik | ePA-Zugang | Post-MVP (Mock in MVP) |
| App Stores | Distribution | Phase 6 (Release) |
| Krankenkassen | B2B-Kooperationen | Post-MVP |
