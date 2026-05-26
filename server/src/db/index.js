import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { importMessagesFromJson, seedFromJson } from './seed.js';
import { SCHEMA } from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.join(__dirname, '../..');

let db = null;

export function resolveDbPath() {
  const configured = process.env.DATABASE_PATH;
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(SERVER_ROOT, configured.replace(/^\.\//, ''));
  }
  return path.join(SERVER_ROOT, 'data/portfolio.db');
}

export function runTransaction(database, fn) {
  database.exec('BEGIN');
  try {
    fn();
    database.exec('COMMIT');
  } catch (err) {
    database.exec('ROLLBACK');
    throw err;
  }
}

export function initDatabase() {
  if (db) return db;

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec(SCHEMA);

  try {
    db.exec('ALTER TABLE profile ADD COLUMN skills_intro TEXT');
  } catch {
    /* column exists */
  }
  try {
    db.exec('ALTER TABLE profile ADD COLUMN portfolio_intro TEXT');
  } catch {
    /* column exists */
  }

  const hasProfile = db.prepare('SELECT COUNT(*) AS count FROM profile').get().count > 0;
  if (!hasProfile) {
    runTransaction(db, () => seedFromJson(db));
    const imported = importMessagesFromJson(db);
    console.log(`Database seeded at ${dbPath}`);
    if (imported > 0) {
      console.log(`Imported ${imported} message(s) from messages.json`);
    }
  }

  return db;
}

export function getDb() {
  if (!db) return initDatabase();
  return db;
}

export function getDatabaseInfo() {
  const database = getDb();
  const stats = database
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM skills) AS skills,
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM services) AS services,
        (SELECT COUNT(*) FROM messages) AS messages`
    )
    .get();

  return {
    engine: 'sqlite',
    path: resolveDbPath(),
    ...stats,
  };
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
