/**
 * node scripts/seed.js
 * Crée l'admin par défaut si la table admin est vide.
 * Variables requises : DB_*, SEED_ADMIN_EMAIL, SEED_ADMIN_NAME, SEED_ADMIN_PASSWORD
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME,
        SEED_ADMIN_EMAIL, SEED_ADMIN_NAME, SEED_ADMIN_PASSWORD } = process.env;

if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_NAME || !SEED_ADMIN_PASSWORD) {
  console.error('[seed] SEED_ADMIN_EMAIL, SEED_ADMIN_NAME et SEED_ADMIN_PASSWORD sont requis');
  process.exit(1);
}

if (SEED_ADMIN_PASSWORD.length < 12) {
  console.error('[seed] SEED_ADMIN_PASSWORD doit contenir au moins 12 caractères');
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
});

try {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM admin');
  if (count > 0) {
    console.log(`[seed] ${count} admin(s) existant(s) — rien à faire`);
    process.exit(0);
  }

  const hash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 12);
  await conn.execute(
    'INSERT INTO admin (id, name, email, password) VALUES (?, ?, ?, ?)',
    [randomUUID(), SEED_ADMIN_NAME, SEED_ADMIN_EMAIL.toLowerCase(), hash]
  );
  console.log(`[seed] ✓ Admin créé : ${SEED_ADMIN_EMAIL}`);
} finally {
  await conn.end();
}
