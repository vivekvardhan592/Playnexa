import { query } from '../../config/postgres.js';

export const findNearbyAthletes = async ({ longitude, latitude, radiusKm = 10, sport = 'All', skill = 'All', limit = 20, offset = 0 }) => {
  let whereClauses = [
    `ST_DWithin(a.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3 * 1000)`
  ];
  let params = [longitude, latitude, radiusKm];
  let paramIdx = 4;

  if (sport && sport !== 'All') {
    whereClauses.push(`s.name ILIKE $${paramIdx}`);
    params.push(sport);
    paramIdx++;
  }

  if (skill && skill !== 'All') {
    whereClauses.push(`asp.skill_level = $${paramIdx}`);
    params.push(skill);
    paramIdx++;
  }

  const whereSql = whereClauses.join(' AND ');

  const sql = `
    SELECT DISTINCT ON (a.id)
      a.id, a.display_name, a.bio, a.profile_image_url, a.city, a.area,
      a.attendance_rate_pct, a.zero_flake_streak,
      ST_Y(a.location::geometry) as latitude,
      ST_X(a.location::geometry) as longitude,
      (ST_Distance(a.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0) as distance_km,
      json_agg(
        json_build_object(
          'sport', s.name,
          'skillLevel', asp.skill_level,
          'sportData', asp.sport_data
        )
      ) OVER (PARTITION BY a.id) as sports
    FROM athletes a
    JOIN athlete_sports asp ON a.id = asp.athlete_id
    JOIN sports s ON asp.sport_id = s.id
    WHERE ${whereSql}
    ORDER BY a.id, distance_km ASC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1};
  `;

  params.push(limit, offset);

  const res = await query(sql, params);

  // Apply Deterministic Match Scoring Engine
  const scoredAthletes = res.rows.map((athlete) => {
    const dist = parseFloat(athlete.distance_km || 0);
    const attendance = athlete.attendance_rate_pct || 90;
    const streak = Math.min(athlete.zero_flake_streak || 0, 10);

    let rawScore = 100 - dist * 2.5 + attendance * 0.15 + streak * 0.8;
    const matchScore = Math.max(50, Math.min(99, Math.round(rawScore)));

    const matchReasons = [
      `${dist.toFixed(1)} km away near ${athlete.area || athlete.city}`,
      `${attendance}% reliable attendance record`,
    ];
    if (streak > 5) matchReasons.push(`${streak} zero-flake consecutive match streak`);

    return {
      ...athlete,
      distanceKm: parseFloat(dist.toFixed(1)),
      matchScore,
      matchReasons,
    };
  });

  // Sort by highest match score then closest distance
  scoredAthletes.sort((a, b) => b.matchScore - a.matchScore || a.distanceKm - b.distanceKm);

  return scoredAthletes;
};

export const explainDiscoveryQuery = async ({ longitude, latitude, radiusKm = 10 }) => {
  const sql = `
    EXPLAIN ANALYZE
    SELECT a.id, a.display_name,
           (ST_Distance(a.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0) as distance_km
    FROM athletes a
    WHERE ST_DWithin(a.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3 * 1000)
    LIMIT 20;
  `;
  const res = await query(sql, [longitude, latitude, radiusKm]);
  return res.rows.map((r) => r['QUERY PLAN']).join('\n');
};
