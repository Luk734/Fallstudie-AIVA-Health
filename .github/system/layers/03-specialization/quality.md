# Layer 3b: Quality Assurance Specialization

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: Reviewer, Tester

---

## Convention-Referenzen

### Code Quality Checklist (SOLID, Clean Code, TypeScript)
→ See [Convention 01: Code Structure](../../conventions/code-architecture/01-code-structure.md)
→ See [Convention 03: Architecture Patterns](../../conventions/code-architecture/03-patterns.md)

### Testing Strategies (Unit, Integration, E2E)
→ See [Convention 12: Testing Strategy](../../conventions/process-quality/12-testing-strategy.md)

### Security & DSGVO
→ See [Convention 05: Security](../../conventions/process-quality/05-security.md)
→ See [Convention 08: Health Security](../../conventions/health-domain/08-health-security.md)

---

## Review Criteria (4+1 Dimensionen)

### Dimension 1: Code Quality
- [ ] SOLID Principles eingehalten
- [ ] Clean Code (sprechende Namen, kurze Funktionen <20 Zeilen)
- [ ] TypeScript Strict Mode, kein `any`
- [ ] Keine hardcoded Secrets
- [ ] Error Handling implementiert

### Dimension 2: Security
- [ ] Keine SQL Injection / XSS Vulnerabilities
- [ ] Input Validation (Schema-basiert)
- [ ] Authentifizierung/Autorisierung korrekt
- [ ] Keine sensiblen Daten in Logs

### Dimension 3: Testing
- [ ] Tests vorhanden (Coverage ≥ 80%)
- [ ] Critical Paths abgedeckt
- [ ] Edge Cases getestet
- [ ] Keine Flaky Tests

### Dimension 4: Architecture
- [ ] Bounded Context respektiert (AIVA Care/Coach/Labs/Family)
- [ ] Keine Cross-Context Dependencies ohne Interface
- [ ] Layered Architecture eingehalten
- [ ] Keine zirkulären Abhängigkeiten

### Dimension 5: DSGVO (AIVA-spezifisch) 🏥
- [ ] Gesundheitsdaten verschlüsselt (at-rest + in-transit)
- [ ] Consent vor Datenverarbeitung geprüft
- [ ] Audit Trail für Gesundheitsdaten-Zugriffe
- [ ] Datensparsamkeit (nur notwendige Felder)
- [ ] Löschfristen implementiert (Art. 17 DSGVO)
- [ ] Keine Gesundheitsdaten in Logs/Error Messages

---

## Review-Feedback-Format

**Gewichtete Kategorisierung**: 

| Severity | Symbol | Aktion |
|----------|--------|--------|
| Critical | 🔴 | MUSS vor Merge gefixt werden |
| High | 🟠 | SOLLTE vor Merge gefixt werden |
| Medium | 🟡 | Erwägen zu fixen |
| Low | 🟢 | Nice to have |

**Lösungsorientiert**: Issue → Problem (Code) → Vorschlag (Code)

```markdown
### 🔴 CRITICAL: Unverschlüsselte Gesundheitsdaten
**File**: src/services/labResultService.ts:42
**Problem**:
```typescript
// Laborbefunde werden unverschlüsselt in DB gespeichert
await db.labResults.create({ patientId, results: rawData });
```
**Vorschlag**:
```typescript
// Laborbefunde MÜSSEN verschlüsselt werden
const encryptedData = await encryptionService.encrypt(rawData);
await db.labResults.create({ patientId, results: encryptedData });
await auditLog.record({ action: 'LAB_RESULT_CREATED', patientId });
```
```

---

## Flaky Test Handling

### Identification
**Flaky Test**: Test der sporadisch fehlschlägt

**Symptome**:
- Test passed lokal, failed in CI
- Test passed gestern, failed heute (ohne Code-Änderung)

### Root Causes
1. **Timing Issues**: Race Conditions, Async nicht gehandled
2. **Dependencies**: Externe Services unreliable
3. **Environment**: Unterschiedliche Test-Umgebungen
4. **Health-spezifisch**: Mock-Wearable-Daten zeitbasiert (Timestamps)

### Fix-Strategie
```typescript
// ❌ SCHLECHT — Fragiler Test
expect(screen.getByText('Nächster Termin: Dr. Müller')).toBeInTheDocument();

// ✅ GUT — Stabiler Test mit waitFor
await waitFor(() => {
  expect(screen.getByText('Nächster Termin: Dr. Müller')).toBeInTheDocument();
}, { timeout: 3000 });

// ✅ GUT — Zeitunabhängiger Test
const fixedDate = new Date('2026-03-15T10:00:00Z');
jest.useFakeTimers().setSystemTime(fixedDate);
```

---

## Test Pyramid

