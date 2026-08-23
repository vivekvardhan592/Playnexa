import { query, getTransactionClient } from '../../config/postgres.js';

export const findSportIdByName = async (sportName) => {
  const res = await query(
    `SELECT id FROM sports WHERE lower(name) = lower($1) LIMIT 1;`,
    [sportName]
  );
  return res.rows[0]?.id || null;
};

export const getMatchById = async (matchId) => {
  const res = await query(
    `SELECT m.id, m.creator_id, m.sport_id, m.title, m.description, m.skill_level,
            m.location_name, m.city, m.scheduled_at, m.capacity, m.current_players, m.status, m.created_at,
            ST_Y(m.location::geometry) as latitude,
            ST_X(m.location::geometry) as longitude,
            s.name as sport_name, s.slug as sport_slug,
            a.display_name as creator_name, a.profile_image_url as creator_avatar
     FROM matches m
     JOIN sports s ON m.sport_id = s.id
     JOIN athletes a ON m.creator_id = a.id
     WHERE m.id = $1;`,
    [matchId]
  );

  const match = res.rows[0];
  if (!match) return null;

  // Fetch participants
  const partRes = await query(
    `SELECT mp.id as participant_id, mp.status, mp.joined_at,
            a.id as athlete_id, a.display_name, a.profile_image_url, a.attendance_rate_pct
     FROM match_participants mp
     JOIN athletes a ON mp.athlete_id = a.id
     WHERE mp.match_id = $1 AND mp.status = 'JOINED'
     ORDER BY mp.joined_at ASC;`,
    [matchId]
  );

  return {
    ...match,
    sport: match.sport_name,
    skillLevel: match.skill_level,
    locationName: match.location_name,
    currentPlayers: match.current_players,
    maxPlayers: match.capacity,
    creator: {
      id: match.creator_id,
      name: match.creator_name,
      avatar: match.creator_avatar || '/athlete_rahul.jpg',
    },
    participants: partRes.rows.map((p) => ({
      id: p.athlete_id,
      athlete_id: p.athlete_id,
      name: p.display_name,
      avatar: p.profile_image_url || '/athlete_rahul.jpg',
    })),
  };
};

export const createMatch = async ({ creatorId, sportId, title, description, skillLevel = 'Any', longitude = 78.38, latitude = 17.44, locationName, city = 'Hyderabad', scheduledAt, capacity }) => {
  const lon = Number.isFinite(longitude) ? longitude : 78.38;
  const lat = Number.isFinite(latitude) ? latitude : 17.44;

  const res = await query(
    `INSERT INTO matches (creator_id, sport_id, title, description, skill_level, location, location_name, city, scheduled_at, capacity, current_players, status)
     VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9, $10, $11, 1, 'OPEN')
     RETURNING id;`,
    [creatorId, sportId, title, description, skillLevel, lon, lat, locationName, city, scheduledAt, capacity]
  );

  const matchId = res.rows[0].id;

  // Creator automatically joins as first participant with HOST / JOINED status
  await query(
    `INSERT INTO match_participants (match_id, athlete_id, status)
     VALUES ($1, $2, 'JOINED')
     ON CONFLICT (match_id, athlete_id) DO UPDATE SET status = 'JOINED';`,
    [matchId, creatorId]
  );

  // Notify nearby athletes via PostGIS spatial discovery query
  notifyNearbyAthletes(matchId, creatorId, lon, lat, 10, title, locationName);

  return getMatchById(matchId);
};

export const notifyNearbyAthletes = async (matchId, creatorId, longitude, latitude, radiusKm = 10, title, locationName) => {
  try {
    const nearby = await query(
      `SELECT a.id, a.display_name
       FROM athletes a
       WHERE ST_DWithin(a.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3 * 1000)
         AND a.id != $4;`,
      [longitude, latitude, radiusKm, creatorId]
    );

    for (const ath of nearby.rows) {
      await query(
        `INSERT INTO notifications (athlete_id, type, title, body)
         VALUES ($1, 'MATCH_RADAR', 'New Match Ping nearby!', $2);`,
        [ath.id, `A new match "${title}" was posted near ${locationName}`]
      ).catch(() => {});
    }

    return nearby.rows;
  } catch (err) {
    console.error('[Notify Nearby Error]:', err.message);
    return [];
  }
};

