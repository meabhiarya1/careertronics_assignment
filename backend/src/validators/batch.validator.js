import {
  BATCH_LIST_DEFAULTS,
  BATCH_MODE,
  BATCH_STATUS,
  MAX_PAGE_LIMIT,
  MAX_SEARCH_LENGTH,
  SORT_ORDER,
  SORTABLE_FIELDS,
} from '../constants/batch.constants.js';
import { ApiError } from '../utils/ApiError.js';
import { parseEnum, parseInteger, parseString } from './primitives.js';

const throwIfInvalid = (errors) => {
  if (errors.length > 0) {
    throw ApiError.badRequest('Invalid request parameters', errors);
  }
};

/** Validates + normalises `GET /batches` query params, applying defaults. */
export function parseListBatchesQuery(query) {
  const errors = [];

  const parsed = {
    search: parseString(query.search, { field: 'search', maxLength: MAX_SEARCH_LENGTH }, errors),
    status: parseEnum(query.status, { field: 'status', allowed: Object.values(BATCH_STATUS) }, errors),
    mode: parseEnum(query.mode, { field: 'mode', allowed: Object.values(BATCH_MODE) }, errors),
    sortBy: parseEnum(
      query.sortBy,
      { field: 'sortBy', allowed: SORTABLE_FIELDS, fallback: BATCH_LIST_DEFAULTS.sortBy },
      errors,
    ),
    order: parseEnum(
      query.order,
      { field: 'order', allowed: Object.values(SORT_ORDER), fallback: BATCH_LIST_DEFAULTS.order },
      errors,
    ),
    page: parseInteger(query.page, { field: 'page', min: 1, fallback: BATCH_LIST_DEFAULTS.page }, errors),
    limit: parseInteger(
      query.limit,
      { field: 'limit', min: 1, max: MAX_PAGE_LIMIT, fallback: BATCH_LIST_DEFAULTS.limit },
      errors,
    ),
  };

  throwIfInvalid(errors);
  return parsed;
}

/** Validates `GET /batches/:id` route params. */
export function parseBatchIdParams(params) {
  const errors = [];
  const id = parseInteger(params.id, { field: 'id', min: 1 }, errors);
  throwIfInvalid(errors);
  return { id };
}
