// src/controllers/medication.controller.js — Medikamenten-Endpunkte (US-19)
//
// Dieser Controller verwaltet die Medikamente eines Nutzers.
// Jeder Handler ist mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).
//
// Endpunkte:
//   GET    /api/medications          → Alle aktiven Medikamente abrufen
//   GET    /api/medications/:id      → Einzelnes Medikament (Detail/Bearbeiten)
//   POST   /api/medications          → Neues Medikament anlegen
//   PUT    /api/medications/:id      → Medikament bearbeiten
//   PATCH  /api/medications/:id/deactivate → Medikament absetzen (Soft-Delete)
//
// ── Soft-Delete-Pattern ──────────────────────────────────────────────
// Medikamente werden NICHT aus der Datenbank gelöscht. Stattdessen wird
// das `active`-Flag auf false gesetzt. Das ist aus zwei Gründen wichtig:
//   1. DSGVO: Medizinische Daten sollen nachvollziehbar bleiben
//   2. US-20: Die Einnahme-Historie (medication_logs) braucht das Medikament

import prisma from '../config/prisma.js';

// ── Erlaubte Einnahmezeiten ──────────────────────────────────────────
// Nur diese Werte sind für das `times`-Feld erlaubt.
// Im Frontend werden sie als Checkboxen angezeigt.
const VALID_TIMES = ['morgens', 'mittags', 'abends', 'nachts'];

// ── Erlaubte Farben ──────────────────────────────────────────────────
// 6 vordefinierte Farben für die visuelle Erkennung.
// Im Frontend werden sie als farbige Kreise angezeigt.
const VALID_COLORS = [
  '#EF4444',   // Rot
  '#F97316',   // Orange
  '#EAB308',   // Gelb
  '#10B981',   // Grün
  '#3B82F6',   // Blau
  '#8B5CF6',   // Violett
];

// ─── GET /api/medications ────────────────────────────────────────────
// Gibt alle AKTIVEN Medikamente des eingeloggten Users zurück.
//
// Query-Parameter (optional):
//   ?active=false → zeigt auch abgesetzte Medikamente (für Historie)
//   Ohne Parameter → nur aktive (Standard im Alltag)
//
// Sortierung: Neueste zuerst (createdAt absteigend).

export async function getMedications(req, res) {
  try {
    // Filter: Standardmäßig nur aktive Medikamente
    const where = { userId: req.user.userId };

    // ?active=all → alle anzeigen (auch abgesetzte)
    // Ohne oder ?active=true → nur aktive
    if (req.query.active !== 'all') {
      where.active = true;
    }

    const medications = await prisma.medication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        substance: true,
        dosage: true,
        times: true,
        startDate: true,
        endDate: true,
        color: true,
        leafletUrl: true,
        active: true,
        notes: true,
        createdAt: true,
      },
    });

    res.json({ medications });
  } catch (error) {
    console.error('Fehler beim Laden der Medikamente:', error);
    res.status(500).json({ error: 'Medikamente konnten nicht geladen werden' });
  }
}

// ─── GET /api/medications/:id ────────────────────────────────────────
// Gibt ein einzelnes Medikament zurück (für Detail-Ansicht / Bearbeiten).
//
// Sicherheit: Wir prüfen, ob das Medikament dem eingeloggten User gehört.
// findFirst mit { id, userId } stellt sicher, dass ein User niemals
// auf Medikamente eines anderen Users zugreifen kann.

export async function getMedicationById(req, res) {
  try {
    const { id } = req.params;

    const medication = await prisma.medication.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.userId,
      },
    });

    if (!medication) {
      return res.status(404).json({ error: 'Medikament nicht gefunden' });
    }

    res.json(medication);
  } catch (error) {
    console.error('Fehler beim Laden des Medikaments:', error);
    res.status(500).json({ error: 'Medikament konnte nicht geladen werden' });
  }
}

