import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import * as chatRepo from './chat.repository.js';

// In-memory online presence store: Map<athleteId, Set<socketId>>
const onlineAthletes = new Map();

const addOnline = (athleteId, socketId) => {
  if (!onlineAthletes.has(athleteId)) onlineAthletes.set(athleteId, new Set());
  onlineAthletes.get(athleteId).add(socketId);
};

const removeOnline = (athleteId, socketId) => {
  const sockets = onlineAthletes.get(athleteId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) onlineAthletes.delete(athleteId);
};

const isOnline = (athleteId) => onlineAthletes.has(athleteId);

export const getOnlineAthletes = () => Array.from(onlineAthletes.keys());

// JWT Auth middleware for Socket.IO handshake
const authenticateSocket = (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) return next(new Error('UNAUTHENTICATED: No token provided.'));

    const decoded = jwt.verify(token, env.JWT_SECRET);
    socket.user = {
      id: decoded.sub,
      athleteId: decoded.athleteId,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  } catch (err) {
    next(new Error('INVALID_TOKEN: Authentication token is invalid or expired.'));
  }
};

export const registerSocketHandlers = (io) => {
  // Apply JWT auth middleware to all socket connections
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const { athleteId, name } = socket.user;

    console.log(`[Socket.IO] Connected: ${name} (athleteId: ${athleteId}, socketId: ${socket.id})`);
    addOnline(athleteId, socket.id);

    // Broadcast updated online presence to all connected clients
    io.emit('presence:online', { athleteId, name, onlineCount: onlineAthletes.size });

    // ── JOIN CONVERSATION ROOM ─────────────────────────────────────
    // Client joins a room keyed by conversationId to receive DM events
    socket.on('chat:join', async ({ conversationId }) => {
      if (!conversationId) return;
      if (!(await chatRepo.isConversationParticipant(conversationId, athleteId))) {
        return socket.emit('chat:error', { message: 'Conversation access denied.' });
      }
      socket.join(`conv:${conversationId}`);
      console.log(`[Socket.IO] ${name} joined room conv:${conversationId}`);

      // Mark messages as read when entering conversation
      try {
        await chatRepo.markMessagesRead(conversationId, athleteId);
        socket.emit('chat:read_ack', { conversationId });
      } catch (err) {
        console.error('[Socket.IO] markMessagesRead error:', err.message);
      }
    });

    // ── LEAVE CONVERSATION ROOM ─────────────────────────────────────
    socket.on('chat:leave', ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(`conv:${conversationId}`);
      console.log(`[Socket.IO] ${name} left room conv:${conversationId}`);
    });

    // ── SEND MESSAGE ────────────────────────────────────────────────
    socket.on('chat:send_message', async ({ conversationId, content }) => {
      if (!conversationId || !content?.trim()) {
        return socket.emit('chat:error', { message: 'conversationId and content are required.' });
      }

      if (content.length > 2000) {
        return socket.emit('chat:error', { message: 'Message exceeds 2000 character limit.' });
      }

      try {
        if (!(await chatRepo.isConversationParticipant(conversationId, athleteId))) {
          return socket.emit('chat:error', { message: 'Conversation access denied.' });
        }
        // Persist to DB
        const message = await chatRepo.saveMessage({
          conversationId,
          senderId: athleteId,
          content: content.trim(),
        });

        const payload = {
          id: message.id,
          conversationId,
          senderId: athleteId,
          senderName: name,
          content: message.content,
          createdAt: message.created_at,
          isRead: false,
        };

        // Broadcast to all sockets in the conversation room (including sender)
        io.to(`conv:${conversationId}`).emit('chat:new_message', payload);

        console.log(`[Socket.IO] Message sent in conv:${conversationId} by ${name}`);
      } catch (err) {
        console.error('[Socket.IO] saveMessage error:', err.message);
        socket.emit('chat:error', { message: 'Failed to deliver message. Please retry.' });
      }
    });

    // ── TYPING INDICATOR ────────────────────────────────────────────
    socket.on('chat:typing', ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conv:${conversationId}`).emit('chat:typing', {
        athleteId,
        name,
        isTyping: !!isTyping,
        conversationId,
      });
    });

    // ── MATCH RADAR PING ────────────────────────────────────────────
    // Broadcast a "new match nearby" ping to all connected athletes
    socket.on('radar:ping', ({ matchId, sport, locationName, distance }) => {
      socket.broadcast.emit('radar:new_match_ping', {
        matchId,
        sport,
        locationName,
        distance,
        sentBy: name,
        sentAt: new Date().toISOString(),
      });
    });

    // ── DISCONNECT ──────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      removeOnline(athleteId, socket.id);
      io.emit('presence:offline', {
        athleteId,
        name,
        onlineCount: onlineAthletes.size,
        reason,
      });
      console.log(`[Socket.IO] Disconnected: ${name} (socketId: ${socket.id}, reason: ${reason})`);
    });
  });
};
