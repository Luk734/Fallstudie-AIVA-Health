# AIVA Health – Fortschritt (Stand: 19.03.2026)

## Projekt-Setup
- Repo: https://github.com/Luk734/Fallstudie-AIVA-Health.git
- Hauptbranch: `main` (Prototyp), `cloud` (Cloud-Deployment + APK)
- Workspace: `C:\\Users\\KUENSTL\\Fallstudie_Bima_20026`

---

## ✅ Erledigtes

### IPv6-Umstellung (19.03.2026)
- **Grund:** BW-Cloud Floating IPs (IPv4) bis Mai nicht verfügbar
- **nginx.conf:** `listen [::]:80;` hinzugefügt → Nginx akzeptiert IPv6-Anfragen
- **docker-compose.yml:** Port-Binding auf `[::]:80:80` → Docker bindet auf IPv6
- **Commit:** 83d3ecb (auf GitHub gepusht)
- **VM:** Dateien per SCP kopiert (git pull geht nicht, s.u.), Container neugestartet
- **Status:** App über IPv6 erreichbar ✅
  - Frontend: `http://[2001:7c0:2320:2:f816:3eff:fe02:fae7]/` → React-HTML ✅
  - API: `http://[2001:7c0:2320:2:f816:3eff:fe02:fae7]/api/health` → OK ✅
  - IPv4 intern (localhost): ✅ funktioniert auch noch

### WICHTIG: Git Pull auf VM funktioniert NICHT
- GitHub hat nur IPv4-Adressen (140.82.121.4)
- VM hat kein IPv4 Internet (nur IPv6)
- BW-Cloud hat KEIN DNS64/NAT64
- **Workaround:** Dateien lokal ändern → `git push` → `scp DATEI aiva-health:~/aiva-health/PFAD`

### Cloud-Deployment (BWCloud / OpenStack)
- VM `aiva-health` (Ubuntu 22.04, m1.tiny) auf BWCloud
- Floating IP: **NICHT VERFÜGBAR** (bis Mai 2026 gesperrt)
- Zugriff NUR über IPv6: `2001:7c0:2320:2:f816:3eff:fe02:fae7`
- Interface: `ens3` = public-belwue-v6only
- Docker 28.2.2 + Docker Compose 2.37.1
- Repo auf VM: `~/aiva-health` (branch `cloud`)
- `.env` auf VM: `DB_USER=aiva_user, DB_PASSWORD=admin, DB_NAME=aiva_health, JWT_SECRET=aiva-cloud-prod-secret-2026`
- Login: `laura@example.com` / `Test1234!` oder `thomas@example.com` / `Test1234!`

### Sicherheits-Maßnahmen
- fail2ban: 3 Fehlversuche → 48h Ban
- SSH gehärtet: PermitRootLogin no, PasswordAuthentication no, MaxAuthTries 3
- Docker: nur Port 80 extern, DB + Backend nur intern

### Android APK
- APK nutzte `VITE_API_URL=http://134.155.108.96` (alte Floating IP)
- **APK funktioniert NICHT** bis Floating IP wieder da (Mai)

## Git-Commits (cloud branch)
- 83d3ecb: fix(cloud): IPv6-Support fuer nginx und docker-compose
- 437c6bf: fix(nginx): resolver fuer Docker DNS
- 8d79384: fix(cloud): OpenSSL fuer Prisma auf Alpine
- 5ef2fc2: feat(cloud): Docker Compose Setup

## SSH Config (lokal ~/.ssh/config)
```
Host aiva-health
    HostName 2001:7c0:2320:2:f816:3eff:fe02:fae7
    User ubuntu
    IdentityFile ~/.ssh/id_rsa
    StrictHostKeyChecking no
```

## Deployment-Workflow (SCP statt git pull)
```bash
# 1. Lokal ändern + committen + pushen
git add . && git commit -m "..." && git push origin cloud

# 2. Dateien per SCP auf VM kopieren
scp "Cloud Test/datei" aiva-health:~/aiva-health/"Cloud Test/"

# 3. Container neustarten (OHNE --build!)
ssh aiva-health "cd ~/aiva-health/'Cloud Test' && sudo docker compose down && sudo docker compose up -d"
```
ACHTUNG: `docker compose up --build` schlägt fehl (kein IPv4 Internet für npm/apk).
Nur `docker compose up -d` (ohne --build) nutzen!
