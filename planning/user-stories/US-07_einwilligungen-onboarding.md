# US-07 — Einwilligungen beim Onboarding

> **Feature:** [F-03 DSGVO & Consent-Management](../features/F-03_dsgvo-consent.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** neuer Nutzer  
> **möchte ich** klar und verständlich gefragt werden, welche Daten AIVA Health nutzen darf,  
> **damit** ich informiert entscheiden kann und meine Privatsphäre geschützt ist.

---

## Akzeptanzkriterien

- [ ] Separate Checkboxen – kein „alles oder nichts":
  - Nutzungsbedingungen & Datenschutzerklärung (🔴 Pflicht)
  - Verarbeitung von Gesundheitsdaten zur Personalisierung (🔴 Pflicht)
  - Anonymisierte Daten für Produktverbesserung (🟢 Optional)
- [ ] Jede Einwilligung mit Zeitstempel in DB gespeichert
- [ ] Links zu Datenschutz und AGB öffnen in neuem Tab

---

## Technische Tasks

- [ ] `TASK-28` DB: Tabelle `consents` (user_id, consent_type, granted, granted_at)
- [ ] `TASK-29` Backend: `POST /api/consents` (Einwilligungen speichern)
- [ ] `TASK-30` Frontend: Consent-Screen mit Checkboxen
