import { query } from '../../config/postgres.js';

export const getAthleteProfileById = async (athleteId) => {
  const athleteRes = await query(
    `SELECT a.id, a.user_id, a.display_name, a.bio, a.profile_image_url, a.city, a.area,
            a.preferred_radius_km, a.attendance_rate_pct, a.zero_flake_streak,
            ST_Y(a.location::geometry) as latitude,
            ST_X(a.location::geometry) as longitude,
            a.created_at, a.updated_at,
            u.email, u.role, u.is_verified
     FROM athletes a
     JOIN users u ON a.user_id = u.id
     WHERE a.id = $1;`,
    [athleteId]
  );

  const athlete = athleteRes.rows[0];
  if (!athlete) return null;

  // Fetch sports
  const sportsRes = await query(
    `SELECT asp.id as athlete_sport_id, asp.skill_level, asp.sport_data, asp.created_at,
            s.id as sport_id, s.name as sport_name, s.slug as sport_slug, s.category
     FROM athlete_sports asp
     JOIN sports s ON asp.sport_id = s.id
     WHERE asp.athlete_id = $1;`,
    [athleteId]
  );

  return {
    ...athlete,
    sports: sportsRes.rows,
  };
};

export const updateAthleteProfile = async (athleteId, { displayName, bio, city, area, preferredRadiusKm }) => {
  const res = await query(
    `UPDATE athletes
     SET display_name = COALESCE($1, display_name),
         bio = COALESCE($2, bio),
         city = COALESCE($3, city),
         area = COALESCE($4, area),
         preferred_radius_km = COALESCE($5, preferred_radius_km),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *;`,
    [displayName || null, bio || null, city || null, area || null, preferredRadiusKm || null, athleteId]
  );
  return res.rows[0];
};

export const updateAthleteLocation = async (athleteId, { longitude, latitude }) => {
  const res = await query(
    `UPDATE athletes
     SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id, display_name, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude;`,
    [longitude, latitude, athleteId]
  );
  return res.rows[0];
};

export const addOrUpdateAthleteSport = async (athleteId, { sportId, skillLevel, sportData = {} }) => {
  const res = await query(
    `INSERT INTO athlete_sports (athlete_id, sport_id, skill_level, sport_data)
     VALUES ($1, $2, $3, $4::jsonb)
     ON CONFLICT (athlete_id, sport_id)
     DO UPDATE SET skill_level = EXCLUDED.skill_level,
                   sport_data = EXCLUDED.sport_data,
                   updated_at = CURRENT_TIMESTAMP
     RETURNING *;`,
    [athleteId, sportId, skillLevel, JSON.stringify(sportData)]
  );
  return res.rows[0];
};

export const removeAthleteSport = async (athleteId, sportId) => {
  const res = await query(
    `DELETE FROM athlete_sports
     WHERE athlete_id = $1 AND sport_id = $2
     RETURNING id;`,
    [athleteId, sportId]
  );
  return res.rows[0] || null;
};
