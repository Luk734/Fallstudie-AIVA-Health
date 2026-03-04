// src/controllers/appointment.controller.js — Termin-Endpunkte (US-13, US-14)
//
// Dieser Controller verwaltet die Arzttermine eines Nutzers.
// Jeder Handler ist mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).
//
// Endpunkte:
//   GET  /api/appointments          → Alle Termine (mit Filtern + optionalem Limit)
//   GET  /api/appointments/:id      → Einzelner Termin (Detail-Ansicht)
//   POST /api/appointments          → Neuen Termin erstellen (US-15)

import prisma from '../config/prisma.js';

// ─── GET /api/appointments ──────────────────────────────────────────────
// Gibt alle Termine des eingeloggten Users zurück.
//
// Query-Parameter (optional):
//   ?time=upcoming  → nur zukünftige Termine (datetime >= jetzt)
//   ?time=past      → nur vergangene Termine (datetime < jetzt)
//   ?status=scheduled|completed|cancelled → nach Status filtern
//   ?limit=N        → Maximal N Ergebnisse zurückgeben (max 50)
//                     Nützlich z.B. für das Dashboard: ?time=upcoming&limit=3
//
// Sortierung:
//   upcoming → aufsteigend (nächster Termin zuerst)
//   past     → absteigend (neuester vergangener Termin zuerst)
//   ohne     → aufsteigend nach Datum

export async function getAppointments(req, res) {
  try {
    const { time, status, limit } = req.query;

    // ── Filter aufbauen ─────────────────────────────────────────────
    // where-Objekt wird dynamisch zusammengebaut.
    // Prisma ignoriert Felder die nicht gesetzt sind.
    const where = { userId: req.user.userId };

    // Zeitfilter: upcoming = ab jetzt, past = vor jetzt
    if (time === 'upcoming') {
      where.datetime = { gte: new Date() };
      // Upcoming zeigt nur geplante Termine (nicht abgesagte)
      where.status = 'scheduled';
    } else if (time === 'past') {
      where.datetime = { lt: new Date() };
    }

    // Status-Filter (überschreibt ggf. den Zeitfilter-Status)
    if (status) {
      where.status = status;
    }

    // ── Sortierung bestimmen ────────────────────────────────────────
    // Upcoming: nächster Termin zuerst (aufsteigend)
    // Past: neuester vergangener zuerst (absteigend)
    const orderBy = time === 'past'
      ? { datetime: 'desc' }
      : { datetime: 'asc' };

    // ── Optionales Limit ────────────────────────────────────────────
    // Wenn ?limit=N gesetzt ist, werden nur N Ergebnisse zurückgegeben.
    // Das nutzt z.B. das Dashboard: ?time=upcoming&limit=3
    // Ohne limit: alle Treffer (z.B. für die vollständige Termin-Liste).
    const take = limit ? Math.min(parseInt(limit) || 50, 50) : undefined;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy,
      ...(take && { take }),
      // Wir geben nur die Felder zurück, die das Frontend braucht.
      // passwordHash o.Ä. von der User-Relation wird nicht mit-gesendet.
      select: {
        id: true,
        title: true,
        doctor: true,
        phone: true,
        location: true,
        datetime: true,
        notes: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json({ appointments });
  } catch (error) {
    console.error('getAppointments error:', error);
    return res.status(500).json({ error: 'Termine konnten nicht geladen werden.' });
  }
}

// ─── GET /api/appointments/:id ──────────────────────────────────────────
// Gibt einen einzelnen Termin zurück (Detail-Ansicht, US-14).
//
// Sicherheit: Es wird IMMER nach id UND userId gefiltert.
// So kann ein User nur seine eigenen Termine abrufen —
// selbst wenn er die ID eines fremden Termins kennt.
//
// 404 wenn der Termin nicht gefunden wurde (oder nicht dem User gehört).

export async function getAppointmentById(req, res) {
  try {
    const id = parseInt(req.params.id);

    // ── ID validieren ─────────────────────────────────────────────────
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Ungültige Termin-ID.' });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: req.user.userId,  // Sicherheit: nur eigene Termine
      },
      select: {
        id: true,
        title: true,
        doctor: true,
        phone: true,
        location: true,
        datetime: true,
        notes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ── Nicht gefunden → 404 ──────────────────────────────────────────
    if (!appointment) {
      return res.status(404).json({ error: 'Termin nicht gefunden.' });
    }

    return res.json({ appointment });
  } catch (error) {
    console.error('getAppointmentById error:', error);
    return res.status(500).json({ error: 'Termin konnte nicht geladen werden.' });
  }
}

// ─── POST /api/appointments ───────────────────────────────────────────
// Erstellt einen neuen Termin für den eingeloggten User (US-15).
//
// Request-Body:
//   { title, doctor, phone?, location, datetime, notes? }
//
// Validierung:
//   - Pflichtfelder: title (2–100 Zeichen), doctor, location, datetime
//   - Datum darf nicht in der Vergangenheit liegen
//   - status wird automatisch auf "scheduled" gesetzt
//
// Response: 201 Created + das erstellte Termin-Objekt

export async function createAppointment(req, res) {
  try {
    const { title, doctor, phone, location, datetime, notes } = req.body;

    // ── Pflichtfelder prüfen ────────────────────────────────────────────
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      errors.push('Titel muss mindestens 2 Zeichen lang sein.');
    }
    if (title && title.trim().length > 100) {
      errors.push('Titel darf maximal 100 Zeichen lang sein.');
    }
    if (!doctor || typeof doctor !== 'string' || !doctor.trim()) {
      errors.push('Arzt/Praxis ist ein Pflichtfeld.');
    }
    if (!location || typeof location !== 'string' || !location.trim()) {
      errors.push('Ort ist ein Pflichtfeld.');
    }
    if (!datetime) {
      errors.push('Datum & Uhrzeit ist ein Pflichtfeld.');
    }

    // ── Datum validieren ────────────────────────────────────────────────
    if (datetime) {
      const parsedDate = new Date(datetime);
      if (isNaN(parsedDate.getTime())) {
        errors.push('Ungültiges Datumsformat.');
      } else if (parsedDate < new Date()) {
        errors.push('Der Termin darf nicht in der Vergangenheit liegen.');
      }
    }

    // ── Bei Fehlern: 400 Bad Request ───────────────────────────────────
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // ── Termin erstellen ────────────────────────────────────────────────
    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.userId,
        title: title.trim(),
        doctor: doctor.trim(),
        phone: phone?.trim() || null,
        location: location.trim(),
        datetime: new Date(datetime),
        notes: notes?.trim() || null,
        status: 'scheduled',
      },
      select: {
        id: true,
        title: true,
        doctor: true,
        phone: true,
        location: true,
        datetime: true,
        notes: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ appointment });
  } catch (error) {
    console.error('createAppointment error:', error);
    return res.status(500).json({ error: 'Termin konnte nicht erstellt werden.' });
  }
}
