import { ApiError } from '../utils/ApiError.js';

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * Central error handler. Known ApiErrors are returned as-is; anything else is
 * logged and returned as a generic 500 so internal details never leak.
 */
// Express identifies error middleware by its 4-argument signature, so `_next` must stay.
export function errorHandler(err, _req, res, _next) {
  const isKnownError = err instanceof ApiError;

  if (!isKnownError) {
    console.error('[unhandled-error]', err);
  }

  const statusCode = isKnownError ? err.statusCode : 500;
  const message = isKnownError ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isKnownError && err.details ? { details: err.details } : {}),
    },
  });
}
