import express from 'express';
import { searchMatchRadar, createMatch, joinMatch, deleteMatch, getMatchOwnerId } from '../controllers/matchController.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireResourceOwner } from '../middleware/authorization.middleware.js';
import { validateMatchCreation } from '../middleware/validation.middleware.js';
import { createRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.get('/radar', searchMatchRadar);
router.post('/create', requireAuth, createRateLimiter, validateMatchCreation, createMatch);
router.post('/:matchId/join', requireAuth, joinMatch);
router.delete('/:id', requireAuth, requireResourceOwner(getMatchOwnerId), deleteMatch);

export default router;
