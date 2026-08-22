import * as discoveryService from './discovery.service.js';
import { sendSuccess } from '../../utils/response.js';

export const getNearbyAthletes = async (req, res, next) => {
  try {
    const { longitude = 78.38, latitude = 17.44, radiusKm = 10, sport = 'All', skill = 'All', limit = 20, offset = 0 } = req.query;

    const result = await discoveryService.getNearbyAthletesService({
      longitude,
      latitude,
      radiusKm,
      sport,
      skill,
      limit,
      offset,
    });

    return sendSuccess(res, result, 'Nearby athletes discovered successfully.');
  } catch (error) {
    next(error);
  }
};

export const getExplainAnalyze = async (req, res, next) => {
  try {
    const { longitude = 78.38, latitude = 17.44, radiusKm = 10 } = req.query;
    const plan = await discoveryService.getExplainAnalyzeService({ longitude, latitude, radiusKm });
    return sendSuccess(res, { queryPlan: plan }, 'PostGIS query execution plan retrieved.');
  } catch (error) {
    next(error);
  }
};
