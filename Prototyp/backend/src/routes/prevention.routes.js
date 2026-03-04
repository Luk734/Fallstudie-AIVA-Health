// src/routes/prevention.routes.js — Vorsorge-Endpunkte (US-17)
//
// Router-Pattern (wie bei appointment/doctor Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/prevention einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Jeder User sieht nur SEINE Vorsorge-Empfehlungen.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getPreventions,
  updatePreventionStatus,
} from '../controllers/prevention.controller.js';

const router = Router();

// ── GET /api/prevention ──────────────────────────────────────────────
// Alle Vorsorgeuntersuchungen, die zum Alter + Geschlecht des Users passen.
// Jede Vorsorge enthält auch den persönlichen Status (open/completed).
router.get('/', authenticateToken, getPreventions);

// ── PATCH /api/prevention/:id/status ─────────────────────────────────
// Status einer Vorsorge ändern.
//   :id = UserPrevention.id (nicht PreventionSchedule.id!)
//   Body: { "status": "completed" } oder { "status": "open" }
router.patch('/:id/status', authenticateToken, updatePreventionStatus);

export default router;
