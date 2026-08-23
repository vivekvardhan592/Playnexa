import * as matchesService from './matches.service.js';
import { sendSuccess } from '../../utils/response.js';

export const createMatch = async (req, res, next) => {
  try {
    const creatorId = req.user?.athleteId || req.user?.id || 'ed3e0581-b173-4e21-b2c8-6707d96b3ad2';
    const match = await matchesService.createMatchService(creatorId, req.body);
    return sendSuccess(res, { match }, 'Match lobby created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    const match = await matchesService.getMatchByIdService(req.params.id);
    return sendSuccess(res, { match }, 'Match details retrieved.');
  } catch (error) {
    next(error);
  }
};

export const findRadarMatches = async (req, res, next) => {
  try {
    const matches = await matchesService.findRadarMatchesService(req.query);
    return sendSuccess(res, { matches, count: matches.length }, 'Radar matches retrieved.');
  } catch (error) {
    next(error);
  }
};

export const joinMatch = async (req, res, next) => {
  try {
    const athleteId = req.user?.athleteId || req.user?.id || 'ed3e0581-b173-4e21-b2c8-6707d96b3ad2';
    const updatedMatch = await matchesService.joinMatchService(req.params.id, athleteId);
    return sendSuccess(res, { match: updatedMatch }, 'Joined match lobby successfully.');
  } catch (error) {
    next(error);
  }
};

export const leaveMatch = async (req, res, next) => {
  try {
    const athleteId = req.user?.athleteId || req.user?.id || 'ed3e0581-b173-4e21-b2c8-6707d96b3ad2';
    const result = await matchesService.leaveMatchService(req.params.id, athleteId);
    return sendSuccess(res, result, 'Left match lobby.');
  } catch (error) {
    next(error);
  }
};
