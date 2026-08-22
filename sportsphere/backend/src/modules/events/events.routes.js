import express from 'express';
import * as eventsRepo from './events.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const events = await eventsRepo.getAllEvents();
    return sendSuccess(res, { events, count: events.length }, 'Events list retrieved.');
  } catch (err) {
    next(err);
  }
});

router.post('/create', requireAuth, async (req, res, next) => {
  try {
    const newEvent = await eventsRepo.createEvent({
      ...req.body,
      creatorId: req.user.athleteId,
    });
    return sendSuccess(res, { event: newEvent }, 'Event created successfully.', 201);
  } catch (err) {
    next(err);
  }
});

export default router;
