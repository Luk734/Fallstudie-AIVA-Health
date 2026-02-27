// src/middleware/auth.middleware.js — JWT-Schutz für geschützte Routen
//
// Eine Middleware ist eine Funktion, die Express bei jeder Anfrage
// VOR dem eigentlichen Controller ausführt. Sie hat drei Parameter:
//   req  → die eingehende Anfrage (Request)
//   res  → die ausgehende Antwort (Response)
//   next → Funktion, die den nächsten Schritt aufruft
//
// Ablauf:
//   1. Authorization-Header lesen (Format: "Bearer <token>")
//   2. Token extrahieren
//   3. Token mit JWT_SECRET verifizieren
//   4a. Gültig  → User-ID in req.user speichern, next() aufrufen
//   4b. Ungültig → 401 Unauthorized zurückgeben

import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  // ── Schritt 1: Header lesen ──────────────────────────────────────────
  // HTTP-Standard: Tokens werden im "Authorization"-Header gesendet.
  // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5..."
  // Das "Bearer "-Präfix zeigt an, dass es sich um ein Bearer-Token handelt.
  const authHeader = req.headers['authorization'];

  // ── Schritt 2: Token extrahieren ─────────────────────────────────────
  // authHeader.split(' ') → ["Bearer", "eyJhbGci..."]
  // [1] → nimmt den zweiten Teil (den eigentlichen Token)
  const token = authHeader && authHeader.split(' ')[1];

  // Kein Token vorhanden → 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      error: 'Zugriff verweigert. Kein Token übermittelt.',
    });
  }

  // ── Schritt 3: Token verifizieren ────────────────────────────────────
  // jwt.verify() prüft:
  //   a) Ist die Signatur gültig? (wurde nicht manipuliert?)
  //   b) Ist der Token noch nicht abgelaufen? (expiresIn: 7d)
  // Wenn beides OK → gibt die gespeicherten Daten zurück (userId, email)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token abgelaufen oder manipuliert
      return res.status(401).json({
        error: 'Token ungültig oder abgelaufen. Bitte erneut einloggen.',
      });
    }

    // ── Schritt 4a: User-Daten an Request anhängen ───────────────────
    // req.user ist jetzt für alle nachfolgenden Controller sichtbar.
    // decoded enthält: { userId, email, iat (erstellt), exp (läuft ab) }
    req.user = decoded;

    // next() → übergibt die Kontrolle an den nächsten Handler (Controller)
    next();
  });
}
