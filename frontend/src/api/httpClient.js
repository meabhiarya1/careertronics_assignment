import { API_BASE_URL } from '../config/env.js';
import { HttpError } from './HttpError.js';

const isAbortError = (error) => error?.name === 'AbortError';

/**
 * Thin wrapper around fetch: builds URLs, drops empty query params, parses JSON
 * and normalises failures into HttpError with a user-presentable message.
 */
export class HttpClient {
  #baseUrl;

  constructor(baseUrl) {
    this.#baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * @param {string} path
   * @param {{ params?: Record<string, unknown>, signal?: AbortSignal }} [options]
   */
  async get(path, { params, signal } = {}) {
    let response;
    try {
      response = await fetch(this.#buildUrl(path, params), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal,
      });
    } catch (error) {
      if (isAbortError(error)) throw error;
      throw new HttpError('Unable to reach the server. Check your connection and try again.', {
        cause: error,
      });
    }

    const body = await HttpClient.#parseJson(response);

    if (!response.ok) {
      throw new HttpError(HttpClient.#errorMessage(response.status, body), {
        status: response.status,
        details: body?.error?.details,
      });
    }

    return body;
  }

  #buildUrl(path, params = {}) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    }
    const queryString = search.toString();
    return `${this.#baseUrl}${path}${queryString ? `?${queryString}` : ''}`;
  }

  static async #parseJson(response) {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) return null;

    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  static #errorMessage(status, body) {
    if (body?.error?.message) return body.error.message;
    if (status >= 500) return 'The server is unavailable right now. Please try again shortly.';
    return `Request failed with status ${status}.`;
  }
}

export const httpClient = new HttpClient(API_BASE_URL);
