// src/controllers/checkin.controller.js — Befinden-Check-in (US-24)
//
// Dieser Controller verwaltet den täglichen Befinden-Check-in.
// Laura (32) möchte täglich in 10 Sekunden ihr Befinden eintragen.
//
// Endpunkte:
//   POST /api/checkins         → Check-in erstellen (1 pro Tag)
//   GET  /api/checkins/today   → Heutigen Check-in abrufen
//   GET  /api/checkins/streak  → Aktuelle Streak berechnen
//
// Alle Handler sind mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).

import prisma from '../config/prisma.js';

// ─── Hilfsfunktion: Heutiges Datum als UTC-Mitternacht ──────────────
// Wird von mehreren Handlern benötigt.
// Wir speichern das Datum immer als 00:00:00 UTC, damit der
// @@unique([userId, date])-Constraint zuverlässig funktioniert.
// Ohne diese Normalisierung könnten Check-ins am selben Tag,
// aber zu verschiedenen Uhrzeiten, als unterschiedliche Einträge gelten.
function todayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

// ─── POST /api/checkins ─────────────────────────────────────────────
// Erstellt einen neuen Befinden-Check-in für heute.
//
// Request-Body:
//   { moodScore: 1-5, note?: "optionaler Text" }
//
// Geschäftsregel: Pro User ist nur EIN Check-in pro Tag erlaubt.
// Wenn heute schon ein Check-in existiert → 409 Conflict.
// (Das @@unique-Constraint in der DB würde das auch verhindern,
// aber wir prüfen vorher, um eine benutzerfreundliche Meldung zu geben.)
//
// Validierung:
//   - moodScore muss ein Integer von 1 bis 5 sein
//   - note ist optional, max 500 Zeichen

export async function createCheckin(req, res) {
  try {
    const { moodScore, note } = req.body;
    const userId = req.user.userId;

    // ── Validierung: moodScore ─────────────────────────────────
    // Muss ein Integer zwischen 1 und 5 sein.
    // parseInt + isNaN fängt Strings, null, undefined etc. ab.
    const score = parseInt(moodScore, 10);
    if (isNaN(score) || score < 1 || score > 5) {
      return res.status(400).json({
        error: 'moodScore muss ein Integer von 1 bis 5 sein.',
      });
    }

    // ── Validierung: note ──────────────────────────────────────
    // Optional, aber wenn vorhanden: max 500 Zeichen.
    if (note && typeof note === 'string' && note.length > 500) {
      return res.status(400).json({
        error: 'Die Notiz darf maximal 500 Zeichen lang sein.',
      });
    }

    const today = todayUTC();

    // ── Prüfung: Heute schon ein Check-in? ─────────────────────
    const existing = await prisma.checkin.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    if (existing) {
      return res.status(409).json({
        error: 'Du hast heute bereits ein Check-in gemacht.',
        checkin: existing,
      });
    }

    // ── Check-in erstellen ─────────────────────────────────────
    const checkin = await prisma.checkin.create({
      data: {
        userId,
        date: today,
        moodScore: score,
        note: note || null,
      },
    });

    res.status(201).json({ checkin });
  } catch (err) {
    console.error('Fehler beim Erstellen des Check-ins:', err);
    res.status(500).json({ error: 'Check-in konnte nicht gespeichert werden.' });
  }
}

// ─── GET /api/checkins/today ────────────────────────────────────────
// Gibt den heutigen Check-in des Users zurück.
// Wenn heute noch kein Check-in → checkin: null.
//
// Das Frontend nutzt das, um zu entscheiden:
//   - null → Emoji-Auswahl anzeigen
//   - vorhanden → "Erledigt ✅" mit gespeichertem Mood anzeigen
//
// Response: { checkin: { ... } | null }

export async function getTodayCheckin(req, res) {
  try {
    const today = todayUTC();

    const checkin = await prisma.checkin.findUnique({
      where: {
        userId_date: {
          userId: req.user.userId,
          date: today,
        },
      },
    });

    res.json({ checkin: checkin || null });
  } catch (err) {
    console.error('Fehler beim Laden des heutigen Check-ins:', err);
    res.status(500).json({ error: 'Check-in konnte nicht geladen werden.' });
  }
}

// ─── GET /api/checkins/streak ───────────────────────────────────────
// Berechnet die aktuelle Streak: Wie viele aufeinanderfolgende Tage
// hat der User einen Check-in gemacht?
//
// Algorithmus:
//   1. Alle Check-ins des Users laden, nach Datum absteigend sortiert
//   2. Vom neuesten Eintrag rückwärts zählen
//   3. Sobald ein Tag fehlt (Lücke > 1 Tag) → Streak endet
//   4. Startpunkt: Wenn heute kein Check-in → prüfe ob gestern einer war
//      (damit die Streak nicht verloren geht, nur weil man heute noch
//       nicht eingecheckt hat)
//
// Response: { streak: 7 }  (z.B. 7 Tage in Folge)

