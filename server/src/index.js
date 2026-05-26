import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { closeDatabase, initDatabase } from './db/index.js';
import apiRouter from './routes/api.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  initDatabase();
} catch (err) {
  console.error('Failed to start database:', err.message);
  console.error('Run from project root: npm run install:all && npm run db:seed');
  process.exit(1);
}
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

const allowedOrigins = new Set([
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'null',
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!isProduction) {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With'],
  })
);
app.use(express.json());

const projectRoot = path.resolve(__dirname, '../..');
const legacyImages = path.join(projectRoot, 'assets/img');

app.use('/assets', express.static(path.join(projectRoot, 'assets')));
app.use('/forms', express.static(path.join(projectRoot, 'forms')));
app.use('/images', express.static(legacyImages));

app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.sendFile(path.join(projectRoot, 'index.html'));
});

if (isProduction && process.env.SERVE_REACT === 'true') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use('/app', express.static(clientDist));
  app.get('/app/*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
