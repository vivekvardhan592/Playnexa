import { query } from '../../config/postgres.js';

export const getCommunityFeed = async () => {
  const res = await query(
    `SELECT cp.id, cp.content, cp.likes_count, cp.comments_count, cp.created_at,
            a.id as author_id, a.display_name as author_name, a.profile_image_url as author_avatar
     FROM community_posts cp
     JOIN athletes a ON cp.athlete_id = a.id
     ORDER BY cp.created_at DESC
     LIMIT 50;`
  );
  return res.rows;
};

export const createCommunityPost = async (athleteId, content) => {
  const res = await query(
    `INSERT INTO community_posts (athlete_id, content)
     VALUES ($1, $2)
     RETURNING *;`,
    [athleteId, content]
  );
  return res.rows[0];
};
