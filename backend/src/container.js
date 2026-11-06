import { BatchController } from './controllers/batch.controller.js';
import { BatchRepository } from './repositories/batch.repository.js';
import { BatchService } from './services/batch.service.js';

/**
 * Composition root: the single place where dependencies are constructed and
 * wired together via constructor injection.
 */
export function createContainer({ batches }) {
  const batchRepository = new BatchRepository(batches);
  const batchService = new BatchService(batchRepository);
  const batchController = new BatchController(batchService);

  return { batchController };
}
