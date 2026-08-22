import express from 'express';
import * as authController from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRegistration, validateLogin } from '../../middleware/validation.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/register', authRateLimiter, validateRegistration, authController.register);
router.post('/login', authRateLimiter, validateLogin, authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

export default router;
