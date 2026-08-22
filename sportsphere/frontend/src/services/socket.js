import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket = null;

/**
 * Initialize Socket.IO with JWT auth token.
 * Called after login when we have a valid token.
 */
export const initSocket = (token) => {
  if (socket?.connected) return socket;

  // Disconnect stale socket if exists
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: { token },
  });

  socket.on('connect', () => {
    console.log(`⚡ [Socket.IO Connected]: ${socket.id}`);
  });

  socket.on('connect_error', (err) => {
    console.warn(`[Socket Notice]: Real-time fallback active (${err.message})`);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ── Chat Room Management ────────────────────────────────────────
export const joinConversation = (conversationId) => {
  if (socket) socket.emit('chat:join', { conversationId });
};

export const leaveConversation = (conversationId) => {
  if (socket) socket.emit('chat:leave', { conversationId });
};

// ── Messaging ───────────────────────────────────────────────────
export const sendSocketMessage = (conversationId, content) => {
  if (socket) socket.emit('chat:send_message', { conversationId, content });
};

export const subscribeToMessages = (callback) => {
  if (!socket) return () => {};
  socket.on('chat:new_message', callback);
  return () => socket.off('chat:new_message', callback);
};

// ── Typing Indicators ───────────────────────────────────────────
export const emitTyping = (conversationId, isTyping) => {
  if (socket) socket.emit('chat:typing', { conversationId, isTyping });
};

export const subscribeToTyping = (callback) => {
  if (!socket) return () => {};
  socket.on('chat:typing', callback);
  return () => socket.off('chat:typing', callback);
};

// ── Online Presence ─────────────────────────────────────────────
export const subscribeToPresence = (onOnline, onOffline) => {
  if (!socket) return () => {};
  socket.on('presence:online', onOnline);
  socket.on('presence:offline', onOffline);
  return () => {
    socket.off('presence:online', onOnline);
    socket.off('presence:offline', onOffline);
  };
};

// ── Match Radar Pings ───────────────────────────────────────────
export const subscribeToMatchPings = (callback) => {
  if (!socket) return () => {};
  socket.on('radar:new_match_ping', callback);
  return () => socket.off('radar:new_match_ping', callback);
};

export const emitMatchCreated = (matchData) => {
  if (socket) socket.emit('radar:ping', matchData);
};
