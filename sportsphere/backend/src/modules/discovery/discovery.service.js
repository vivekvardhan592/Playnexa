import * as discoveryRepo from './discovery.repository.js';

// Deterministic Match Scoring Engine
export const calculateExplainableMatchScore = (athlete, targetSport, targetSkill, maxDistanceKm) => {
  let score = 50; // Base score
  const reasons = [];

  // 1. Skill Compatibility (35%)
  if (athlete.skill_level === targetSkill || athlete.level === targetSkill) {
    score += 35;
    reasons.push(`Exact skill level match (${targetSkill})`);
  } else {
    score += 20;
    reasons.push(`Compatible skill level`);
  }

  // 2. Distance Proximity (25%)
  const dist = athlete.distance_km || athlete.distanceKm || 1.5;
  if (dist <= 2) {
    score += 25;
    reasons.push(`Only ${dist.toFixed ? dist.toFixed(1) : dist} km away (Nearby neighborhood)`);
  } else if (dist <= maxDistanceKm) {
    score += 15;
    reasons.push(`Within requested radius (${dist.toFixed ? dist.toFixed(1) : dist} km)`);
  }

  // 3. Reliability & Show-up Rating (15%)
  const attendance = athlete.attendance_rate_pct || athlete.attendancePct || 94;
  if (attendance >= 90) {
    score += 15;
    reasons.push(`Proven ${attendance}% attendance score`);
  }

  // Cap at 99%
  const finalScore = Math.min(99, Math.max(60, score));

  return {
    ...athlete,
    matchScore: finalScore,
    reasons,
  };
};

export const discoverAthletes = async ({ longitude = 78.38, latitude = 17.44, radiusKm = 10, sport, skill }) => {
  const radiusMeters = radiusKm * 1000;
  const rawAthletes = await discoveryRepo.findNearbyAthletesPostGIS({ longitude, latitude, radiusMeters, sportName: sport, skillLevel: skill });

  const scoredResults = rawAthletes.map((a) =>
    calculateExplainableMatchScore(a, sport || 'Badminton', skill || 'Intermediate', radiusKm)
  );

  scoredResults.sort((a, b) => b.matchScore - a.matchScore);

  return scoredResults;
};