export async function getStreak(req, res) {
  try {
    // Alle Check-ins des Users, neueste zuerst
    const checkins = await prisma.checkin.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    if (checkins.length === 0) {
      return res.json({ streak: 0 });
    }

    const today = todayUTC();
    let streak = 0;

    // ── Startpunkt bestimmen ───────────────────────────────────
    // Der neueste Check-in muss entweder heute oder gestern sein,
    // sonst ist die Streak schon unterbrochen.
    const latestDate = new Date(checkins[0].date);
    const diffToToday = Math.floor(
      (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Wenn der letzte Check-in mehr als 1 Tag her ist → Streak = 0
    if (diffToToday > 1) {
      return res.json({ streak: 0 });
    }

    // ── Streak rückwärts zählen ────────────────────────────────
    // Wir gehen die sortierten Check-ins durch und prüfen,
    // ob jeder Eintrag genau 1 Tag nach dem vorherigen kommt.
    streak = 1;
    for (let i = 1; i < checkins.length; i++) {
      const current = new Date(checkins[i].date);
      const previous = new Date(checkins[i - 1].date);
      const diffDays = Math.floor(
        (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        streak++;
      } else {
        break; // Lücke gefunden → Streak endet
      }
    }

    res.json({ streak });
  } catch (err) {
    console.error('Fehler beim Berechnen der Streak:', err);
    res.status(500).json({ error: 'Streak konnte nicht berechnet werden.' });
  }
}

// ─── GET /api/checkins?from=&to= ───────────────────────────────────
// Gibt alle Check-ins eines Zeitraums zurück (US-25).
//
// Query-Parameter:
//   from (optional): Startdatum als ISO-String, z.B. "2026-02-20"
//   to   (optional): Enddatum als ISO-String, z.B. "2026-03-22"
//   Ohne Parameter: letzte 30 Tage ab heute.
//
// Zusätzlich werden Durchschnittswerte berechnet:
//   averages.last7:  Ø moodScore der letzten 7 Tage
//   averages.last30: Ø moodScore der letzten 30 Tage
// Diese Werte braucht die MoodTrend-Komponente im Frontend.
//
// Sortierung: aufsteigend nach Datum (älteste zuerst),
// damit die Kalender-Ansicht chronologisch rendern kann.
//
// Response: { checkins: [...], averages: { last7, last30 } }

export async function getCheckins(req, res) {
  try {
    const userId = req.user.userId;
    const today = todayUTC();

    // ── Zeitraum bestimmen ─────────────────────────────────────
    // Falls from/to nicht angegeben: Default = letzte 30 Tage.
    const to = req.query.to
      ? new Date(req.query.to + 'T00:00:00.000Z')
      : today;
    const from = req.query.from
      ? new Date(req.query.from + 'T00:00:00.000Z')
      : new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 29));

    // ── Check-ins des Zeitraums laden ──────────────────────────
    const checkins = await prisma.checkin.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
      orderBy: { date: 'asc' },
    });

    // ── Durchschnitte berechnen ────────────────────────────────
    // Wir holen die letzten 7 und 30 Tage separat,
    // damit die Durchschnitte unabhängig vom gewählten Zeitraum stimmen.
    const last7Start = new Date(Date.UTC(
      today.getFullYear(), today.getMonth(), today.getDate() - 6
    ));
    const last30Start = new Date(Date.UTC(
      today.getFullYear(), today.getMonth(), today.getDate() - 29
    ));

    const [last7Checkins, last30Checkins] = await Promise.all([
      prisma.checkin.findMany({
        where: { userId, date: { gte: last7Start, lte: today } },
        select: { moodScore: true },
      }),
      prisma.checkin.findMany({
        where: { userId, date: { gte: last30Start, lte: today } },
        select: { moodScore: true },
      }),
    ]);

    // Ø berechnen: Summe / Anzahl, auf 1 Nachkommastelle gerundet.
    // Wenn keine Einträge → null (Frontend zeigt dann "Keine Daten").
    const avg = (arr) =>
      arr.length > 0
        ? Math.round((arr.reduce((sum, c) => sum + c.moodScore, 0) / arr.length) * 10) / 10
        : null;

    res.json({
      checkins,
      averages: {
        last7: avg(last7Checkins),
        last30: avg(last30Checkins),
      },
    });
  } catch (err) {
    console.error('Fehler beim Laden der Check-ins:', err);
    res.status(500).json({ error: 'Check-ins konnten nicht geladen werden.' });
  }
}
