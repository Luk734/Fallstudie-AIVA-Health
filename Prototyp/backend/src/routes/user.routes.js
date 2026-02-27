// src/routes/user.routes.js — Profil-Endpunkte (US-05 + US-06)
//
// Router-Pattern (wie bei auth.routes.js):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter einem Prefix einbinden (z.B. /api/users)
//
// BEIDE Routen sind geschützt durch authenticateToken.
// Das heißt: Nur eingeloggte User (mit gültigem JWT) können ihr Profil sehen/ändern.
// Die Middleware extrahiert die userId aus dem Token und packt sie in req.user.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const router = Router();

// ── GET /api/users/profile ──────────────────────────────────────────────
// Liefert die Profildaten des eingeloggten Users.
// Ablauf: Request → authenticateToken (JWT prüfen) → getProfile (DB lesen)
router.get('/profile', authenticateToken, getProfile);

// ── PUT /api/users/profile ──────────────────────────────────────────────
// Erstellt oder aktualisiert das Profil.
// Ablauf: Request → authenticateToken (JWT prüfen) → updateProfile (DB schreiben)
router.put('/profile', authenticateToken, updateProfile);

export default router;
