// src/routes/medication.routes.js — Medikamenten-Endpunkte (US-19 + US-20)
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
//   Spezifische Pfade (/today, /history, /:id/deactivate etc.)
//   MÜSSEN vor /:id stehen! Sonst interpretiert Express
//   "today"/"history"/"deactivate" als Teil von /:id.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deactivateMedication,
  getTodayMedications,
  takeMedication,
  skipMedication,
  getMedicationHistory,
} from '../controllers/medication.controller.js';

const router = Router();

// ── GET /api/medications ─────────────────────────────────────────────
// Alle aktiven Medikamente des Users.
// ?active=all → auch abgesetzte anzeigen (für Historie)
router.get('/', authenticateToken, getMedications);

// ── POST /api/medications ────────────────────────────────────────────
// Neues Medikament anlegen (US-19 Kernfeature).
router.post('/', authenticateToken, createMedication);

// ═══════════════════════════════════════════════════════════════════════
// ── US-20: Einnahme-Tracking ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════

// ── GET /api/medications/today ───────────────────────────────────────
// Heutige Einnahmen + Fortschritt (US-20 Kernfeature).
// ⚠️ MUSS vor /:id stehen (sonst matcht Express "today" als :id)
router.get('/today', authenticateToken, getTodayMedications);

// ── GET /api/medications/history ─────────────────────────────────────
// Einnahme-Historie der letzten N Tage (?days=30).
// ⚠️ MUSS vor /:id stehen
router.get('/history', authenticateToken, getMedicationHistory);

// ── POST /api/medications/:id/take ───────────────────────────────────
// Einnahme bestätigen (status → "taken").
// Body: { "scheduledTime": "morgens" }
router.post('/:id/take', authenticateToken, takeMedication);

// ── POST /api/medications/:id/skip ───────────────────────────────────
// Einnahme überspringen (status → "skipped").
// Body: { "scheduledTime": "abends" }
router.post('/:id/skip', authenticateToken, skipMedication);

// ═══════════════════════════════════════════════════════════════════════
// ── US-19: CRUD ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════

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
