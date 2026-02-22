# Other Tools

**Zweck**: Weitere verfügbare Tools für Agents.  
**Geladen von**: Alle Agents (Layer 00: Foundation)

---

## `get_errors`

Compile- und Lint-Fehler abrufen.

**Parameter:**
- `filePaths` (string[], optional): Dateipfade (leer = alle Fehler)

**Use-Cases:**
- Nach Edit: Fehler prüfen
- Vor Commit: Alle Fehler abrufen
- CI/CD Gate simulieren

---

## `ask_questions`

User-Rückfragen stellen (max 4 Fragen, je 2-6 Optionen).

**Use-Cases:**
- Ambige Anforderungen klären
- Implementation-Auswahl (z.B. "Mock oder API?")
- Bestätigung bei Breaking Changes

**Best Practices:**
- Nur fragen wenn nötig (nicht für offensichtliche Entscheidungen)
- `recommended: true` für empfohlene Option
- Max 4 Fragen pro Aufruf

---

## `manage_todo_list`

Fortschritt tracken.

**Use-Cases:**
- Multi-Step Tasks planen
- Checkpoints setzen
- Fortschritt sichtbar machen

**Best Practices:**
- Max 1 Task `in-progress`
- Sofort `completed` markieren nach Abschluss
- Übspring für Single-Step Tasks

---

## GitHub Tools (MCP)

### Issues
- `mcp_io_github_git_list_issues` — Issues auflisten
- `mcp_io_github_git_issue_read` — Issue lesen
- `mcp_io_github_git_issue_write` — Issue erstellen/updaten
- `mcp_io_github_git_search_issues` — Issues suchen

### Pull Requests
- `mcp_io_github_git_create_pull_request` — PR erstellen
- `mcp_io_github_git_list_pull_requests` — PRs auflisten
- `mcp_io_github_git_pull_request_read` — PR lesen

### Repository
- `mcp_io_github_git_get_file_contents` — Datei aus GitHub lesen
- `mcp_io_github_git_push_files` — Dateien pushen
- `mcp_io_github_git_create_branch` — Branch erstellen

---

## Tool-Auswahl Matrix

| Aufgabe | Tool |
|---------|------|
| Code finden (Konzept) | `semantic_search` |
| Code finden (exakt) | `grep_search` |
| Datei finden | `file_search` |
| Datei erstellen | `create_file` |
| Datei bearbeiten | `replace_string_in_file` |
| Fehler prüfen | `get_errors` |
| Tests ausführen | `run_in_terminal` |
| Issue erstellen | GitHub MCP Tools |
| User fragen | `ask_questions` |
| Fortschritt tracken | `manage_todo_list` |
