import express from 'express';
import * as athletesController from './athletes.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', requireAuth, athletesController.getMyProfile);
router.patch('/me', requireAuth, athletesController.updateProfile);
router.patch('/me/location', requireAuth, athletesController.updateLocation);

router.post('/me/sports', requireAuth, athletesController.addOrUpdateSport);
router.delete('/me/sports/:sportId', requireAuth, athletesController.removeSport);

router.get('/:id', athletesController.getPublicProfile);

export default router;