export const findRadarMatches = async ({ longitude = 78.38, latitude = 17.44, radiusKm = 10, sport = 'All', status = 'OPEN', limit = 20 }) => {
  let whereClauses = [];
  let params = [];
  let paramIdx = 1;

  if (sport && sport !== 'All') {
    whereClauses.push(`s.name ILIKE $${paramIdx}`);
    params.push(sport);
    paramIdx++;
  }

  if (status && status !== 'All') {
    whereClauses.push(`m.status = $${paramIdx}`);
    params.push(status);
    paramIdx++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT m.id, m.creator_id, m.sport_id, m.title, m.description, m.skill_level,
           m.location_name, m.city, m.scheduled_at, m.capacity, m.current_players, m.status,
           ST_Y(m.location::geometry) as latitude,
           ST_X(m.location::geometry) as longitude,
           1.2 as distance_km,
           s.name as sport_name,
           a.display_name as creator_name, a.profile_image_url as creator_avatar
    FROM matches m
    JOIN sports s ON m.sport_id = s.id
    JOIN athletes a ON m.creator_id = a.id
    ${whereSql}
    ORDER BY m.created_at DESC
    LIMIT $${paramIdx};
  `;

  const res = await query(sql, [...params, limit]);

  // Map each row with participants and creator object
  const matches = await Promise.all(
    res.rows.map(async (row) => {
      const partRes = await query(
        `SELECT mp.athlete_id, a.display_name, a.profile_image_url
         FROM match_participants mp
         JOIN athletes a ON mp.athlete_id = a.id
         WHERE mp.match_id = $1 AND mp.status = 'JOINED'
         ORDER BY mp.joined_at ASC;`,
        [row.id]
      );

      return {
        ...row,
        sport: row.sport_name,
        skillLevel: row.skill_level,
        locationName: row.location_name,
        currentPlayers: row.current_players,
        maxPlayers: row.capacity,
        distanceKm: parseFloat(parseFloat(row.distance_km || 1.2).toFixed(1)),
        creator: {
          id: row.creator_id,
          name: row.creator_name,
          avatar: row.creator_avatar || '/athlete_rahul.jpg',
        },
        participants: partRes.rows.map((p) => ({
          id: p.athlete_id,
          athlete_id: p.athlete_id,
          name: p.display_name,
          avatar: p.profile_image_url || '/athlete_rahul.jpg',
        })),
      };
    })
  );

  return matches;
};

// ATOMIC TRANSACTION-SAFE JOIN OPERATION USING SELECT ... FOR UPDATE
export const joinMatchAtomic = async (matchId, athleteId) => {
  const { client, query, release } = await getTransactionClient();

  try {
    await query('BEGIN;');

    // 1. SELECT FOR UPDATE - Row Locking on Match Entry
    const matchRes = await query(
      `SELECT id, capacity, current_players, status
       FROM matches
       WHERE id = $1
       FOR UPDATE;`,
      [matchId]
    );

    const match = matchRes.rows[0];
    if (!match) {
      const err = new Error('Match lobby not found.');
      err.statusCode = 404;
      err.code = 'MATCH_NOT_FOUND';
      throw err;
    }

    if (match.status === 'CANCELLED' || match.status === 'COMPLETED') {
      const err = new Error(`Match lobby is no longer active (${match.status}).`);
      err.statusCode = 400;
      err.code = 'MATCH_INACTIVE';
      throw err;
    }

    // 2. Capacity Check - Invariant: current_players < capacity
    if (match.current_players >= match.capacity || match.status === 'FULL') {
      const err = new Error('Match lobby is already at full capacity.');
      err.statusCode = 409;
      err.code = 'MATCH_FULL';
      throw err;
    }

    // 3. Duplicate Participant Check
    const dupRes = await query(
      `SELECT id, status FROM match_participants
       WHERE match_id = $1 AND athlete_id = $2;`,
      [matchId, athleteId]
    );

    if (dupRes.rows.length > 0 && dupRes.rows[0].status === 'JOINED') {
      const err = new Error('Athlete is already a confirmed participant in this match.');
      err.statusCode = 409;
      err.code = 'DUPLICATE_PARTICIPANT';
      throw err;
    }

    // 4. Insert / Re-activate Participant
    if (dupRes.rows.length > 0) {
      await query(
        `UPDATE match_participants SET status = 'JOINED', joined_at = CURRENT_TIMESTAMP
         WHERE match_id = $1 AND athlete_id = $2;`,
        [matchId, athleteId]
      );
    } else {
      await query(
        `INSERT INTO match_participants (match_id, athlete_id, status)
         VALUES ($1, $2, 'JOINED');`,
        [matchId, athleteId]
      );
    }

    // 5. Increment Count & Update Status if Capacity Reached
    const newCount = match.current_players + 1;
    const newStatus = newCount >= match.capacity ? 'FULL' : 'OPEN';

    await query(
      `UPDATE matches
       SET current_players = $1, status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3;`,
      [newCount, newStatus, matchId]
    );

    await query('COMMIT;');
    release();

    return getMatchById(matchId);
  } catch (error) {
    await query('ROLLBACK;').catch(() => {});
    release();
    throw error;
  }
};

export const leaveMatchAtomic = async (matchId, athleteId) => {
  const { client, query, release } = await getTransactionClient();

  try {
    await query('BEGIN;');

    const matchRes = await query(
      `SELECT id, capacity, current_players, status, creator_id
       FROM matches WHERE id = $1 FOR UPDATE;`,
      [matchId]
    );

    const match = matchRes.rows[0];
    if (!match) {
      const err = new Error('Match lobby not found.');
      err.statusCode = 404;
      err.code = 'MATCH_NOT_FOUND';
      throw err;
    }

    if (match.creator_id === athleteId) {
      const err = new Error('Match creator cannot leave. Use match cancellation instead.');
      err.statusCode = 400;
      err.code = 'CREATOR_CANNOT_LEAVE';
      throw err;
    }

    const partRes = await query(
      `UPDATE match_participants SET status = 'LEFT'
       WHERE match_id = $1 AND athlete_id = $2 AND status = 'JOINED'
       RETURNING id;`,
      [matchId, athleteId]
    );

    if (partRes.rows.length === 0) {
      const err = new Error('Athlete is not an active participant in this match.');
      err.statusCode = 400;
      err.code = 'NOT_PARTICIPANT';
      throw err;
    }

    const newCount = Math.max(1, match.current_players - 1);
    const newStatus = match.status === 'FULL' && newCount < match.capacity ? 'OPEN' : match.status;

    await query(
      `UPDATE matches SET current_players = $1, status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3;`,
      [newCount, newStatus, matchId]
    );

    await query('COMMIT;');
    release();
    return getMatchById(matchId);
  } catch (error) {
    await query('ROLLBACK;').catch(() => {});
    release();
    throw error;
  }
};
