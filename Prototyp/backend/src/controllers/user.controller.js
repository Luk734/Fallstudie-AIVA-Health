// src/controllers/user.controller.js — Profil lesen & aktualisieren (US-05)
//
// Dieser Controller kümmert sich um das Nutzerprofil.
// Zwei Funktionen:
//   getProfile()    → liest das Profil des eingeloggten Users
//   updateProfile() → erstellt/aktualisiert das Profil
//
// WICHTIG: Beide Funktionen sind geschützt durch authenticateToken.
// Das heißt: req.user ist IMMER vorhanden und enthält { userId, email }.
// Die Middleware hat das bereits geprüft, bevor wir hier ankommen.

import prisma from '../config/prisma.js';

// ── Erlaubte Werte für das Geschlecht ─────────────────────────────────────
// Wir definieren sie als Konstante, damit:
//   1. Wir sie im Controller zur Validierung nutzen können
//   2. Sie an einer Stelle gepflegt werden (Single Source of Truth)
const ALLOWED_GENDERS = ['male', 'female', 'diverse', 'unspecified'];

// ─── GET /api/users/profile ───────────────────────────────────────────────
// Liest das Profil des aktuell eingeloggten Users aus der DB.
//
// Ablauf:
//   1. userId aus dem JWT-Token holen (req.user wurde von Middleware gesetzt)
//   2. User in DB suchen (findUnique = suche genau EINEN Eintrag)
//   3. Nur bestimmte Felder zurückgeben (select) — KEIN passwordHash!
//
// Warum "select"?
//   Ohne select würde Prisma ALLE Felder zurückgeben, inklusive passwordHash.
//   Das wäre ein Sicherheitsrisiko. Mit select: wir wählen explizit nur die
//   Felder, die der Client sehen darf.

export async function getProfile(req, res) {
  try {
    // req.user.userId kommt aus dem JWT-Token (von auth.middleware.js)
    const userId = req.user.userId;

    // ── DB-Abfrage ──────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,   // Prisma nutzt camelCase (DB-Spalte: first_name)
        lastName: true,
        birthDate: true,
        gender: true,
        avatarUrl: true,
        createdAt: true,
      },
      // ❌ passwordHash ist NICHT in select → wird nicht zurückgegeben
    });

    // User nicht gefunden? (Sollte nicht passieren, aber Sicherheit geht vor)
    if (!user) {
      return res.status(404).json({ error: 'Nutzer nicht gefunden.' });
    }

    // ── Antwort senden ──────────────────────────────────────────────────
    return res.json({ user });

  } catch (error) {
    console.error('[getProfile] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}

// ─── PUT /api/users/profile ───────────────────────────────────────────────
// Erstellt ODER aktualisiert das Profil des eingeloggten Users.
//
// Warum PUT und nicht POST?
//   POST = "erstelle eine NEUE Ressource" (z.B. neuen User)
//   PUT  = "ersetze/aktualisiere eine BESTEHENDE Ressource"
//   Der User existiert schon (durch Register), wir aktualisieren nur Felder.
//   PUT ist außerdem idempotent: 5x aufrufen = selbes Ergebnis wie 1x.
//
// Ablauf:
//   1. Daten aus req.body lesen (was der Client geschickt hat)
//   2. Validierung: Vorname ist Pflicht, Geschlecht muss gültig sein
//   3. Optional: Geburtsdatum in Date-Objekt umwandeln
//   4. User in DB aktualisieren (prisma.user.update)
//   5. Aktualisierte Daten zurückgeben

export async function updateProfile(req, res) {
  try {
    const userId = req.user.userId;

    // ── Schritt 1: Daten aus Request lesen ───────────────────────────────
    // Destructuring: Wir "entpacken" die Felder aus req.body.
    // Wenn ein Feld nicht gesendet wurde, ist es undefined.
    const { firstName, lastName, birthDate, gender, avatarUrl } = req.body;

    // ── Schritt 2: Validierung ───────────────────────────────────────────

    // 2a: Vorname ist Pflicht (laut Akzeptanzkriterien US-05)
    //     trim() entfernt Leerzeichen vorne/hinten: "  " → ""
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        error: 'Vorname ist ein Pflichtfeld.',
      });
    }

    // 2b: Wenn ein Geschlecht angegeben wird, muss es ein erlaubter Wert sein
    if (gender && !ALLOWED_GENDERS.includes(gender)) {
      return res.status(400).json({
        error: `Ungültiges Geschlecht. Erlaubt: ${ALLOWED_GENDERS.join(', ')}`,
      });
    }

    // ── Schritt 3: Geburtsdatum verarbeiten ──────────────────────────────
    // Das Frontend schickt das Datum als String (z.B. "1990-05-15").
    // Prisma erwartet ein JavaScript Date-Objekt oder ISO-String.
    // new Date("1990-05-15") erstellt das Date-Objekt.
    // Wenn kein Datum geschickt wird → null (Feld bleibt leer)
    let parsedBirthDate = null;
    if (birthDate) {
      parsedBirthDate = new Date(birthDate);
      // Prüfen ob das Datum gültig ist (z.B. "abc" → Invalid Date)
      if (isNaN(parsedBirthDate.getTime())) {
        return res.status(400).json({
          error: 'Ungültiges Geburtsdatum. Format: YYYY-MM-DD',
        });
      }
    }

    // ── Schritt 4: User in DB aktualisieren ──────────────────────────────
    // prisma.user.update:
    //   where: { id: userId } → welchen User aktualisieren?
    //   data: { ... }          → welche Felder auf welchen Wert setzen?
    //   select: { ... }        → welche Felder in der Antwort zurückgeben?
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName.trim(),         // Leerzeichen entfernen
        lastName: lastName?.trim() || null,   // Optional: wenn leer → null
        birthDate: parsedBirthDate,           // Date-Objekt oder null
        gender: gender || null,               // String oder null
        avatarUrl: avatarUrl || null,         // Avatar-URL oder null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        gender: true,
        avatarUrl: true,
        createdAt: true,
        // ❌ passwordHash wird NIE zurückgegeben
      },
    });

    // ── Schritt 5: Erfolgsantwort ────────────────────────────────────────
    return res.json({
      message: 'Profil erfolgreich aktualisiert.',
      user: updatedUser,
    });

  } catch (error) {
    console.error('[updateProfile] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}
