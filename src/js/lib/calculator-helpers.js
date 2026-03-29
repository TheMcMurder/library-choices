/**
 * Calculate per-household annual cost.
 * Extracted from calculator.js IIFE for testability.
 *
 * @param {number} staffingCost - annual staffing cost
 * @param {number} digitalCost  - annual digital collections budget
 * @param {number} physicalCost - annual physical collections budget
 * @param {number} households   - total selected households
 * @returns {number|null} per-household cost, or null if households === 0
 */
export function calculatePerHousehold(staffingCost, digitalCost, physicalCost, households) {
  if (households === 0) return null;
  return (staffingCost + digitalCost + physicalCost) / households;
}
