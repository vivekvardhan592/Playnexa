import express from 'express';
import { query } from '../../config/postgres.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const dbRes = await query(
      `SELECT id, type, title, body, is_read, created_at
       FROM notifications
       WHERE athlete_id = $1
       ORDER BY created_at DESC
       LIMIT 50;`,
      [req.user.athleteId]
    );
    return sendSuccess(res, { notifications: dbRes.rows, count: dbRes.rows.length }, 'Notifications list retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;
