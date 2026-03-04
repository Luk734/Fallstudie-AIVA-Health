// src/routes/medication.routes.js — Medikamenten-Endpunkte (US-19)
//
// Router-Pattern (wie bei appointment/notification Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/medications einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Jeder User sieht nur SEINE Medikamente.
//
// WICHTIG zur Reihenfolge:
//   /:id/deactivate MUSS vor /:id stehen!
//   Sonst interpretiert Express "deactivate" als Teil von /:id.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deactivateMedication,
} from '../controllers/medication.controller.js';

const router = Router();

// ── GET /api/medications ─────────────────────────────────────────────
// Alle aktiven Medikamente des Users.
// ?active=all → auch abgesetzte anzeigen (für Historie)
router.get('/', authenticateToken, getMedications);

// ── POST /api/medications ────────────────────────────────────────────
// Neues Medikament anlegen (US-19 Kernfeature).
router.post('/', authenticateToken, createMedication);

// ── PATCH /api/medications/:id/deactivate ────────────────────────────
// Medikament absetzen (Soft-Delete, active → false).
// ⚠️ MUSS vor /:id stehen (sonst matcht Express "deactivate" als Teil von :id)
router.patch('/:id/deactivate', authenticateToken, deactivateMedication);

// ── GET /api/medications/:id ─────────────────────────────────────────
// Einzelnes Medikament abrufen (für Bearbeiten-Formular).
router.get('/:id', authenticateToken, getMedicationById);

// ── PUT /api/medications/:id ─────────────────────────────────────────
// Medikament-Daten aktualisieren.
router.put('/:id', authenticateToken, updateMedication);

export default router;
