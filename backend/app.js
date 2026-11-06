import cors from 'cors';
import express from 'express';
import { BatchController } from './controllers/batchController.js';
import { batches } from './data/batches.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { createBatchRoutes } from './routes/batchRoutes.js';
import { BatchService } from './services/batchService.js';

// Builds the Express app. Tests can pass their own batch data.
export function createApp(batchData = batches) {
  const batchService = new BatchService(batchData);
  const batchController = new BatchController(batchService);

  const app = express();

  app.use(cors());

  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
  });

  app.use('/api/batches', createBatchRoutes(batchController));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
