import express from 'express';
import { checkDatabaseHealth } from '../config/postgres.js';
import { env } from '../config/env.js';

const router = express.Router();

// Liveness Probe: Returns HTTP 200 if the process is running
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SportSphere Backend Core Service',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    requestId: req.requestId,
  });
});

// Readiness Probe: Returns HTTP 200 if DB is connected, or 503 if DB is unreachable
router.get('/health/ready', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();

  if (dbHealth.healthy) {
    return res.json({
      status: 'READY',
      database: 'PostgreSQL + PostGIS Connected',
      dbTime: dbHealth.time,
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  } else {
    return res.status(503).json({
      status: 'NOT_READY',
      database: 'UNREACHABLE',
      error: dbHealth.error,
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  }
});

export default router;
