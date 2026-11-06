import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { createContainer } from './container.js';
import { batches as seedBatches } from './data/batches.data.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createApiRouter } from './routes/index.js';

/**
 * Builds the Express app without starting a server, so tests can mount it
 * directly (and inject their own data set).
 */
export function createApp({ batches = seedBatches } = {}) {
  const container = createContainer({ batches });
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, methods: ['GET'] }));
  if (!config.isTest) {
    app.use(morgan(config.isProduction ? 'combined' : 'dev'));
  }

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  app.use('/api/v1', createApiRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
