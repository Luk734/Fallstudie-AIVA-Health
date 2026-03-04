// src/config/cron.js — Automatische Termin-Erinnerungen (US-18, TASK-69)
//
// Cron-Job: Läuft alle 15 Minuten und prüft, ob Termine bevorstehen.
// Wenn ja, werden In-App-Benachrichtigungen erstellt.
//
// ── Was ist ein Cron-Job? ──────────────────────────────────────────────
// Ein Cron-Job ist ein Timer, der eine Funktion in regelmäßigen Abständen
// automatisch ausführt — wie ein Wecker, der immer wieder klingelt.
// "node-cron" ist eine Bibliothek, die das in Node.js ermöglicht.
//
// ── Cron-Syntax: '*/15 * * * *' ───────────────────────────────────────
//   ┌── Minute (*/15 = alle 15 Minuten)
//   │ ┌── Stunde (* = jede)
//   │ │ ┌── Tag im Monat (* = jeder)
//   │ │ │ ┌── Monat (* = jeder)
//   │ │ │ │ ┌── Wochentag (* = jeder)
//   │ │ │ │ │
//   */15 * * * *
//
// ── Zwei Zeitfenster für Erinnerungen ─────────────────────────────────
//   1. "24h vorher" → Nachricht: "Termin morgen"
//   2. "1h vorher"  → Nachricht: "Termin in 1 Stunde"
//
// ── Duplikat-Schutz ───────────────────────────────────────────────────
//   Bevor eine Notification erstellt wird, prüfen wir ob es schon eine
//   für denselben Termin (relatedId) mit demselben Typ gibt.
//   Ohne diesen Check würde alle 15 Minuten eine neue erstellt werden!

import cron from 'node-cron';
import prisma from './prisma.js';

// ── Hilfsfunktion: Datum formatieren ──────────────────────────────────
// Wandelt ein Date-Objekt in ein lesbares deutsches Format um.
// Beispiel: new Date('2026-03-15T10:30') → "15.03.2026 um 10:30 Uhr"
//
// toLocaleDateString('de-DE') → "15.03.2026" (deutsches Datumsformat)
// toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) → "10:30"
function formatDateTime(date) {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} um ${timeStr} Uhr`;
}

// ── Hauptfunktion: Erinnerungen generieren ────────────────────────────
// Diese Funktion wird vom Cron-Job alle 15 Minuten aufgerufen.
// Sie ist auch exportiert, damit sie beim Serverstart einmal sofort
// ausgeführt werden kann (für sofortige Erinnerungen nach Neustart).
export async function generateReminders() {
  try {
    const now = new Date();

    // ── Zeitfenster berechnen ──────────────────────────────────────
    // Wir definieren zwei Erinnerungszeitpunkte:
    //   1. Termine in 23-25 Stunden → "Termin morgen"
    //   2. Termine in 45-75 Minuten → "Termin in 1 Stunde"
    //
    // Warum Bereiche und nicht exakte Zeitpunkte?
    // Der Cron läuft alle 15 Minuten. Wenn ein Termin um 10:30 ist
    // und der Cron um 09:28 läuft, liegt 10:30 genau 62 Minuten entfernt.
    // Um nichts zu verpassen, definieren wir großzügige Fenster.

    // Zeitfenster 1: "Morgen" = in 23 bis 25 Stunden
    const tomorrow_from = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const tomorrow_to = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Zeitfenster 2: "In 1 Stunde" = in 45 bis 75 Minuten
    const oneHour_from = new Date(now.getTime() + 45 * 60 * 1000);
    const oneHour_to = new Date(now.getTime() + 75 * 60 * 1000);

    // ── Konfiguration der zwei Erinnerungstypen ───────────────────
    // Jeder Eintrag definiert:
    //   - type: Wird als Notification-Typ gespeichert (für Duplikat-Check)
    //   - title: Überschrift in der Benachrichtigung
    //   - from/to: Zeitfenster für die DB-Abfrage
    const reminderConfigs = [
      {
        type: 'appointment_reminder_24h',
        title: 'Termin morgen',
        from: tomorrow_from,
        to: tomorrow_to,
      },
      {
        type: 'appointment_reminder_1h',
        title: 'Termin in 1 Stunde',
        from: oneHour_from,
        to: oneHour_to,
      },
    ];

    let createdCount = 0;

    // ── Für jeden Erinnerungstyp: Termine suchen + Notifications erstellen ──
    for (const config of reminderConfigs) {
      // Schritt 1: Alle anstehenden Termine im Zeitfenster finden
      // Bedingungen:
      //   - status = "scheduled" (nicht abgesagt/erledigt)
      //   - datetime zwischen from und to
      const appointments = await prisma.appointment.findMany({
        where: {
          status: 'scheduled',
          datetime: {
            gte: config.from,  // >= Anfang des Zeitfensters
            lte: config.to,    // <= Ende des Zeitfensters
          },
        },
        // Wir brauchen die User-ID, den Titel und weitere Infos für die Nachricht
        select: {
          id: true,
          userId: true,
          title: true,
          doctor: true,
          location: true,
          datetime: true,
        },
      });

      // Schritt 2: Für jeden gefundenen Termin eine Notification erstellen
      for (const apt of appointments) {
        // ── Duplikat-Check ──────────────────────────────────────────
        // Prüfe: Gibt es schon eine Notification für diesen Termin
        // mit diesem Erinnerungstyp?
        // findFirst gibt null zurück wenn nichts gefunden wurde.
        const existing = await prisma.notification.findFirst({
          where: {
            userId: apt.userId,
            type: config.type,
            relatedId: apt.id,
          },
        });

        // Wenn schon eine Erinnerung existiert → überspringen
        if (existing) continue;

        // ── Notification erstellen ──────────────────────────────────
        // Nachricht mit lesbarem Datum und Termin-Details zusammenbauen
        const message = `${apt.title} am ${formatDateTime(apt.datetime)} bei ${apt.doctor}` +
          (apt.location ? ` — ${apt.location}` : '');

        await prisma.notification.create({
          data: {
            userId: apt.userId,
            type: config.type,
            title: config.title,
            message,
            relatedId: apt.id,
            read: false,
          },
        });

        createdCount++;
      }
    }

    if (createdCount > 0) {
      console.log(`🔔 ${createdCount} neue Erinnerung(en) erstellt`);
    }
  } catch (error) {
    console.error('❌ Fehler beim Generieren der Erinnerungen:', error);
  }
}

// ── Cron-Job starten ──────────────────────────────────────────────────
// Diese Funktion wird in server.js aufgerufen, wenn der Server startet.
// Sie:
//   1. Führt generateReminders() sofort aus (falls Erinnerungen fällig sind)
//   2. Plant den Cron-Job für alle 15 Minuten
export function startReminderCron() {
  // Sofort beim Start einmal ausführen
  console.log('⏰ Erinnerungs-Cron gestartet (alle 15 Minuten)');
  generateReminders();

  // Dann alle 15 Minuten wiederholen
  // '*/15 * * * *' = "jede 15. Minute jeder Stunde jedes Tages"
  cron.schedule('*/15 * * * *', () => {
    generateReminders();
  });
}
