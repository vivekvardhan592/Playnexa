import * as matchesRepo from './matches.repository.js';

export const createMatchService = async (creatorId, matchData) => {
  let { sportId, title, description, skillLevel = 'Any', longitude, latitude, locationName, city = 'Hyderabad', scheduledAt, capacity } = matchData;

  if (!title) {
    const error = new Error('Match title is required.');
    error.statusCode = 422;
    error.code = 'MISSING_REQUIRED_FIELDS';
    throw error;
  }

  if (!sportId) sportId = '22222222-2222-2222-2222-222222222222';
  if (!locationName) locationName = 'Gachibowli Indoor Sports Complex';
  if (!scheduledAt) scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  if (!capacity) capacity = 4;

  const cap = Math.max(2, Math.min(100, parseInt(capacity, 10) || 4));
  const lon = parseFloat(longitude || 78.38);
  const lat = parseFloat(latitude || 17.44);

  return await matchesRepo.createMatch({
    creatorId,
    sportId,
    title,
    description: description || 'Casual game lobby created on SportSphere.',
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
