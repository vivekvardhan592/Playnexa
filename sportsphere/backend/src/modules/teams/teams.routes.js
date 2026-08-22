import express from 'express';
import { query } from '../../config/postgres.js';
import { sendSuccess } from '../../utils/response.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const dbRes = await query(
      `SELECT t.id, t.name, t.description, t.city, t.members_count, t.created_at,
              s.name as sport_name
       FROM teams t
       LEFT JOIN sports s ON t.sport_id = s.id
       ORDER BY t.created_at DESC;`
    );
    return sendSuccess(res, { teams: dbRes.rows, count: dbRes.rows.length }, 'Teams list retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;
