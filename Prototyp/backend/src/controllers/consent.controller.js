// src/controllers/consent.controller.js — DSGVO-Einwilligungen (US-07)
//
// Dieser Controller verwaltet die Datenschutz-Einwilligungen (Consents).
// Jeder User muss beim Onboarding seine Einwilligungen erteilen,
// bevor er die App nutzen kann.
//
// Zwei Funktionen:
//   createConsents() → speichert die Einwilligungen (POST /api/consents)
//   getConsents()    → liest die Einwilligungen (GET /api/consents)
//
// DSGVO-Anforderungen umgesetzt:
//   - Jede Einwilligung ist separat (kein "alles oder nichts")
//   - Zeitstempel für Nachweispflicht
//   - Pflicht-Consents werden validiert (terms + health_data müssen true sein)

import prisma from '../config/prisma.js';

// ── Erlaubte Consent-Typen ────────────────────────────────────────────────
// Diese Konstante definiert alle gültigen Consent-Typen.
// Alles außerhalb dieser Liste wird vom Server abgelehnt.
const VALID_CONSENT_TYPES = ['terms', 'health_data', 'analytics'];

// ── Pflicht-Consents ──────────────────────────────────────────────────────
// Diese Consents MÜSSEN erteilt werden (granted = true).
// Ohne sie darf der User die App nicht nutzen (DSGVO Art. 6 + Art. 9).
// "terms" = Nutzungsbedingungen & Datenschutzerklärung akzeptiert
// "health_data" = Einwilligung zur Verarbeitung von Gesundheitsdaten
const REQUIRED_CONSENTS = ['terms', 'health_data'];

// ─── POST /api/consents ───────────────────────────────────────────────────
// Speichert die Einwilligungen des Users in der Datenbank.
//
// Erwarteter Request-Body:
// {
//   "consents": [
//     { "consentType": "terms",       "granted": true },
//     { "consentType": "health_data", "granted": true },
//     { "consentType": "analytics",   "granted": false }
//   ]
// }
//
// Ablauf:
//   1. Daten aus req.body lesen
//   2. Validierung: Array vorhanden? Alle Typen gültig?
//   3. Pflicht-Prüfung: terms + health_data müssen true sein
//   4. Upsert in DB: Erstellen oder aktualisieren (wenn schon vorhanden)
//   5. Alle gespeicherten Consents zurückgeben
//
// Was ist ein "upsert"?
//   "upsert" = "update" + "insert" kombiniert.
//   - Wenn ein Consent für diesen User + Typ schon existiert → update
//   - Wenn noch keiner existiert → insert (neu erstellen)
//   Das verhindert Duplikate und macht den Endpunkt idempotent.

