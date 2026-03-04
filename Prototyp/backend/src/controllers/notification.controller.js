// src/controllers/notification.controller.js — Benachrichtigungs-Endpunkte (US-18)
//
// Dieser Controller verwaltet die In-App-Benachrichtigungen eines Nutzers.
// Im MVP werden Benachrichtigungen hauptsächlich vom Cron-Job erstellt
// (Termin-Erinnerungen). Der User kann sie hier abrufen und als gelesen markieren.
//
// Jeder Handler ist mit authenticateToken geschützt — die userId
// kommt aus dem JWT-Token (req.user.userId).
//
// Endpunkte:
//   GET   /api/notifications          → Alle Benachrichtigungen abrufen
//   PATCH /api/notifications/:id/read → Eine als gelesen markieren
//   PATCH /api/notifications/read-all → Alle als gelesen markieren

import prisma from '../config/prisma.js';

// ─── GET /api/notifications ──────────────────────────────────────────────
// Gibt alle Benachrichtigungen des eingeloggten Users zurück.
//
// Sortierung: neueste zuerst (createdAt absteigend).
// Das ist sinnvoll, weil der User zuerst die aktuellsten Erinnerungen sehen soll.
//
// Zusätzlich wird die Anzahl der ungelesenen Benachrichtigungen
// als "unreadCount" mitgeliefert — das braucht das Frontend für
// den Badge-Zähler an der Glocke (🔔 3).
//
// Rückgabe:
// {
//   notifications: [...],    // Array aller Benachrichtigungen
//   unreadCount: 3           // Anzahl ungelesener
// }

export async function getNotifications(req, res) {
  try {
    // ── Alle Benachrichtigungen des Users abrufen ─────────────────
    // findMany gibt ein Array zurück, sortiert nach createdAt DESC
    // (neueste zuerst). select begrenzt die zurückgegebenen Felder
    // auf das, was das Frontend wirklich braucht.
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        relatedId: true,
        read: true,
        createdAt: true,
      },
    });

    // ── Ungelesene zählen ─────────────────────────────────────────
    // count() ist effizienter als notifications.filter().length,
    // weil die Zählung direkt in der Datenbank stattfindet.
    // Das spart Arbeitsspeicher, wenn es viele Benachrichtigungen gibt.
    const unreadCount = await prisma.notification.count({
      where: {
        userId: req.user.userId,
        read: false,
      },
    });

    // ── Antwort senden ────────────────────────────────────────────
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Fehler beim Laden der Benachrichtigungen:', error);
    res.status(500).json({ error: 'Benachrichtigungen konnten nicht geladen werden' });
  }
}

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────
// Markiert eine einzelne Benachrichtigung als gelesen.
//
// Wann wird das aufgerufen?
//   Wenn der User auf eine Benachrichtigung klickt/tippt, um sie zu öffnen
//   oder zum zugehörigen Termin zu navigieren.
//
// Sicherheit:
//   Wir prüfen, ob die Benachrichtigung dem eingeloggten User gehört
//   (userId-Check). Ohne diesen Check könnte ein User fremde
//   Benachrichtigungen manipulieren.
//
// updateMany statt update:
//   Wir verwenden updateMany mit der WHERE-Bedingung { id, userId },
//   weil Prisma's update() nur nach Unique-Feldern filtern kann.
//   Mit updateMany können wir id UND userId kombinieren → sicher.

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    // ── Update: read = true setzen ────────────────────────────────
    // updateMany gibt { count: N } zurück — Anzahl geänderter Zeilen.
    // count === 0 → Benachrichtigung existiert nicht oder gehört nicht dem User.
    const result = await prisma.notification.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.userId,  // Sicherheits-Check: nur eigene!
      },
      data: { read: true },
    });

    // Wenn keine Zeile aktualisiert wurde → 404
    if (result.count === 0) {
      return res.status(404).json({ error: 'Benachrichtigung nicht gefunden' });
    }

    res.json({ message: 'Als gelesen markiert' });
  } catch (error) {
    console.error('Fehler beim Markieren als gelesen:', error);
    res.status(500).json({ error: 'Konnte nicht als gelesen markiert werden' });
  }
}

// ─── PATCH /api/notifications/read-all ───────────────────────────────────
// Markiert ALLE ungelesenen Benachrichtigungen des Users als gelesen.
//
// Wann wird das aufgerufen?
//   Wenn der User den Button "Alle als gelesen markieren" drückt.
//   Das ist ein Komfort-Feature — statt jede einzeln zu klicken.
//
// updateMany aktualisiert alle Treffer in einem einzigen DB-Query.
// Das ist viel effizienter als eine Schleife über einzelne Updates.

export async function markAllAsRead(req, res) {
  try {
    // ── Alle ungelesenen des Users auf read=true setzen ───────────
    const result = await prisma.notification.updateMany({
      where: {
        userId: req.user.userId,
        read: false,               // Nur ungelesene aktualisieren
      },
      data: { read: true },
    });

    // result.count = Anzahl aktualisierter Benachrichtigungen
    res.json({
      message: `${result.count} Benachrichtigung(en) als gelesen markiert`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error('Fehler beim Markieren aller als gelesen:', error);
    res.status(500).json({ error: 'Konnte nicht alle als gelesen markieren' });
  }
}
