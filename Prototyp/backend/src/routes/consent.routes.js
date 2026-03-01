// src/routes/consent.routes.js — DSGVO-Einwilligungs-Endpunkte (US-07)
//
// Router-Pattern (wie bei auth.routes.js und user.routes.js):
//   1. Express-Router erstellen
//   2. Endpunkte definieren (HTTP-Methode + Pfad + Handler)
//   3. Router exportieren
//   4. In server.js unter /api/consents einbinden
//
// BEIDE Routen sind durch authenticateToken geschützt.
// Der User muss eingeloggt sein, damit wir seine Einwilligungen
// seiner userId zuordnen können.

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { createConsents, getConsents, updateConsent } from '../controllers/consent.controller.js';

const router = Router();

// ── POST /api/consents ──────────────────────────────────────────────────
// Speichert die Einwilligungen des Users.
// Wird beim Onboarding aufgerufen (ConsentPage → "Weiter" klicken).
// Ablauf: Request → authenticateToken → createConsents
router.post('/', authenticateToken, createConsents);

// ── GET /api/consents ───────────────────────────────────────────────────
// Gibt alle Einwilligungen des Users zurück.
// Wird verwendet um zu prüfen ob der User das Onboarding schon gemacht hat.
// Ablauf: Request → authenticateToken → getConsents
router.get('/', authenticateToken, getConsents);

// ── PATCH /api/consents/:id ─────────────────────────────────────────────
// Aktualisiert eine einzelne Einwilligung (US-08: Widerruf/Erteilung).
// :id ist die ID des Consent-Eintrags in der Datenbank.
// Ablauf: Request → authenticateToken → updateConsent
router.patch('/:id', authenticateToken, updateConsent);

export default router;
