// server.js — Einstiegspunkt des Backends
// Dieses File startet den gesamten Express-Server.
// Wir importieren zuerst "dotenv", damit alle Umgebungsvariablen (.env)
// gelesen werden, BEVOR der Rest des Codes sie benutzt.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import consentRoutes from './src/routes/consent.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';

// Express-App erstellen – das ist unser Webserver-Objekt
const app = express();

// PORT: Entweder aus .env oder als Fallback 3001
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
// Middleware = Funktionen, die bei JEDER Anfrage ausgeführt werden, bevor
// der eigentliche Route-Handler aufgerufen wird.

// 1. CORS: Erlaubt unserem Frontend (localhost:5173) die API aufzurufen.
//    Ohne CORS würde der Browser die Anfrage blockieren (Security-Feature).
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// 2. JSON: Parsed eingehende Anfragen mit JSON-Body automatisch.
//    Ohne das wäre req.body immer undefined.
app.use(express.json());

// ─── ROUTES ─────────────────────────────────────────────────────────────────
// Health-Check: Einfacher Endpunkt, der prüft ob der Server läuft.
// Wird später auch für Monitoring genutzt.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AIVA Health API',
    timestamp: new Date().toISOString(),
  });
});

// Auth-Routen: Registrierung, Login etc. unter /api/auth/*
app.use('/api/auth', authRoutes);

// User-Routen: Profilverwaltung unter /api/users/* (US-05, US-06)
// Alle Endpunkte in userRoutes sind JWT-geschützt (siehe user.routes.js)
app.use('/api/users', userRoutes);

// Consent-Routen: DSGVO-Einwilligungen unter /api/consents/* (US-07)
// POST = Einwilligungen speichern, GET = Einwilligungen abrufen
app.use('/api/consents', consentRoutes);

// Appointment-Routen: Termin-Verwaltung unter /api/appointments/* (US-13)
// GET = Termine abrufen (alle + upcoming für Dashboard)
app.use('/api/appointments', appointmentRoutes);

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AIVA Backend läuft auf http://localhost:${PORT}`);
  console.log(`   Health-Check: http://localhost:${PORT}/api/health`);
});
