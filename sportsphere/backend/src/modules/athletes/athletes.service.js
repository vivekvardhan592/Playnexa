import * as athletesRepo from './athletes.repository.js';

export const getAthleteProfile = async (athleteId) => {
  const profile = await athletesRepo.getAthleteProfileById(athleteId);
  if (!profile) {
    const error = new Error('Athlete profile not found.');
    error.statusCode = 404;
    error.code = 'ATHLETE_NOT_FOUND';
    throw error;
  }
  return profile;
};

export const updateAthleteProfileService = async (athleteId, updateData) => {
  if (updateData.preferredRadiusKm && (updateData.preferredRadiusKm < 1 || updateData.preferredRadiusKm > 100)) {
    const error = new Error('Preferred discovery radius must be between 1 km and 100 km.');
    error.statusCode = 422;
    error.code = 'INVALID_RADIUS';
    throw error;
  }

  const updated = await athletesRepo.updateAthleteProfile(athleteId, updateData);
  return updated;
};

export const updateAthleteLocationService = async (athleteId, { longitude, latitude }) => {
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    const error = new Error('Valid numeric longitude and latitude coordinates are required.');
    error.statusCode = 422;
    error.code = 'INVALID_COORDINATES';
    throw error;
  }

  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    const error = new Error('Geographic coordinates out of valid WGS84 bounds.');
    error.statusCode = 422;
    error.code = 'COORDINATES_OUT_OF_BOUNDS';
    throw error;
  }

  return await athletesRepo.updateAthleteLocation(athleteId, { longitude, latitude });
};

export const addOrUpdateSportService = async (athleteId, { sportId, skillLevel, sportData }) => {
  const allowedSkills = ['Beginner', 'Intermediate', 'Advanced', 'Competitive'];
  if (!allowedSkills.includes(skillLevel)) {
    const error = new Error(`Invalid skill level. Allowed values: [${allowedSkills.join(', ')}]`);
    error.statusCode = 422;
    error.code = 'INVALID_SKILL_LEVEL';
    throw error;
  }

  return await athletesRepo.addOrUpdateAthleteSport(athleteId, { sportId, skillLevel, sportData });
};

export const removeSportService = async (athleteId, sportId) => {
  const removed = await athletesRepo.removeAthleteSport(athleteId, sportId);
  if (!removed) {
    const error = new Error('Sport not found in athlete profile.');
    error.statusCode = 404;
    error.code = 'SPORT_NOT_FOUND';
    throw error;
  }
  return removed;
};
