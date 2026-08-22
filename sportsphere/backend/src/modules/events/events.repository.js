import { query } from '../../config/postgres.js';

export const getAllEvents = async () => {
  const res = await query(
    `SELECT e.id, e.title, e.description, e.category, e.date, e.time, e.fee, e.location_name,
            e.participants_count, e.max_participants, e.banner_url,
            s.name as sport_name
     FROM events e
     LEFT JOIN sports s ON e.sport_id = s.id
     ORDER BY e.created_at DESC;`
  );
  return res.rows;
};

export const createEvent = async ({ title, description, category = 'Tournament', date, time, fee = 'Free', locationName, sportId, creatorId }) => {
  const res = await query(
    `INSERT INTO events (title, description, category, date, time, fee, location_name, sport_id, creator_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *;`,
    [title, description, category, date, time, fee, locationName, sportId, creatorId]
  );
  return res.rows[0];
};
