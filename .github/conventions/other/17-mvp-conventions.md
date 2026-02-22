# Convention 17 — MVP Conventions

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** MVP-spezifische Regeln, Scope Discipline, Mock-First, Quality Gates.  
> **Geladen von:** Developer Agent (MVP-Mode), Planner Agent, UX-Designer Agent

---

## MVP Definition

**Minimum Viable Product** = Kleinste Version mit echtem User Value.

| ✅ MVP ist | ❌ MVP ist NICHT |
|-----------|-----------------|
| Core Features only (20/80) | Beta mit allen Features |
| Production-ready (reduzierter Scope) | Schlechte Code-Qualität |
| Erweiterbar (Foundation für v2.0) | Throw-Away Code |
| Timeboxed (8-11 Wochen) | Unbegrenztes Projekt |

---

## MoSCoW für AIVA Health MVP

### MUST Have (v1.0)
- Patient-Registrierung & Login
- Consent-Management (DSGVO)
- Termin-Übersicht & Buchung (Care)
- Medikamenten-Liste & Reminder (Labs)
- Basis Check-In (Coach)
- AIVA Health Design System (Basis)

### SHOULD Have (v1.0)
- Laborbefund-Anzeige (Labs)
- Vorsorge-Kalender (Care)
- Wearable-Daten-Anzeige (Coach)
- Push-Notifications

### COULD Have (v1.x)
- Familienkonto (Family)
- Daten-Export (DSGVO Art. 20)
- Dark Mode

### WON'T Have (v1.0)
- Echte Doctolib-Integration
- Echte ePA-Integration
- ML-basierte Empfehlungen
- Video-Konsultation
- Multi-Sprach-Support

---

## Mock-First Regel

### Entscheidungsmatrix

| Integration | Geschätzt | Mock? | Begründung |
|------------|-----------|-------|------------|
| Doctolib API | 3+ Wochen | ✅ Mock | API-Zugang nicht verfügbar |
| ePA/FHIR | 4+ Wochen | ✅ Mock | gematik-Zugang nötig |
| Apple Health | 2+ Wochen | ✅ Mock | SDK-Integration aufwändig |
| Google Fit | 2+ Wochen | ✅ Mock | OAuth + API |
| Push Notifications | 1 Woche | ✅ Mock | FCM/APNs Setup |
| In-Memory DB | 0 | ✅ Built-in | Standard für MVP |

### Mock-Interface Pattern

```typescript
// 1. Interface definieren (Port)
interface IExternalService {
  doSomething(): Promise<Result>;
}

// 2. Mock implementieren (MVP)
class MockExternalService implements IExternalService {
  async doSomething(): Promise<Result> {
    return MOCK_DATA;
  }
}

// 3. Echte Implementation (Post-MVP)
class RealExternalService implements IExternalService {
  async doSomething(): Promise<Result> {
    return await fetch(API_URL).then(r => r.json());
  }
}

// 4. Factory (Environment-basiert)
function createService(): IExternalService {
  return process.env.USE_MOCK === 'true'
    ? new MockExternalService()
    : new RealExternalService();
}
```

---

## MVP Quality Gates

| Gate | Production | MVP |
|------|------------|-----|
| **Test Coverage** | ≥ 80% | ≥ 60% |
| **DSGVO Coverage** | ≥ 95% | ≥ 90% ⚠️ |
| **Lint** | 0 Errors | 0 Errors |
| **Build** | ✅ | ✅ |
| **Critical Bugs** | 0 | 0 |
| **Security Scan** | Pass | Pass |
| **Accessibility** | WCAG AA | Basis-Check |
| **Documentation** | Vollständig | README + Comments |

> **Wichtig**: DSGVO-Coverage ist im MVP HÖHER als allgemeine Coverage!

---

## Timeboxing

| Phase | Zeitrahmen | Ergebnis |
|-------|-----------|----------|
| Core Platform | Wochen 1-3 | Auth, Consent, Design System |
| AIVA Care | Wochen 3-5 | Termine |
| AIVA Labs | Wochen 5-7 | Medikation, Befunde |
| AIVA Coach | Wochen 7-9 | Check-In, Empfehlungen |
| AIVA Family | Wochen 9-11 | Familienkonto |
| Polish | Wochen 11+ | E2E Tests, Accessibility |

### Timebox Rules

1. **HARD DEADLINE**: Feature nicht fertig → Scope reduzieren, NICHT Zeit verlängern
2. **Scope Cut Protocol**: 
   - COULD Have → Backlog
   - SHOULD Have → Diskussion mit Team → Backlog oder Simplify
   - MUST Have → NIEMALS cutten (Feature vereinfachen stattdessen)
3. **ADR erstellen** wenn Scope geändert wird

---

## MVP Anti-Patterns

| Anti-Pattern | Problem | Lösung |
|-------------|---------|--------|
| **Scope Creep** | "Können wir noch X?" | MoSCoW prüfen, ADR wenn nötig |
| **Premature Optimization** | "Das muss skalieren" | YAGNI! Erst MVP, dann optimieren |
| **Mock Hell** | Zu viele Mock-Layer | Max 1 Mock pro Integration |
| **Gold Plating** | Perfektes UI für MVP | 80/20 Regel anwenden |
| **DSGVO-Ignoranz** | "Machen wir später" | DSGVO ist MUST, nie verschieben |

---

## Cross-References

- **MVP Prototype Layer** → [Layer 03: MVP Prototype](../../system/layers/03-specialization/mvp-prototype.md)
- **Roadmap** → [Context: Roadmap](../../context/roadmap.md)
- **Planning Layer** → [Layer 03: Planning](../../system/layers/03-specialization/planning.md)
