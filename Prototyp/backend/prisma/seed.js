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
      location: 'Hauptstr. 12, München',
      datetime: dateOffset(7, 10, 30),   // in 7 Tagen
      notes: 'Professionelle Zahnreinigung mitbuchen',
      status: 'scheduled',
    },
    {
      userId: user.id,
      title: 'Hausarzt Check-up',
      doctor: 'Dr. Schmidt',
      location: 'Berliner Str. 5, München',
      datetime: dateOffset(14, 9, 0),   // in 14 Tagen
      notes: 'Blutbild besprechen',
      status: 'scheduled',
    },
    {
      userId: user.id,
      title: 'Augenarzt',
      doctor: 'Dr. Weber',
      location: 'Leopoldstr. 88, München',
      datetime: dateOffset(1, 14, 15),   // morgen
      notes: null,
      status: 'scheduled',
    },
    {
      userId: user.id,
      title: 'Dermatologin',
      doctor: 'Dr. Fischer',
      location: 'Sendlinger Str. 22, München',
      datetime: dateOffset(-10, 11, 0),  // vor 10 Tagen
      notes: 'Muttermal-Screening abgeschlossen',
      status: 'completed',
    },
    {
      userId: user.id,
      title: 'Orthopäde',
      doctor: 'Dr. Braun',
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
