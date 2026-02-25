# AIVA Health — Technische Architektur

> **Stand:** 25.02.2026 | **Branch:** architektur | **Status:** Entschieden (MVP v1)  
> Extrahiert aus Architektur-Interview vom 25.02.2026 — Referenz für alle Agents.

---

## 1. Architektur-Übersicht

```
┌─────────────────────────────────────────────────────┐
│               BWCloud VM (Single VM)                │
│                                                     │
│  ┌──────────┐                    ┌───────────────┐  │
│  │  Nginx   │──▶ /* (statisch)  │  React App    │  │
│  │ :80/:443 │                   │  (Vite Build) │  │
│  │ Rev.Proxy│──▶ /api/*        ─┤               │  │
│  └──────────┘        │          └───────────────┘  │
│                       ▼                             │
│               ┌───────────────┐                     │
│               │  Node.js      │                     │
│               │  Express API  │                     │
│               │  :3001 (PM2)  │                     │
│               └───────┬───────┘                     │
│                       │                             │
│               ┌───────▼───────┐                     │
│               │  PostgreSQL   │                     │
│               │   :5432       │                     │
│               └───────────────┘                     │
└─────────────────────────────────────────────────────┘
```

**HTTPS:** Let's Encrypt (Certbot) — automatisch erneuert  
**Zugang Admin:** pgAdmin oder Adminer (intern)

---

## 2. Tech-Stack Entscheidungen

### 2.1 Frontend

| Entscheidung | Auswahl | Begründung |
|---|---|---|
| Framework | **React 18** | Team-Präferenz, Code-Sharing mit späterer Mobile App |
| Build Tool | **Vite** | Schneller als CRA, moderner Standard |
| HTTP Client | **Axios** | Einfach, gut dokumentiert |
| State Management | **React Context / useState** | Ausreichend für MVP-Scope |
| Routing | **React Router v6** | Standard für React SPAs |
| Styling | **TBD** | Designer liefert Layout nach |

### 2.2 Backend

| Entscheidung | Auswahl | Begründung |
|---|---|---|
| Runtime | **Node.js v20 LTS** | Passt zu React-Stack, Team-Kenntnisse |
| Framework | **Express.js** | Einfach, weit verbreitet, gut dokumentiert |
| API-Stil | **REST API** | Einfach, gut testbar, ausreichend für MVP |
| Auth | **JWT** (bcrypt + jsonwebtoken) | Kein externer Dienst, ca. 1-2 Tage Aufwand |
| Prozessmanager | **PM2** | Stabil auf Linux, Auto-Restart bei Absturz |

### 2.3 Datenbank

| Entscheidung | Auswahl | Begründung |
|---|---|---|
| DBMS | **PostgreSQL 15** | Team-Grundlagen vorhanden, Open Source, produktionstauglich |
| ORM | **Prisma** | Typsichere Queries, einfache Migrations, gute DX |
| Admin-UI | **pgAdmin / Adminer** | Einfaches Befüllen und Verwalten von Testdaten |

### 2.4 Hosting & Infrastruktur

