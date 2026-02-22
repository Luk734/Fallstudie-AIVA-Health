# Code Search & Analysis Tools

**Zweck**: Tools für semantische und pattern-basierte Code-Suche.  
**Geladen von**: Alle Agents (Layer 00: Foundation)

---

## `semantic_search`

Semantische Code-Suche für Kontext-Verständnis (nicht exakte String-Matches).

**Use-Cases:**
- Konzepte finden ("Wo wird Consent geprüft?")
- Ähnlichen Code entdecken
- Architektur verstehen
- Domain-Patterns finden

**Best Practices:**
- Nutze natürliche Sprache: "health data validation"
- Kombiniere mit `grep_search` für exakte Matches
- Ergebnisse sind ranked nach Relevanz

---

## `grep_search`

Pattern-basierte Suche mit Regex oder exakten Strings.

**Use-Cases:**
- Exakte String-Matches (`ConsentService`)
- Regex-Patterns (`requireConsent|checkConsent`)
- Schnelle Code-Suche in spezifischen Dateien
- TODO/FIXME finden

**Best Practices:**
- Nutze `isRegexp: true` für Regex
- Nutze `includePattern` für gezielte Suche in Ordnern
- Kombiniere Patterns mit `|` (OR)

---

## `file_search`

Dateien suchen via Glob-Patterns.

**Use-Cases:**
- Dateien nach Namen finden
- Bestimmte Dateitypen suchen (`**/*.test.ts`)
- Verzeichnis-Struktur erkunden

**Best Practices:**
- `**/*.{ts,tsx}` für alle TypeScript-Dateien
- `src/modules/care/**` für Modul-spezifische Suche

---

## `list_code_usages`

Symbol-Referenzen finden (Functions, Classes, Variables).

**Use-Cases:**
- "Wo wird `ConsentService` verwendet?"
- Refactoring-Impact analysieren
- Dead Code finden
- Abhängigkeits-Analyse

---

## AIVA Health Such-Strategien

| Suche | Tool | Pattern |
|-------|------|---------|
| DSGVO-Code | `grep_search` | `consent\|dsgvo\|audit\|gdpr` |
| Health Models | `grep_search` | `Patient\|VitalSign\|Medication\|LabResult` |
| Module | `file_search` | `src/modules/<modul>/**` |
| Conventions | `file_search` | `.github/conventions/**/*.md` |
| Tests | `file_search` | `**/*.test.{ts,tsx}` |
