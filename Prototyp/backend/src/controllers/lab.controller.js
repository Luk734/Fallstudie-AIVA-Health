// src/controllers/lab.controller.js — Laborbefund-Endpunkte (US-22)
//
// Dieser Controller liefert Laborbefunde für den eingeloggten User.
// Alle Handler sind mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).
//
// Endpunkte:
//   GET /api/labs      → Alle Laborbefunde (Liste, neueste zuerst)
//   GET /api/labs/:id  → Einzelner Befund mit allen Laborwerten
//
// Im MVP werden die Daten per Seed befüllt (Mock-Daten).
// Es gibt keine POST/PUT/DELETE-Endpunkte, weil Laborbefunde
// in der Realität vom Labor/Arzt kommen und nicht vom User erstellt werden.

import prisma from '../config/prisma.js';

// ─── GET /api/labs ───────────────────────────────────────────────────
// Gibt alle Laborbefunde des eingeloggten Users zurück.
//
// Sortierung: Neueste zuerst (reportDate absteigend).
// Für jeden Befund wird die Anzahl der Werte mitgeliefert (_count),
// damit die Liste anzeigen kann: "Großes Blutbild · 8 Parameter".
//
// Response: { reports: [...] }

export async function getLabReports(req, res) {
  try {
    const reports = await prisma.labReport.findMany({
      where: { userId: req.user.userId },
      orderBy: { reportDate: 'desc' },
      include: {
        // _count zählt die zugehörigen lab_values pro Befund
        // → wird im Frontend als "X Parameter" angezeigt
        _count: { select: { values: true } },
      },
    });

    res.json({ reports });
  } catch (err) {
    console.error('Fehler beim Laden der Laborbefunde:', err);
    res.status(500).json({ error: 'Laborbefunde konnten nicht geladen werden.' });
  }
}

// ─── GET /api/labs/:id ───────────────────────────────────────────────
// Gibt einen einzelnen Laborbefund mit allen Laborwerten zurück.
//
// Die values werden mit include geladen (Prisma Eager Loading).
// Sortierung der Werte: nach Parameter-Name alphabetisch,
// damit die Darstellung konsistent ist.
//
// Sicherheits-Check: Der Befund muss dem eingeloggten User gehören.
// → findFirst mit userId-Filter statt findUnique (verhindert IDOR).
//
// Response: { report: { ...befund, values: [...] } }

export async function getLabReportById(req, res) {
  try {
    const reportId = parseInt(req.params.id, 10);

    if (isNaN(reportId)) {
      return res.status(400).json({ error: 'Ungültige Befund-ID.' });
    }

    // findFirst mit userId-Check: User kann nur SEINE Befunde sehen
    const report = await prisma.labReport.findFirst({
      where: {
        id: reportId,
        userId: req.user.userId,
      },
      include: {
        values: {
          orderBy: { parameter: 'asc' },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Laborbefund nicht gefunden.' });
    }

    res.json({ report });
  } catch (err) {
    console.error('Fehler beim Laden des Laborbefunds:', err);
    res.status(500).json({ error: 'Laborbefund konnte nicht geladen werden.' });
  }
}
