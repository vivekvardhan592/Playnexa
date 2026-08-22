import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/authRoutes.js';
import athleteRoutes from './src/routes/athleteRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io Real-Time Event Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Connect Database
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());

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
    service: 'SportSphere Backend API Service',
    timestamp: new Date().toISOString(),
  });
});

// Socket.io Connection & Event Handling
io.on('connection', (socket) => {
  console.log(`[Socket Connected]: ${socket.id}`);

  // Real-time direct message event
  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
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
  console.log(`🚀 [SportSphere Server] Running on http://localhost:${PORT}`);
});