// ─── POST /api/medications ───────────────────────────────────────────
// Erstellt ein neues Medikament für den eingeloggten User.
//
// Erwarteter Body:
// {
//   "name": "Ramipril",              // Pflicht
//   "dosage": "5mg",                 // Pflicht
//   "times": "morgens,abends",       // Pflicht, komma-separiert
//   "startDate": "2026-01-15",       // Pflicht
//   "substance": "ACE-Hemmer",       // Optional
//   "endDate": null,                 // Optional (null = dauerhaft)
//   "color": "#EF4444",              // Optional (Standard: Indigo)
//   "leafletUrl": "https://...",     // Optional
//   "notes": "Vor dem Essen"         // Optional
// }
//
// Validierung:
//   - name: mindestens 1 Zeichen
//   - dosage: mindestens 1 Zeichen
//   - times: mindestens 1 gültige Einnahmezeit
//   - startDate: muss ein gültiges Datum sein
//   - color: muss in VALID_COLORS enthalten sein (falls angegeben)

export async function createMedication(req, res) {
  try {
    const {
      name, substance, dosage, times, startDate,
      endDate, color, leafletUrl, notes,
    } = req.body;

    // ── Validierung ───────────────────────────────────────────────
    const errors = [];

    if (!name || name.trim().length === 0) {
      errors.push('Medikamentenname ist erforderlich');
    }
    if (!dosage || dosage.trim().length === 0) {
      errors.push('Dosierung ist erforderlich');
    }
    if (!times || times.trim().length === 0) {
      errors.push('Mindestens eine Einnahmezeit ist erforderlich');
    } else {
      // Prüfe ob alle angegebenen Zeiten gültig sind
      const timesArray = times.split(',').map((t) => t.trim());
      const invalidTimes = timesArray.filter((t) => !VALID_TIMES.includes(t));
      if (invalidTimes.length > 0) {
        errors.push(`Ungültige Einnahmezeiten: ${invalidTimes.join(', ')}`);
      }
    }
    if (!startDate) {
      errors.push('Startdatum ist erforderlich');
    }
    if (color && !VALID_COLORS.includes(color)) {
      errors.push('Ungültige Farbe ausgewählt');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // ── Medikament erstellen ──────────────────────────────────────
    const medication = await prisma.medication.create({
      data: {
        userId: req.user.userId,
        name: name.trim(),
        substance: substance?.trim() || null,
        dosage: dosage.trim(),
        times: times.trim(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        color: color || '#4F46E5',   // Standard: Indigo (Primary)
        leafletUrl: leafletUrl?.trim() || null,
        notes: notes?.trim() || null,
        active: true,
      },
    });

    res.status(201).json(medication);
  } catch (error) {
    console.error('Fehler beim Erstellen des Medikaments:', error);
    res.status(500).json({ error: 'Medikament konnte nicht erstellt werden' });
  }
}

// ─── PUT /api/medications/:id ────────────────────────────────────────
// Aktualisiert ein bestehendes Medikament.
//
// Gleiche Validierung wie bei POST.
// Sicherheit: updateMany mit userId-Check (wie bei Notifications).

export async function updateMedication(req, res) {
  try {
    const { id } = req.params;
    const {
      name, substance, dosage, times, startDate,
      endDate, color, leafletUrl, notes,
    } = req.body;

    // ── Validierung (gleich wie bei POST) ─────────────────────────
    const errors = [];

    if (!name || name.trim().length === 0) {
      errors.push('Medikamentenname ist erforderlich');
    }
    if (!dosage || dosage.trim().length === 0) {
      errors.push('Dosierung ist erforderlich');
    }
    if (!times || times.trim().length === 0) {
      errors.push('Mindestens eine Einnahmezeit ist erforderlich');
    } else {
      const timesArray = times.split(',').map((t) => t.trim());
      const invalidTimes = timesArray.filter((t) => !VALID_TIMES.includes(t));
      if (invalidTimes.length > 0) {
        errors.push(`Ungültige Einnahmezeiten: ${invalidTimes.join(', ')}`);
      }
    }
    if (!startDate) {
      errors.push('Startdatum ist erforderlich');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // ── Update mit userId-Check ───────────────────────────────────
    // updateMany gibt { count: N } zurück.
    // count === 0 → Medikament existiert nicht oder gehört einem anderen User.
    const result = await prisma.medication.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.userId,
      },
      data: {
        name: name.trim(),
        substance: substance?.trim() || null,
        dosage: dosage.trim(),
        times: times.trim(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        color: color || '#4F46E5',
        leafletUrl: leafletUrl?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Medikament nicht gefunden' });
    }

    // Aktualisiertes Medikament zurückgeben
    const updated = await prisma.medication.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(updated);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Medikaments:', error);
    res.status(500).json({ error: 'Medikament konnte nicht aktualisiert werden' });
  }
}

// ─── PATCH /api/medications/:id/deactivate ───────────────────────────
// Setzt ein Medikament auf "abgesetzt" (active = false).
//
// Das ist ein Soft-Delete: Das Medikament verschwindet aus der aktiven
// Liste, bleibt aber in der Datenbank für:
//   - Einnahme-Historie (US-20)
//   - DSGVO-Nachvollziehbarkeit
//   - Mögliches Reaktivieren
//
// endDate wird automatisch auf "jetzt" gesetzt (Absetz-Zeitpunkt).

export async function deactivateMedication(req, res) {
  try {
    const { id } = req.params;

    const result = await prisma.medication.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.userId,
        active: true,   // Nur aktive können abgesetzt werden
      },
      data: {
        active: false,
        endDate: new Date(),  // Absetz-Zeitpunkt merken
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Medikament nicht gefunden oder bereits abgesetzt' });
    }

    res.json({ message: 'Medikament abgesetzt' });
  } catch (error) {
    console.error('Fehler beim Absetzen des Medikaments:', error);
    res.status(500).json({ error: 'Medikament konnte nicht abgesetzt werden' });
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ── US-20: Einnahme bestätigen ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════

// ── Hilfsfunktion: Heute als normalisiertes Datum (00:00:00) ─────────
// Wir normalisieren auf Mitternacht, weil scheduledDate in der DB
// immer 00:00:00 Uhr hat. So stimmt der Vergleich.
function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Sortier-Reihenfolge für Einnahmezeiten ───────────────────────────
// Damit die Tagesansicht immer chronologisch sortiert ist:
// Morgens → Mittags → Abends → Nachts
const TIME_ORDER = { morgens: 0, mittags: 1, abends: 2, nachts: 3 };

// ─── GET /api/medications/today ──────────────────────────────────────
// Gibt alle heutigen Einnahmen des Users zurück.
//
// Ablauf:
//   1. Alle aktiven Medikamente des Users laden
//   2. Für jedes Medikament + jede Einnahmezeit prüfen: Gibt es schon
//      einen MedicationLog-Eintrag für heute?
//   3. Falls ja → Status aus DB (taken/skipped/pending)
//      Falls nein → "pending" (noch kein Eintrag, User hat noch nicht reagiert)
//   4. Fortschritt berechnen (taken / total)
//
// Response:
// {
//   "date": "2026-03-19",
//   "progress": { "taken": 2, "total": 3, "percent": 67 },
//   "entries": [ { medicationId, name, dosage, color, scheduledTime, status, takenAt } ]
// }

export async function getTodayMedications(req, res) {
  try {
    const today = getToday();

    // 1. Alle aktiven Medikamente des Users laden
    const medications = await prisma.medication.findMany({
      where: { userId: req.user.userId, active: true },
      orderBy: { createdAt: 'asc' },
    });

    // 2. Bestehende Logs für heute laden
    const existingLogs = await prisma.medicationLog.findMany({
      where: {
        userId: req.user.userId,
        scheduledDate: today,
      },
    });

    // Logs als Map für schnellen Zugriff: "medId-time" → log
    const logMap = new Map();
    for (const log of existingLogs) {
      logMap.set(`${log.medicationId}-${log.scheduledTime}`, log);
    }

    // 3. Für jedes Medikament + Zeit einen Eintrag erstellen
    const entries = [];

    for (const med of medications) {
      const timesList = med.times.split(',');

      for (const time of timesList) {
        const key = `${med.id}-${time}`;
        const log = logMap.get(key);

        entries.push({
          medicationId: med.id,
          medicationName: med.name,
          substance: med.substance,
          dosage: med.dosage,
          color: med.color,
          scheduledTime: time,
          status: log?.status || 'pending',
          takenAt: log?.takenAt || null,
          logId: log?.id || null,
        });
      }
    }

    // Chronologisch sortieren: morgens → mittags → abends → nachts
    entries.sort((a, b) => {
      const orderA = TIME_ORDER[a.scheduledTime] ?? 99;
      const orderB = TIME_ORDER[b.scheduledTime] ?? 99;
      return orderA - orderB;
    });

    // 4. Fortschritt berechnen
    const total = entries.length;
    const taken = entries.filter((e) => e.status === 'taken').length;
    const percent = total > 0 ? Math.round((taken / total) * 100) : 0;

    res.json({
      date: today.toISOString().split('T')[0],
      progress: { taken, total, percent },
      entries,
    });
  } catch (error) {
    console.error('Fehler beim Laden der heutigen Einnahmen:', error);
    res.status(500).json({ error: 'Heutige Einnahmen konnten nicht geladen werden' });
  }
}

// ─── POST /api/medications/:id/take ──────────────────────────────────
// Bestätigt die Einnahme eines Medikaments für eine bestimmte Tageszeit.
//
// Body: { "scheduledTime": "morgens" }
//
// Ablauf:
//   1. Prüfen: Gehört das Medikament dem User? Ist es aktiv?
//   2. Upsert: Existiert schon ein Log für dieses Medikament+Datum+Zeit?
//      → Ja: Status auf "taken" updaten
//      → Nein: Neuen Log-Eintrag erstellen
//   3. Aktualisiertes Log zurückgeben

export async function takeMedication(req, res) {
  try {
    const { id } = req.params;
    const { scheduledTime } = req.body;

    // Validierung: scheduledTime muss angegeben sein
    if (!scheduledTime || !VALID_TIMES.includes(scheduledTime)) {
      return res.status(400).json({
        error: `Ungültige Einnahmezeit. Erlaubt: ${VALID_TIMES.join(', ')}`,
      });
    }

    // Prüfen: Medikament existiert und gehört dem User
    const medication = await prisma.medication.findFirst({
      where: { id: parseInt(id), userId: req.user.userId, active: true },
    });

    if (!medication) {
      return res.status(404).json({ error: 'Medikament nicht gefunden' });
    }

    // Prüfen: Einnahmezeit passt zum Medikament
    const medTimes = medication.times.split(',');
    if (!medTimes.includes(scheduledTime)) {
      return res.status(400).json({
        error: `${medication.name} wird nicht ${scheduledTime} eingenommen`,
      });
    }

    const today = getToday();

    // Upsert: Erstellen oder aktualisieren
    const log = await prisma.medicationLog.upsert({
      where: {
        medicationId_scheduledDate_scheduledTime: {
          medicationId: parseInt(id),
          scheduledDate: today,
          scheduledTime,
        },
      },
      update: {
        status: 'taken',
        takenAt: new Date(),
      },
      create: {
        userId: req.user.userId,
        medicationId: parseInt(id),
        scheduledDate: today,
        scheduledTime,
        status: 'taken',
        takenAt: new Date(),
      },
    });

    res.json(log);
  } catch (error) {
    console.error('Fehler beim Bestätigen der Einnahme:', error);
    res.status(500).json({ error: 'Einnahme konnte nicht bestätigt werden' });
  }
}

// ─── POST /api/medications/:id/skip ──────────────────────────────────
// Markiert eine Einnahme als übersprungen.
//
// Body: { "scheduledTime": "abends" }
//
// Gleicher Ablauf wie /take, aber mit status: "skipped" und takenAt: null.

export async function skipMedication(req, res) {
  try {
    const { id } = req.params;
    const { scheduledTime } = req.body;

    if (!scheduledTime || !VALID_TIMES.includes(scheduledTime)) {
      return res.status(400).json({
        error: `Ungültige Einnahmezeit. Erlaubt: ${VALID_TIMES.join(', ')}`,
      });
    }

    const medication = await prisma.medication.findFirst({
      where: { id: parseInt(id), userId: req.user.userId, active: true },
    });

    if (!medication) {
      return res.status(404).json({ error: 'Medikament nicht gefunden' });
    }

    const medTimes = medication.times.split(',');
    if (!medTimes.includes(scheduledTime)) {
      return res.status(400).json({
        error: `${medication.name} wird nicht ${scheduledTime} eingenommen`,
      });
    }

    const today = getToday();

    const log = await prisma.medicationLog.upsert({
      where: {
        medicationId_scheduledDate_scheduledTime: {
          medicationId: parseInt(id),
          scheduledDate: today,
          scheduledTime,
        },
      },
      update: {
        status: 'skipped',
        takenAt: null,
      },
      create: {
        userId: req.user.userId,
        medicationId: parseInt(id),
        scheduledDate: today,
        scheduledTime,
        status: 'skipped',
        takenAt: null,
      },
    });

    res.json(log);
  } catch (error) {
    console.error('Fehler beim Überspringen der Einnahme:', error);
    res.status(500).json({ error: 'Einnahme konnte nicht übersprungen werden' });
  }
}

// ─── GET /api/medications/history ────────────────────────────────────
// Gibt die Einnahme-Historie der letzten N Tage zurück.
//
// Query: ?days=30 (Standard: 30)
//
// Gibt pro Tag einen aggregierten Eintrag zurück:
// { date, taken, total, percent }
//
// Das Frontend zeigt daraus eine Wochen-/Monatsübersicht.

export async function getMedicationHistory(req, res) {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90); // Max 90 Tage
    const today = getToday();

    // Startdatum berechnen (X Tage zurück)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    // Alle aktiven Medikamente mit Einnahmezeiten laden
    const medications = await prisma.medication.findMany({
      where: { userId: req.user.userId, active: true },
    });

    // Gesamtzahl der täglichen Einnahmen berechnen
    let dailyTotal = 0;
    for (const med of medications) {
      dailyTotal += med.times.split(',').length;
    }

    // Alle Logs im Zeitraum laden
    const logs = await prisma.medicationLog.findMany({
      where: {
        userId: req.user.userId,
        scheduledDate: { gte: startDate, lte: today },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    // Logs nach Datum gruppieren
    const logsByDate = new Map();
    for (const log of logs) {
      const dateKey = log.scheduledDate.toISOString().split('T')[0];
      if (!logsByDate.has(dateKey)) {
        logsByDate.set(dateKey, []);
      }
      logsByDate.get(dateKey).push(log);
    }

    // Pro Tag: taken-Zähler berechnen
    const history = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateKey = new Date(d).toISOString().split('T')[0];
      const dayLogs = logsByDate.get(dateKey) || [];
      const taken = dayLogs.filter((l) => l.status === 'taken').length;

      history.push({
        date: dateKey,
        taken,
        total: dailyTotal,
        percent: dailyTotal > 0 ? Math.round((taken / dailyTotal) * 100) : 0,
      });
    }

    res.json({ days, history });
  } catch (error) {
    console.error('Fehler beim Laden der Einnahme-Historie:', error);
    res.status(500).json({ error: 'Historie konnte nicht geladen werden' });
  }
}
