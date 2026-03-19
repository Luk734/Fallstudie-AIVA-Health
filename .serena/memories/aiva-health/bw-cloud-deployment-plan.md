# BW Cloud Deployment Plan - AIVA Health
Stand: 05.03.2026 | Branch: cloud

## Erstellte Dateien (alle in "Cloud Test/")
1. docker-compose.yml — Orchestriert DB + Backend + Frontend
2. Dockerfile.backend — Node 20 Alpine, npm ci, prisma generate, migrate deploy + server start
3. Dockerfile.frontend — Multi-stage: Build (Vite) + Nginx, sed-Fix fuer localhost-Fallback
4. nginx.conf — Reverse Proxy: /* → React SPA, /api/* → backend:3001
5. .env — Produktions-Umgebungsvariablen (DB_USER, DB_PASSWORD, JWT_SECRET)
6. .gitignore — Ignoriert .env

## Architektur
- Nginx (Port 80, einziger externer Port) → Reverse Proxy
- Backend (Port 3001, nur intern) → Express + Prisma
- DB (Port 5432, nur intern) → PostgreSQL 16 Alpine
- Alle in Docker Compose Netzwerk verbunden

## Wichtiger Fix im Frontend-Build
- sed ersetzt localhost-Fallback durch leeren String
- Damit werden alle fetch-Aufrufe relativ (/api/...) → Nginx proxied zum Backend
- Original-Code im Prototyp bleibt UNVERÄNDERT

## Nächste Schritte (User muss machen)
1. VM in bwCloud erstellen (Ubuntu 22.04, m1.small, Security Group Port 22+80)
2. SSH-Key zuweisen, Floating IP zuweisen
3. Auf VM: Docker + Git installieren
4. Repo klonen, cd "Cloud Test", docker compose up --build -d
5. Seed-Daten laden: docker compose exec backend npx prisma db seed
6. Browser: http://VM-IP
