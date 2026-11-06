import { SEARCHABLE_FIELDS, SORT_ORDER } from '../constants/batch.constants.js';

const compareValues = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'en', { sensitivity: 'base', numeric: true });
};

/**
 * Data-access layer for batches.
 *
 * Backed by an in-memory array, but the public API mirrors a database query
 * (WHERE / ORDER BY / OFFSET / LIMIT + aggregates), so swapping in a real
 * database only requires changing this class.
 */
export class BatchRepository {
  #batches;

  constructor(batches) {
    if (!Array.isArray(batches)) {
      throw new TypeError('BatchRepository requires an array of batches');
    }
    this.#batches = batches;
  }

  /**
   * @param {object} criteria
   * @param {{ search?: string, status?: string, mode?: string }} [criteria.filters]
   * @param {{ field: string, order: 'asc' | 'desc' }} [criteria.sort]
   * @param {number} [criteria.offset]
   * @param {number} criteria.limit
   * @returns {Promise<{ items: object[], total: number }>}
   */
  async findMany({ filters = {}, sort, offset = 0, limit }) {
    const matched = this.#batches.filter((batch) => BatchRepository.#matchesFilters(batch, filters));
    const ordered = sort ? [...matched].sort(BatchRepository.#comparator(sort)) : matched;

    return {
      items: ordered.slice(offset, offset + limit),
      total: matched.length,
    };
  }

  async findById(id) {
    return this.#batches.find((batch) => batch.id === id) ?? null;
  }

  /** @returns {Promise<{ total: number, totalEnrolled: number, byStatus: Record<string, number> }>} */
  async getSummary() {
    return this.#batches.reduce(
      (summary, { status, enrolled }) => {
        summary.total += 1;
        summary.totalEnrolled += enrolled;
        summary.byStatus[status] = (summary.byStatus[status] ?? 0) + 1;
        return summary;
      },
      { total: 0, totalEnrolled: 0, byStatus: {} },
    );
  }

  static #matchesFilters(batch, { search, status, mode }) {
    if (status && batch.status !== status) return false;
    if (mode && batch.mode !== mode) return false;
    if (!search) return true;

    const term = search.toLowerCase();
    return SEARCHABLE_FIELDS.some((field) => String(batch[field]).toLowerCase().includes(term));
  }

  static #comparator({ field, order }) {
    const direction = order === SORT_ORDER.DESC ? -1 : 1;
    // Tie-break on id so pagination is stable when sort values are equal.
    return (a, b) => compareValues(a[field], b[field]) * direction || a.id - b.id;
  }
}
