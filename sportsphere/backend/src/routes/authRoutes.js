import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, sendOTP, verifyOTP } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/send-otp', authRateLimiter, sendOTP);
router.post('/verify-otp', authRateLimiter, verifyOTP);
router.post('/register', authRateLimiter, validateRegistration, registerUser);
router.post('/login', authRateLimiter, validateLogin, loginUser);
router.post('/logout', requireAuth, logoutUser);
router.get('/profile', requireAuth, getUserProfile);

export default router;
