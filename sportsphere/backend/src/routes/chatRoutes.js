import express from 'express';
import { getMessageThread, sendMessage } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateMessageSend } from '../middleware/validation.middleware.js';
import { createRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.get('/messages', requireAuth, getMessageThread);
router.post('/send', requireAuth, createRateLimiter, validateMessageSend, sendMessage);

export default router;
