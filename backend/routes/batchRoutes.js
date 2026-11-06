import { Router } from 'express';

export function createBatchRoutes(batchController) {
  const router = Router();

  router.get('/', batchController.getBatches);
  router.get('/centres', batchController.getCentres);

  return router;
}
