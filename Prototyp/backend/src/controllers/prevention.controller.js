// src/controllers/prevention.controller.js — Vorsorge-Endpunkte (US-17)
//
// Dieser Controller liefert die Vorsorge-Empfehlungen basierend auf dem
// GKV-Leistungskatalog, gefiltert nach Alter und Geschlecht des Users.
//
// Endpunkte:
//   GET   /api/prevention             → Alle passenden Vorsorgen für den User
//   PATCH /api/prevention/:id/status  → Status ändern (open ↔ completed)
//
// DSGVO-Hinweis:
//   Gesundheitsdaten (Art. 9 DSGVO) — hier: welche Vorsorge der User
//   gemacht hat. Zugriff nur über JWT-Token (der User sieht nur SEINE Daten).

import prisma from '../config/prisma.js';

// ─── Hilfsfunktion: Alter berechnen ─────────────────────────────────────
// Berechnet das aktuelle Alter aus einem Geburtsdatum.
// Berücksichtigt, ob der Geburtstag dieses Jahr schon war oder nicht.
//
// Beispiel:
//   birthDate = 1992-06-15, heute = 2026-03-04 → Alter = 33
//   birthDate = 1970-03-22, heute = 2026-03-04 → Alter = 55 (Geburtstag noch nicht gewesen)

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Geburtstag dieses Jahr noch nicht erreicht? → 1 Jahr abziehen
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// ─── GET /api/prevention ────────────────────────────────────────────────
// Gibt alle Vorsorgeuntersuchungen zurück, die zum Alter und Geschlecht
// des eingeloggten Users passen.
//
// Ablauf:
//   1. User aus DB laden (wir brauchen birthDate + gender)
//   2. Alter berechnen
//   3. PreventionSchedule filtern: ageFrom ≤ Alter ≤ ageTo
//      UND (gender = user.gender ODER gender = null → gilt für alle)
//   4. Für jede passende Vorsorge den UserPrevention-Status dazujoinen
//   5. Falls kein UserPrevention-Eintrag existiert, wird "open" angenommen
//
// Response-Format:
//   [{
//     id: 1,                           ← PreventionSchedule.id
//     type: "Hautkrebs-Screening",
//     description: "Visuelle ...",
//     frequencyMonths: 24,
//     userPreventionId: 5,             ← UserPrevention.id (für PATCH)
//     status: "open",                  ← "open" | "completed"
//     completedAt: null                ← Datum oder null
//   }]

export async function getPreventions(req, res) {
  try {
    // ── Schritt 1: User-Daten laden ─────────────────────────────────
    // Wir brauchen birthDate und gender aus dem User-Profil,
    // um die passenden Vorsorgen zu filtern.
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { birthDate: true, gender: true },
    });

    // Profil unvollständig? → Wir können nicht filtern
    if (!user || !user.birthDate || !user.gender) {
      return res.status(400).json({
        error: 'Profil unvollständig',
        message: 'Bitte zuerst Geburtsdatum und Geschlecht im Profil angeben, damit wir passende Vorsorgeempfehlungen anzeigen können.',
      });
    }

    // ── Schritt 2: Alter berechnen ──────────────────────────────────
    const age = calculateAge(user.birthDate);

    // ── Schritt 3: GKV-Katalog filtern ──────────────────────────────
    // Prisma WHERE-Bedingung:
    //   ageFrom ≤ Alter (User ist alt genug)
    //   ageTo   ≥ Alter (User ist noch nicht zu alt)
    //   gender  = user.gender ODER gender = null (gilt für alle)
    //
    // Das OR ist wichtig: gender = null bedeutet "für alle Geschlechter".
    // Ohne das OR würden geschlechtsunspezifische Vorsorgen (Check-up,
    // Zahnvorsorge) nicht angezeigt werden.
    const schedules = await prisma.preventionSchedule.findMany({
      where: {
        ageFrom: { lte: age },     // ab-Alter ≤ mein Alter
        ageTo: { gte: age },       // bis-Alter ≥ mein Alter
        OR: [
          { gender: user.gender }, // geschlechtsspezifisch
          { gender: null },        // oder für alle
        ],
      },
      orderBy: { type: 'asc' },   // alphabetisch sortiert
    });

    // ── Schritt 4: UserPrevention dazuladen ─────────────────────────
    // Für jede Vorsorge im Katalog suchen wir den Status des Users.
    // Include wäre hier auch möglich, aber so ist die Logik expliziter.
    const userPreventions = await prisma.userPrevention.findMany({
      where: {
        userId: req.user.userId,
        preventionId: { in: schedules.map((s) => s.id) },
      },
    });

    // Map für schnellen Lookup: preventionId → UserPrevention
    const statusMap = new Map();
    for (const up of userPreventions) {
      statusMap.set(up.preventionId, up);
    }

    // ── Schritt 5: Response zusammenbauen ─────────────────────────
    // Jede Vorsorge bekommt ihren Status. Falls kein UserPrevention-
    // Eintrag existiert (sollte durch Seed nicht passieren), nehmen
    // wir "open" als Default an.
    const result = schedules.map((schedule) => {
      const userPrev = statusMap.get(schedule.id);
      return {
        id: schedule.id,
        type: schedule.type,
        description: schedule.description,
        frequencyMonths: schedule.frequencyMonths,
        // UserPrevention-Daten (oder Defaults)
        userPreventionId: userPrev?.id ?? null,
        status: userPrev?.status ?? 'open',
        completedAt: userPrev?.completedAt ?? null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Prevention GET Error:', error);
    res.status(500).json({ error: 'Vorsorge-Daten konnten nicht geladen werden.' });
  }
}

// ─── PATCH /api/prevention/:id/status ───────────────────────────────────
// Ändert den Status einer Vorsorge für den eingeloggten User.
//
// :id = userPrevention.id (NICHT preventionSchedule.id!)
//
// Request-Body:
//   { "status": "completed" }   → Vorsorge als erledigt markieren
//   { "status": "open" }        → Zurück auf "offen" setzen
//
// Bei "completed" wird automatisch completedAt auf das aktuelle Datum gesetzt.
// Bei "open" wird completedAt auf null gesetzt (= wieder offen).

export async function updatePreventionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ── Validierung: Nur "open" und "completed" erlaubt ─────────────
    if (!status || !['open', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Ungültiger Status',
        message: 'Status muss "open" oder "completed" sein.',
      });
    }

    // ── UserPrevention laden und Besitzer prüfen ────────────────────
    // Wichtig: Wir prüfen, dass der Eintrag dem eingeloggten User
    // gehört. Sonst könnte User A den Status von User B ändern!
    const userPrevention = await prisma.userPrevention.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userPrevention) {
      return res.status(404).json({ error: 'Vorsorge-Eintrag nicht gefunden.' });
    }

    // Sicherheitscheck: Gehört der Eintrag dem eingeloggten User?
    if (userPrevention.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Zugriff verweigert.' });
    }

    // ── Status aktualisieren ────────────────────────────────────────
    // Bei "completed": completedAt = jetzt (Zeitstempel WANN erledigt)
    // Bei "open": completedAt = null (wieder offen, Datum weg)
    const updated = await prisma.userPrevention.update({
      where: { id: parseInt(id) },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });

    res.json({
      id: updated.id,
      status: updated.status,
      completedAt: updated.completedAt,
    });
  } catch (error) {
    console.error('Prevention PATCH Error:', error);
    res.status(500).json({ error: 'Status konnte nicht aktualisiert werden.' });
  }
}
