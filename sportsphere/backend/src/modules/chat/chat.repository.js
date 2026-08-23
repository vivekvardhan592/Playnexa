import { query } from '../../config/postgres.js';

// Get or create a direct message conversation between two athletes
export const getOrCreateConversation = async (athleteId1, athleteId2) => {
  // Normalize order so (A,B) and (B,A) map to same row
  const [p1, p2] = [athleteId1, athleteId2].sort();

  const existing = await query(
    `SELECT id FROM conversations
     WHERE participant_one = $1 AND participant_two = $2;`,
    [p1, p2]
  );

  if (existing.rows.length > 0) return existing.rows[0].id;

  const created = await query(
    `INSERT INTO conversations (participant_one, participant_two)
     VALUES ($1, $2)
     RETURNING id;`,
    [p1, p2]
  );

  return created.rows[0].id;
};

// Persist a chat message to the database
export const saveMessage = async ({ conversationId, senderId, content }) => {
  const res = await query(
    `INSERT INTO messages (conversation_id, sender_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, conversation_id, sender_id, content, created_at, is_read;`,
    [conversationId, senderId, content]
  );

  return res.rows[0];
};

export const isConversationParticipant = async (conversationId, athleteId) => {
  const res = await query(
    `SELECT 1 FROM conversations WHERE id = $1 AND ($2 = participant_one OR $2 = participant_two);`,
    [conversationId, athleteId]
  );
  return res.rowCount > 0;
};

// Retrieve paginated message history for a conversation
export const getMessageHistory = async (conversationId, limit = 50, before = null) => {
  let sql, params;

  if (before) {
    sql = `
      SELECT m.id, m.sender_id, m.content, m.created_at, m.is_read,
             a.display_name as sender_name, a.profile_image_url as sender_avatar
      FROM messages m
      JOIN athletes a ON m.sender_id = a.id
      WHERE m.conversation_id = $1 AND m.created_at < $2
      ORDER BY m.created_at DESC
      LIMIT $3;
    `;
    params = [conversationId, before, limit];
  } else {
    sql = `
      SELECT m.id, m.sender_id, m.content, m.created_at, m.is_read,
             a.display_name as sender_name, a.profile_image_url as sender_avatar
      FROM messages m
      JOIN athletes a ON m.sender_id = a.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2;
    `;
    params = [conversationId, limit];
  }

  const res = await query(sql, params);
  return res.rows.reverse(); // Return chronological order
};

// Mark all unread messages in a conversation as read
export const markMessagesRead = async (conversationId, readerId) => {
  await query(
    `UPDATE messages
     SET is_read = true
     WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false;`,
    [conversationId, readerId]
  );
};

// Get all conversations for an athlete with last message preview
export const getConversationsForAthlete = async (athleteId) => {
  const res = await query(
    `SELECT
       c.id as conversation_id,
       CASE WHEN c.participant_one = $1 THEN c.participant_two ELSE c.participant_one END as other_athlete_id,
       a.display_name as other_name,
       a.profile_image_url as other_avatar,
       (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
       (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
       (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != $1 AND is_read = false) as unread_count
     FROM conversations c
     JOIN athletes a ON a.id = CASE WHEN c.participant_one = $1 THEN c.participant_two ELSE c.participant_one END
     WHERE c.participant_one = $1 OR c.participant_two = $1
     ORDER BY last_message_at DESC NULLS LAST;`,
    [athleteId]
  );
  return res.rows;
};
