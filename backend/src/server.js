import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[server] Batch API listening on http://localhost:${config.port} (${config.env})`);
});

const shutdown = (signal) => {
  console.log(`[server] ${signal} received, shutting down gracefully`);
  server.close(() => process.exit(0));
  // Force-exit if open connections keep the server alive too long.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
