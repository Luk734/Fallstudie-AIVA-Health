// src/config/prisma.js — Prisma-Client Singleton
//
// WARUM ein Singleton?
// Wenn wir in jeder Datei "new PrismaClient()" schreiben würden,
// entstehen hunderte offene Datenbankverbindungen → Server crasht.
// Eine einzige Instanz wird hier angelegt und überall importiert.
//
// Der Client liegt in src/generated/prisma (von Prisma v7 generiert).

// src/config/prisma.js — Prisma-Client Singleton
//
// WARUM ein Singleton?
// Wenn wir in jeder Datei "new PrismaClient()" schreiben würden,
// entstehen hunderte offene Datenbankverbindungen → Server crasht.
// Eine einzige Instanz wird hier angelegt und überall importiert.
// Prisma v5 liest DATABASE_URL automatisch aus der .env (via schema.prisma).

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