export async function createConsents(req, res) {
  try {
    const userId = req.user.userId;
    const { consents } = req.body;

    // ── Schritt 1: Grundvalidierung ──────────────────────────────────────
    // Ist "consents" ein Array und nicht leer?
    if (!Array.isArray(consents) || consents.length === 0) {
      return res.status(400).json({
        error: 'Einwilligungen müssen als Array übermittelt werden.',
      });
    }

    // ── Schritt 2: Alle Consent-Typen prüfen ────────────────────────────
    // Jeder Eintrag muss einen gültigen consentType haben.
    for (const consent of consents) {
      if (!VALID_CONSENT_TYPES.includes(consent.consentType)) {
        return res.status(400).json({
          error: `Ungültiger Consent-Typ: "${consent.consentType}". Erlaubt: ${VALID_CONSENT_TYPES.join(', ')}`,
        });
      }
    }

    // ── Schritt 3: Pflicht-Consents prüfen ───────────────────────────────
    // Für jeden Pflicht-Typ prüfen wir:
    //   a) Ist er überhaupt im Array enthalten?
    //   b) Ist granted = true?
    for (const requiredType of REQUIRED_CONSENTS) {
      const found = consents.find((c) => c.consentType === requiredType);

      if (!found || found.granted !== true) {
        // Menschenlesbare Fehlermeldung generieren
        const label = requiredType === 'terms'
          ? 'Nutzungsbedingungen & Datenschutzerklärung'
          : 'Verarbeitung von Gesundheitsdaten';

        return res.status(400).json({
          error: `Die Einwilligung "${label}" ist erforderlich.`,
        });
      }
    }

    // ── Schritt 4: Consents in DB speichern (upsert) ────────────────────
    // Wir verwenden eine Transaktion ($transaction), damit entweder ALLE
    // Consents gespeichert werden oder KEINER (Atomarität).
    //
    // Warum Transaktion?
    //   Wenn nach 2 von 3 Inserts ein Fehler auftritt, würden ohne
    //   Transaktion 2 Consents in der DB stehen und 1 fehlen.
    //   Das wäre ein inkonsistenter Zustand.
    //   Mit Transaktion: bei Fehler wird alles zurückgerollt.
    const upsertOperations = consents.map((consent) =>
      prisma.consent.upsert({
        // where: Suche nach der Kombination userId + consentType
        // (das ist der @@unique Constraint aus dem Schema)
        where: {
          userId_consentType: {
            userId,
            consentType: consent.consentType,
          },
        },
        // update: Wenn Eintrag existiert → diese Felder aktualisieren
        update: {
          granted: consent.granted,
          grantedAt: new Date(),
        },
        // create: Wenn Eintrag nicht existiert → neuen Eintrag erstellen
        create: {
          userId,
          consentType: consent.consentType,
          granted: consent.granted,
          grantedAt: new Date(),
        },
      })
    );

    // Alle upsert-Operationen als Transaktion ausführen
    const savedConsents = await prisma.$transaction(upsertOperations);

    // ── Schritt 5: Erfolgsantwort ────────────────────────────────────────
    return res.status(201).json({
      message: 'Einwilligungen erfolgreich gespeichert.',
      consents: savedConsents.map((c) => ({
        id: c.id,
        consentType: c.consentType,
        granted: c.granted,
        grantedAt: c.grantedAt,
      })),
    });
  } catch (error) {
    console.error('[createConsents] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}

// ─── GET /api/consents ────────────────────────────────────────────────────
// Gibt alle Einwilligungen des eingeloggten Users zurück.
//
// Wird verwendet von:
//   - Frontend: prüft ob User schon Consents hat (Onboarding-Flow)
//   - Später (US-08): Einwilligungen verwalten / widerrufen
//
// Antwort-Format:
// {
//   "consents": [
//     { "id": 1, "consentType": "terms", "granted": true, "grantedAt": "..." },
//     ...
//   ]
// }

export async function getConsents(req, res) {
  try {
    const userId = req.user.userId;

    // ── DB-Abfrage ──────────────────────────────────────────────────────
    // findMany: Gibt ALLE Einträge zurück, die zum User gehören.
    // select: Nur die Felder die der Client braucht (Datensparsamkeit).
    // orderBy: Sortiert nach consentType für konsistente Reihenfolge.
    const consents = await prisma.consent.findMany({
      where: { userId },
      select: {
        id: true,
        consentType: true,
        granted: true,
        grantedAt: true,
      },
      orderBy: { consentType: 'asc' },
    });

    return res.json({ consents });
  } catch (error) {
    console.error('[getConsents] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}

// ─── PATCH /api/consents/:id ──────────────────────────────────────────────
// Aktualisiert eine einzelne Einwilligung (US-08: Einwilligungen verwalten).
//
// Anwendungsfälle:
//   - Optionale Einwilligung widerrufen (analytics: true → false)
//   - Optionale Einwilligung nachträglich erteilen (analytics: false → true)
//
// Wichtige Regeln:
//   - Nur der EIGENE Consent kann geändert werden (userId-Check)
//   - Pflicht-Consents (terms, health_data) können NICHT widerrufen werden,
//     weil die App ohne sie nicht funktionieren darf.
//     → Dafür müsste der User sein Konto löschen (zukünftiges Feature).
//   - Jede Änderung wird mit neuem Zeitstempel dokumentiert (DSGVO)
//
// :id ist ein URL-Parameter. Express extrahiert ihn aus der URL:
//   PATCH /api/consents/3 → req.params.id = "3"

export async function updateConsent(req, res) {
  try {
    const userId = req.user.userId;
    const consentId = parseInt(req.params.id, 10);  // String → Zahl
    const { granted } = req.body;

    // ── Validierung ─────────────────────────────────────────────────────
    // granted muss ein Boolean sein (true oder false)
    if (typeof granted !== 'boolean') {
      return res.status(400).json({
        error: '"granted" muss true oder false sein.',
      });
    }

    // ── Consent in DB suchen ────────────────────────────────────────────
    // findUnique sucht einen spezifischen Eintrag anhand der ID.
    const consent = await prisma.consent.findUnique({
      where: { id: consentId },
    });

    // Consent existiert nicht?
    if (!consent) {
      return res.status(404).json({ error: 'Einwilligung nicht gefunden.' });
    }

    // Gehört der Consent dem eingeloggten User?
    // SECURITY: Ohne diesen Check könnte ein User die Consents anderer
    // User ändern, indem er einfach eine andere ID einsetzt.
    if (consent.userId !== userId) {
      return res.status(403).json({ error: 'Zugriff verweigert.' });
    }

    // Pflicht-Consents dürfen nicht widerrufen werden
    // (nur von true → false blockieren, true → true oder false → true erlauben)
    if (REQUIRED_CONSENTS.includes(consent.consentType) && granted === false) {
      return res.status(400).json({
        error: 'Pflicht-Einwilligungen können nicht widerrufen werden. ' +
               'Um die Datenverarbeitung vollständig zu beenden, ' +
               'kontaktiere bitte den Support oder lösche dein Konto.',
      });
    }

    // ── Consent aktualisieren ───────────────────────────────────────────
    // grantedAt wird auf den aktuellen Zeitpunkt gesetzt,
    // damit dokumentiert ist WANN die Änderung stattfand.
    const updatedConsent = await prisma.consent.update({
      where: { id: consentId },
      data: {
        granted,
        grantedAt: new Date(),  // Neuer Zeitstempel (DSGVO-Nachweispflicht)
      },
      select: {
        id: true,
        consentType: true,
        granted: true,
        grantedAt: true,
      },
    });

    return res.json({
      message: 'Einwilligung aktualisiert.',
      consent: updatedConsent,
    });
  } catch (error) {
    console.error('[updateConsent] Fehler:', error);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
}
