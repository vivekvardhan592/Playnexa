import { query } from '../../config/postgres.js';

// Ensure event_participants table exists
export const initEventTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS event_participants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
      joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (event_id, athlete_id)
    );
  `).catch((err) => console.error('[Event Table Init Notice]:', err.message));
};

initEventTables();

export const getAllEvents = async (athleteId = null) => {
  let sql, params;
  if (athleteId) {
    sql = `
      SELECT e.id, e.title, e.description, e.category, e.date, e.time, e.fee, e.location_name as "locationName",
             e.participants_count as participants, e.max_participants as "maxParticipants", e.banner_url,
             s.name as sport_name,
             CASE WHEN ep.athlete_id IS NOT NULL THEN true ELSE false END as is_registered
      FROM events e
      LEFT JOIN sports s ON e.sport_id = s.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.athlete_id = $1
      ORDER BY e.created_at DESC;
    `;
    params = [athleteId];
  } else {
    sql = `
      SELECT e.id, e.title, e.description, e.category, e.date, e.time, e.fee, e.location_name as "locationName",
             e.participants_count as participants, e.max_participants as "maxParticipants", e.banner_url,
             s.name as sport_name, false as is_registered
      FROM events e
      LEFT JOIN sports s ON e.sport_id = s.id
      ORDER BY e.created_at DESC;
    `;
    params = [];
  }

  const res = await query(sql, params);
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

export const registerForEvent = async (eventId, athleteId) => {
  await query(
    `INSERT INTO event_participants (event_id, athlete_id)
     VALUES ($1, $2)
     ON CONFLICT (event_id, athlete_id) DO NOTHING;`,
    [eventId, athleteId]
  );

  const countRes = await query(
    `SELECT COUNT(*) as count FROM event_participants WHERE event_id = $1;`,
    [eventId]
  );
  const count = parseInt(countRes.rows[0].count, 10);

  await query(
    `UPDATE events SET participants_count = $1 WHERE id = $2;`,
    [count, eventId]
  );

  return { success: true, registered: true, count };
};

export const leaveEvent = async (eventId, athleteId) => {
  await query(
    `DELETE FROM event_participants WHERE event_id = $1 AND athlete_id = $2;`,
    [eventId, athleteId]
  );

  const countRes = await query(
    `SELECT COUNT(*) as count FROM event_participants WHERE event_id = $1;`,
    [eventId]
  );
  const count = parseInt(countRes.rows[0].count, 10);

  await query(
    `UPDATE events SET participants_count = $1 WHERE id = $2;`,
    [count, eventId]
  );

  return { success: true, registered: false, count };
};
