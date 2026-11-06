/**
 * HTTP layer for batches: reads validated input from the request, delegates to
 * the service and serialises the response envelope. No business logic here.
 *
 * Handlers are arrow-function fields so they stay bound when passed to the router.
 * Express 5 forwards rejected promises to the error handler automatically.
 */
export class BatchController {
  #batchService;

  constructor(batchService) {
    this.#batchService = batchService;
  }

  list = async (req, res) => {
    const { items, pagination } = await this.#batchService.listBatches(req.validated.query);
    res.status(200).json({ success: true, data: items, meta: pagination });
  };

  getById = async (req, res) => {
    const batch = await this.#batchService.getBatchById(req.validated.params.id);
    res.status(200).json({ success: true, data: batch });
  };

  getStats = async (_req, res) => {
    const stats = await this.#batchService.getStats();
    res.status(200).json({ success: true, data: stats });
  };
}
