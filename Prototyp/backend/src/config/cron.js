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

// ── Medikamenten-Erinnerungen generieren (US-21, TASK-80 + TASK-81) ───
//
// Prüft alle 15 Minuten, ob gerade eine Einnahmezeit fällig ist.
// Falls ja und der User seine Einnahme noch NICHT bestätigt hat,
// wird eine In-App-Notification mit Quick-Action erstellt.
//
// ── Zuordnung der Tageszeiten zu Uhrzeiten ────────────────────────────
//   morgens = 08:00, mittags = 12:00, abends = 18:00, nachts = 22:00
//
// ── Warum ein Zeitfenster und kein exakter Vergleich? ─────────────────
//   Der Cron läuft alle 15 Minuten (z.B. um 07:45, 08:00, 08:15).
//   Wenn die Einnahmezeit 08:00 ist, prüfen wir ob 08:00 im Fenster
//   [jetzt - 15 Min, jetzt] liegt. So wird nichts verpasst.
//
// ── Duplikat-Schutz ───────────────────────────────────────────────────
//   Bevor eine Notification erstellt wird, prüfen wir:
//   1. Gibt es schon eine Notification für dieses Medikament HEUTE?
//   2. Hat der User die Einnahme schon bestätigt (MedicationLog=taken)?
//   Ohne diese Checks würde alle 15 Min eine neue Erinnerung kommen!

// Einnahmezeiten → Uhrzeiten (Stunde:Minute als Dezimalzahl)
const TIME_TO_HOUR = {
  morgens: 8,    // 08:00
  mittags: 12,   // 12:00
  abends: 18,    // 18:00
  nachts: 22,    // 22:00
};

// Einnahmezeiten → Emojis (für die Notification-Nachricht)
const TIME_EMOJI = {
  morgens: '🌅',
  mittags: '☀️',
  abends: '🌙',
  nachts: '🌑',
};

export async function generateMedicationReminders() {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // ── Welche Einnahmezeit liegt im aktuellen 15-Min-Fenster? ────
    // Beispiel: Cron läuft um 08:07 → Fenster = 07:52 bis 08:07
    // → "morgens" (08:00) liegt genau im Fenster → Erinnerung fällig!
    //
    // Wir rechnen alles in Minuten seit Mitternacht um, damit der
    // Vergleich einfach ist (z.B. 08:07 = 487 Minuten).
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const windowStart = currentTotalMinutes - 15; // 15 Min zurück

    // Finde die Einnahmezeit(en), die im Fenster liegen
    const dueTimeEntries = Object.entries(TIME_TO_HOUR).filter(
      ([, hour]) => {
        const timeMinutes = hour * 60; // z.B. 08:00 = 480 Minuten
        return timeMinutes > windowStart && timeMinutes <= currentTotalMinutes;
      }
    );

    // Wenn keine Einnahmezeit gerade fällig ist → nichts zu tun
    if (dueTimeEntries.length === 0) return;

    // ── Heute als Datum (00:00:00) für DB-Abfragen ────────────────
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Beginn des heutigen Tages (für Duplikat-Check: createdAt >= today)
    const todayStart = new Date(today);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    let createdCount = 0;

    // ── Für jede fällige Einnahmezeit ─────────────────────────────
    for (const [timeName] of dueTimeEntries) {
      // Schritt 1: Alle aktiven Medikamente finden, die zu dieser
      // Tageszeit eingenommen werden müssen.
      // times ist ein Komma-separierter String: "morgens,abends"
      // Prisma's "contains" prüft ob der String den Wert enthält.
      const medications = await prisma.medication.findMany({
        where: {
          active: true,
          times: { contains: timeName },
        },
        select: {
          id: true,
          userId: true,
          name: true,
          dosage: true,
        },
      });

      // Schritt 2: Für jedes Medikament prüfen + Notification erstellen
      for (const med of medications) {
        // ── Duplikat-Check: Schon eine Erinnerung heute? ──────────
        // Wir suchen nach einer Notification mit:
        //   - type = "medication_reminder"
        //   - relatedId = Medication.id
        //   - createdAt = heute (zwischen 00:00 und 23:59)
        //   - message enthält die Tageszeit (z.B. "morgens")
        // So vermeiden wir doppelte Erinnerungen, wenn der Cron
        // mehrmals im selben 15-Min-Fenster läuft.
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: med.userId,
            type: 'medication_reminder',
            relatedId: med.id,
            message: { contains: timeName },
            createdAt: { gte: todayStart, lt: tomorrowStart },
          },
        });

        if (existingNotification) continue;

        // ── Einnahme-Check: Schon eingenommen? ────────────────────
        // Wenn der User die Einnahme schon bestätigt hat (status=taken),
        // braucht er keine Erinnerung mehr.
        const existingLog = await prisma.medicationLog.findFirst({
          where: {
            medicationId: med.id,
            userId: med.userId,
            scheduledDate: today,
            scheduledTime: timeName,
            status: 'taken',
          },
        });

        if (existingLog) continue;

        // ── Notification erstellen ────────────────────────────────
        // Die message enthält: Emoji + Medikamentenname + Dosierung + Tageszeit
        // relatedId = Medication.id → damit das Frontend den Quick-Action-Button
        // korrekt mit POST /api/medications/:relatedId/take aufrufen kann.
        const emoji = TIME_EMOJI[timeName];
        const message = `${emoji} ${med.name} ${med.dosage} — ${timeName}`;

        await prisma.notification.create({
          data: {
            userId: med.userId,
            type: 'medication_reminder',
            title: '💊 Medikament einnehmen',
            message,
            relatedId: med.id,
            read: false,
          },
        });

        createdCount++;
      }
    }

    if (createdCount > 0) {
      console.log(`💊 ${createdCount} Medikamenten-Erinnerung(en) erstellt`);
    }
  } catch (error) {
    console.error('❌ Fehler bei Medikamenten-Erinnerungen:', error);
  }
}

// ── Cron-Job starten ──────────────────────────────────────────────────
// Diese Funktion wird in server.js aufgerufen, wenn der Server startet.
// Sie:
//   1. Führt beide Reminder-Funktionen sofort aus
//   2. Plant den Cron-Job für alle 15 Minuten
//
// Beide Funktionen laufen unabhängig voneinander:
//   - generateReminders() → Termin-Erinnerungen (US-18)
//   - generateMedicationReminders() → Medikamenten-Erinnerungen (US-21)
export function startReminderCron() {
  // Sofort beim Start einmal ausführen
  console.log('⏰ Erinnerungs-Cron gestartet (alle 15 Minuten)');
  generateReminders();
  generateMedicationReminders();

  // Dann alle 15 Minuten wiederholen
  // '*/15 * * * *' = "jede 15. Minute jeder Stunde jedes Tages"
  cron.schedule('*/15 * * * *', () => {
    generateReminders();
    generateMedicationReminders();
  });
}
