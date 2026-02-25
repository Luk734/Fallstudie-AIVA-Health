# EPIC-04 — AIVA Coach (Check-ins & Empfehlungen)

> **Milestone:** MVP - AIVA Coach
> **Roadmap-Phase:** Phase 4 (Wochen 7–9)
> **Status:** 📋 Geplant | Startet nach EPIC-03
> **Zurück:** [← Alle Epics](../README.md)

---

## Ziel

Laura und Thomas erhalten täglich personalisierte Gesundheitsempfehlungen und können ihren Wohlbefindensverlauf tracken.

**Warum wichtig?**
AIVA Coach ist das „Herzstück" der App – hier geht es um echten täglichen Mehrwert. Laura schaut morgens kurz rein, gibt ihr Befinden ein, und bekommt eine umsetzbare Empfehlung.

**MVP-Einschränkung:** Empfehlungen sind regelbasiert (if–else). Echtes Machine Learning kommt in v2.0.

**Primäre Persona:** Laura Becker (Stressreduktion, Work-Life-Balance)

---

## Features

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-14](../features/F-14_check-in.md) | Täglicher Check-in | 🔴 MUST | M | EPIC-01 |
| [F-15](../features/F-15_empfehlungen.md) | Regelbasierte Empfehlungen | 🟡 SHOULD | L | F-14 |
| [F-16](../features/F-16_wearable-mock.md) | Wearable-Daten (Mock) | 🟡 SHOULD | M | EPIC-01 |
| [F-17](../features/F-17_metriken-dashboard.md) | Health-Metriken Dashboard | 🟢 COULD | M | F-16 |

---

## Zusammenfassung

| Kennzahl | Wert |
|----------|------|
| Features | 4 |
| User Stories | 5 |
| Tasks | 21 |
| Geschätzte Dauer | 2 Wochen |
