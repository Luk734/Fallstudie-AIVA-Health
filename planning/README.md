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

## Übersicht aller Epics

| # | Epic | Roadmap-Phase | Wochen | Status |
|---|------|--------------|--------|--------|
| [EPIC-01](./EPIC-01_core-platform.md) | Core Platform | Phase 1 | 1–3 | 🟡 In Planung |
| [EPIC-02](./EPIC-02_aiva-care.md) | AIVA Care | Phase 2 | 3–5 | 📋 Geplant |
| [EPIC-03](./EPIC-03_aiva-labs.md) | AIVA Labs | Phase 3 | 5–7 | 📋 Geplant |
| [EPIC-04](./EPIC-04_aiva-coach.md) | AIVA Coach | Phase 4 | 7–9 | 📋 Geplant |
| [EPIC-05](./EPIC-05_aiva-family.md) | AIVA Family | Phase 5 | 9–11 | 📋 Geplant |

---

## Gesamt-Fortschritt

```
Woche 1-3:   EPIC-01 Core Platform     ████░░░░░░░░  (Setup done)
Woche 3-5:   EPIC-02 AIVA Care        ░░░░░░░░░░░░
Woche 5-7:   EPIC-03 AIVA Labs        ░░░░░░░░░░░░
Woche 7-9:   EPIC-04 AIVA Coach       ░░░░░░░░░░░░
Woche 9-11:  EPIC-05 AIVA Family      ░░░░░░░░░░░░
```
