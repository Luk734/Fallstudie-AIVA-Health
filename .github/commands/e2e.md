# /E2E Command

**Context Layers:**
- [Layer 03b: Quality](../../system/layers/03-specialization/quality.md#test-pyramid) — Test Pyramid (E2E = 10%)
- [Convention 12: Testing](../../conventions/process-quality/12-testing-strategy.md) — Testing Strategy
- [Context: Personas](../../context/personas.md) — Laura & Thomas User Journeys

## Zweck
Erstellt End-to-End Test-Szenarien basierend auf User Journeys.

## Verantwortlicher Agent
**Tester Agent**

## Syntax
```
/E2E <Feature-Name> [--persona=laura|thomas|both]
```

## Workflow
1. User Journey aus Persona ableiten
2. Happy Path definieren
3. Error Paths definieren
4. DSGVO-Flows testen (Consent, Widerruf)
5. Accessibility-Checks einbauen (Thomas-Anforderungen)
6. E2E-Szenarien dokumentieren
7. GitHub Issue anlegen (Label: `e2e-test`)

## Template: E2E Scenarios

### Body Template

```markdown
## 🔄 E2E Scenarios: <Feature-Name>

**Feature**: #<Feature-Issue-Number>
**Persona**: Laura / Thomas / Beide

---

### Scenario 1: Happy Path — <Beschreibung>

**Persona**: <Name>

```gherkin
Feature: <Feature-Name>

  Scenario: <Happy Path Beschreibung>
    Given <Persona> ist eingeloggt
    And hat Consent für <Datentyp> gegeben
    When <Persona> navigiert zu <Seite>
    And <Aktion 1>
    And <Aktion 2>
    Then <Erwartetes Ergebnis>
    And Audit Trail enthält Event "<EventName>"
```

### Scenario 2: Error Path — <Beschreibung>

```gherkin
  Scenario: <Error Beschreibung>
    Given <Persona> ist eingeloggt
    When <Aktion mit ungültigen Daten>
    Then Fehlermeldung "<Meldung>" wird angezeigt
    And keine Daten wurden gespeichert
```

### Scenario 3: DSGVO — Consent Flow

```gherkin
  Scenario: Consent erforderlich
    Given <Persona> ist eingeloggt
    And hat KEINEN Consent für <Datentyp>
    When <Persona> navigiert zu <Seite mit Gesundheitsdaten>
    Then Consent-Dialog wird angezeigt
    And Daten werden NICHT angezeigt bis Consent gegeben

  Scenario: Consent widerrufen
    Given <Persona> hat Consent für <Datentyp>
    When <Persona> widerruft Consent unter Einstellungen
    Then Daten werden nicht mehr angezeigt
    And Audit Trail enthält "consent.revoked"
```

### Scenario 4: Accessibility — Thomas

```gherkin
  Scenario: Barrierefreie Bedienung
    Given Thomas nutzt die App
    Then alle Texte sind min. 16px
    And alle Buttons haben min. 44px Touch Target
    And Farbkontrast ist ≥ 4.5:1
    And App ist per Tastatur navigierbar
```

---

### 📋 E2E Checklist
- [ ] Happy Path getestet
- [ ] Fehlerfall getestet
- [ ] Consent-Flow getestet
- [ ] Consent-Widerruf getestet
- [ ] Accessibility für Thomas getestet
- [ ] Audit Trail verifiziert
- [ ] Responsive (Mobile + Desktop)
```

## Verwandte Commands
- **/TestPlan** → Gesamter Test-Plan
- **/Review** → E2E-Code reviewen
- **/Prototype** → Prototyp zum Testen

## AIVA Health Beispiel
```
/E2E Terminbuchung --persona=both

E2E-Tests für Terminbuchung:
- Laura: Schnelle Smartphone-Buchung (Happy Path)
- Thomas: Desktop-Buchung mit großer Schrift (Accessibility)
- Beide: Consent für Termin-Daten
```
