// src/controllers/doctor.controller.js — Ärzte-Endpunkte (US-15)
//
// Dieser Controller liefert die Arztliste für die Termin-Erstellung.
// Im MVP sind die Ärzte per Seed vorbefüllt ("Mock-Doctolib").
//
// Endpunkte:
//   GET /api/doctors → Alle Ärzte (alphabetisch nach Name sortiert)

import prisma from '../config/prisma.js';

// ─── GET /api/doctors ───────────────────────────────────────────────────
// Gibt alle Ärzte zurück, alphabetisch nach Name sortiert.
// Das Frontend nutzt diese Liste als Dropdown im Termin-Formular.
//
// Wenn der User einen Arzt wählt, werden Telefon + Ort automatisch
// ins Formular eingetragen (aber manuell editierbar).

export async function getDoctors(req, res) {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        specialty: true,
        phone: true,
        location: true,
      },
    });

    return res.json({ doctors });
  } catch (error) {
    console.error('getDoctors error:', error);
    return res.status(500).json({ error: 'Ärzte konnten nicht geladen werden.' });
  }
}