| Entscheidung | Auswahl | Begründung |
|---|---|---|
| Hoster | **BWCloud (DHBW)** | Kostenlos, DSGVO-konform (DE), institutionell vorgegeben |
| VM-Strategie | **Single VM** | 1 Monat MVP, 2 Entwickler → einfache Verwaltung |
| Reverse Proxy | **Nginx** | Frontend statisch servieren + /api/* weiterleiten |
| HTTPS | **Let's Encrypt (Certbot)** | Kostenlos, automatisch erneuert |

### 2.5 KI-Komponente

| Phase | Entscheidung | Begründung |
|---|---|---|
| **MVP (jetzt)** | **Gemockt** — statische JSON-Antworten | Kein Zeitaufwand, kein API-Cost im Prototyp |
| **Post-MVP** | **OpenAI API (GPT-4o)** | Einfachste Anbindung, gute Dokumentation |

### 2.6 Mobile (Zukunft — Post-MVP)

| Entscheidung | Auswahl | Begründung |
|---|---|---|
| Framework | **Expo (React Native)** | Einfacher Einstieg, ~60-80% Code-Sharing mit Web |
| Zeitpunkt | **Phase 2** | Nach erfolgreichem Web-Launch |
| Code-Sharing | Business-Logik, Services, Context | UI-Komponenten werden nativ neu gebaut |

---

## 3. Repository-Struktur

```
aiva-health/
├── frontend/                    # React App (Vite)
│   ├── src/
│   │   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── pages/               # Seitenkomponenten
│   │   │   ├── Care/            # AIVA Care (MVP — funktional)
│   │   │   ├── Labs/            # AIVA Labs (MVP — funktional)
│   │   │   ├── Coach/           # AIVA Coach (Shell — sichtbar)
│   │   │   └── Family/          # AIVA Family (Shell — sichtbar)
│   │   ├── services/            # API-Calls (Axios)
│   │   ├── context/             # React Context (Auth, User)
│   │   └── mocks/               # KI-Mock-Daten (JSON)
│   ├── public/
│   └── package.json
│
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── routes/              # REST API Endpoints (care, labs, auth)
│   │   ├── controllers/         # Business Logic
│   │   ├── middleware/          # JWT Auth, Error Handling
│   │   └── prisma/              # Schema & Migrations
│   │       └── schema.prisma
│   └── package.json
│
├── .github/                     # Agents, Context, Workflows
│   ├── context/                 # Projekt-Kontext für Agents
│   ├── agents/                  # Agent-Definitionen
│   └── workitems/               # GitHub Issues Tracking
└── README.md
```

---

## 4. API-Design (REST)

### Auth
```
POST   /api/auth/register          # Nutzer registrieren
POST   /api/auth/login             # Login → JWT zurück
GET    /api/auth/me                # Eigenes Profil (auth required)
```

### AIVA Care (MVP — vollständig funktional)
```
GET    /api/care/appointments         # Alle Termine abrufen
POST   /api/care/appointments         # Termin erstellen
PUT    /api/care/appointments/:id     # Termin aktualisieren
DELETE /api/care/appointments/:id     # Termin löschen
GET    /api/care/doctors              # Arztliste abrufen
```

### AIVA Labs (MVP — vollständig funktional)
```
GET    /api/labs/results              # Laborwerte abrufen
POST   /api/labs/results              # Befund hinzufügen
DELETE /api/labs/results/:id          # Befund löschen
GET    /api/labs/medications          # Medikationsplan abrufen
POST   /api/labs/medications          # Medikament hinzufügen
DELETE /api/labs/medications/:id      # Medikament entfernen
```

### KI-Mock (MVP)
```
POST   /api/ai/ask                    # Mock-Antwort basierend auf Modul zurückgeben
```

### AIVA Coach & Family (MVP — Shell, keine Funktion)
```
GET    /api/coach/status              # → 501 Not Implemented
GET    /api/family/status             # → 501 Not Implemented
```

---

## 5. Datenmodell (Prisma Schema)

```prisma
model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  passwordHash String
  name         String
  createdAt    DateTime      @default(now())
  appointments Appointment[]
  labResults   LabResult[]
  medications  Medication[]
  aiResponses  AIResponse[]
}

model Appointment {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
  doctorName String
  date       DateTime
  type       String
  notes      String?
  createdAt  DateTime @default(now())
}

model Doctor {
  id        Int    @id @default(autoincrement())
  name      String
  specialty String
  address   String
  phone     String?
}

model LabResult {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  name      String
  value     Float
  unit      String
  date      DateTime
  status    String   // normal | warning | critical
  createdAt DateTime @default(now())
}

model Medication {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  name      String
  dosage    String
  frequency String
  startDate DateTime
  createdAt DateTime @default(now())
}

model AIResponse {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  prompt    String
  response  String
  module    String   // care | labs | coach | family
  createdAt DateTime @default(now())
}
```

---

## 6. Deployment (BWCloud)

```bash
# 1. VM-Pakete installieren (einmalig)
sudo apt update && sudo apt install -y nginx postgresql nodejs npm
sudo npm install -g pm2

# 2. Datenbank einrichten
sudo -u postgres createdb aiva_health
npx prisma migrate deploy
npx prisma db seed   # Testdaten einspielen

# 3. Backend starten (via PM2)
cd backend && npm install && npm run build
pm2 start src/index.js --name aiva-backend
pm2 save && pm2 startup

# 4. Frontend bauen
cd frontend && npm install && npm run build
# → dist/ Ordner wird von Nginx serviert

# 5. HTTPS einrichten
sudo certbot --nginx -d <domain>

# 6. Nginx-Konfiguration
# /api/*  → Proxy zu localhost:3001
# /*      → Root auf frontend/dist/
```

---

## 7. MVP-Scope (1 Monat)

### ✅ Must-Have — AIVA Care + Labs (vollständig funktional)
- [ ] Login / Registrierung (JWT-Auth)
- [ ] AIVA Care: Terminverwaltung (CRUD)
- [ ] AIVA Care: Arztliste anzeigen
- [ ] AIVA Labs: Laborwerte anzeigen & hinzufügen
- [ ] AIVA Labs: Medikationsplan verwalten
- [ ] KI-Mock: Einfache statische Antworten je Modul
- [ ] Deployment auf BWCloud (HTTPS, Nginx, PM2)

### 👁️ Sichtbar, keine Funktion (Shell-UI)
- [ ] AIVA Coach: Navigation + Platzhalter-Screen
- [ ] AIVA Family: Navigation + Platzhalter-Screen

### 🔮 Post-MVP (Phase 2)
- [ ] OpenAI API Anbindung (echte KI-Empfehlungen)
- [ ] Expo Mobile App (iOS / Android Store)
- [ ] Wearable Integration (Apple Health, Google Fit)
- [ ] ePA Anbindung (Befunde, bidirektional)
- [ ] DSGVO-vollständige Datenschutzimplementierung

---

## 8. Teamaufteilung (1 Monat, 2 Entwickler + 1 Designer)

| Woche | Entwickler 1 | Entwickler 2 | Designer |
|---|---|---|---|
| **Woche 1** | Backend Setup, Auth API, DB + Prisma Schema | React + Vite Setup, Routing, Auth UI | Layouts für Care + Labs Screens |
| **Woche 2** | Care REST API, Labs REST API, KI-Mock | Care UI-Komponenten (Termine, Ärzte) | Weitere UI-Specs, Designsystem |
| **Woche 3** | Labs UI-Komponenten, Coach/Family Shells | Frontend ↔ Backend Integration (Axios) | Review, Feinschliff, Edge Cases |
| **Woche 4** | Deployment BWCloud, HTTPS, Nginx | Bug-Fixing, Tests, E2E-Verifikation | Final UI-Checks, Abnahme |

---

## 9. Dependency-Versionen (Ziel)

```
# Frontend
react                    ^18.0.0
react-dom                ^18.0.0
react-router-dom         ^6.0.0
vite                     ^5.0.0
axios                    ^1.0.0

# Backend
node                     20 LTS
express                  ^4.18.0
jsonwebtoken             ^9.0.0
bcrypt                   ^5.0.0
prisma                   ^5.0.0
@prisma/client           ^5.0.0

# Infrastruktur
PostgreSQL               15
PM2                      ^5.0.0
Nginx                    1.24+
```

---

## Verwandte Context-Dateien

- [project-overview.md](project-overview.md) — Business-Kontext & Value Proposition
- [modules.md](modules.md) — AIVA Module Details (Care, Coach, Labs, Family)
- [roadmap.md](roadmap.md) — Entwicklungs-Roadmap & Meilensteine
- [security.md](security.md) — DSGVO & Sicherheitsanforderungen
- [personas.md](personas.md) — Zielgruppen (Laura Becker, Thomas Wagner)
