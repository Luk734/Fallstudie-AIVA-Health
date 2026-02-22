# Convention 09 — Health AI & Empfehlungen

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** KI-Empfehlungen, regelbasiert vs. ML, ethische Grundsätze, Transparenz.  
> **Geladen von:** Developer Agent, Reviewer Agent

---

## MVP: Regelbasierte Empfehlungen

Im MVP werden alle Empfehlungen **regelbasiert** generiert — kein ML.

### Empfehlungs-Engine

```typescript
interface HealthRecommendation {
  id: string;
  patientId: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  source: 'rule_engine' | 'ml_model';  // MVP: immer 'rule_engine'
  createdAt: Date;
  dismissed: boolean;
}

type RecommendationType =
  | 'preventive_care'      // Vorsorge-Empfehlung
  | 'medication_reminder'  // Medikamenten-Erinnerung
  | 'lifestyle'            // Bewegung, Schlaf, Ernährung
  | 'vital_sign_alert'     // Auffälliger Wert
  | 'appointment_suggest'; // Arztbesuch empfohlen
```

### Regelbasierte Engine (MVP)

```typescript
class RuleBasedRecommendationEngine {
  
  generateRecommendations(patient: PatientProfile): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];

    // Regel 1: Vorsorge nach Alter und Geschlecht
    const duePreventive = this.checkPreventiveCare(patient);
    recommendations.push(...duePreventive);

    // Regel 2: Vital Signs Alerts
    const vitalAlerts = this.checkVitalSigns(patient.recentVitalSigns);
    recommendations.push(...vitalAlerts);

    // Regel 3: Medikamenten-Compliance
    const medAlerts = this.checkMedicationCompliance(patient.medications);
    recommendations.push(...medAlerts);

    // Regel 4: Lifestyle basierend auf Wearable-Daten
    const lifestyleRecs = this.checkLifestyle(patient.recentVitalSigns);
    recommendations.push(...lifestyleRecs);

    return recommendations;
  }

  private checkVitalSigns(vitalSigns: VitalSign[]): HealthRecommendation[] {
    const alerts: HealthRecommendation[] = [];
    
    const latestHR = vitalSigns
      .filter(v => v.type === 'heart_rate')
      .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime())[0];
    
    if (latestHR && latestHR.value > 100) {
      alerts.push({
        id: generateId(),
        patientId: latestHR.patientId,
        type: 'vital_sign_alert',
        title: 'Erhöhte Herzfrequenz',
        description: `Ihre letzte gemessene Herzfrequenz (${latestHR.value} bpm) liegt über dem Normalbereich. Bei anhaltend erhöhten Werten empfehlen wir einen Arztbesuch.`,
        priority: latestHR.value > 120 ? 'high' : 'medium',
        source: 'rule_engine',
        createdAt: new Date(),
        dismissed: false
      });
    }

    return alerts;
  }

  private checkPreventiveCare(patient: PatientProfile): HealthRecommendation[] {
    const age = calculateAge(patient.dateOfBirth);
    const recommendations: HealthRecommendation[] = [];

    // Gesundheits-Check-up ab 35 (alle 3 Jahre)
    if (age >= 35) {
      recommendations.push({
        id: generateId(),
        patientId: patient.id,
        type: 'preventive_care',
        title: 'Gesundheits-Check-up',
        description: 'Ab 35 Jahren empfiehlt die gesetzliche Krankenversicherung alle 3 Jahre einen allgemeinen Gesundheits-Check-up.',
        priority: 'low',
        source: 'rule_engine',
        createdAt: new Date(),
        dismissed: false
      });
    }

    // Hautkrebsscreening ab 35 (alle 2 Jahre)
    if (age >= 35) {
      recommendations.push({
        id: generateId(),
        patientId: patient.id,
        type: 'preventive_care',
        title: 'Hautkrebsscreening',
        description: 'Ab 35 Jahren wird ein Hautkrebsscreening alle 2 Jahre empfohlen.',
        priority: 'low',
        source: 'rule_engine',
        createdAt: new Date(),
        dismissed: false
      });
    }

    return recommendations;
  }
}
```

---

## Post-MVP: ML-basierte Empfehlungen

### Architektur-Vorbereitung

