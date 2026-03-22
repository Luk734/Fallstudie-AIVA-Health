// src/routes/lab.routes.js — Laborbefund-Endpunkte (US-22)
//
// Router-Pattern (wie bei medication/appointment Routes):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/labs einbinden
//
// ALLE Routen sind durch authenticateToken geschützt.
// Jeder User sieht nur SEINE Laborbefunde.
//
// Nur GET-Endpunkte: Im MVP werden Laborbefunde nicht manuell
// erstellt, sondern über Seed-Daten (Mock) oder später via ePA/FHIR.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getLabReports,
  getLabReportById,
  getLabValueHistory,
} from '../controllers/lab.controller.js';

const router = Router();

// ── GET /api/labs ────────────────────────────────────────────────────
// Alle Laborbefunde des Users (Liste, neueste zuerst).
// Jeder Eintrag enthält: Titel, Labor, Arzt, Datum, Anzahl Parameter.
router.get('/', authenticateToken, getLabReports);

// ── GET /api/labs/history/:parameter ────────────────────────────────
// Letzte 3 Messwerte eines Parameters (für Mini-Verlaufsdiagramm, US-23).
// MUSS VOR /:id stehen, sonst interpretiert Express "history" als ID!
router.get('/history/:parameter', authenticateToken, getLabValueHistory);

// ── GET /api/labs/:id ────────────────────────────────────────────────
// Einzelner Laborbefund mit allen Messwerten (Detail-Ansicht).
// Beinhaltet: Parameter-Name, Wert, Einheit, Referenzbereich.
router.get('/:id', authenticateToken, getLabReportById);

export default router;
