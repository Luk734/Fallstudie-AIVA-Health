// ══════════════════════════════════════════════════════════════════════════════
// MainActivity.java — Einzige Java-Klasse der AIVA Health Android-App
// ══════════════════════════════════════════════════════════════════════════════
//
// Was macht diese Klasse?
// ───────────────────────
// Diese Klasse ist der Einstiegspunkt der Android-App. Sie erbt von
// BridgeActivity (Capacitor), die intern eine WebView erstellt und unsere
// React-Web-App (aus assets/public/) darin laedt.
//
// Warum ist die Klasse leer?
// ──────────────────────────
// Capacitor's BridgeActivity uebernimmt ALLES automatisch:
//   - WebView erstellen und konfigurieren
//   - Web-Assets (HTML/JS/CSS) aus assets/public/ laden
//   - JavaScript ↔ Native Bridge aufbauen
//   - Lifecycle-Events (onPause, onResume etc.) verwalten
//
// Wir muessen hier nur dann Code hinzufuegen, wenn wir:
//   - Native Android-Funktionen ansprechen wollen (z.B. Kamera, GPS)
//   - Capacitor-Plugins konfigurieren wollen
//   - Eigene Event-Handler registrieren wollen
//
// ══════════════════════════════════════════════════════════════════════════════

package de.aiva.health;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
