import * as matchesRepo from './matches.repository.js';

export const createMatchService = async (creatorId, matchData) => {
  const { sportId, title, description, skillLevel = 'Any', longitude, latitude, locationName, city = 'Hyderabad', scheduledAt, capacity } = matchData;

  if (!sportId || !title || !locationName || !scheduledAt || !capacity) {
    const error = new Error('Missing required fields: sportId, title, locationName, scheduledAt, capacity.');
    error.statusCode = 422;
    error.code = 'MISSING_REQUIRED_FIELDS';
    throw error;
  }

  const cap = parseInt(capacity, 10);
  if (isNaN(cap) || cap < 2 || cap > 100) {
    const error = new Error('Capacity must be an integer between 2 and 100 players.');
    error.statusCode = 422;
    error.code = 'INVALID_CAPACITY';
    throw error;
  }

  const lon = parseFloat(longitude || 78.38);
  const lat = parseFloat(latitude || 17.44);

  return await matchesRepo.createMatch({
    creatorId,
    sportId,
    title,
    description,
    skillLevel,
    longitude: lon,
    latitude: lat,
    locationName,
    city,
    scheduledAt,
    capacity: cap,
  });
};

export const getMatchByIdService = async (matchId) => {
  const match = await matchesRepo.getMatchById(matchId);
  if (!match) {
    const error = new Error('Match lobby not found.');
    error.statusCode = 404;
    error.code = 'MATCH_NOT_FOUND';
    throw error;
  }
  return match;
};

export const findRadarMatchesService = async (filters) => {
  return await matchesRepo.findRadarMatches(filters);
};

export const joinMatchService = async (matchId, athleteId) => {
  return await matchesRepo.joinMatchAtomic(matchId, athleteId);
};

export const leaveMatchService = async (matchId, athleteId) => {
  return await matchesRepo.leaveMatchAtomic(matchId, athleteId);
};
