# Layer 0: Foundation

**Version**: v1.0.0  
**Erstellt**: 2026-02-22  
**Geladen von**: ALLE Agents

---

## Claude Configuration

| Agent | Temperature | Max Tokens | Thinking Mode |
|-------|------------|------------|---------------|
| Developer | 0.3 (Prod) / 0.35 (MVP) | 8000 | Enabled |
| Orchestrator | 0.4 | 8000 | Enabled |
| Planner | 0.6 | 6000 | Enabled |
| Reviewer | 0.2 | 6000 | Disabled |
| Tester | 0.35 | 6000 | Enabled |
| UX Designer | 0.25 | 5000 | Disabled |

---

## Tool-Katalog

### Code Search & Analysis
- `semantic_search` — Semantische Code-Suche für Kontext-Verständnis
- `grep_search` — Pattern-basierte Suche mit Regex oder exakten Strings
- `file_search` — Dateien suchen via Glob-Patterns
- `list_code_usages` — Symbol-Referenzen finden

### File Operations
- `create_file` — Neue Dateien erstellen
- `read_file` — Dateien lesen (Zeilenbereich)
- `replace_string_in_file` — Einzelne Ersetzung
- `multi_replace_string_in_file` — Mehrere Ersetzungen gleichzeitig
- `list_dir` — Verzeichnisinhalt auflisten

### Terminal
- `run_in_terminal` — Commands ausführen (npm, git, build, test)
- `get_terminal_output` — Output abrufen (für Background-Prozesse)

### Other
- `get_errors` — Compile-/Lint-Fehler abrufen
- `get_changed_files` — Git-Änderungen anzeigen
- `memory` — Kontext speichern/abrufen (Agent Memory)
- `todo` — Task-Tracking

Siehe Details: [Tools Documentation](../tools/)

---

## Command-Katalog (12 Commands)

### Planning
| Command | Agent | Zweck |
|---------|-------|-------|
| `/Epic` | Planner | Erstellt Epics (strategische Initiativen) |
| `/Feature` | Planner | Erstellt Features unter einem Epic |
| `/UserStory` | Planner | Erstellt User Stories mit Akzeptanzkriterien |

### Development
| Command | Agent | Zweck |
|---------|-------|-------|
| `/Task` | Developer | Erstellt technische Implementierungs-Tasks |
| `/Component` | Developer/UX | Erstellt UI-Komponenten mit Tests |
| `/BugFix` | Developer | Systematische Bug-Behebung mit RCA |
| `/Prototype` | Developer/UX | Erstellt Prototypen (Low-/High-Fidelity) |

### Quality
| Command | Agent | Zweck |
|---------|-------|-------|
| `/Review` | Reviewer | Code Review (4+1 Dimensionen) |
| `/TestPlan` | Tester | Erstellt Test-Pläne |
| `/E2E` | Tester | Erstellt End-to-End Tests |

### Design
| Command | Agent | Zweck |
|---------|-------|-------|
| `/DesignSpec` | UX Designer | Erstellt Design-Spezifikationen |

### Operations
| Command | Agent | Zweck |
|---------|-------|-------|
| `/Release` | Orchestrator | Release-Koordination & Deployment |

Siehe Details: [Commands](../../commands/)

---

## AIVA Health Projekt-Context

**Projekt**: AIVA Health — KI-basierter digitaler Gesundheitsassistent  
**Organisation**: DHBW Stuttgart | Fallstudie Bima 20026  
**Repository**: https://github.com/Luk734/Fallstudie-AIVA-Health  
**Tracking**: GitHub Issues (Labels + Milestones)

### Die 4 AIVA-Module (DDD Bounded Contexts)
1. **AIVA Care** — Terminmanagement & Vorsorge-Reminder (Doctolib-Integration)
2. **AIVA Coach** — Handlungsempfehlungen & tägliche Check-ins
3. **AIVA Labs** — Befundverwaltung & Medikationsmanagement
4. **AIVA Family** — Familienkonto & Kinder-Management

### Personas
- **Laura Becker** (32) — Marketing Managerin, technikaffin, vergisst Arzttermine
- **Thomas Wagner** (56) — Projektleiter, Vorerkrankungen (Bluthochdruck), braucht Medikamenten-Erinnerungen

Vollständige Details: [Context-Dateien](../../context/)

### Convention-Referenzen
- [Code Conventions](../../conventions/code-architecture/)
- [Process & Quality](../../conventions/process-quality/)
- [Health Domain](../../conventions/health-domain/)
- [Full-Stack](../../conventions/fullstack/)
- [Other (MVP, Design System)](../../conventions/other/)

---

## Security (Mandatory Rules)

1. **KEINE hardcoded Secrets** — Environment Variables oder Secret Manager
2. **DSGVO-Compliance** — Gesundheitsdaten sind besondere Kategorien (Art. 9 DSGVO)
3. **Ende-zu-Ende-Verschlüsselung** — Für alle Health-Daten
4. **Input Validation** — Schema-basierte Validierung (Zod/äquivalent)
5. **Audit Logging** — Alle Zugriffe auf Gesundheitsdaten protokollieren
6. **Consent Management** — Explizite Einwilligung für Datenverarbeitung

Siehe Details: [Security Conventions](../../conventions/process-quality/05-security.md) und [Health Security](../../conventions/health-domain/08-health-security.md)

---

## Datenbank-Policy

- **Migrations**: Versioniert, reversibel (Up + Down Scripts)
- **Naming**: snake_case für Tabellen/Spalten
- **Constraints**: Foreign Keys, NOT NULL wo sinnvoll, CHECK Constraints für Wertebereiche (z.B. Herzfrequenz 30-250 bpm)
- **Indexes**: Für häufige Queries (patient_id, timestamp)
- **Soft Delete**: Für Gesundheitsdaten (DSGVO-Löschfrist beachten)
- **Encryption**: Sensitive Felder verschlüsselt speichern (Befunde, Medikation)

---

## MVP-Mode

**Aktivierung**: Wenn Projekt-Context "MVP" enthält oder explizit angefordert wird.

**MVP-Anpassungen**:
- Coverage-Gate: 60% (statt 80%)
- Quality Rating: B akzeptabel (statt A)
- Mock-First für externe Integrationen (Doctolib, ePA, Wearables)
- Manuelles Testing OK (statt vollständige E2E-Suite)
- Vereinfachte Dokumentation (Code-Kommentare reichen)

**Nicht verhandelbar (auch im MVP)**:
- ✅ Type Safety (kein `any`)
- ✅ Input Validation
- ✅ DSGVO-Compliance (Gesundheitsdaten!)
- ✅ Conventional Commits
- ✅ 0 Critical Vulnerabilities

Siehe Details: [Layer 3d: MVP & Prototype](03-specialization/mvp-prototype.md)

---

## Common Principles

1. **Health First**: Medizinische Korrektheit vor Feature-Geschwindigkeit
2. **Privacy by Design**: Datenschutz von Anfang an einbauen, nicht nachträglich
3. **User-Centric**: Personas (Laura & Thomas) bei jeder Entscheidung berücksichtigen
4. **Test-Driven**: Tests vor Implementation (TDD Red-Green-Refactor)
5. **Incremental**: Vertical Slicing (DB + API + UI pro Feature)
6. **Document as Code**: Dokumentation im Repository, nicht extern
