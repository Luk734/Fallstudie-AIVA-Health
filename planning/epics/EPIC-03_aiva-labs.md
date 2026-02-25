# EPIC-03 — AIVA Labs (Befunde & Medikation)

> **Milestone:** MVP - AIVA Labs
> **Roadmap-Phase:** Phase 3 (Wochen 5–7)
> **Status:** 📋 Geplant | Startet nach EPIC-02
> **Zurück:** [← Alle Epics](../README.md)

---

## Ziel

Thomas kann seine Medikamente verwalten, wird zuverlässig erinnert und kann Laborbefunde einsehen.

**Warum wichtig?**
Thomas' größtes Risiko: Er vergisst seine Blutdruck-Medikamente oder nimmt sie zur falschen Zeit. AIVA Labs wird zu seinem täglichen Begleiter.

**Primäre Persona:** Thomas Wagner (56, Bluthochdruck, nimmt täglich Medikamente)

> ⚠️ **DSGVO-Hinweis:** Medikamentendaten und Laborbefunde sind hochsensible Gesundheitsdaten (Art. 9 DSGVO). Alle Daten müssen verschlüsselt gespeichert werden.

---

## Features

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-10](../features/F-10_medikamenten-liste.md) | Medikamenten-Liste | 🔴 MUST | M | EPIC-01 |
| [F-11](../features/F-11_medikamenten-erinnerung.md) | Medikamenten-Erinnerung | 🔴 MUST | M | F-10 |
| [F-12](../features/F-12_laborbefunde.md) | Laborbefunde anzeigen | 🟡 SHOULD | L | EPIC-01 |
| [F-13](../features/F-13_referenzbereich.md) | Referenzbereich-Visualisierung | 🟡 SHOULD | M | F-12 |

---

## Zusammenfassung

| Kennzahl | Wert |
|----------|------|
| Features | 4 |
| User Stories | 5 |
| Tasks | 20 |
| Geschätzte Dauer | 2 Wochen |
