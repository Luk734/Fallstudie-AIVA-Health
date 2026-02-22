# Terminal Tools

**Zweck**: Command-Line Operationen ausführen.  
**Geladen von**: Developer Agent, Tester Agent

---

## `run_in_terminal`

Terminal-Befehle ausführen (PowerShell / Bash).

**Parameter:**
- `command` (string, required): Befehl
- `explanation` (string, required): Beschreibung
- `isBackground` (boolean): Background-Prozess (Server, Watch)
- `timeout` (number, optional): Timeout in ms

**Best Practices:**
- Nie `&&` verwenden → `;` für Verkettung (PowerShell)
- `isBackground: true` für Server/Build-Watch
- Immer `explanation` angeben

---

## Häufige AIVA Health Commands

### Development
```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Testing
```bash
# Alle Tests
npm test

# Tests mit Coverage
npm run test:coverage

# Nur DSGVO-Tests
npm test -- --grep "dsgvo|consent|audit"

# Nur ein Modul testen
npm test -- --testPathPattern="modules/care"
```

### Git
```bash
# Branch erstellen (Convention)
git checkout -b feature/care-terminbuchung

# Commit (Conventional)
git commit -m "feat(care): add appointment booking"

# Push
git push origin feature/care-terminbuchung
```

### Code-Qualität
```bash
# Type-Check
npx tsc --noEmit

# Format
npm run format

# Security Audit
npm audit
```

---

## Umgebungsvariablen

```bash
# .env (lokal, nie committen!)
NODE_ENV=development
AIVA_API_KEY=mock-key-for-dev
USE_MOCK=true
JWT_SECRET=dev-secret-change-in-prod
```

> **DSGVO-Regel**: Nie echte Patientendaten in Umgebungsvariablen!
