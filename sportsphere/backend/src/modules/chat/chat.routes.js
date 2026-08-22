import express from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import * as chatController from './chat.controller.js';

const router = express.Router();

// All chat REST endpoints require authentication
router.use(requireAuth);

router.get('/conversations', chatController.getConversations);
router.post('/conversations', chatController.startConversation);
router.get('/conversations/:conversationId/messages', chatController.getMessages);

export default router;