```typescript
// Interface für beide Engines (Strategy Pattern)
interface IRecommendationEngine {
  generateRecommendations(patient: PatientProfile): Promise<HealthRecommendation[]>;
}

// MVP
class RuleBasedEngine implements IRecommendationEngine { ... }

// Post-MVP
class MLRecommendationEngine implements IRecommendationEngine {
  constructor(private modelEndpoint: string) {}
  
  async generateRecommendations(patient: PatientProfile): Promise<HealthRecommendation[]> {
    // ML Model API Call
    // Erfordert: Trainierte Modelle, Validierung, Bias-Testing
    throw new Error('ML engine not yet implemented');
  }
}

// Factory
function createRecommendationEngine(): IRecommendationEngine {
  if (process.env.USE_ML_ENGINE === 'true') {
    return new MLRecommendationEngine(process.env.ML_ENDPOINT!);
  }
  return new RuleBasedEngine();
}
```

---

## KI-Ethik Regeln

### Die 5 Grundsätze

1. **Transparenz**: Nutzer weiß immer, dass eine KI-Empfehlung vorliegt
2. **Kein Ersatz**: KI ersetzt KEINEN Arzt — immer Disclaimer anzeigen
3. **Erklärbarkeit**: Empfehlungen müssen nachvollziehbar sein
4. **Fairness**: Keine Diskriminierung nach Alter, Geschlecht, Herkunft
5. **Kontrollierbarkeit**: Nutzer kann Empfehlungen ablehnen/deaktivieren

### Disclaimer (Mandatory)

```typescript
const AI_DISCLAIMER = {
  de: 'Diese Empfehlung basiert auf allgemeinen Gesundheitsrichtlinien und ersetzt keine ärztliche Beratung. Bei Beschwerden wenden Sie sich bitte an Ihren Arzt.',
  en: 'This recommendation is based on general health guidelines and does not replace medical advice. Please consult your doctor if you have concerns.'
};

// Jede Empfehlung MUSS den Disclaimer enthalten
interface RecommendationDisplay {
  recommendation: HealthRecommendation;
  disclaimer: string;  // PFLICHT!
  showSource: boolean; // true = zeige "Quelle: Regelbasiert" / "Quelle: KI-Modell"
}
```

### Transparenz-Anforderungen

```typescript
// ✅ Transparent
{
  title: "Empfehlung: Gesundheits-Check-up",
  description: "Basierend auf Ihrem Alter (56) empfehlen wir...",
  source: "Regelbasiert (GKV-Vorsorgerichtlinien)",
  disclaimer: "Dies ersetzt keine ärztliche Beratung."
}

// ❌ Intransparent
{
  title: "Sie sollten zum Arzt",
  description: "Unser System empfiehlt..."
  // Keine Quelle, kein Disclaimer!
}
```

---

## Testing von KI-Empfehlungen

```typescript
describe('RuleBasedRecommendationEngine', () => {
  it('should recommend check-up for patients over 35', () => {
    const patient = createTestPatient({ dateOfBirth: yearsAgo(40) });
    const engine = new RuleBasedEngine();
    
    const recommendations = engine.generateRecommendations(patient);
    
    expect(recommendations.some(r => r.type === 'preventive_care')).toBe(true);
  });

  it('should NOT recommend check-up for patients under 35', () => {
    const patient = createTestPatient({ dateOfBirth: yearsAgo(25) });
    const engine = new RuleBasedEngine();
    
    const recommendations = engine.generateRecommendations(patient);
    
    expect(recommendations.filter(r => r.type === 'preventive_care')).toHaveLength(0);
  });

  it('should alert on elevated heart rate', () => {
    const patient = createTestPatient({
      recentVitalSigns: [createVitalSign({ type: 'heart_rate', value: 130 })]
    });
    
    const recommendations = new RuleBasedEngine().generateRecommendations(patient);
    
    const alert = recommendations.find(r => r.type === 'vital_sign_alert');
    expect(alert).toBeDefined();
    expect(alert!.priority).toBe('high');
  });

  it('should always include disclaimer in display', () => {
    const recommendation = createRecommendation();
    const display = formatForDisplay(recommendation);
    
    expect(display.disclaimer).toBeTruthy();
    expect(display.disclaimer).toContain('ärztliche Beratung');
  });
});
```

---

## Cross-References

- **Health Data** → [Convention 06: Health Data](06-health-data.md)
- **Health Security** → [Convention 08: Health Security](08-health-security.md)
- **Testing** → [Convention 12: Testing](../process-quality/12-testing-strategy.md)
- **Modules** → [Context: Modules](../../context/modules.md) (AIVA Coach)
