# AIVA Health — Entwicklungsplanung

> **DHBW Stuttgart | Fallstudie Bima 20026**  
> Stand: 25.02.2026 | Entwicklungsstart: Woche 1

---

## Wie ist diese Planung aufgebaut?

Die Planung folgt einer **3-stufigen Hierarchie**, die in agilen Projekten Standard ist:

```
EPIC (das große Ziel)
  └── FEATURE (eine konkrete Funktion)
        └── USER STORY (eine Nutzeranforderung)
              └── TASK (eine technische Aufgabe)
```

### Was ist ein Epic?
Ein Epic ist ein **großes Oberziel**, das mehrere Wochen dauert und aus vielen Einzelfunktionen besteht.  
Beispiel: „AIVA Care" = alles rund um Terminmanagement.

### Was ist ein Feature?
Ein Feature ist eine **konkrete, abgrenzbare Funktion** innerhalb eines Epics.  
Beispiel: „Termin buchen" = ein Feature innerhalb von AIVA Care.

### Was ist eine User Story?
Eine User Story beschreibt eine Anforderung aus **Sicht des Nutzers**:  
`Als [Wer] möchte ich [Was tun], damit [Warum / Nutzen].`  
Beispiel: *Als Laura möchte ich einen Termin in 3 Klicks buchen, damit ich keine Zeit verschwende.*

### Was ist ein Task?
Ein Task ist eine **technische Aufgabe**, die ein Entwickler umsetzt.  
Beispiel: `POST /api/appointments` Endpunkt implementieren.

---

## Prioritäten

| Priorität | Bedeutung |
|-----------|-----------|
| 🔴 MUST | Ohne das ist das MVP nicht lieferbar |
| 🟡 SHOULD | Wichtig, aber nicht blockierend |
| 🟢 COULD | Nice-to-have, wenn Zeit bleibt |

## Story-Größen (T-Shirt)

| Größe | Tage (Schätzung) | Bedeutung |
|-------|-----------------|-----------|
| XS | ~0.5 | Trivial, wenige Zeilen |
| S | ~1 | Ein halber Tag |
| M | ~2–3 | Mehrere Komponenten |
| L | ~4–5 | Komplexe Feature-Implementierung |
| XL | ~1 Woche | Komplexes System |

---

## Ordnerstruktur

```
planning/
  README.md              ← Diese Datei (Übersicht)
  epics/                 ← 5 Epics (große Ziele)
  features/              ← 21 Features (konkrete Funktionen)
  user-stories/          ← 34 User Stories (Nutzeranforderungen)
```

## Übersicht aller Epics

| # | Epic | Roadmap-Phase | Wochen | Status |
|---|------|--------------|--------|--------|
| [EPIC-01](./epics/EPIC-01_core-platform.md) | Core Platform | Phase 1 | 1–3 | 🟡 In Planung |
| [EPIC-02](./epics/EPIC-02_aiva-care.md) | AIVA Care | Phase 2 | 3–5 | 📋 Geplant |
| [EPIC-03](./epics/EPIC-03_aiva-labs.md) | AIVA Labs | Phase 3 | 5–7 | 📋 Geplant |
| [EPIC-04](./epics/EPIC-04_aiva-coach.md) | AIVA Coach | Phase 4 | 7–9 | 📋 Geplant |
| [EPIC-05](./epics/EPIC-05_aiva-family.md) | AIVA Family | Phase 5 | 9–11 | 📋 Geplant |

## Features (21 gesamt)

| # | Feature | Epic | Wochen |
|---|---------|------|--------|
| [F-01](./features/F-01_registrierung.md) | Registrierung & Login | EPIC-01 | 1 |
| [F-02](./features/F-02_jwt-auth.md) | JWT-Authentifizierung | EPIC-01 | 1 |
| [F-03](./features/F-03_nutzerprofil.md) | Nutzerprofil | EPIC-01 | 2 |
| [F-04](./features/F-04_navigation.md) | Navigation & Routing | EPIC-01 | 2 |
| [F-05](./features/F-05_design-system.md) | Design-System | EPIC-01 | 2–3 |
| [F-06](./features/F-06_arztsuche.md) | Arztsuche | EPIC-02 | 3 |
| [F-07](./features/F-07_termin-buchen.md) | Termin buchen | EPIC-02 | 3–4 |
| [F-08](./features/F-08_termin-uebersicht.md) | Terminübersicht | EPIC-02 | 4 |
| [F-09](./features/F-09_erinnerungen.md) | Erinnerungen | EPIC-02 | 4–5 |
| [F-10](./features/F-10_scan-upload.md) | Befund-Scan & Upload | EPIC-03 | 5 |
| [F-11](./features/F-11_befund-anzeigen.md) | Befund anzeigen | EPIC-03 | 5–6 |
| [F-12](./features/F-12_medikationsplan.md) | Medikationsplan | EPIC-03 | 6 |
| [F-13](./features/F-13_referenzbereich.md) | Referenzbereich-Visualisierung | EPIC-03 | 6–7 |
| [F-14](./features/F-14_check-in.md) | Täglicher Check-in | EPIC-04 | 7 |
| [F-15](./features/F-15_empfehlungen.md) | Regelbasierte Empfehlungen | EPIC-04 | 7–8 |
| [F-16](./features/F-16_wearable-mock.md) | Wearable-Daten (Mock) | EPIC-04 | 8 |
| [F-17](./features/F-17_metriken-dashboard.md) | Health-Metriken Dashboard | EPIC-04 | 8–9 |
| [F-18](./features/F-18_familienkonto.md) | Familienkonto & Mitglieder | EPIC-05 | 9 |
| [F-19](./features/F-19_kind-profil.md) | Kind-Profil | EPIC-05 | 9–10 |
| [F-20](./features/F-20_u-untersuchungen.md) | U-Untersuchungen & Impfplan | EPIC-05 | 10 |
| [F-21](./features/F-21_daten-sharing.md) | Daten-Sharing & Berechtigungen | EPIC-05 | 10–11 |

---

## Gesamt-Fortschritt

```
Woche 1-3:   EPIC-01 Core Platform     ████░░░░░░░░  (Setup done)
Woche 3-5:   EPIC-02 AIVA Care        ░░░░░░░░░░░░
Woche 5-7:   EPIC-03 AIVA Labs        ░░░░░░░░░░░░
Woche 7-9:   EPIC-04 AIVA Coach       ░░░░░░░░░░░░
Woche 9-11:  EPIC-05 AIVA Family      ░░░░░░░░░░░░
```
