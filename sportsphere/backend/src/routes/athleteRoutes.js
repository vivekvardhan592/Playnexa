import express from 'express';
import { getNearbyAthletes, updateSportProfile } from '../controllers/athleteController.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/nearby', getNearbyAthletes);
router.put('/sports-profile', requireAuth, updateSportProfile);

export default router;