```
E2E Tests (10%)     ← Wenige, langsam, aber vollständig
    ▲
Integration (20%)   ← API + DB zusammen
    ▲
Unit Tests (70%)    ← Viele, schnell, stabil
```

**Target Coverage**: ≥ 80% gesamt (Production) / ≥ 60% (MVP)

---

## Health-spezifische Test-Patterns

### Vital Sign Validation Tests
```typescript
describe('VitalSignValidation', () => {
  it('should reject heart rate below 30 bpm', () => {
    expect(() => new HeartRate(25)).toThrow(InvalidVitalSignError);
  });

  it('should reject heart rate above 250 bpm', () => {
    expect(() => new HeartRate(300)).toThrow(InvalidVitalSignError);
  });

  it('should identify hypertensive blood pressure', () => {
    const bp = new BloodPressure(150, 95);
    expect(bp.isHypertensive()).toBe(true);
  });

  it('should flag abnormal lab values', () => {
    const result = new LabResult({
      type: 'cholesterol',
      value: 280,
      referenceRange: { min: 0, max: 200 }
    });
    expect(result.isAbnormal).toBe(true);
  });
});
```

### DSGVO Compliance Tests
```typescript
describe('DSGVO Compliance', () => {
  it('should not store health data without consent', async () => {
    const patient = createPatient({ consentGiven: false });
    await expect(
      labService.saveResult(patient.id, labData)
    ).rejects.toThrow(ConsentRequiredError);
  });

  it('should encrypt health data at rest', async () => {
    const result = await labService.saveResult(patientId, labData);
    const rawRecord = await db.labResults.findById(result.id);
    expect(rawRecord.data).not.toEqual(labData); // Must be encrypted
  });

  it('should create audit trail for health data access', async () => {
    await labService.getResult(patientId, resultId);
    const auditEntries = await auditLog.getEntries({ patientId });
    expect(auditEntries).toContainEqual(
      expect.objectContaining({ action: 'LAB_RESULT_ACCESSED' })
    );
  });

  it('should support data deletion (Art. 17 DSGVO)', async () => {
    await patientService.deleteAllData(patientId);
    const results = await labService.getResults(patientId);
    expect(results).toHaveLength(0);
  });
});
```

### Medication Reminder Tests
```typescript
describe('MedicationReminder', () => {
  it('should send reminder at scheduled time', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-15T08:00:00Z'));
    
    const reminder = createReminder({ 
      dueAt: new Date('2026-03-15T08:00:00Z') 
    });
    
    const notifications = await reminderService.checkDueReminders();
    expect(notifications).toContainEqual(
      expect.objectContaining({ reminderId: reminder.id })
    );
  });

  it('should escalate missed medication after 30 minutes', async () => {
    // Thomas (56) darf Blutdruck-Medikament nicht vergessen
    jest.advanceTimersByTime(30 * 60 * 1000);
    
    const escalations = await reminderService.checkEscalations();
    expect(escalations).toContainEqual(
      expect.objectContaining({ 
        type: 'MEDICATION_MISSED',
        severity: 'high' 
      })
    );
  });
});
```

---

## E2E Test Patterns

### Health-App E2E Structure
```typescript
// tests/e2e/appointment-booking.spec.ts
import { test, expect } from '@playwright/test';

test('Laura can book an appointment via AIVA Care', async ({ page }) => {
  await page.goto('/care/appointments');
  await page.click('button:text("Neuer Termin")');
  await page.fill('input[name="specialty"]', 'Hausarzt');
  await page.click('button:text("Suchen")');
  
  // Doctolib-Integration (Mock im MVP)
  await page.click('[data-testid="doctor-dr-mueller"]');
  await page.click('[data-testid="slot-2026-03-15-10-00"]');
  await page.click('button:text("Termin buchen")');
  
  await expect(page.locator('text=Termin bestätigt')).toBeVisible();
});

test('Thomas can view medication reminders', async ({ page }) => {
  await page.goto('/labs/medications');
  
  // Große Touch-Targets für Thomas (56)
  const takeButton = page.locator('[data-testid="take-medication-btn"]');
  const box = await takeButton.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(48); // WCAG Touch Target
  expect(box?.height).toBeGreaterThanOrEqual(48);
});
```

---

## Quality Gates Summary

| Gate | Production | MVP |
|------|-----------|-----|
| Linting | 0 Errors | 0 Errors |
| Type Safety | Strict, 0 `any` | Strict, 0 `any` |
| Test Coverage | ≥ 80% | ≥ 60% |
| All Tests Pass | ✅ | ✅ |
| DSGVO Check | ✅ | ✅ |
| 0 Critical Vulns | ✅ | ✅ |
| Code Review | ✅ (4+1 Dim.) | ✅ (4+1 Dim.) |
| E2E Tests | ✅ | ⚠️ Manual OK |
| Performance | ✅ | ⚠️ Optional |
