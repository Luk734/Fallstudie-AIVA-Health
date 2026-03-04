// src/routes/doctor.routes.js — Ärzte-Endpunkte (US-15)
//
// Router für die Arztliste ("Mock-Doctolib").
// Wird in server.js unter /api/doctors eingebunden.
//
// Alle Routen sind durch authenticateToken geschützt —
// nur eingeloggte User dürfen die Arztliste abrufen.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getDoctors } from '../controllers/doctor.controller.js';

const router = Router();

// ── GET /api/doctors ────────────────────────────────────────────────────
// Gibt alle Ärzte zurück (alphabetisch sortiert).
// Genutzt vom Termin-Formular als Dropdown-Auswahl.
router.get('/', authenticateToken, getDoctors);

export default router;
