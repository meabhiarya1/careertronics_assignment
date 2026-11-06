import { Router } from 'express';
import { createBatchRouter } from './batch.routes.js';

export function createApiRouter({ batchController }) {
  const router = Router();
  router.use('/batches', createBatchRouter(batchController));
  return router;
}
