import { pool } from '../../config/postgres.js';

const client = await pool.connect();
try {
  const r1 = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('conversations','messages')`
  );
  console.log('Existing tables:', r1.rows);

  const r2 = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'conversations' ORDER BY ordinal_position`
  );
  console.log('conversations columns:', r2.rows);

  const r3 = await client.query(
    `SELECT indexname FROM pg_indexes WHERE tablename = 'conversations'`
  );
  console.log('conversations indexes:', r3.rows);
} finally {
  client.release();
  await pool.end();
}
