/**
 * Encode selections as URL parameter indices.
 * Extracted from url.js IIFE for testability.
 *
 * @param {object} data - config data with staffingLevels, collectionsDigital, collectionsPhysical, cities
 * @param {string} staffingId - selected staffing level id
 * @param {number} digitalValue - selected digital collections value
 * @param {number} physicalValue - selected physical collections value
 * @param {string[]} cityIds - array of selected city ids
 * @returns {URLSearchParams}
 */
export function encodeIndices(data, staffingId, digitalValue, physicalValue, cityIds) {
  var params = new URLSearchParams();
  var pi = data.staffingLevels.findIndex(function (l) { return l.id === staffingId; });
  if (pi !== -1) params.set('pi', String(pi));
  var delta = data.collectionsDigital.options.findIndex(function (o) { return o.value === digitalValue; });
  if (delta !== -1) params.set('delta', String(delta));
  var tau = data.collectionsPhysical.options.findIndex(function (o) { return o.value === physicalValue; });
  if (tau !== -1) params.set('tau', String(tau));
  var phi = cityIds.map(function (id) { return data.cities.findIndex(function (c) { return c.id === id; }); })
                   .filter(function (i) { return i !== -1; });
  if (phi.length) params.set('phi', phi.join(','));
  return params;
}

/**
 * Decode URL parameters back to selection indices with bounds checking.
 * Out-of-bounds or invalid values return null/empty (silent fallback).
 *
 * @param {object} data - config data
 * @param {URLSearchParams} params - URL search params to decode
 * @returns {{ staffingIdx: number|null, digitalIdx: number|null, physicalIdx: number|null, cityIndices: number[] }}
 */
export function decodeIndices(data, params) {
  var pi = params.get('pi');
  var staffingIdx = (pi !== null && !isNaN(+pi) && +pi >= 0 && +pi < data.staffingLevels.length)
    ? +pi : null;
  var delta = params.get('delta');
  var digitalIdx = (delta !== null && !isNaN(+delta) && +delta >= 0 && +delta < data.collectionsDigital.options.length)
    ? +delta : null;
  var tau = params.get('tau');
  var physicalIdx = (tau !== null && !isNaN(+tau) && +tau >= 0 && +tau < data.collectionsPhysical.options.length)
    ? +tau : null;
  var phi = params.get('phi');
  var cityIndices = phi ? phi.split(',').map(Number).filter(function (i) {
    return !isNaN(i) && i >= 0 && i < data.cities.length;
  }) : [];
  return { staffingIdx, digitalIdx, physicalIdx, cityIndices };
}
