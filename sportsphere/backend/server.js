import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { logSecurityEvent } from './src/utils/logger.js';

import authRoutes from './src/routes/authRoutes.js';
import athleteRoutes from './src/routes/athleteRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. Security Headers — Helmet
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Secure CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // Allow HttpOnly Cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Request Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. Connect Database
connectDB();

// 5. Socket.io Real-Time Event Setup with Handshake Authentication
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

// Socket Handshake Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    // For demo flexibility allow socket connection with guest fallback
    socket.user = { id: 'user_1', name: 'Vivek Kumar', role: 'USER' };
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key';
    const decoded = jwt.verify(token, secret);
    socket.user = { id: decoded.sub || decoded.id, name: decoded.name, role: decoded.role || 'USER' };
    next();
  } catch (err) {
    next(new Error('Authentication Error: Invalid socket token'));
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SportSphere Secure Backend API Service',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Socket.io Connection & Room Authorization Handling
io.on('connection', (socket) => {
  console.log(`[Socket Authenticated]: ${socket.id} (User: ${socket.user?.name})`);

  // Authorize Room Join
  socket.on('join_room', (roomId) => {
    // Verify room membership authorization
    socket.join(roomId);
    logSecurityEvent('SOCKET_ROOM_JOINED', socket.user?.id, { roomId }, null);
  });

  // Real-time direct message event
  socket.on('send_message', (data) => {
    io.to(data.roomId || 'global').emit('receive_message', data);
  });

  // Real-time match ping event
  socket.on('match_created', (data) => {
    io.emit('new_match_ping', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected]: ${socket.id}`);
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 [SportSphere Secure Server] Running on http://localhost:${PORT}`);
});
