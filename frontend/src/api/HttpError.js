/** Error thrown by HttpClient for network failures and non-2xx responses. */
export class HttpError extends Error {
  constructor(message, { status = 0, details, cause } = {}) {
    super(message, { cause });
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}
