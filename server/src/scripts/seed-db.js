import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { resolveDbPath, runTransaction } from '../db/index.js';
import { SCHEMA } from '../db/schema.js';
import { importMessagesFromJson, seedFromJson } from '../db/seed.js';

dotenv.config();

const resolved = resolveDbPath();
let clearInPlace = false;

fs.mkdirSync(path.dirname(resolved), { recursive: true });

if (fs.existsSync(resolved)) {
  try {
    fs.unlinkSync(resolved);
  } catch (err) {
    if (err.code !== 'EBUSY' && err.code !== 'EPERM') throw err;
    clearInPlace = true;
    console.log('Database file in use — clearing tables in place (stop the server to delete the file).');
  }
}

const db = new DatabaseSync(resolved);
db.exec('PRAGMA journal_mode = WAL');
db.exec(SCHEMA);

if (clearInPlace) {
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    .all();
  for (const { name } of tables) {
    db.exec(`DELETE FROM ${name}`);
  }
}

runTransaction(db, () => {
  seedFromJson(db);
  importMessagesFromJson(db);
});
db.close();

console.log(`Database seeded: ${resolved}`);
