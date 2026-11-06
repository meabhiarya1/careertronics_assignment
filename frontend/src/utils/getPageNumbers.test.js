import { describe, expect, it } from 'vitest';
import { getPageNumbers } from './getPageNumbers.js';

describe('getPageNumbers', () => {
  it('shows every page when there are 5 pages or fewer', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(4, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps the current page in the middle when there are many pages', () => {
    expect(getPageNumbers(7, 20)).toEqual([5, 6, 7, 8, 9]);
  });

  it('does not go below page 1 or above the last page', () => {
    expect(getPageNumbers(1, 20)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageNumbers(20, 20)).toEqual([16, 17, 18, 19, 20]);
  });

  it('returns no pages when there are no results', () => {
    expect(getPageNumbers(1, 0)).toEqual([]);
  });
});
