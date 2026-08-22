import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './modules/auth/auth.routes.js';
import athleteRoutes from './modules/athletes/athletes.routes.js';
import discoveryRoutes from './modules/discovery/discovery.routes.js';
import matchRoutes from './modules/matches/matches.routes.js';

const app = express();

// 1. Security Headers — Helmet
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production',
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS Configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  })
);

// 3. Body & Cookie Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. Request ID Tracing Middleware
app.use(requestIdMiddleware);

// 5. Basic Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] [${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// 6. Foundation Health Endpoints
app.use('/', healthRoutes);
app.use('/api', healthRoutes);

// 7. Phase 3 Authentication Domain Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes);

// 8. Phase 4 Athlete Profile Domain Routes
app.use('/api/v1/athletes', athleteRoutes);
app.use('/api/athletes', athleteRoutes);

// 9. Phase 5 Discovery Engine Domain Routes
app.use('/api/v1/discovery', discoveryRoutes);

// 10. Phase 6 Matches Lobbies Domain Routes
app.use('/api/v1/matches', matchRoutes);
app.use('/api/matches', matchRoutes);

// 11. Global Centralized Error Handler
app.use(errorHandler);

export default app;
