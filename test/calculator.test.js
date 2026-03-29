import { describe, it, expect } from 'vitest';
import { calculatePerHousehold } from '../src/js/lib/calculator-helpers.js';

describe('calculatePerHousehold', () => {
  it('divides total cost by households', () => {
    // 230000 + 15000 + 10000 = 255000 / 6314
    expect(calculatePerHousehold(230000, 15000, 10000, 6314)).toBeCloseTo(255000 / 6314, 5);
  });
  it('returns null for zero households', () => {
    expect(calculatePerHousehold(230000, 15000, 10000, 0)).toBeNull();
  });
  it('handles all-zeros except households', () => {
    expect(calculatePerHousehold(0, 0, 0, 1000)).toBe(0);
  });
  it('handles single-city scenario', () => {
    // 150000 + 5000 + 0 = 155000 / 2823
    expect(calculatePerHousehold(150000, 5000, 0, 2823)).toBeCloseTo(155000 / 2823, 5);
  });
});
