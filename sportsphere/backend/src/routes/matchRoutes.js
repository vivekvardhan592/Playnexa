import express from 'express';
import { searchMatchRadar, createMatch, joinMatch } from '../controllers/matchController.js';

const router = express.Router();

router.get('/radar', searchMatchRadar);
router.post('/create', createMatch);
router.post('/:matchId/join', joinMatch);

export default router;
