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

// ─── GET /api/labs/history/:parameter ────────────────────────────────
// Gibt die letzten 3 Messwerte eines bestimmten Parameters zurück.
//
// Beispiel: GET /api/labs/history/Hämoglobin
// → Liefert die letzten 3 Hämoglobin-Werte aus verschiedenen Befunden.
//
// Warum brauchen wir das? (US-23, Akzeptanzkriterium 3)
//   Thomas möchte den Trend sehen: "Wird mein Hämoglobin besser oder schlechter?"
//   Dafür zeigen wir die letzten 3 Messungen als Mini-Balkendiagramm.
//
// SQL-Logik:
//   1. Alle LabValues mit passendem Parameter-Namen finden
//   2. NUR aus Befunden des eingeloggten Users (Sicherheit!)
//   3. Sortiert nach Befunddatum (neueste zuerst)
//   4. Limitiert auf 3 Einträge
//
// Response: { parameter: "Hämoglobin", history: [{ value, date, reportTitle }, ...] }

export async function getLabValueHistory(req, res) {
  try {
    const parameterName = decodeURIComponent(req.params.parameter);

    // LabValues finden, die zum eingeloggten User gehören
    // → Über die Relation: LabValue → LabReport → userId
    const values = await prisma.labValue.findMany({
      where: {
        parameter: parameterName,
        report: {
          userId: req.user.userId,
        },
      },
      include: {
        report: {
          select: {
            reportDate: true,
            title: true,
          },
        },
      },
      orderBy: {
        report: {
          reportDate: 'desc',
        },
      },
      take: 3,
    });

    // Rückgabe: Vereinfachtes Format für das Frontend
    const history = values.map((v) => ({
      value: v.value,
      unit: v.unit,
      referenceMin: v.referenceMin,
      referenceMax: v.referenceMax,
      date: v.report.reportDate,
      reportTitle: v.report.title,
    }));

    res.json({ parameter: parameterName, history });
  } catch (err) {
    console.error('Fehler beim Laden der Laborwert-Historie:', err);
    res.status(500).json({ error: 'Historie konnte nicht geladen werden.' });
  }
}
