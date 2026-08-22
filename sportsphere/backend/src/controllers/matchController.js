// Match Controller — Handles Match Radar & Explainable Discovery Engine
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
    status: 'OPEN',
    reasoning: ['2 midfielder spots left', 'Weekend morning schedule match'],
  },
];

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
      status: 'OPEN',
      reasoning: ['Created by verified local athlete'],
    };

    sampleMatches.unshift(newMatch);

    res.status(201).json({
      success: true,
      message: 'Match created on SportSphere Match Radar',
      match: newMatch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = sampleMatches.find((m) => m.id === matchId);

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.currentPlayers < match.maxPlayers) {
      match.currentPlayers += 1;
      if (match.currentPlayers === match.maxPlayers) match.status = 'FULL';
    }

    res.json({
      success: true,
      message: `Joined match: ${match.title}`,
      match,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
