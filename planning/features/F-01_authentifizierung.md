# F-01 — Authentifizierung

> **Epic:** [EPIC-01 Core Platform](../epics/EPIC-01_core-platform.md)
> **Priorität:** 🔴 MUST | **Größe:** L | **Abhängigkeit:** —

---

## Ziel

Ein Nutzer kann sich registrieren, einloggen und die Session bleibt erhalten.

**Hintergrund:**
Auth ist der Türsteher der App. Jede Anfrage ans Backend wird geprüft: „Hat dieser Nutzer einen gültigen Token?" Wir nutzen JWT (JSON Web Token) – ein verschlüsseltes Ticket, das beim Login ausgestellt und bei jeder weiteren Anfrage mitgeschickt wird.

---

## User Stories

| ID | Titel | Größe | Status |
|----|-------|-------|--------|
| [US-01](../user-stories/US-01_registrierung.md) | Registrierung | L | 🔲 Offen |
| [US-02](../user-stories/US-02_login.md) | Login | M | 🔲 Offen |
| [US-03](../user-stories/US-03_logout.md) | Logout | S | 🔲 Offen |
| [US-04](../user-stories/US-04_session-persistenz.md) | Session-Persistenz | S | 🔲 Offen |
