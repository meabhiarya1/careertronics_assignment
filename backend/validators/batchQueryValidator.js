import { BATCH_STATUSES, DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants/batchConstants.js';
import { ApiError } from '../utils/ApiError.js';

function toText(value) {
  return value === undefined ? '' : String(value).trim();
}

function toPositiveNumber(value, fieldName, defaultValue) {
  const text = toText(value);
  if (text === '') return defaultValue;

  const number = Number(text);
  if (!Number.isInteger(number) || number < 1) {
    throw new ApiError(400, `${fieldName} must be a positive whole number`);
  }
  return number;
}

// Reads the query string (?page=&limit=&search=&status=&centre=),
// fills in defaults and rejects invalid values with a 400 error.
export function validateBatchQuery(query) {
  const page = toPositiveNumber(query.page, 'page', DEFAULT_PAGE);
  const limit = toPositiveNumber(query.limit, 'limit', DEFAULT_LIMIT);

  if (limit > MAX_LIMIT) {
    throw new ApiError(400, `limit cannot be more than ${MAX_LIMIT}`);
  }

  const status = toText(query.status);
  const isKnownStatus = BATCH_STATUSES.some((item) => item.toLowerCase() === status.toLowerCase());

  if (status && !isKnownStatus) {
    throw new ApiError(400, `status must be one of: ${BATCH_STATUSES.join(', ')}`);
  }

  return {
    search: toText(query.search),
    status,
    centre: toText(query.centre),
    page,
    limit,
  };
}
