import * as discoveryRepo from './discovery.repository.js';

export const getNearbyAthletesService = async ({ longitude, latitude, radiusKm = 10, sport = 'All', skill = 'All', limit = 20, offset = 0 }) => {
  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);
  const rad = parseFloat(radiusKm);
  const lim = parseInt(limit, 10);
  const off = parseInt(offset, 10);

  if (isNaN(lon) || isNaN(lat)) {
    const error = new Error('Invalid numeric longitude and latitude geographic query parameters.');
    error.statusCode = 422;
    error.code = 'INVALID_COORDINATES';
    throw error;
  }

  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
    const error = new Error('Geographic coordinates out of valid WGS84 bounds (-180..180, -90..90).');
    error.statusCode = 422;
    error.code = 'COORDINATES_OUT_OF_BOUNDS';
    throw error;
  }

  if (isNaN(rad) || rad < 1 || rad > 100) {
    const error = new Error('Search radiusKm must be a number between 1 km and 100 km.');
    error.statusCode = 422;
    error.code = 'INVALID_RADIUS';
    throw error;
  }

  const athletes = await discoveryRepo.findNearbyAthletes({
    longitude: lon,
    latitude: lat,
    radiusKm: rad,
    sport,
    skill,
    limit: Math.min(lim || 20, 50),
    offset: Math.max(off || 0, 0),
  });

  return {
    athletes,
    count: athletes.length,
    filters: { longitude: lon, latitude: lat, radiusKm: rad, sport, skill, limit: lim, offset: off },
  };
};

export const getExplainAnalyzeService = async ({ longitude = 78.38, latitude = 17.44, radiusKm = 10 }) => {
  return await discoveryRepo.explainDiscoveryQuery({ longitude, latitude, radiusKm });
};
