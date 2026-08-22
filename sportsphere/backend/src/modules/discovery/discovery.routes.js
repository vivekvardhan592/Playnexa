import express from 'express';
import * as discoveryController from './discovery.controller.js';

const router = express.Router();

router.get('/athletes', discoveryController.getNearbyAthletes);
router.get('/explain', discoveryController.getExplainAnalyze);

export default router;
