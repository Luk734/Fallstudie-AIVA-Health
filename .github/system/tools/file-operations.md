# File Operations Tools

**Zweck**: Tools für Datei-Operationen (Erstellen, Lesen, Bearbeiten, Auflisten).  
**Geladen von**: Developer Agent, Tester Agent, UX-Designer Agent

---

## `create_file`

Neue Dateien erstellen.

**Parameter:**
- `filePath` (string, required): Absoluter Pfad
- `content` (string, required): Datei-Inhalt

**Best Practices:**
- Verzeichnis wird automatisch erstellt
- Überschreibt NICHT existierende Dateien (wirft Fehler)
- Nutze für neue Components, Tests, Configs

---

## `read_file`

Dateien lesen mit Zeilen-Range.

**Parameter:**
- `filePath` (string, required): Absoluter Pfad
- `startLine` (number, required): Start-Zeile (1-basiert)
- `endLine` (number, required): End-Zeile (inklusiv)

**Best Practices:**
- Lies große Ranges (50-100 Zeilen) statt viele kleine Reads
- Nutze parallele Reads für unabhängige Dateien
- **Nie** ganze Dateien lesen, wenn spezifische Sections reichen

---

## `replace_string_in_file`

Bestehende Dateien bearbeiten (String-Replacement).

**Parameter:**
- `filePath` (string, required): Absoluter Pfad
- `oldString` (string, required): Zu ersetzender String (min. 3 Zeilen Context)
- `newString` (string, required): Neuer String

**Best Practices:**
- Immer min. 3 Zeilen Context VOR und NACH dem Ziel-Text
- Whitespace und Indentation exakt matchen
- Für mehrere Edits: `multi_replace_string_in_file` nutzen

---

## `list_dir`

Verzeichnis-Inhalt auflisten.

**Parameter:**
- `path` (string, required): Absoluter Pfad zum Verzeichnis

**Best Practices:**
- Endet mit `/` → Ordner, sonst Datei
- Nutze für Projekt-Struktur Analyse

---

## AIVA Health File-Struktur

```
src/
├── modules/
│   ├── core/           # Auth, Consent, Shared
│   ├── care/           # Terminmanagement
│   ├── labs/           # Befunde, Medikation
│   ├── coach/          # Empfehlungen, Check-In
│   └── family/         # Familienkonto
├── shared/
│   ├── components/     # Shared UI Components
│   ├── utils/          # Utilities
│   └── types/          # Shared TypeScript Types
└── __tests__/          # Test-Verzeichnis
```
