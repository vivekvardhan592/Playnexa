import express from 'express';
import { getNearbyAthletes, updateSportProfile } from '../controllers/athleteController.js';

const router = express.Router();

router.get('/nearby', getNearbyAthletes);
router.put('/sports-profile', updateSportProfile);

export default router;
