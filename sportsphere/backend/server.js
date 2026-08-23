import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectPostgres, closePostgresPool } from './src/config/postgres.js';
import { runCoreMigrations } from './src/db/core.migrations.js';
import { runChatMigrations } from './src/modules/chat/chat.migrations.js';
import { registerSocketHandlers } from './src/modules/chat/chat.socket.js';

// 1. Create HTTP server from Express app
const server = http.createServer(app);

// 2. Attach Socket.IO to the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
});

// 3. Register all Socket.IO event handlers
registerSocketHandlers(io);

// 4. Connect PostgreSQL and run boot-time migrations
const bootstrap = async () => {
  await connectPostgres();
  await runCoreMigrations();
  await runChatMigrations();
};

bootstrap().catch((err) => {
  console.error('[Bootstrap Error]:', err.message);
});

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`🚀 [SportSphere Server] Running on http://localhost:${PORT} (${env.NODE_ENV})`);
  console.log(`🔌 [Socket.IO] Real-time chat & presence active on ws://localhost:${PORT}`);
});

// 5. Graceful Shutdown Handler
const shutdownGracefully = (signal) => {
  console.log(`\n⚠️  [${signal}] Received. Initiating graceful shutdown...`);

  io.close(() => {
    console.log('✅ Socket.IO closed.');
  });

  server.close(async () => {
    console.log('✅ HTTP server closed to new connections.');
    try {
      await closePostgresPool();
      console.log('🏁 Graceful shutdown complete. Exiting process.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during graceful shutdown:', err.message);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('⏱️ Graceful shutdown timed out. Forcing termination.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
