import * as athletesService from './athletes.service.js';
import { sendSuccess } from '../../utils/response.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await athletesService.getAthleteProfile(req.user.athleteId);
    return sendSuccess(res, { athlete: profile }, 'Athlete profile retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await athletesService.getAthleteProfile(req.params.id);
    return sendSuccess(res, { athlete: profile }, 'Public athlete profile retrieved.');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await athletesService.updateAthleteProfileService(req.user.athleteId, req.body);
    return sendSuccess(res, { athlete: updated }, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    const location = await athletesService.updateAthleteLocationService(req.user.athleteId, { longitude, latitude });
    return sendSuccess(res, { location }, 'PostGIS spatial location updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateSport = async (req, res, next) => {
  try {
    const athleteSport = await athletesService.addOrUpdateSportService(req.user.athleteId, req.body);
    return sendSuccess(res, { sport: athleteSport }, 'Multi-sport identity updated successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const removeSport = async (req, res, next) => {
  try {
    await athletesService.removeSportService(req.user.athleteId, req.params.sportId);
    return sendSuccess(res, {}, 'Sport removed from athlete profile.');
  } catch (error) {
    next(error);
  }
};
