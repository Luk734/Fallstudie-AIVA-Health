// src/controllers/appointment.controller.js — Termin-Endpunkte (US-13)
//
// Dieser Controller verwaltet die Arzttermine eines Nutzers.
// Jeder Handler ist mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).
//
// Endpunkte:
//   GET /api/appointments          → Alle Termine (mit Filtern)
//   GET /api/appointments/upcoming → Nächste N Termine (für Dashboard)

import prisma from '../config/prisma.js';

// ─── GET /api/appointments ──────────────────────────────────────────────
// Gibt alle Termine des eingeloggten Users zurück.
//
// Query-Parameter (optional):
//   ?time=upcoming  → nur zukünftige Termine (datetime >= jetzt)
//   ?time=past      → nur vergangene Termine (datetime < jetzt)
//   ?status=scheduled|completed|cancelled → nach Status filtern
//
// Sortierung:
//   upcoming → aufsteigend (nächster Termin zuerst)
//   past     → absteigend (neuester vergangener Termin zuerst)
//   ohne     → aufsteigend nach Datum

export async function getAppointments(req, res) {
  try {
    const { time, status } = req.query;

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

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy,
      // Wir geben nur die Felder zurück, die das Frontend braucht.
      // passwordHash o.Ä. von der User-Relation wird nicht mit-gesendet.
      select: {
        id: true,
        title: true,
        doctor: true,
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

// ─── GET /api/appointments/upcoming ─────────────────────────────────────
// Spezieller Endpunkt für das Dashboard: gibt die nächsten N anstehenden
// Termine zurück (Standard: 3).
//
// Query-Parameter:
//   ?limit=3 (Standard) → Anzahl der zurückgegebenen Termine
//
// Nur Termine mit status="scheduled" und datetime >= jetzt werden berücksichtigt.
// Sortierung: aufsteigend (nächster Termin zuerst).

export async function getUpcomingAppointments(req, res) {
  try {
    // limit aus Query lesen, Standard = 3, max = 10
    const limit = Math.min(parseInt(req.query.limit) || 3, 10);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: req.user.userId,
        datetime: { gte: new Date() },
        status: 'scheduled',
      },
      orderBy: { datetime: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        doctor: true,
        location: true,
        datetime: true,
        notes: true,
        status: true,
      },
    });

    return res.json({ appointments });
  } catch (error) {
    console.error('getUpcomingAppointments error:', error);
    return res.status(500).json({ error: 'Termine konnten nicht geladen werden.' });
  }
}
