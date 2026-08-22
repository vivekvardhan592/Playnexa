import express from 'express';
import { getMessageThread, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/messages', getMessageThread);
router.post('/send', sendMessage);

export default router;
