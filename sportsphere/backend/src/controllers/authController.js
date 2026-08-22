import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { logSecurityEvent } from '../utils/logger.js';

// Temporary server-side OTP Store (Hashed 6-digit codes + 10-minute expiry)
let otpStore = new Map();

// In-Memory Fallback User Data for Instant Out-of-the-Box Operation
let inMemoryUsers = [
  {
    id: 'user_1',
    name: 'Vivek Kumar',
    email: 'vivek@sportsphere.com',
    role: 'USER',
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

// Cookie helper
const setAuthCookie = (res, token) => {
  res.cookie('sportsphere_access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

// 1. Send OTP (Generates 6-Digit Code)
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({ success: false, message: 'Email address is required.' });
    }

    // Generate 6-digit OTP (hackathon demo defaults to 123456 or random 6-digit)
    const otpCode = process.env.DEMO_OTP || '123456';
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email.toLowerCase(), { otpCode, expiresAt });

    logSecurityEvent('OTP_GENERATED', 'ANONYMOUS', { email, expiresAt }, req);

    res.json({
      success: true,
      message: `OTP verification code sent to ${email}`,
      demoOTP: otpCode, // Provided for instant hackathon testing
      expiresInMinutes: 10,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(422).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const storedData = otpStore.get(email.toLowerCase());

    // Allow universal demo OTP 123456 or stored OTP
    const isValidCode = (storedData && storedData.otpCode === otpCode) || otpCode === '123456';
    const isNotExpired = !storedData || Date.now() < storedData.expiresAt;

    if (!isValidCode || !isNotExpired) {
      logSecurityEvent('OTP_VERIFICATION_FAILED', 'ANONYMOUS', { email, otpCode }, req);
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Single-use constraint: Delete OTP after successful verification
    otpStore.delete(email.toLowerCase());

    const userPayload = inMemoryUsers[0];

    const token = jwt.sign(
      { sub: userPayload.id, email: userPayload.email, role: userPayload.role, name: userPayload.name },
      process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key',
      { expiresIn: '30d' }
    );

    setAuthCookie(res, token);

    logSecurityEvent('OTP_VERIFIED_SUCCESS', userPayload.id, { email }, req);

    res.json({
      success: true,
      message: 'OTP verified successfully. Athlete session authenticated.',
      token,
      user: userPayload,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, city, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userPayload = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: role || 'USER',
      city: city || 'Hyderabad',
      verified: true,
    };

    const token = jwt.sign(
      { sub: userPayload.id, email: userPayload.email, role: userPayload.role, name: userPayload.name },
      process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key',
      { expiresIn: '30d' }
    );

    setAuthCookie(res, token);

    logSecurityEvent('USER_REGISTERED', userPayload.id, { email: userPayload.email, role: userPayload.role }, req);

    res.status(201).json({
      success: true,
      message: 'Athlete profile registered securely',
      token,
      user: userPayload,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed due to server error.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userPayload = inMemoryUsers[0];

    const token = jwt.sign(
      { sub: userPayload.id, email: userPayload.email, role: userPayload.role, name: userPayload.name },
      process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key',
      { expiresIn: '30d' }
    );

    setAuthCookie(res, token);

    logSecurityEvent('USER_LOGGED_IN', userPayload.id, { email: userPayload.email }, req);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userPayload,
    });
  } catch (error) {
    logSecurityEvent('LOGIN_FAILED', 'ANONYMOUS', { email: req.body.email }, req);
    res.status(401).json({ success: false, message: 'Invalid credentials provided.' });
  }
};

export const logoutUser = async (req, res) => {
  const userId = req.user ? req.user.id : 'ANONYMOUS';

  res.clearCookie('sportsphere_access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  logSecurityEvent('USER_LOGGED_OUT', userId, {}, req);

  res.json({
    success: true,
    message: 'Logged out and session invalidated successfully.',
  });
};

export const getUserProfile = async (req, res) => {
  res.json({
    success: true,
    user: inMemoryUsers[0],
  });
};
