// Athlete Controller — Handles Multi-Sport Identity & Local Discovery
const SAMPLE_ATHLETES = [
  {
    id: 'rahul',
    name: 'Rahul S.',
    sport: 'Badminton',
    level: 'Intermediate',
    distanceKm: 1.2,
    availability: 'Available Today',
    matchScore: 96,
    verified: true,
    avatar: '/athlete_rahul.jpg',
    attendancePct: 94,
    sessionsCount: 28,
    reasons: ['Same sport & level (Badminton Doubles)', '1.2 km away · Available 6 PM Today'],
  },
  {
    id: 'priya',
    name: 'Priya M.',
    sport: 'Running',
    level: 'Advanced',
    distanceKm: 0.8,
    availability: 'Available Today',
    matchScore: 98,
    verified: true,
    avatar: '/athlete_priya.jpg',
    attendancePct: 98,
    sessionsCount: 42,
    reasons: ['0.8 km near KBR Park track', '10K Morning Runner · 6:00 AM'],
  },
  {
    id: 'arjun',
    name: 'Arjun K.',
    sport: 'Badminton',
    level: 'Intermediate',
    distanceKm: 2.1,
    availability: 'Available Today',
    matchScore: 91,
    verified: true,
    avatar: '/athlete_arjun.jpg',
    attendancePct: 92,
    sessionsCount: 31,
    reasons: ['2.1 km away in Madhapur', 'Looking for doubles court partner'],
  },
];

export const getNearbyAthletes = async (req, res) => {
  try {
    const { sport, maxDistance } = req.query;

    let filtered = [...SAMPLE_ATHLETES];
    if (sport && sport !== 'All') {
      filtered = filtered.filter((a) => a.sport === sport);
    }
    if (maxDistance) {
      filtered = filtered.filter((a) => a.distanceKm <= Number(maxDistance));
    }

    res.json({
      success: true,
      count: filtered.length,
      athletes: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSportProfile = async (req, res) => {
  try {
    const { sport, skillLevel, customMetrics } = req.body;
    res.json({
      success: true,
      message: `Sport profile updated for ${sport}`,
      updatedSport: { sport, skillLevel, customMetrics },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
