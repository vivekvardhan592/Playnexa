import * as chatService from './chat.service.js';
import { sendSuccess } from '../../utils/response.js';

// GET /api/v1/chat/conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.getConversationsService(req.user.athleteId);
    return sendSuccess(res, { conversations }, 'Conversations retrieved.');
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/chat/conversations — Get or create DM conversation
export const startConversation = async (req, res, next) => {
  try {
    const { otherAthleteId } = req.body;
    const result = await chatService.getOrCreateConversationService(req.user.athleteId, otherAthleteId);
    return sendSuccess(res, result, 'Conversation ready.', 200);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/chat/conversations/:conversationId/messages
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit, before } = req.query;
    const messages = await chatService.getMessageHistoryService(conversationId, req.user.athleteId, { limit, before });
    return sendSuccess(res, { messages, count: messages.length }, 'Message history retrieved.');
  } catch (err) {
    next(err);
  }
};
