import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log(`⚡ [Socket.IO Connected]: ${socket.id}`);
    });

    socket.on('connect_error', (err) => {
      console.warn(`[Socket Notice]: Real-time fallback active (${err.message})`);
    });
  }
  return socket;
};

export const subscribeToMessages = (callback) => {
  const s = initSocket();
  s.on('receive_message', callback);
  return () => s.off('receive_message', callback);
};

export const sendSocketMessage = (data) => {
  const s = initSocket();
  s.emit('send_message', data);
};

export const subscribeToMatchPings = (callback) => {
  const s = initSocket();
  s.on('new_match_ping', callback);
  return () => s.off('new_match_ping', callback);
};

export const emitMatchCreated = (matchData) => {
  const s = initSocket();
  s.emit('match_created', matchData);
};
