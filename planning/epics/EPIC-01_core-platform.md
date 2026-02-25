# EPIC-01 — Core Platform

> **Milestone:** MVP - Core Platform
> **Roadmap-Phase:** Phase 1 (Wochen 1–3)
> **Status:** 🟡 In Bearbeitung
> **Zurück:** [←  Alle Epics](../README.md)

---

## Ziel

Die technische Grundlage schaffen, auf der alle anderen Module aufbauen. Ohne diese Basis können Care, Labs, Coach und Family nicht starten.

**Warum zuerst?**
- Nutzer müssen sich registrieren und einloggen können
- Jeder braucht ein Profil (Basis für personalisierte Empfehlungen)
- DSGVO-Konformität ist Pflicht (Gesundheitsdaten = Art. 9 DSGVO)
- Einheitliches Designsystem damit alle Seiten gleich aussehen

---

## Features

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-01](../features/F-01_authentifizierung.md) | Authentifizierung (Register/Login/Logout) | 🔴 MUST | L | — |
| [F-02](../features/F-02_nutzer-profil.md) | Nutzer-Profil (anlegen & bearbeiten) | 🔴 MUST | M | F-01 |
| [F-03](../features/F-03_dsgvo-consent.md) | DSGVO & Consent-Management | 🔴 MUST | M | F-01 |
| [F-04](../features/F-04_navigation-layout.md) | Navigation & App-Layout | 🔴 MUST | S | F-01 |
| [F-05](../features/F-05_design-system.md) | Design System & Basis-Komponenten | 🟡 SHOULD | M | — |

---

## Zusammenfassung

| Kennzahl | Wert |
|----------|------|
| Features | 5 |
| User Stories | 12 |
| Tasks | 47 |
| Geschätzte Dauer | 2–3 Wochen |
