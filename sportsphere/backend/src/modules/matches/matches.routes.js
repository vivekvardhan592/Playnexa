import express from 'express';
import * as matchesController from './matches.controller.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/radar', optionalAuth, matchesController.findRadarMatches);
router.post('/create', requireAuth, matchesController.createMatch);

router.get('/:id', optionalAuth, matchesController.getMatchById);
router.post('/:id/join', requireAuth, matchesController.joinMatch);
router.post('/:id/leave', requireAuth, matchesController.leaveMatch);

export default router;
