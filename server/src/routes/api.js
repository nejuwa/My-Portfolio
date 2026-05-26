import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabaseInfo, getDb } from '../db/index.js';
import { insertMessage, getMessages } from '../db/messages.js';
import { getPortfolio } from '../db/portfolio.js';

const router = Router();

router.get('/health', (_req, res) => {
  try {
    const db = getDb();
    db.prepare('SELECT 1').get();
    res.json({ ok: true, database: getDatabaseInfo() });
  } catch {
    res.status(503).json({ ok: false, message: 'Database unavailable' });
  }
});

router.get('/portfolio', (_req, res, next) => {
  try {
    const db = getDb();
    const data = getPortfolio(db);
    if (!data) {
      return res.status(503).json({
        success: false,
        message: 'Portfolio not seeded. Run: npm run db:seed --prefix server',
      });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;
      const db = getDb();
      insertMessage(db, { name, email, subject, message });

      res.status(201).json({
        success: true,
        message: 'Your message has been sent. Thank you!',
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/messages', (_req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    const db = getDb();
    res.json(getMessages(db));
  } catch (err) {
    next(err);
  }
});

export default router;
