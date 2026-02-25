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
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[register] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}
