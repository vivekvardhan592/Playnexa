import express from 'express';
import * as communityRepo from './community.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = express.Router();

router.get('/feed', async (req, res, next) => {
  try {
    const posts = await communityRepo.getCommunityFeed();
    return sendSuccess(res, { posts, count: posts.length }, 'Community feed retrieved.');
  } catch (err) {
    next(err);
  }
});

router.post('/posts', requireAuth, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(422).json({ success: false, message: 'Content is required.' });
    }
    const post = await communityRepo.createCommunityPost(req.user.athleteId, content.trim());
    return sendSuccess(res, { post }, 'Post created successfully.', 201);
  } catch (err) {
    next(err);
  }
});

export default router;
