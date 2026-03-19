# BW-Cloud VM Session Status — 19. März 2026

## Cloudflare Quick Tunnel ✅ AKTIV (als systemd-Service)
- **URL:** https://bomb-insert-heather-provision.trycloudflare.com
- **Verbindung:** IPv6 QUIC zu Cloudflare Stuttgart (str01), ip=2606:4700:a0::2
- **Service:** `sudo systemctl start|stop|restart|status cloudflared`
- **Auto-Start:** Ja (enabled via systemd)
- **Log:** `~/cloudflared.log` / `grep trycloudflare ~/cloudflared.log`
- **WICHTIG:** URL ändert sich bei jedem Neustart! Danach APK neu bauen.
- **WICHTIG:** `--url http://[::1]:80` weil Docker nur auf IPv6 [::]:80 bindet
- **WICHTIG:** `--edge-ip-version 6` nötig weil VM nur IPv6-Internet hat

## APK (Stand: 19.03.2026)
- Gebaut mit `VITE_API_URL=https://bomb-insert-heather-provision.trycloudflare.com`
- Pfad: `APK Test/android/app/build/outputs/apk/release/app-release-cloud.apk` (3.3 MB)
- Signiert mit: `APK Test/aiva-health-release.keystore` (Pass: aiva2026, Alias: aiva-health)
- JAVA_HOME: `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot`

## APK Rebuild Workflow (bei Tunnel-URL-Änderung)
```powershell
# 1. Neue URL holen
ssh aiva-health "grep trycloudflare ~/cloudflared.log | tail -1"
# 2. .env aktualisieren
# Prototyp/frontend/.env → VITE_API_URL=https://NEUE-URL.trycloudflare.com
# 3. Bauen
cd Prototyp/frontend; npm run build
# 4. Assets kopieren
Copy-Item dist/assets/* "../../APK Test/android/app/src/main/assets/public/assets/" -Force
Copy-Item dist/index.html "../../APK Test/android/app/src/main/assets/public/index.html" -Force
# 5. APK bauen
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot"
cd "../../APK Test/android"; .\gradlew.bat assembleRelease
```

## VM-Infos
- **Name:** aiva-health
- **IPv6:** 2001:7c0:2320:2:f816:3eff:fe02:fae7
- **SSH:** `ssh aiva-health` (via IPv6 in ~/.ssh/config)
- **Docker:** Alle 3 Container laufen (frontend, backend, db)
- **Port 80:** Nur auf [::]:80 gebunden (IPv6 only)

## Einschränkungen
- Kein IPv4-Internet auf VM (BW-Cloud v6only)
- git pull geht nicht (GitHub nur IPv4) → SCP nutzen
- docker compose --build geht nicht → nur `up -d`
- Floating IP (IPv4) erst wieder ab Mai 2026
