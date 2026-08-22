import { logSecurityEvent } from '../utils/logger.js';

let sampleMatches = [
  {
    id: 'match_1',
    title: 'Badminton Doubles Evening Game',
    sport: 'Badminton',
    requiredSkillLevel: 'Intermediate',
    locationName: 'Madhapur Indoor Sports Complex',
    distanceKm: 1.2,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    maxPlayers: 4,
    currentPlayers: 3,
    joinedAthleteIds: ['user_rahul', 'user_arjun', 'user_siddharth'],
    creatorId: 'user_rahul',
    status: 'OPEN',
    reasoning: ['Same sport & skill match', '1.2 km away from Gachibowli', 'High 94% show-up rating'],
  },
  {
    id: 'match_2',
    title: 'Weekend 7v7 Turf Football',
    sport: 'Football',
    requiredSkillLevel: 'Intermediate',
    locationName: 'AstroTurf Hitec City',
    distanceKm: 2.1,
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    maxPlayers: 14,
    currentPlayers: 12,
    joinedAthleteIds: ['user_vikram', 'user_rahul'],
    creatorId: 'user_vikram',
    status: 'OPEN',
    reasoning: ['2 midfielder spots left', 'Weekend morning schedule match'],
  },
];

// Helper for resource ownership verification
export const getMatchOwnerId = async (req) => {
  const match = sampleMatches.find((m) => m.id === req.params.id || m.id === req.params.matchId);
  return match ? match.creatorId : null;
};

export const searchMatchRadar = async (req, res) => {
  try {
    const { sport, level, maxDistance } = req.query;

    let results = [...sampleMatches];
    if (sport && sport !== 'All') {
      results = results.filter((m) => m.sport === sport);
    }
    if (maxDistance) {
      results = results.filter((m) => m.distanceKm <= Number(maxDistance));
    }

    res.json({
      success: true,
      count: results.length,
      matches: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMatch = async (req, res) => {
  try {
    const { title, sport, requiredSkillLevel, locationName, distanceKm, maxPlayers } = req.body;
    const creatorId = req.user ? req.user.id : 'user_1';

    const newMatch = {
      id: `match_${Date.now()}`,
      title,
      sport,
      requiredSkillLevel: requiredSkillLevel || 'Intermediate',
      locationName,
      distanceKm: distanceKm || 1.0,
      scheduledAt: new Date().toISOString(),
      maxPlayers: maxPlayers || 4,
      currentPlayers: 1,
      joinedAthleteIds: [creatorId],
      creatorId,
      status: 'OPEN',
      reasoning: ['Created by verified local athlete'],
    };

    sampleMatches.unshift(newMatch);

    logSecurityEvent('MATCH_CREATED', creatorId, { matchId: newMatch.id, sport, title }, req);

    res.status(201).json({
      success: true,
      message: 'Match created on SportSphere Match Radar',
      match: newMatch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Concurrency-Safe & Idempotent Match Joining Engine
export const joinMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user ? req.user.id : 'user_1';

    const match = sampleMatches.find((m) => m.id === matchId);

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // 1. Check idempotency: Prevent duplicate joins
    if (match.joinedAthleteIds && match.joinedAthleteIds.includes(userId)) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: You are already registered as a participant in this match.',
      });
    }

    // 2. Concurrency check: Ensure capacity lock
    if (match.currentPlayers >= match.maxPlayers) {
      match.status = 'FULL';
      return res.status(422).json({
        success: false,
        message: 'Capacity Limit Exceeded: Match lobby is full.',
      });
    }

    // Atomic update simulation
    match.currentPlayers += 1;
    if (!match.joinedAthleteIds) match.joinedAthleteIds = [];
    match.joinedAthleteIds.push(userId);

    if (match.currentPlayers === match.maxPlayers) {
      match.status = 'FULL';
    }

    logSecurityEvent('MATCH_JOINED', userId, { matchId: match.id, currentPlayers: match.currentPlayers }, req);

    res.json({
      success: true,
      message: `Successfully joined match: ${match.title}`,
      match,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMatch = async (req, res) => {
  const { id } = req.params;
  sampleMatches = sampleMatches.filter((m) => m.id !== id);

  logSecurityEvent('MATCH_DELETED', req.user?.id, { matchId: id }, req);

  res.json({
    success: true,
    message: 'Match lobby cancelled successfully',
  });
};
