# APK Test Ordner – Struktur & Analyse

## Was ist das?
Capacitor-Android-Projekt, das die AIVA Health Vite/React-Frontend-App als native Android-APK verpackt.
Capacitor bettet eine WebView in eine native Android-Shell ein → die Web-App läuft in einer WebView.

## Package: `de.aiva.health`
## Gradle Version: 8.2.1, Android Gradle Plugin 8.2.1
## SDK: min 22, compile/target 34

## Keystore: `aiva-health-release.keystore` (Passwort: aiva2026, Alias: aiva-health)

## Build-Outputs:
- `android/app/build/outputs/apk/release/app-release.apk` – Signierte Release-APK
- `android/app/build/outputs/apk/release/app-release-cloud.apk` – Kopie der Release-APK
- `android/app/build/outputs/apk/debug/app-debug.apk` – Debug-APK

## Web-Assets (gebaut und reinkopiert):
- `android/app/src/main/assets/public/` enthält den Vite-Build-Output (index.html, JS, CSS, Avatare)

## Unnötige/Löschbare Dateien:
- `.gradle/` – Build-Cache, regeneriert sich bei jedem Build
- `app/build/` – Kompletter Build-Output, regeneriert sich
- `capacitor-cordova-android-plugins/build/` – Build-Cache des Cordova-Plugin-Moduls
- `node_modules/` – NPM-Abhängigkeiten, regeneriert mit `npm install`
- `app-release-cloud.apk` – Manuelle Kopie, nicht Teil des Build-Prozesses
- `local.properties` – Maschinenspezifisch (SDK-Pfad), soll nicht versioniert sein
