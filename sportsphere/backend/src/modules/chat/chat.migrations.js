import { pool } from '../../config/postgres.js';

export const runChatMigrations = async () => {
  const client = await pool.connect();
  try {
    // Create conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        participant_one UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        participant_two UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (participant_one, participant_two),
        CHECK (participant_one < participant_two)
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON conversations(participant_one);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON conversations(participant_two);`);

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        content TEXT NOT NULL CHECK (char_length(content) <= 2000),
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = false;`);

    console.log('[Chat Migrations] ✅ conversations + messages tables ready.');
  } catch (err) {
    console.error('[Chat Migrations] ❌ Error:', err.message);
    throw err;
  } finally {
    client.release();
  }
};
