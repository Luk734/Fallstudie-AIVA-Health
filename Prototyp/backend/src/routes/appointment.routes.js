// src/routes/appointment.routes.js — Termin-Endpunkte (US-13 bis US-16)
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

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from '../controllers/appointment.controller.js';

const router = Router();

// ── POST /api/appointments ───────────────────────────────────────────
// Neuen Termin erstellen (US-15).
router.post('/', authenticateToken, createAppointment);

// ── PUT /api/appointments/:id ───────────────────────────────────────────
// Bestehenden Termin bearbeiten (US-16).
router.put('/:id', authenticateToken, updateAppointment);

// ── DELETE /api/appointments/:id ────────────────────────────────────────
// Termin stornieren — Soft Delete, Status → "cancelled" (US-16).
router.delete('/:id', authenticateToken, cancelAppointment);

// ── GET /api/appointments/:id ───────────────────────────────────────────
// Detail-Ansicht eines einzelnen Termins (US-14).
router.get('/:id', authenticateToken, getAppointmentById);

// ── GET /api/appointments ───────────────────────────────────────────────
// Alle Termine des Users (mit optionalen Filtern: time, status, limit).
// Dashboard nutzt: ?time=upcoming&limit=3
// Care-Liste nutzt: ?time=upcoming oder ?time=past
router.get('/', authenticateToken, getAppointments);

export default router;
