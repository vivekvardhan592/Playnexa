import { query } from '../../config/postgres.js';

export const getAllEvents = async (athleteId = null) => {
  let sql, params;
  if (athleteId) {
    sql = `
      SELECT e.id, e.title, e.description, e.category,
             TO_CHAR(e.start_time AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS date,
             TO_CHAR(e.start_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS time,
             e.fee, e.location_name as "locationName", e.registered_count as participants,
             e.capacity as "maxParticipants",
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
      SELECT e.id, e.title, e.description, e.category,
             TO_CHAR(e.start_time AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS date,
             TO_CHAR(e.start_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS time,
             e.fee, e.location_name as "locationName", e.registered_count as participants,
             e.capacity as "maxParticipants",
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

export const getEventById = async (eventId, athleteId = null) => {
  const res = await query(
    `SELECT e.id, e.title, e.description, e.category,
            TO_CHAR(e.start_time AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS date,
            TO_CHAR(e.start_time AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS time,
            e.fee, e.location_name AS "locationName", e.registered_count AS participants,
            e.capacity AS "maxParticipants", s.name AS sport_name,
            CASE WHEN ep.athlete_id IS NOT NULL THEN true ELSE false END AS is_registered
     FROM events e
     LEFT JOIN sports s ON e.sport_id = s.id
     LEFT JOIN event_participants ep ON ep.event_id = e.id AND ep.athlete_id = $2
     WHERE e.id = $1;`,
    [eventId, athleteId]
  );
  return res.rows[0] || null;
};

export const createEvent = async ({ title, description, category = 'Tournament', date, time, fee = 'Free', locationName, sportId, organizerId, capacity = 100, longitude = 78.38, latitude = 17.44 }) => {
  const startTime = new Date(`${date}T${time || '00:00'}:00+05:30`);
  if (Number.isNaN(startTime.getTime())) {
    const error = new Error('A valid event date is required.');
    error.statusCode = 422;
    error.code = 'INVALID_EVENT_DATE';
    throw error;
  }
  const res = await query(
    `INSERT INTO events (title, description, category, start_time, fee, location, location_name, sport_id, organizer_id, capacity)
     VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9, $10, $11)
     RETURNING *;`,
    [title, description, category, startTime, fee, longitude, latitude, locationName, sportId, organizerId, capacity]
  );
  return res.rows[0];
};

export const registerForEvent = async (eventId, athleteId) => {
  const event = await query('SELECT capacity, registered_count FROM events WHERE id = $1;', [eventId]);
  if (!event.rows[0]) {
    const error = new Error('Event not found.');
    error.statusCode = 404;
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }
  if (event.rows[0].registered_count >= event.rows[0].capacity) {
    const error = new Error('Event is already at capacity.');
    error.statusCode = 409;
    error.code = 'EVENT_FULL';
    throw error;
  }
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
    `UPDATE events SET registered_count = $1 WHERE id = $2;`,
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
    `UPDATE events SET registered_count = $1 WHERE id = $2;`,
    [count, eventId]
  );

  return { success: true, registered: false, count };
};
