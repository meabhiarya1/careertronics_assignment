import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { parseBatchIdParams, parseListBatchesQuery } from '../validators/batch.validator.js';

/** @param {import('../controllers/batch.controller.js').BatchController} batchController */
export function createBatchRouter(batchController) {
  const router = Router();

  router.get('/', validateRequest(parseListBatchesQuery, 'query'), batchController.list);
  // Must be registered before '/:id' so "stats" isn't treated as an id.
  router.get('/stats', batchController.getStats);
  router.get('/:id', validateRequest(parseBatchIdParams, 'params'), batchController.getById);

  return router;
}
