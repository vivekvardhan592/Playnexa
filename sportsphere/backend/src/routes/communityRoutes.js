import express from 'express';
import { getCommunityPosts, createPost, togglePostReaction, addComment } from '../controllers/communityController.js';

const router = express.Router();

router.get('/feed', getCommunityPosts);
router.post('/post', createPost);
router.post('/post/:postId/react', togglePostReaction);
router.post('/post/:postId/comment', addComment);

export default router;
