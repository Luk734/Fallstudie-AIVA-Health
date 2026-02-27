// src/controllers/auth.controller.js — Registrierung & Login
//
// Ein Controller enthält die eigentliche Logik für einen API-Endpunkt.
// Er liest die eingehende Anfrage (req), verarbeitet sie und schickt
// eine Antwort zurück (res).

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// ─── POST /api/auth/register ──────────────────────────────────────────────
// Ablauf:
//   1. E-Mail + Passwort aus dem Request-Body lesen
//   2. Validieren (Felder vorhanden? E-Mail-Format? Passwort lang genug?)
//   3. Prüfen ob E-Mail bereits vergeben
//   4. Passwort hashen (bcrypt, 12 Runden)
//   5. Nutzer in DB speichern
//   6. JWT-Token erstellen und zurückschicken

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    // ── Schritt 1: Felder vorhanden? ────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        error: 'E-Mail und Passwort sind erforderlich.',
      });
    }

    // ── Schritt 2: Mindestanforderungen ─────────────────────────────────
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    }

    // ── Schritt 3: E-Mail bereits vergeben? ─────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Diese E-Mail-Adresse ist bereits registriert.',
      });
    }

    // ── Schritt 4: Passwort hashen ───────────────────────────────────────
    // bcrypt.hash("meinPasswort", 12) → "$2b$12$xyz..." (nicht umkehrbar!)
    // Die 12 bedeutet: 2^12 = 4096 Runden → brute-force-sicher
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Schritt 5: Nutzer speichern ──────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    // ── Schritt 6: JWT erstellen ─────────────────────────────────────────
    // Der Token enthält: user.id und user.email (KEINE Passwort-Daten!)
    // Er ist mit JWT_SECRET signiert → Server kann ihn später verifizieren
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Antwort: 201 Created
    return res.status(201).json({
      message: 'Registrierung erfolgreich!',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,   // US-05: Profil-Felder mitliefern
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[register] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────
// Ablauf:
//   1. E-Mail + Passwort aus dem Request-Body lesen
//   2. User in DB suchen (nach E-Mail)
//   3. bcrypt.compare(): Passwort gegen gespeicherten Hash prüfen
//   4. JWT-Token erstellen und zurückschicken
//
// SECURITY: Wir sagen bei Fehler immer "E-Mail oder Passwort falsch" —
// nie ob die E-Mail existiert oder nicht. So erfährt ein Angreifer
// nichts über registrierte Nutzer.

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // ── Schritt 1: Felder vorhanden? ────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        error: 'E-Mail und Passwort sind erforderlich.',
      });
    }

    // ── Schritt 2: User in DB suchen ────────────────────────────────────
    // findUnique sucht genau einen Eintrag anhand des einzigartigen Feldes "email"
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // User nicht gefunden? Gleiche Fehlermeldung wie bei falschem Passwort!
    if (!user) {
      return res.status(401).json({
        error: 'E-Mail oder Passwort falsch.',
      });
    }

    // ── Schritt 3: Passwort prüfen ───────────────────────────────────────
    // bcrypt.compare() hasht das eingegebene Passwort mit dem Salt aus
    // user.passwordHash und vergleicht das Ergebnis.
    // Gibt true zurück wenn gleich, false wenn nicht.
    const passwortStimmt = await bcrypt.compare(password, user.passwordHash);

    if (!passwortStimmt) {
      return res.status(401).json({
        error: 'E-Mail oder Passwort falsch.',
      });
    }

    // ── Schritt 4: JWT erstellen ─────────────────────────────────────────
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      message: 'Login erfolgreich!',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,   // US-05: Profil-Felder mitliefern
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[login] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
// Gibt die Daten des aktuell eingeloggten Users zurück.
//
// Diese Route ist GESCHÜTZT — sie wird nur erreicht, wenn die
// authenticateToken-Middleware den Token erfolgreich geprüft hat.
//
// Die Middleware hat req.user befüllt, z.B.:
//   req.user = { userId: 3, email: "julian@example.com", iat: ..., exp: ... }
//
// Ablauf:
//   1. req.user.userId lesen (von der Middleware gesetzt)
//   2. User aus der DB laden (aktuellste Daten, nicht aus dem Token!)
//   3. User-Daten zurückgeben (OHNE passwordHash)

export async function getMe(req, res) {
  try {
    // ── Schritt 1: userId aus req.user lesen ────────────────────────────
    // req.user wurde von authenticateToken gesetzt (nicht vom Client!)
    // Der Client kann diesen Wert nicht fälschen — er steckt im signierten Token.
    const { userId } = req.user;

    // ── Schritt 2: User aus DB laden ────────────────────────────────────
    // Wir laden frisch aus der DB, statt den Token-Inhalt zu vertrauen.
    // Warum? Der User könnte z.B. die E-Mail geändert haben seit dem Login.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,    // US-05: Profil-Felder auch bei /me zurückgeben
        lastName: true,     // damit AuthContext nach Page-Reload alles hat
        birthDate: true,
        gender: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        // passwordHash: false → wird NICHT mitgeschickt (Sicherheit!)
      },
    });

    if (!user) {
      // Sollte nicht vorkommen (Token war gültig, User wurde gelöscht)
      return res.status(404).json({ error: 'User nicht gefunden.' });
    }

    // ── Schritt 3: Antwort ───────────────────────────────────────────────
    return res.status(200).json({ user });
  } catch (error) {
    console.error('[getMe] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}
