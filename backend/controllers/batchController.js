import { validateBatchQuery } from '../validators/batchQueryValidator.js';

// Handles HTTP requests for batches. It reads the request, calls the
// service and sends the JSON response. Errors go to the error handler.
export class BatchController {
  constructor(batchService) {
    this.batchService = batchService;
  }

  // GET /api/batches?page=1&limit=5&search=&status=&centre=
  getBatches = (req, res) => {
    const query = validateBatchQuery(req.query);
    const { data, pagination } = this.batchService.getBatches(query);

    res.status(200).json({ success: true, data, pagination });
  };

  // GET /api/batches/centres
  getCentres = (req, res) => {
    const centres = this.batchService.getCentres();

    res.status(200).json({ success: true, data: centres });
  };
}
