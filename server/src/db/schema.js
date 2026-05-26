export const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  student_id TEXT,
  section TEXT,
  title TEXT,
  about TEXT,
  role TEXT,
  subtitle TEXT,
  birthday TEXT,
  age INTEGER,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  tagline TEXT NOT NULL,
  images TEXT NOT NULL,
  social TEXT NOT NULL,
  skills_intro TEXT,
  portfolio_intro TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'web',
  demo_url TEXT,
  tags TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL,
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS resume_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  intro TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resume_summary (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resume_education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  period TEXT NOT NULL,
  focus TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS resume_experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  highlights TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS github_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
`;
