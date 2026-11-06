import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate.js';

describe('formatDate', () => {
  it('formats an ISO date like the UI reference ("Mar 15, 2024")', () => {
    expect(formatDate('2024-03-15')).toBe('Mar 15, 2024');
  });

  it('does not shift the day because of time zones', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026');
  });
});
