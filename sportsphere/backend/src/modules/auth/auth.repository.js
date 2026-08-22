import { query, getTransactionClient } from '../../config/postgres.js';

export const findUserByEmail = async (email) => {
  const res = await query('SELECT * FROM users WHERE email = $1;', [email.toLowerCase().trim()]);
  return res.rows[0] || null;
};

export const findUserById = async (userId) => {
  const res = await query(
    `SELECT u.id, u.email, u.role, u.is_verified, u.created_at,
            a.id as athlete_id, a.display_name, a.bio, a.city, a.area, a.attendance_rate_pct, a.zero_flake_streak
     FROM users u
     LEFT JOIN athletes a ON u.id = a.user_id
     WHERE u.id = $1;`,
    [userId]
  );
  return res.rows[0] || null;
};

export const createUserWithAthleteProfile = async ({ email, hashedPassword, role = 'ATHLETE', name, city = 'Hyderabad', area = 'Gachibowli' }) => {
  const { client, query, release } = await getTransactionClient();

  try {
    await query('BEGIN;');

    // 1. Insert user
    const userRes = await query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, is_verified, created_at;',
      [email.toLowerCase().trim(), hashedPassword, role]
    );
    const newUser = userRes.rows[0];

    // 2. Insert corresponding athlete profile
    const athleteRes = await query(
      `INSERT INTO athletes (user_id, display_name, city, area)
       VALUES ($1, $2, $3, $4)
       RETURNING id as athlete_id, display_name, city, area, attendance_rate_pct, zero_flake_streak;`,
      [newUser.id, name, city, area]
    );

    await query('COMMIT;');
    release();

    return {
      ...newUser,
      athlete: athleteRes.rows[0],
    };
  } catch (error) {
    await query('ROLLBACK;').catch(() => {});
    release();
    throw error;
  }
};
