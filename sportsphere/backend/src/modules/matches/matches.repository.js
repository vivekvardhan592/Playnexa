import { query, getTransactionClient } from '../../config/postgres.js';

// Transaction-Safe Concurrency-Protected Match Join Engine
export const joinMatchAtomicTransaction = async (matchId, athleteId) => {
  const { client, query, release } = await getTransactionClient();

  try {
    // 1. BEGIN Transaction
    await query('BEGIN;');

    // 2. Lock match row using SELECT ... FOR UPDATE (Prevents race condition overbooking)
    const matchRes = await query('SELECT * FROM matches WHERE id = $1 FOR UPDATE;', [matchId]);
    const match = matchRes.rows[0];

    if (!match) {
      await query('ROLLBACK;');
      release();
      throw new Error('MATCH_NOT_FOUND: Match lobby does not exist.');
    }

    // 3. Check capacity limit
    if (match.current_players >= match.capacity) {
      await query('ROLLBACK;');
      release();
      throw new Error('MATCH_FULL: Capacity limit reached for this game lobby.');
    }

    // 4. Check duplicate registration (UNIQUE constraint validation)
    const participantRes = await query(
      'SELECT id FROM match_participants WHERE match_id = $1 AND athlete_id = $2;',
      [matchId, athleteId]
    );

    if (participantRes.rows.length > 0) {
      await query('ROLLBACK;');
      release();
      throw new Error('ALREADY_JOINED: You are already a registered participant in this match.');
    }

    // 5. Insert participant record
    await query(
      'INSERT INTO match_participants (match_id, athlete_id, status) VALUES ($1, $2, $3);',
      [matchId, athleteId, 'JOINED']
    );

    // 6. Update current_players count & status atomically
    const newCount = match.current_players + 1;
    const newStatus = newCount >= match.capacity ? 'FULL' : 'OPEN';

    const updatedMatchRes = await query(
      'UPDATE matches SET current_players = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *;',
      [newCount, newStatus, matchId]
    );

    // 7. COMMIT Transaction
    await query('COMMIT;');
    release();

    return updatedMatchRes.rows[0];
  } catch (error) {
    await query('ROLLBACK;').catch(() => {});
    release();
    throw error;
  }
};
