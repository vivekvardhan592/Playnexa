import express from 'express';
import * as eventsRepo from './events.repository.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const athleteId = req.user?.athleteId || null;
    const events = await eventsRepo.getAllEvents(athleteId);
    return sendSuccess(res, { events, count: events.length }, 'Events list retrieved.');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const event = await eventsRepo.getEventById(req.params.id, req.user?.athleteId || null);
    if (!event) {
      return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
    }
    return sendSuccess(res, { event }, 'Event retrieved.');
  } catch (err) {
    next(err);
  }
});

router.post('/create', requireAuth, async (req, res, next) => {
  try {
    const newEvent = await eventsRepo.createEvent({
      ...req.body,
      organizerId: req.user.id,
    });
    return sendSuccess(res, { event: newEvent }, 'Event created successfully.', 201);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/register', requireAuth, async (req, res, next) => {
  try {
    const result = await eventsRepo.registerForEvent(req.params.id, req.user.athleteId);
    return sendSuccess(res, result, 'Registered for event in database.');
  } catch (err) {
    next(err);
  }
});

router.post('/:id/leave', requireAuth, async (req, res, next) => {
  try {
    const result = await eventsRepo.leaveEvent(req.params.id, req.user.athleteId);
    return sendSuccess(res, result, 'Unregistered from event in database.');
  } catch (err) {
    next(err);
  }
});

export default router;
