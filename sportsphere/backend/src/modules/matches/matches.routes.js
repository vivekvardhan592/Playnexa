import express from 'express';
import * as matchesController from './matches.controller.js';
import { optionalAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/radar', optionalAuth, matchesController.findRadarMatches);
router.post('/create', optionalAuth, matchesController.createMatch);

router.get('/:id', optionalAuth, matchesController.getMatchById);
router.post('/:id/join', optionalAuth, matchesController.joinMatch);
router.post('/:id/leave', optionalAuth, matchesController.leaveMatch);

export default router;
