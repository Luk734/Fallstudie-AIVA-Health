# EPIC-05 — AIVA Family (Familienkonto)

> **Milestone:** MVP - AIVA Family
> **Roadmap-Phase:** Phase 5 (Wochen 9–11)
> **Status:** 📋 Geplant | Startet nach EPIC-04
> **Zurück:** [← Alle Epics](../README.md)

---

## Ziel

Laura kann ein Familienkonto verwalten und das Kind-Profil (U-Untersuchungen, Impfplan) tracken.

**Warum wichtig?**
Laura hat ein 2-jähriges Kind. U-Untersuchungen und Impftermine sind gesetzlich empfohlen – aber schnell vergessen. AIVA Family bündelt Familiengesundheit in einem Konto.

**Primäre Persona:** Laura Becker (Kind, 2 Jahre – U-Untersuchungen nicht verpassen)

> ⚠️ **DSGVO-Hinweis:** Kindesdaten sind besonders schützenswert. Eltern handeln als gesetzliche Vertreter. Datenweitergabe nur mit expliziter Einwilligung.

---

## Features

| ID | Feature | Priorität | Größe | Abhängigkeit |
|----|---------|-----------|-------|-------------|
| [F-18](../features/F-18_familienkonto.md) | Familienkonto & Mitglieder | 🟡 SHOULD | L | EPIC-01 |
| [F-19](../features/F-19_kind-profil.md) | Kind-Profil | 🟡 SHOULD | M | F-18 |
| [F-20](../features/F-20_u-untersuchungen.md) | U-Untersuchungen & Impfplan | 🟡 SHOULD | L | F-19 |
| [F-21](../features/F-21_daten-sharing.md) | Daten-Sharing & Berechtigungen | 🟢 COULD | M | F-18 |

---

## Zusammenfassung

| Kennzahl | Wert |
|----------|------|
| Features | 4 |
| User Stories | 6 |
| Tasks | 24 |
| Geschätzte Dauer | 2 Wochen |
