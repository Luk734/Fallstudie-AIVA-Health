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
import doctorRoutes from './src/routes/doctor.routes.js';
import preventionRoutes from './src/routes/prevention.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import medicationRoutes from './src/routes/medication.routes.js';
import labRoutes from './src/routes/lab.routes.js';
import checkinRoutes from './src/routes/checkin.routes.js';
import { startReminderCron } from './src/config/cron.js';

// Express-App erstellen – das ist unser Webserver-Objekt
const app = express();

// PORT: Entweder aus .env oder als Fallback 3001
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
// Middleware = Funktionen, die bei JEDER Anfrage ausgeführt werden, bevor
// der eigentliche Route-Handler aufgerufen wird.

// 1. CORS: Erlaubt unserem Frontend (localhost:5173) und der Android-App
//    die API aufzurufen. Ohne CORS würde der Browser/WebView die Anfrage
//    blockieren (Security-Feature).
//    - http://localhost:5173  = Vite Dev-Server (Entwicklung)
//    - https://localhost      = Capacitor Android-App (APK)
//    - capacitor://localhost  = Capacitor iOS-App (falls später benötigt)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://localhost',
    'capacitor://localhost',
  ],
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

// Appointment-Routen: Termin-Verwaltung unter /api/appointments/* (US-13, US-14, US-15)
// GET / = Termine abrufen (mit Filtern: time, status, limit)
// GET /:id = Einzelner Termin (Detail-Ansicht)
// POST / = Neuen Termin erstellen (US-15)
app.use('/api/appointments', appointmentRoutes);

// Doctor-Routen: Arztliste unter /api/doctors/* (US-15)
// GET / = Alle Ärzte abrufen (für Dropdown im Termin-Formular)
app.use('/api/doctors', doctorRoutes);

// Prevention-Routen: Vorsorge-Empfehlungen unter /api/prevention/* (US-17)
// GET / = Passende Vorsorgen für den User (gefiltert nach Alter + Geschlecht)
// PATCH /:id/status = Status ändern (open ↔ completed)
app.use('/api/prevention', preventionRoutes);

// Notification-Routen: Benachrichtigungen unter /api/notifications/* (US-18)
// GET / = Alle Benachrichtigungen abrufen (+ unreadCount)
// PATCH /read-all = Alle als gelesen markieren
// PATCH /:id/read = Eine als gelesen markieren
app.use('/api/notifications', notificationRoutes);

// Medication-Routen: Medikamentenverwaltung unter /api/medications/* (US-19)
// GET / = Alle aktiven Medikamente, POST / = Neues Medikament
// GET /:id = Detail, PUT /:id = Bearbeiten, PATCH /:id/deactivate = Absetzen
app.use('/api/medications', medicationRoutes);

// Lab-Routen: Laborbefunde unter /api/labs/* (US-22)
// GET / = Alle Laborbefunde (neueste zuerst, mit Parameteranzahl)
// GET /:id = Einzelner Befund mit allen Messwerten (Detail)
app.use('/api/labs', labRoutes);

// Checkin-Routen: Täglicher Befinden-Check-in unter /api/checkins/* (US-24)
// POST / = Neuen Check-in erstellen (max. 1 pro Tag)
// GET /today = Heutigen Check-in abrufen
// GET /streak = Aktuelle Streak berechnen
app.use('/api/checkins', checkinRoutes);

// ─── START ───────────────────────────────────────────────────────────────────
// '0.0.0.0' = Server lauscht auf ALLEN Netzwerk-Interfaces,
// nicht nur localhost. Dadurch kann die Android-App über WLAN zugreifen.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AIVA Backend läuft auf http://0.0.0.0:${PORT}`);
  console.log(`   Health-Check: http://localhost:${PORT}/api/health`);

  // ─── CRON-JOB: Termin-Erinnerungen (US-18) ─────────────────────────────
  // Startet den Hintergrund-Timer, der alle 15 Minuten prüft,
  // ob Termine bevorstehen und automatisch Benachrichtigungen erstellt.
  // Wird NACH dem Server-Start aufgerufen, damit die DB-Verbindung steht.
  startReminderCron();
});
