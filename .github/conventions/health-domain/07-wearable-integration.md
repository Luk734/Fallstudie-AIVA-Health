# Convention 07 — Wearable Integration

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Integration Patterns für Wearables (Apple Health, Google Fit), Mock-First Strategie.  
> **Geladen von:** Developer Agent

---

## Mock-First Strategie

Im MVP verwenden alle Wearable-Integrationen Mock-Implementierungen:

```typescript
// Port (Interface im Core)
interface IWearableDataProvider {
  getHeartRate(patientId: string, from: Date, to: Date): Promise<VitalSign[]>;
  getSteps(patientId: string, date: Date): Promise<number>;
  getSleepData(patientId: string, date: Date): Promise<SleepData | null>;
  isConnected(patientId: string): Promise<boolean>;
}

// Mock Adapter (MVP)
class MockWearableProvider implements IWearableDataProvider {
  async getHeartRate(patientId: string, from: Date, to: Date): Promise<VitalSign[]> {
    return generateMockHeartRateData(from, to);
  }

  async getSteps(patientId: string, date: Date): Promise<number> {
    return Math.floor(Math.random() * 8000) + 3000; // 3000-11000 Schritte
  }

  async getSleepData(patientId: string, date: Date): Promise<SleepData | null> {
    return {
      totalHours: 6.5 + Math.random() * 2, // 6.5-8.5h
      deepSleepHours: 1.5 + Math.random(),
      remSleepHours: 1.5 + Math.random(),
      awakenings: Math.floor(Math.random() * 3)
    };
  }

  async isConnected(): Promise<boolean> {
    return true; // Mock ist immer "verbunden"
  }
}
```

### Mock Data Generator

```typescript
function generateMockHeartRateData(from: Date, to: Date): VitalSign[] {
  const data: VitalSign[] = [];
  const intervalMs = 15 * 60 * 1000; // alle 15 Minuten
  
  for (let t = from.getTime(); t <= to.getTime(); t += intervalMs) {
    const hour = new Date(t).getHours();
    
    // Realistische Tageskurve
    const baseRate = hour >= 23 || hour < 6 
      ? 55 + Math.random() * 10  // Nachts: 55-65
      : hour >= 6 && hour < 9
        ? 65 + Math.random() * 15 // Morgens: 65-80
        : 70 + Math.random() * 20; // Tagsüber: 70-90

    data.push({
      id: `mock-hr-${t}`,
      patientId: '',
      type: 'heart_rate',
      value: Math.round(baseRate),
      unit: 'bpm',
      measuredAt: new Date(t),
      source: 'wearable'
    });
  }
  
  return data;
}
```

---

## Echte Integration (Post-MVP)

### Apple HealthKit

```typescript
// Adapter für Apple Health (Post-MVP)
class AppleHealthProvider implements IWearableDataProvider {
  async getHeartRate(patientId: string, from: Date, to: Date): Promise<VitalSign[]> {
    // Apple HealthKit API Calls
    // Requires: NSHealthShareUsageDescription in Info.plist
    // Requires: User permission via HKHealthStore.requestAuthorization()
    throw new Error('Apple Health integration not yet implemented');
  }
  // ...
}
```

### Google Fit

```typescript
// Adapter für Google Fit (Post-MVP)
class GoogleFitProvider implements IWearableDataProvider {
  async getHeartRate(patientId: string, from: Date, to: Date): Promise<VitalSign[]> {
    // Google Fit REST API
    // Requires: OAuth 2.0 scope 'https://www.googleapis.com/auth/fitness.heart_rate.read'
    throw new Error('Google Fit integration not yet implemented');
  }
  // ...
}
```

---

## Data Sync Pattern

```typescript
interface WearableSyncResult {
  synced: number;
  failed: number;
  lastSyncAt: Date;
  errors: string[];
}

async function syncWearableData(
  patientId: string, 
  provider: IWearableDataProvider
): Promise<WearableSyncResult> {
  const lastSync = await getLastSyncTime(patientId);
  const now = new Date();

  try {
    const [heartRate, steps, sleep] = await Promise.allSettled([
      provider.getHeartRate(patientId, lastSync, now),
      provider.getSteps(patientId, now),
      provider.getSleepData(patientId, now)
    ]);

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    if (heartRate.status === 'fulfilled') {
      await vitalSignRepository.saveMany(heartRate.value);
      synced += heartRate.value.length;
    } else {
      failed++;
      errors.push(`HeartRate: ${heartRate.reason}`);
    }

    // ... analog für steps, sleep

    await updateLastSyncTime(patientId, now);
    
    return { synced, failed, lastSyncAt: now, errors };
  } catch (error) {
    logger.error('Wearable sync failed', { patientId, error: error.message });
    throw error;
  }
}
```

---

## Consent für Wearable-Daten

Wearable-Daten erfordern spezifischen Consent:

| Scope | Beschreibung |
|-------|-------------|
| `wearable:heart_rate` | Herzfrequenz-Daten lesen |
| `wearable:steps` | Schrittzähler-Daten lesen |
| `wearable:sleep` | Schlaf-Daten lesen |
| `wearable:all` | Alle Wearable-Daten |

```typescript
// Consent-Check vor jedem Wearable-Zugriff
async function getHeartRateWithConsent(patientId: string): Promise<VitalSign[]> {
  await requireConsent(patientId, 'wearable:heart_rate');
  return wearableProvider.getHeartRate(patientId, lastWeek(), now());
}
```

---

## Cross-References

- **Health Data** → [Convention 06: Health Data](06-health-data.md)
- **Mock-First** → [Layer 03: MVP Prototype](../../system/layers/03-specialization/mvp-prototype.md)
- **Security** → [Convention 08: Health Security](08-health-security.md)
