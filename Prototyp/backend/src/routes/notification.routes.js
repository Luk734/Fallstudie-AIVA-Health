// src/routes/notification.routes.js — Benachrichtigungs-Endpunkte (US-18)
//
// Router-Pattern (wie bei appointment/prevention Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/notifications einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Jeder User sieht nur SEINE Benachrichtigungen.
//
// WICHTIG zur Reihenfolge:
//   /read-all MUSS vor /:id/read stehen!
//   Sonst interpretiert Express "read-all" als :id Parameter
//   und ruft den falschen Handler auf.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller.js';

const router = Router();

// ── GET /api/notifications ───────────────────────────────────────────
// Alle Benachrichtigungen des Users + unreadCount für Badge.
router.get('/', authenticateToken, getNotifications);

// ── PATCH /api/notifications/read-all ────────────────────────────────
// Alle ungelesenen als gelesen markieren (Komfort-Feature).
// ⚠️ MUSS vor /:id/read stehen (sonst matcht Express "read-all" als :id)
router.patch('/read-all', authenticateToken, markAllAsRead);

// ── PATCH /api/notifications/:id/read ────────────────────────────────
// Eine einzelne Benachrichtigung als gelesen markieren.
// :id = Notification.id
router.patch('/:id/read', authenticateToken, markAsRead);

export default router;
