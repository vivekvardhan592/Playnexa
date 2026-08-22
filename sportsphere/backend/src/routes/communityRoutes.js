import express from 'express';
import { getCommunityPosts, createPost, togglePostReaction, addComment } from '../controllers/communityController.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.get('/feed', getCommunityPosts);
router.post('/post', requireAuth, createRateLimiter, createPost);
router.post('/post/:postId/react', requireAuth, togglePostReaction);
router.post('/post/:postId/comment', requireAuth, addComment);

export default router;
