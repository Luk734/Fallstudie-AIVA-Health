// src/routes/appointment.routes.js — Termin-Endpunkte (US-13)
//
// Router-Pattern (wie bei auth/user/consent Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/appointments einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Der User muss eingeloggt sein, damit seine Termine seiner userId
// zugeordnet werden können.
//
// WICHTIG: Die Reihenfolge der Routen zählt!
// /upcoming MUSS vor /:id definiert werden, sonst interpretiert Express
// "upcoming" als :id-Parameter.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getAppointments,
  getUpcomingAppointments,
} from '../controllers/appointment.controller.js';

const router = Router();

// ── GET /api/appointments/upcoming ──────────────────────────────────────
// Dashboard-Endpunkt: Nächste 3 (oder N) anstehende Termine.
// MUSS vor der allgemeinen Route stehen (sonst matcht /:id zuerst).
router.get('/upcoming', authenticateToken, getUpcomingAppointments);

// ── GET /api/appointments ───────────────────────────────────────────────
// Alle Termine des Users (mit optionalen Filtern: time, status).
router.get('/', authenticateToken, getAppointments);

export default router;
