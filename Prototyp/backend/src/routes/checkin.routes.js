// src/routes/checkin.routes.js — Check-in-Endpunkte (US-24)
//
// Router-Pattern (wie bei allen anderen Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/checkins einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Jeder User sieht nur SEINE Check-ins.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  createCheckin,
  getTodayCheckin,
  getStreak,
  getCheckins,
} from '../controllers/checkin.controller.js';

const router = Router();

// ── GET /api/checkins/today ──────────────────────────────────────────
// Heutigen Check-in abrufen (oder null wenn noch keiner).
// ⚠️ MUSS vor /:id stehen (falls wir später /:id ergänzen),
// sonst interpretiert Express "today" als :id.
router.get('/today', authenticateToken, getTodayCheckin);

// ── GET /api/checkins/streak ─────────────────────────────────────────
// Aktuelle Streak berechnen (aufeinanderfolgende Tage mit Check-in).
router.get('/streak', authenticateToken, getStreak);

// ── GET /api/checkins?from=&to= ──────────────────────────────────────
// Alle Check-ins eines Zeitraums abrufen + Durchschnitte (US-25).
// ⚠️ MUSS nach /today und /streak stehen (sonst matcht Express
// die spezifischen Pfade nicht mehr korrekt).
router.get('/', authenticateToken, getCheckins);

// ── POST /api/checkins ───────────────────────────────────────────────
// Neuen Check-in für heute erstellen (max. 1 pro Tag).
router.post('/', authenticateToken, createCheckin);

export default router;
