import { describe, it, expect } from 'vitest';
import { encodeIndices, decodeIndices } from '../src/js/lib/url-helpers.js';
import config from '../src/_data/config.js';

describe('URL encode/decode round-trip', () => {
  it('round-trips all four selection types', () => {
    const staffingId = config.staffingLevels[1].id;       // "1fte-1pte"
    const digitalIdx = 2;
    const physicalIdx = 3;
    const cityIds = [config.cities[0].id, config.cities[2].id]; // ["providence", "millville"]

    const params = encodeIndices(config, staffingId, digitalIdx, physicalIdx, cityIds);
    const decoded = decodeIndices(config, params);

    expect(decoded.staffingIdx).toBe(1);
    expect(decoded.digitalIdx).toBe(2);
    expect(decoded.physicalIdx).toBe(3);
    expect(decoded.cityIndices).toEqual([0, 2]);
  });

  it('out-of-bounds staffing index falls back to null', () => {
    const params = new URLSearchParams('pi=99');
    const decoded = decodeIndices(config, params);
    expect(decoded.staffingIdx).toBeNull();
  });

  it('out-of-bounds digital index falls back to null', () => {
    const params = new URLSearchParams('delta=99');
    const decoded = decodeIndices(config, params);
    expect(decoded.digitalIdx).toBeNull();
  });

  it('out-of-bounds physical index falls back to null', () => {
    const params = new URLSearchParams('tau=99');
    const decoded = decodeIndices(config, params);
    expect(decoded.physicalIdx).toBeNull();
  });

  it('empty params decode to all defaults', () => {
    const params = new URLSearchParams('');
    const decoded = decodeIndices(config, params);
    expect(decoded.staffingIdx).toBeNull();
    expect(decoded.digitalIdx).toBeNull();
    expect(decoded.physicalIdx).toBeNull();
    expect(decoded.cityIndices).toEqual([]);
  });

  it('non-numeric param values fall back to null', () => {
    const params = new URLSearchParams('pi=abc&delta=xyz&tau=!!');
    const decoded = decodeIndices(config, params);
    expect(decoded.staffingIdx).toBeNull();
    expect(decoded.digitalIdx).toBeNull();
    expect(decoded.physicalIdx).toBeNull();
  });
});
