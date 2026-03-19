## ══════════════════════════════════════════════════════════════════════════════
## proguard-rules.pro — Regeln fuer Code-Verkleinerung und Obfuskation
## ══════════════════════════════════════════════════════════════════════════════
##
## Was ist ProGuard / R8?
## ──────────────────────
## ProGuard (bzw. sein Nachfolger R8) kann den Java/Kotlin-Code der App:
##   1. Verkleinern (Shrink) — Unbenutzte Klassen/Methoden entfernen
##   2. Optimieren — Code-Optimierungen durchfuehren
##   3. Obfuskieren — Klassen/Methoden umbenennen (a, b, c...) → Reverse Engineering erschweren
##
## AKTUELLER STATUS: DEAKTIVIERT
## ──────────────────────────────
## In app/build.gradle ist "minifyEnabled false" gesetzt, daher werden diese
## Regeln aktuell NICHT angewendet. Bei einer WebView-App wie AIVA Health
## bringt ProGuard wenig Nutzen, weil der eigentliche App-Code (JavaScript)
## bereits von Vite minimiert wird. Nur der duenne Android-Java-Wrapper
## (MainActivity) wuerde betroffen sein.
##
## Wann waere ProGuard sinnvoll?
## ─────────────────────────────
## - Bei Apps mit viel nativem Java/Kotlin-Code
## - Wenn die APK-Groesse kritisch ist (ProGuard entfernt ungenutzten Code)
## - Wenn der Code vor Reverse Engineering geschuetzt werden soll
##
## ══════════════════════════════════════════════════════════════════════════════

## Wenn die App eine WebView mit JavaScript-Bridge nutzt (was bei Capacitor
## der Fall ist), muss man die JS-Interface-Klasse hier schuetzen, damit
## ProGuard sie nicht umbenennt oder entfernt. Aktuell nicht noetig, da
## ProGuard deaktiviert ist.
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

## Zeilennummer-Informationen in Stack-Traces beibehalten.
## Nuetzlich zum Debuggen von Crash-Reports.
#-keepattributes SourceFile,LineNumberTable

## Wenn Zeilennummern beibehalten werden, kann man den Original-Dateinamen
## verstecken (wird durch "SourceFile" ersetzt).
#-renamesourcefileattribute SourceFile
