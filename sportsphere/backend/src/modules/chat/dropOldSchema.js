import { pool } from '../../config/postgres.js';

// One-time schema correction: drop old conversations/messages and recreate with correct columns
const client = await pool.connect();
try {
  console.log('Dropping old conversations and messages tables (CASCADE)...');
  await client.query('DROP TABLE IF EXISTS messages CASCADE;');
  await client.query('DROP TABLE IF EXISTS conversations CASCADE;');
  console.log('✅ Old tables dropped.');
} finally {
  client.release();
  await pool.end();
}
