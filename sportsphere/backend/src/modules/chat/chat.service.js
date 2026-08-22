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
  const messages = await chatRepo.getMessageHistory(conversationId, Math.min(parseInt(limit, 10) || 50, 100), before);
  // Mark fetched messages as read
  await chatRepo.markMessagesRead(conversationId, athleteId);
  return messages;
};

export const getConversationsService = async (athleteId) => {
  return await chatRepo.getConversationsForAthlete(athleteId);
};
