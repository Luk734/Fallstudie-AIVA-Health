// src/routes/metrics.routes.js — Wearable-Metriken-Endpunkte (US-27)
//
// Router-Pattern (wie bei allen anderen Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/metrics einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Jeder User sieht nur SEINE Metriken.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getMetricsByDate,
  getLatestMetrics,
} from '../controllers/metrics.controller.js';

const router = Router();

// ── GET /api/metrics/latest ──────────────────────────────────────────
// Aktuellste Metriken abrufen (neuester Datensatz des Users).
// ⚠️ MUSS vor / stehen, sonst interpretiert Express "latest" als
// Teil des Query-Strings oder matcht nicht korrekt.
router.get('/latest', authenticateToken, getLatestMetrics);

// ── GET /api/metrics?date=YYYY-MM-DD ─────────────────────────────────
// Metriken für ein bestimmtes Datum (oder heute als Fallback).
router.get('/', authenticateToken, getMetricsByDate);

export default router;
