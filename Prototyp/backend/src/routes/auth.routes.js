// src/routes/auth.routes.js — Routen für Authentifizierung
//
// Eine Route verbindet eine URL + HTTP-Methode mit einem Controller.
// Dieser Router wird in server.js unter "/api/auth" eingehängt,
// d.h. alle Pfade hier sind relativ zu "/api/auth".

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/register → register-Funktion im Controller
router.post('/register', register);

// POST /api/auth/login → login-Funktion im Controller
router.post('/login', login);

export default router;
