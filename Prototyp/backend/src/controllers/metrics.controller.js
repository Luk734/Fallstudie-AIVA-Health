// src/controllers/metrics.controller.js — Wearable-Metriken (US-27)
//
// Dieser Controller liefert die simulierten Wearable-Gesundheitsdaten.
// Laura (32, Apple Watch) sieht hier ihre täglichen Metriken:
//   - Schritte, Herzfrequenz (Ø/Min/Max), Schlaf (Dauer + Qualität)
//
// Im MVP sind das Mock-Daten, die vom Cron-Job generiert werden.
// Echte Wearable-Integration (Apple Health, Google Fit) folgt später.
//
// Endpunkte:
//   GET /api/metrics          → Metriken für ein Datum (?date=YYYY-MM-DD)
//   GET /api/metrics/latest   → Aktuellste verfügbare Metriken
//
// Alle Handler sind mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).

import prisma from '../config/prisma.js';

// ─── GET /api/metrics?date=YYYY-MM-DD ────────────────────────────────
// Liefert die Wearable-Metriken für ein bestimmtes Datum.
// Wenn kein date-Parameter angegeben wird → Metriken von heute.
//
// Warum UTC-Normalisierung?
//   Wie bei Checkins speichern wir das Datum immer als 00:00:00 UTC.
//   Dadurch matcht die DB-Abfrage korrekt, egal aus welcher Zeitzone
//   die Anfrage kommt.
//
// Response:
//   200 + Metrik-Objekt (wenn vorhanden)
//   200 + { metric: null } (wenn kein Eintrag für das Datum)

export async function getMetricsByDate(req, res) {
  try {
    const userId = req.user.userId;

    // Datum aus Query-Parameter oder heute als Fallback
    let date;
    if (req.query.date) {
      // Date-String parsen und auf 00:00:00 UTC normalisieren
      const parsed = new Date(req.query.date);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({
          error: 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD',
        });
      }
      date = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
    } else {
      // Kein date angegeben → heute
      const now = new Date();
      date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    // ── Metrik für dieses Datum abrufen ────────────────────────
    // findUnique mit dem Composite Key [userId, date].
    // Gibt null zurück wenn kein Eintrag existiert.
    const metric = await prisma.healthMetric.findUnique({
      where: { userId_date: { userId, date } },
    });

    res.json({ metric });
  } catch (error) {
    console.error('Fehler beim Abrufen der Metriken:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

// ─── GET /api/metrics/latest ─────────────────────────────────────────
// Liefert die aktuellsten Wearable-Metriken des Users.
// Nützlich für die Anzeige auf der Coach-Seite: Zeigt immer den
// neuesten verfügbaren Datensatz, auch wenn heute noch keine Daten da sind.
//
// findFirst + orderBy date desc → der neueste Eintrag kommt zuerst.
// Gibt null zurück wenn der User noch nie Metriken hatte.

export async function getLatestMetrics(req, res) {
  try {
    const userId = req.user.userId;

    const metric = await prisma.healthMetric.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json({ metric });
  } catch (error) {
    console.error('Fehler beim Abrufen der aktuellsten Metriken:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
