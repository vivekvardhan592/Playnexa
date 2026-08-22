import http from 'http';
import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectPostgres, closePostgresPool } from './src/config/postgres.js';

const server = http.createServer(app);

// Connect PostgreSQL connection pool
connectPostgres();

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`🚀 [SportSphere Modular Monolith Server] Running on http://localhost:${PORT} (${env.NODE_ENV})`);
});

// Graceful Shutdown Handler
const shutdownGracefully = (signal) => {
  console.log(`\n⚠️  [${signal}] Received. Initiating graceful shutdown...`);

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

  // Force close after 10 seconds timeout
  setTimeout(() => {
    console.error('⏱️ Graceful shutdown timed out. Forcing termination.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
