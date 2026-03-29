import { describe, it, expect } from 'vitest';
import config from '../src/_data/config.js';

describe('config structure', () => {
  describe('staffingLevels', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(config.staffingLevels)).toBe(true);
      expect(config.staffingLevels.length).toBeGreaterThanOrEqual(1);
    });
    it('every level has required shape', () => {
      config.staffingLevels.forEach(level => {
        expect(typeof level.id).toBe('string');
        expect(typeof level.label).toBe('string');
        expect(typeof level.annualCost).toBe('number');
        expect(level.annualCost).toBeGreaterThan(0);
        expect(Array.isArray(level.schedule)).toBe(true);
        expect(level.schedule.length).toBeGreaterThanOrEqual(1);
      });
    });
    it('exactly one has isCurrentServiceLevel true', () => {
      const current = config.staffingLevels.filter(l => l.isCurrentServiceLevel === true);
      expect(current).toHaveLength(1);
    });
  });

  describe('collectionsDigital', () => {
    it('options is a non-empty array', () => {
      expect(Array.isArray(config.collectionsDigital.options)).toBe(true);
      expect(config.collectionsDigital.options.length).toBeGreaterThanOrEqual(1);
    });
    it('every option has value and description', () => {
      config.collectionsDigital.options.forEach(opt => {
        expect(typeof opt.value).toBe('number');
        expect(opt.value).toBeGreaterThanOrEqual(0);
        expect(typeof opt.description).toBe('string');
      });
    });
    it('exactly one has isCurrentServiceLevel true', () => {
      const current = config.collectionsDigital.options.filter(o => o.isCurrentServiceLevel === true);
      expect(current).toHaveLength(1);
    });
  });

  describe('collectionsPhysical', () => {
    it('options is a non-empty array', () => {
      expect(Array.isArray(config.collectionsPhysical.options)).toBe(true);
      expect(config.collectionsPhysical.options.length).toBeGreaterThanOrEqual(1);
    });
    it('every option has value and description', () => {
      config.collectionsPhysical.options.forEach(opt => {
        expect(typeof opt.value).toBe('number');
        expect(opt.value).toBeGreaterThanOrEqual(0);
        expect(typeof opt.description).toBe('string');
      });
    });
    it('exactly one has isCurrentServiceLevel true', () => {
      const current = config.collectionsPhysical.options.filter(o => o.isCurrentServiceLevel === true);
      expect(current).toHaveLength(1);
    });
  });

  describe('cities', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(config.cities)).toBe(true);
      expect(config.cities.length).toBeGreaterThanOrEqual(1);
    });
    it('every city has required shape', () => {
      config.cities.forEach(city => {
        expect(typeof city.id).toBe('string');
        expect(typeof city.label).toBe('string');
        expect(typeof city.households).toBe('number');
        expect(city.households).toBeGreaterThan(0);
        expect(typeof city.defaultChecked).toBe('boolean');
      });
    });
  });
});
