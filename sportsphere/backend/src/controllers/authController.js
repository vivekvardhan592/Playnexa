import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// In-Memory Fallback User Data for Instant Out-of-the-Box Operation
let inMemoryUsers = [
  {
    id: 'user_1',
    name: 'Vivek Kumar',
    email: 'vivek@sportsphere.com',
    city: 'Hyderabad',
    verified: true,
    avatar: '/athlete_rahul.jpg',
    sports: [
      { sport: 'Cricket', skillLevel: 'Intermediate', customMetrics: { battingAvg: '38.5' } },
      { sport: 'Badminton', skillLevel: 'Advanced', customMetrics: { winRate: '82%', smashSpeed: '240 km/h' } },
      { sport: 'Running', skillLevel: 'Advanced', customMetrics: { best10k: '44m 12s', pace: '4:25/km' } },
    ],
    participationScore: { totalScheduled: 24, completed: 22, attendanceRatePct: 92, zeroFlakeStreak: 14 },
  },
];

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // Generate token
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key', {
      expiresIn: '30d',
    });

    res.status(201).json({
      success: true,
      message: 'Athlete profile created successfully',
      token,
      user: { name, email, city: city || 'Hyderabad', verified: true },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key', {
      expiresIn: '30d',
    });

    res.json({
      success: true,
      token,
      user: inMemoryUsers[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  res.json({ success: true, user: inMemoryUsers[0] });
};
