// prisma/seed.js — Seed-Daten für die Entwicklung
//
// Dieses Skript füllt die Datenbank mit Testdaten.
// Ausführen mit: npx prisma db seed
//
// ACHTUNG: Seed wird NICHT in Produktion ausgeführt!
// Es dient nur dazu, beim Entwickeln sofort Daten zum Testen zu haben.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed gestartet...');

  // ── Test-User erstellen (falls nicht vorhanden) ─────────────────────
  // Wir nutzen upsert: Existiert der User schon → Update, sonst → Create.
  // So kann man den Seed mehrfach ausführen, ohne Fehler zu bekommen.
  const passwordHash = await bcrypt.hash('Test1234!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'laura@example.com' },
    update: {},
    create: {
      email: 'laura@example.com',
      passwordHash,
      firstName: 'Laura',
      lastName: 'Becker',
      birthDate: new Date('1992-06-15'),
      gender: 'female',
      avatarUrl: null,
    },
  });

  console.log(`   ✅ User: ${user.email} (ID: ${user.id})`);

  // ── Zweiter Test-User: Thomas Wagner (US-17) ───────────────────────
  // Thomas ist 56 Jahre alt und männlich → bekommt andere Vorsorge-
  // empfehlungen als Laura (z.B. Prostata-Vorsorge, Koloskopie ab 50).
  // So können wir die geschlechtsspezifische Filterung testen.
  const user2 = await prisma.user.upsert({
    where: { email: 'thomas@example.com' },
    update: {},
    create: {
      email: 'thomas@example.com',
      passwordHash,                           // gleiches Passwort: Test1234!
      firstName: 'Thomas',
      lastName: 'Wagner',
      birthDate: new Date('1970-03-22'),      // 56 Jahre alt (März 2026)
      gender: 'male',
      avatarUrl: null,
    },
  });

  console.log(`   ✅ User: ${user2.email} (ID: ${user2.id})`);

  // ── Consents für Test-User ──────────────────────────────────────────
  const consentTypes = ['terms', 'health_data', 'analytics'];
  for (const type of consentTypes) {
    await prisma.consent.upsert({
      where: {
        userId_consentType: { userId: user.id, consentType: type },
      },
      update: {},
      create: {
        userId: user.id,
        consentType: type,
        granted: true,
        grantedAt: new Date(),
      },
    });
  }
  console.log('   ✅ Consents: terms, health_data, analytics');

  // ── Consents für Thomas (gleich wie Laura) ──────────────────────────
  for (const type of consentTypes) {
    await prisma.consent.upsert({
      where: {
        userId_consentType: { userId: user2.id, consentType: type },
      },
      update: {},
      create: {
        userId: user2.id,
        consentType: type,
        granted: true,
        grantedAt: new Date(),
      },
    });
  }
  console.log('   ✅ Consents für Thomas: terms, health_data, analytics');

  // ── Ärzte-Datenbank (US-15) ─────────────────────────────────────────
  // Vorbefüllte Arztliste ("Mock-Doctolib") für die Termin-Erstellung.
  // Beim Erstellen eines Termins kann der User einen Arzt aus der Liste
  // wählen → Telefon + Ort werden automatisch ins Formular eingetragen.
  //
  // Wir verwenden upsert basierend auf name + specialty,
  // damit der Seed mehrfach ausgeführt werden kann.

  const doctors = [
    {
      name: 'Dr. Sarah Müller',
      specialty: 'Hausärztin',
      phone: '089 / 123 4567',
      location: 'Hauptstr. 12, München',
    },
    {
      name: 'Dr. Thomas Weber',
      specialty: 'Zahnarzt',
      phone: '089 / 234 5678',
      location: 'Marienplatz 8, München',
    },
    {
      name: 'Dr. Anna Schmidt',
      specialty: 'Augenärztin',
      phone: '089 / 345 6789',
      location: 'Leopoldstr. 88, München',
    },
    {
      name: 'Dr. Michael Braun',
      specialty: 'Orthopäde',
      phone: '089 / 456 7890',
      location: 'Karlsplatz 3, München',
    },
    {
      name: 'Dr. Lisa Hoffmann',
      specialty: 'Dermatologin',
      phone: '089 / 567 8901',
      location: 'Sendlinger Str. 22, München',
    },
    {
      name: 'Dr. Markus Klein',
      specialty: 'HNO-Arzt',
      phone: '089 / 678 9012',
      location: 'Schillerstr. 15, München',
    },
    {
      name: 'Kinderarztpraxis am Park',
      specialty: 'Kinderarzt',
      phone: '089 / 789 0123',
      location: 'Englischer Garten 1, München',
    },
    {
      name: 'Dr. Julia Fischer',
      specialty: 'Gynäkologin',
      phone: '089 / 890 1234',
      location: 'Theresienstr. 44, München',
    },
  ];

  // Bestehende Ärzte löschen und neu anlegen (idempotent)
  await prisma.doctor.deleteMany();

  for (const doc of doctors) {
    await prisma.doctor.create({ data: doc });
  }

  console.log(`   ✅ Ärzte: ${doctors.length} Beispielärzte erstellt`);

  // ── Termine (US-13) ────────────────────────────────────────────────
  // Wir erstellen 5 Beispieltermine:
  //   - 2 in der Zukunft (upcoming)
  //   - 1 heute (upcoming, aber knapp)
  //   - 2 in der Vergangenheit (Verlauf)
  //
  // So können wir sowohl die "Anstehend" als auch die "Verlauf"-Ansicht testen.

  // Zuerst bestehende Termine des Users löschen (idempotent)
  await prisma.appointment.deleteMany({ where: { userId: user.id } });

  const now = new Date();

  // Hilfsfunktion: Datum X Tage in der Zukunft/Vergangenheit + Uhrzeit
  function dateOffset(days, hours = 10, minutes = 0) {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  const appointments = [
    {
      userId: user.id,
      title: 'Zahnarzt-Kontrolle',
      doctor: 'Dr. Müller',
      phone: '089 / 123 4567',
      location: 'Hauptstr. 12, München',
      datetime: dateOffset(7, 10, 30),   // in 7 Tagen
      notes: 'Professionelle Zahnreinigung mitbuchen',
      status: 'scheduled',
    },
    {
      userId: user.id,
      title: 'Hausarzt Check-up',
      doctor: 'Dr. Schmidt',
      phone: '089 / 234 5678',
      location: 'Berliner Str. 5, München',
      datetime: dateOffset(14, 9, 0),   // in 14 Tagen
      notes: 'Blutbild besprechen',
      status: 'scheduled',
    },
    {
      userId: user.id,
      title: 'Augenarzt',
      doctor: 'Dr. Weber',
      phone: '089 / 345 6789',
      location: 'Leopoldstr. 88, München',
      datetime: dateOffset(1, 14, 15),   // morgen
      notes: null,
      status: 'scheduled',
    },
    {
      userId: user.id,
      title: 'Dermatologin',
      doctor: 'Dr. Fischer',
      phone: '089 / 456 7890',
      location: 'Sendlinger Str. 22, München',
      datetime: dateOffset(-10, 11, 0),  // vor 10 Tagen
      notes: 'Muttermal-Screening abgeschlossen',
      status: 'completed',
    },
    {
      userId: user.id,
      title: 'Orthopäde',
      doctor: 'Dr. Braun',
      phone: null,
      location: 'Karlsplatz 3, München',
      datetime: dateOffset(-30, 8, 30),  // vor 30 Tagen
      notes: 'Rücken-Übungen empfohlen',
      status: 'completed',
    },
  ];

  for (const apt of appointments) {
    await prisma.appointment.create({ data: apt });
  }

  console.log(`   ✅ Termine: ${appointments.length} Beispieltermine erstellt`);

  // ── Termine für Thomas (US-17 Testdaten) ───────────────────────────
  // Thomas bekommt auch ein paar Termine, damit wir sehen, dass User
  // getrennte Daten haben.
  await prisma.appointment.deleteMany({ where: { userId: user2.id } });

  const thomasAppointments = [
    {
      userId: user2.id,
      title: 'Hausarzt Check-up',
      doctor: 'Dr. Sarah Müller',
      phone: '089 / 123 4567',
      location: 'Hauptstr. 12, München',
      datetime: dateOffset(5, 9, 0),
      notes: 'Blutdruck kontrollieren',
      status: 'scheduled',
    },
    {
      userId: user2.id,
      title: 'Koloskopie',
      doctor: 'Dr. med. Schneider',
      phone: '089 / 999 8888',
      location: 'Gastro-Zentrum, Maximilianstr. 10, München',
      datetime: dateOffset(-60, 8, 0),
      notes: 'Befund unauffällig',
      status: 'completed',
    },
  ];

  for (const apt of thomasAppointments) {
    await prisma.appointment.create({ data: apt });
  }

  console.log(`   ✅ Termine Thomas: ${thomasAppointments.length} Beispieltermine`);

  // ══════════════════════════════════════════════════════════════════════
  // ── GKV-Vorsorge-Katalog (US-17) ─────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════
  //
  // Statische Daten aus dem Leistungskatalog der gesetzlichen Kranken-
  // versicherung (GKV). Jeder Eintrag definiert eine Vorsorge-Unter-
  // suchung mit Altersbereich, Geschlecht und Häufigkeit.
  //
  // gender: null = gilt für alle Geschlechter
  //         "male" = nur für Männer
  //         "female" = nur für Frauen
  //
  // frequencyMonths: Wie oft die Untersuchung gemacht werden soll
  //   12   = jährlich
  //   24   = alle 2 Jahre
  //   36   = alle 3 Jahre
  //   120  = alle 10 Jahre
  //   999  = einmalig (Sonderwert, z.B. Bauchaorta-Screening)

  // Erst bestehende Vorsorge-Daten löschen (Reihenfolge wegen FK!)
  await prisma.userPrevention.deleteMany();
  await prisma.preventionSchedule.deleteMany();

  const preventions = [
    {
      type: 'Gesundheits-Check-up',
      description: 'Allgemeine Gesundheitsuntersuchung: Blut, Urin, Herz-Kreislauf. Einmalig zwischen 18-34, ab 35 alle 3 Jahre.',
      gender: null,            // alle Geschlechter
      ageFrom: 18,
      ageTo: 99,
      frequencyMonths: 36,     // alle 3 Jahre
    },
    {
      type: 'Hautkrebs-Screening',
      description: 'Visuelle Ganzkörperuntersuchung der Haut auf verdächtige Veränderungen (Muttermale, Pigmentflecken).',
      gender: null,
      ageFrom: 35,
      ageTo: 99,
      frequencyMonths: 24,     // alle 2 Jahre
    },
    {
      type: 'Zahnärztliche Vorsorge',
      description: 'Kontrolluntersuchung beim Zahnarzt. Wichtig für das Bonusheft (höherer Zuschuss bei Zahnersatz).',
      gender: null,
      ageFrom: 18,
      ageTo: 99,
      frequencyMonths: 12,     // jährlich
    },
    {
      type: 'Gynäkologische Krebsvorsorge',
      description: 'Abstrich (Pap-Test) zur Früherkennung von Gebärmutterhalskrebs. Ab 20 jährlich.',
      gender: 'female',        // nur für Frauen
      ageFrom: 20,
      ageTo: 99,
      frequencyMonths: 12,     // jährlich
    },
    {
      type: 'Mammographie-Screening',
      description: 'Röntgenuntersuchung der Brust zur Brustkrebsfrüherkennung. Einladung per Post.',
      gender: 'female',
      ageFrom: 50,
      ageTo: 69,
      frequencyMonths: 24,     // alle 2 Jahre
    },
    {
      type: 'Darmkrebs-Vorsorge (Stuhltest)',
      description: 'Immunologischer Stuhltest (iFOBT) auf verstecktes Blut im Stuhl. Einfach zu Hause durchführbar.',
      gender: null,
      ageFrom: 50,
      ageTo: 99,
      frequencyMonths: 12,     // jährlich (bis Koloskopie-Alter)
    },
    {
      type: 'Koloskopie (Darmspiegelung)',
      description: 'Darmspiegelung zur Früherkennung von Darmkrebs. Goldstandard der Vorsorge.',
      gender: 'male',          // Männer ab 50
      ageFrom: 50,
      ageTo: 99,
      frequencyMonths: 120,    // alle 10 Jahre
    },
    {
      type: 'Koloskopie (Darmspiegelung)',
      description: 'Darmspiegelung zur Früherkennung von Darmkrebs. Goldstandard der Vorsorge.',
      gender: 'female',        // Frauen ab 55
      ageFrom: 55,
      ageTo: 99,
      frequencyMonths: 120,    // alle 10 Jahre
    },
    {
      type: 'Bauchaorta-Ultraschall',
      description: 'Einmalige Ultraschalluntersuchung der Bauchschlagader auf Aneurysmen (Aussackungen).',
      gender: 'male',          // nur Männer
      ageFrom: 65,
      ageTo: 99,
      frequencyMonths: 999,    // einmalig
    },
    {
      type: 'Prostata- & Genitaluntersuchung',
      description: 'Abtasten der Prostata und äußeren Genitalien zur Krebsfrüherkennung.',
      gender: 'male',
      ageFrom: 45,
      ageTo: 99,
      frequencyMonths: 12,     // jährlich
    },
  ];

  // Vorsorge-Katalog in DB schreiben
  const createdPreventions = [];
  for (const prev of preventions) {
    const created = await prisma.preventionSchedule.create({ data: prev });
    createdPreventions.push(created);
  }

  console.log(`   ✅ Vorsorge-Katalog: ${createdPreventions.length} GKV-Leistungen`);

  // ── UserPrevention-Einträge automatisch erzeugen ──────────────────
  // Für jeden User prüfen wir: Welche Vorsorge passt zu Alter + Geschlecht?
  // Passende Vorsorgen bekommen einen Eintrag mit Status "open".
  //
  // So sieht Laura nur ihre Vorsorgen, Thomas nur seine.

  // Hilfsfunktion: Alter aus Geburtsdatum berechnen
  function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // Noch nicht Geburtstag gehabt dieses Jahr? → 1 Jahr abziehen
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Beide User durchgehen und passende Vorsorgen zuweisen
  const users = [
    { ...user, birthDate: new Date('1992-06-15'), gender: 'female' },   // Laura, 33
    { ...user2, birthDate: new Date('1970-03-22'), gender: 'male' },    // Thomas, 56
  ];

  for (const u of users) {
    const age = calculateAge(u.birthDate);

    for (const prev of createdPreventions) {
      // Prüfung 1: Passt das Alter?
      const ageMatch = age >= prev.ageFrom && age <= prev.ageTo;

      // Prüfung 2: Passt das Geschlecht?
      // gender = null → gilt für alle, sonst muss es übereinstimmen
      const genderMatch = prev.gender === null || prev.gender === u.gender;

      if (ageMatch && genderMatch) {
        await prisma.userPrevention.create({
          data: {
            userId: u.id,
            preventionId: prev.id,
            status: 'open',        // Standardmäßig noch offen
            completedAt: null,
          },
        });
      }
    }

    const userPreventionCount = await prisma.userPrevention.count({
      where: { userId: u.id },
    });
    console.log(`   ✅ Vorsorge ${u.firstName}: ${userPreventionCount} passende Einträge (Alter ${age}, ${u.gender})`);
  }

  // ── US-18: Test-Benachrichtigungen (Termin-Erinnerungen) ────────────
  // Erstelle einige Beispiel-Notifications für Laura, damit beim
  // ersten Login sofort etwas in der Benachrichtigungs-Ansicht sichtbar ist.
  //
  // Zuerst alle bestehenden Notifications löschen (für idempotenten Seed).
  // deleteMany ohne where → löscht ALLE Notifications.
  await prisma.notification.deleteMany({});

  // Lauras Termine laden, um relatedId setzen zu können
  const lauraAppointments = await prisma.appointment.findMany({
    where: { userId: user.id, status: 'scheduled' },
    orderBy: { datetime: 'asc' },
  });

  // Für jeden anstehenden Termin eine "24h vorher"-Erinnerung erstellen
  const notificationsData = [];

  for (const apt of lauraAppointments) {
    notificationsData.push({
      userId: user.id,
      type: 'appointment_reminder_24h',
      title: 'Termin morgen',
      message: `${apt.title} am ${apt.datetime.toLocaleDateString('de-DE', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      })} um ${apt.datetime.toLocaleTimeString('de-DE', {
        hour: '2-digit', minute: '2-digit'
      })} Uhr bei ${apt.doctor}${apt.location ? ` — ${apt.location}` : ''}`,
      relatedId: apt.id,
      read: false,
    });
  }

  // Zusätzlich eine bereits gelesene Erinnerung (für UI-Test)
  if (lauraAppointments.length > 0) {
    notificationsData.push({
      userId: user.id,
      type: 'appointment_reminder_1h',
      title: 'Termin in 1 Stunde',
      message: `Vergiss nicht: ${lauraAppointments[0].title} bei ${lauraAppointments[0].doctor}`,
      relatedId: lauraAppointments[0].id,
      read: true,   // Diese ist schon gelesen → wird im UI dezenter dargestellt
    });
  }

  // Alle Notifications auf einmal erstellen (effizienter als einzeln)
  // createMany erzeugt alle Einträge in einem einzigen DB-Query.
  if (notificationsData.length > 0) {
    await prisma.notification.createMany({ data: notificationsData });
  }

  const notifCount = await prisma.notification.count({ where: { userId: user.id } });
  console.log(`   ✅ Notifications Laura: ${notifCount} Erinnerungen erstellt`);

  console.log('🌱 Seed abgeschlossen!');
}

main()
  .catch((e) => {
    console.error('❌ Seed fehlgeschlagen:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
