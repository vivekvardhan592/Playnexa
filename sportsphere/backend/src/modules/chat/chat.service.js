import * as chatRepo from './chat.repository.js';

export const getOrCreateConversationService = async (myAthleteId, otherAthleteId) => {
  if (!otherAthleteId) {
    const err = new Error('otherAthleteId is required.');
    err.statusCode = 422;
    err.code = 'MISSING_RECIPIENT';
    throw err;
  }

  if (myAthleteId === otherAthleteId) {
    const err = new Error('Cannot create a conversation with yourself.');
    err.statusCode = 400;
    err.code = 'SELF_CONVERSATION';
    throw err;
  }

  const conversationId = await chatRepo.getOrCreateConversation(myAthleteId, otherAthleteId);
  return { conversationId };
};

export const getMessageHistoryService = async (conversationId, athleteId, { limit = 50, before = null } = {}) => {
  const isParticipant = await chatRepo.isConversationParticipant(conversationId, athleteId);
  if (!isParticipant) {
    const error = new Error('You are not a participant in this conversation.');
    error.statusCode = 403;
    error.code = 'CONVERSATION_ACCESS_DENIED';
    throw error;
  }
  const messages = await chatRepo.getMessageHistory(conversationId, Math.min(parseInt(limit, 10) || 50, 100), before);
  // Mark fetched messages as read
  await chatRepo.markMessagesRead(conversationId, athleteId);
  return messages;
};

export const sendMessageService = async (conversationId, athleteId, content) => {
  if (!conversationId || !content?.trim()) {
    const error = new Error('conversationId and content are required.');
    error.statusCode = 422;
    error.code = 'INVALID_MESSAGE';
    throw error;
  }
  if (content.trim().length > 2000) {
    const error = new Error('Message exceeds 2000 character limit.');
    error.statusCode = 422;
    error.code = 'MESSAGE_TOO_LONG';
    throw error;
  }
  if (!(await chatRepo.isConversationParticipant(conversationId, athleteId))) {
    const error = new Error('You are not a participant in this conversation.');
    error.statusCode = 403;
    error.code = 'CONVERSATION_ACCESS_DENIED';
    throw error;
  }
  return chatRepo.saveMessage({ conversationId, senderId: athleteId, content: content.trim() });
};

export const getConversationsService = async (athleteId) => {
  return await chatRepo.getConversationsForAthlete(athleteId);
};
