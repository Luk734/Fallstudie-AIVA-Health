// src/routes/auth.routes.js — Routen für Authentifizierung
//
// Eine Route verbindet eine URL + HTTP-Methode mit einem Controller.
// Dieser Router wird in server.js unter "/api/auth" eingehängt,
// d.h. alle Pfade hier sind relativ zu "/api/auth".
//
// Öffentliche Routen (kein Token nötig):
//   POST /api/auth/register
//   POST /api/auth/login
//
// Geschützte Routen (gültiger JWT-Token im Authorization-Header nötig):
//   GET /api/auth/me

import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// ── Öffentliche Routen ───────────────────────────────────────────────────
// Kein Token nötig — jeder darf diese Endpunkte aufrufen

// POST /api/auth/register → register-Funktion im Controller
router.post('/register', register);

// POST /api/auth/login → login-Funktion im Controller
router.post('/login', login);

// ── Geschützte Routen ────────────────────────────────────────────────────
// authenticateToken wird VOR dem Controller ausgeführt.
// Ist der Token ungültig → antwortet die Middleware mit 401, Controller
// wird gar nicht erst aufgerufen.

// GET /api/auth/me → gibt den eingeloggten User zurück
router.get('/me', authenticateToken, getMe);

export default router;
