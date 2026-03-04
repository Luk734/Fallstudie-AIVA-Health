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
