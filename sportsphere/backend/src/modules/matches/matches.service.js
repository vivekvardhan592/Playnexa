import * as matchesRepo from './matches.repository.js';
import { logSecurityEvent } from '../../utils/logger.js';

export const joinMatch = async (matchId, userId, req) => {
  try {
    const updatedMatch = await matchesRepo.joinMatchAtomicTransaction(matchId, userId);
    logSecurityEvent('MATCH_JOINED_SUCCESS', userId, { matchId, newCount: updatedMatch.current_players }, req);
    return updatedMatch;
  } catch (error) {
    if (error.message.startsWith('MATCH_FULL')) {
      throw { statusCode: 422, code: 'MATCH_FULL', message: 'This game lobby is full.' };
    }
    if (error.message.startsWith('ALREADY_JOINED')) {
      throw { statusCode: 409, code: 'ALREADY_JOINED', message: 'You have already joined this match.' };
    }
    throw error;
  }
};
