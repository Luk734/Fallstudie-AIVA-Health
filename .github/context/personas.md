# AIVA Health — Personas

> Extrahiert aus [AIVA_Context.md](../AIVA_Context.md) — Referenz für alle Code-arbeitenden Agents.

---

## Persona 1: Laura Becker (Primäre Persona)

| Kategorie | Beschreibung |
|-----------|--------------|
| **Name** | Laura Becker |
| **Alter** | 32 Jahre |
| **Geschlecht** | Weiblich |
| **Beruf** | Marketing Managerin |
| **Einkommen** | ca. 55.000 € / Jahr |
| **Wohnort** | Großstadt (z.B. München, Berlin) |

### Biografie
Laura arbeitet in einem anspruchsvollen Job mit vielen Terminen und hoher Verantwortung. Sie ist technikaffin und nutzt Wearables, fühlt sich jedoch von der Vielzahl an Gesundheitsdaten oft überfordert. Arzttermine und Vorsorgeuntersuchungen schiebt sie aus Zeitmangel häufig auf.

### Verhaltensmuster
- Nutzt regelmäßig Wearables und Apps
- Informiert sich online über Gesundheit
- Reagiert positiv auf klare, kurze Empfehlungen
- Vergisst Vorsorge- und Arzttermine

### Wünsche
- Gesundheitsdaten verständlich erklärt bekommen
- Weniger organisatorischer Aufwand
- Sicherheit über den eigenen Gesundheitszustand

### Ziele
- Langfristig gesund bleiben
- Stress reduzieren
- Bessere Work-Life-Balance
- Frühzeitige Risikoerkennung

### Design Implications für Agents
- **Mobile-First**: Laura nutzt hauptsächlich Smartphone
- **Quick Actions**: Swipe-Gesten, schnelle Interaktionen
- **Push-Notifications**: Konfigurierbar (nicht nerven)
- **Wearable-Integration**: Apple Watch / Fitbit Priorität
- **Familien-Feature**: Kind (2 Jahre) → U-Untersuchungen tracken
- **Sprache**: Modern, freundlich, nicht belehrend

---

## Persona 2: Thomas Wagner (Sekundäre Persona)

| Kategorie | Beschreibung |
|-----------|--------------|
| **Name** | Thomas Wagner |
| **Alter** | 56 Jahre |
| **Geschlecht** | Männlich |
| **Beruf** | Projektleiter im Maschinenbau |
| **Einkommen** | ca. 70.000 € / Jahr |
| **Wohnort** | Mittelgroße Stadt |

### Biografie
Thomas hat seit einigen Jahren gesundheitliche Vorerkrankungen (z.B. Bluthochdruck) und nimmt regelmäßig Medikamente. Er möchte Verantwortung für seine Gesundheit übernehmen, fühlt sich aber von medizinischen Informationen oft überfordert.

### Verhaltensmuster
- Nutzt Wearables eher funktional
- Vergisst gelegentlich Medikamente
- Geht ungern zum Arzt
- Schätzt strukturierte und verlässliche Systeme

### Wünsche
- Klare Hinweise, wann ein Arztbesuch sinnvoll ist
- Unterstützung bei Medikamenten-Erinnerungen
- Übersichtliche Gesundheitsdaten

### Ziele
- Gesundheit stabil halten
- Risiken früh erkennen
- Selbstständig und aktiv bleiben

### Design Implications für Agents
- **Große Touch-Targets**: Min. 48px (WCAG 2.1 AA), evtl. Zittern
- **Große Schrift**: Min. 16px, besser 18px
- **Klare Farben**: Hoher Kontrast, Status-Farben deutlich
- **Einfache Navigation**: Wenige Ebenen, klare Labels
- **Medikamenten-Reminder**: CRITICAL Feature — Vergessen = Gesundheitsrisiko
- **Laborwerte**: Referenzbereiche mit klarer Visualisierung
- **Datenvertrauen**: Transparente Consent-Verwaltung, verständliche Erklärungen
- **Sprache**: Klar, sachlich, respektvoll, keine Fachbegriffe ohne Erklärung

---

## Persona-Nutzung in der Entwicklung

### Bei User Stories
```markdown
Als Laura (32, technikaffin)
Möchte ich meinen nächsten Arzttermin per Smartphone buchen
Damit ich den Termin nicht vergesse und nicht extra anrufen muss
```

### Bei Design-Entscheidungen
```
Frage: Button-Größe für "Medikament genommen"?
→ Thomas (56): Min. 48x48px, prominent platziert
→ Laura (32): Swipe-Aktion wäre schneller, aber Button als Fallback
→ Entscheidung: 56x56px Button + Swipe-Option
```

### Bei Feature-Priorisierung
```
Feature: Video-Konsultation
→ Laura: "Nice to have, buche lieber schnell über App"
→ Thomas: "Brauche ich nicht, will Erinnerungen"
→ Entscheidung: Won't Have (MVP), Post-MVP evaluieren
```

### Bei Accessibility-Tests
```
Test: Kann Thomas die Laborwerte verstehen?
→ Referenzbereich als farbige Zone (grün/gelb/rot)
→ Erklärung in einfacher Sprache: "Dein Cholesterin (280) liegt über dem Normalbereich (< 200)"
→ Handlungsempfehlung: "Bespreche das Ergebnis mit deinem Hausarzt"
```
