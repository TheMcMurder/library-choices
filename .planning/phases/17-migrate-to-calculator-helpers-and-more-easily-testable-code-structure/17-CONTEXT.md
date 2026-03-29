# Phase 17: migrate to calculator helpers and more easily testable code structure - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Update `calculator.js` and `url.js` browser scripts to call the already-extracted helper functions (`calculator-helpers.js`, `url-helpers.js`) instead of duplicating the logic inline. Convert both scripts from classic `<script>` tags to `type="module"` so they can import the helpers. Restructure both files to match a four-stage model: (1) pull from DOM/URL, (2) map to values via helpers, (3) calculate via helpers, (4) main function wiring it all together. Closes the gap from Phase 16 where helpers were extracted for testing but the browser scripts were not updated to use them.

</domain>

<decisions>
## Implementation Decisions

### Script Loading

- **D-01:** Convert both `<script src="/js/calculator.js">` and `<script src="/js/url.js">` in `src/index.html` to `<script type="module" src="...">`. This allows the scripts to use `import` statements to load from `src/js/lib/`. No bundler added — native browser module loading is sufficient.

### IIFE Removal

- **D-02:** Drop the `(function() { 'use strict'; ... }())` IIFE wrappers from both scripts. Module scope replaces the scope isolation the IIFE provided. Code becomes flat, top-level module functions.

### calculator.js Structure

- **D-03:** Keep DOM-reading functions (`getStaffingCost`, `getDigitalCost`, `getPhysicalCost`, `getTotalHouseholds`) as module-level private functions. Each must return a value with a defensive fallback (e.g., `return el ? parseInt(el.dataset.cost, 10) : 0`) so a missing DOM element doesn't cascade. These are DOM-coupled and not exported.
- **D-04:** `updateResult()` calls `calculatePerHousehold()` from `calculator-helpers.js` for the math, passing values returned by the getters. No inline math formula in `updateResult()`.

### url.js Structure

- **D-05:** Split into a clear four-stage model:
  1. **Pull DOM state** — private functions read current form selections (staffing ID, digital value, physical value, city IDs) and return plain values. DOM-coupled.
  2. **Encode** — calls `encodeIndices(data, staffingId, digitalValue, physicalValue, cityIds)` from `url-helpers.js` to produce URLSearchParams.
  3. **Pull URL params** — read raw `URLSearchParams` from `location.search`.
  4. **Decode and restore** — calls `decodeIndices(data, params)` from `url-helpers.js`, then applies returned indices to form elements.
- **D-06:** The DOM-applying step (writing decoded indices back to form elements) remains a private module function — it's inherently DOM-coupled and not testable without a fixture.

### Claude's Discretion

- Exact function names for the new DOM-reading helpers in url.js (e.g., `getCurrentSelections()`, `applySelections(indices)`)
- Whether to keep `updateSliderLabels` / `updateAllSliderLabels` as-is or reorganize (scope is to preserve behavior, not redesign it)
- Order of exports/imports within each file
- Whether to add any additional defensive fallbacks beyond zero/null for missing DOM state

</decisions>

<specifics>
## Specific Ideas

- "Each getter should return a value with fallback values. If each getter is isolated then the failure states are minimized because the methods can return fallback values." — pattern for getStaffingCost, getDigitalCost, getPhysicalCost, getTotalHouseholds.
- Four-stage model explicitly requested: (1) Pull URL params, (2) Map URL params to values, (3) Calculate, (4) main function that weaves it all together.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to Modify
- `src/index.html` — contains the `<script>` tags to convert to `type="module"`
- `src/js/calculator.js` — IIFE to refactor into a flat module calling `calculatePerHousehold`
- `src/js/url.js` — IIFE to refactor into four-stage module calling `encodeIndices` / `decodeIndices`

### Helpers (already exist, read before modifying callers)
- `src/js/lib/calculator-helpers.js` — `calculatePerHousehold(staffingCost, digitalCost, physicalCost, households)` — pure ESM export
- `src/js/lib/url-helpers.js` — `encodeIndices(data, staffingId, digitalValue, physicalValue, cityIds)` and `decodeIndices(data, params)` — pure ESM exports

### Tests (must still pass after refactor)
- `test/calculator.test.js` — tests `calculatePerHousehold` directly; must still pass
- `test/url.test.js` — tests `encodeIndices`/`decodeIndices` directly; must still pass
- `test/config.test.js` — config shape tests; unaffected by this phase

### Project Config
- `package.json` — `"type": "module"` already set; no changes needed
- `src/_data/config.js` — browser receives this as `window.LIBRARY_DATA` via inline script; `calculator.js` and `url.js` still access it via `window.LIBRARY_DATA`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/js/lib/calculator-helpers.js` — already extracted; `calculatePerHousehold` is the single formula to import
- `src/js/lib/url-helpers.js` — already extracted; `encodeIndices` and `decodeIndices` are ready to import
- `src/_data/config.js` — pure ESM data file; browser receives it as `window.LIBRARY_DATA` via inline `<script>`

### Established Patterns
- `window.LIBRARY_DATA` is how config reaches browser scripts; `calculator.js` and `url.js` reference it as `var data = window.LIBRARY_DATA` — this pattern continues in Phase 17
- Tests already import the helpers directly via ESM; no test changes should be needed (helpers aren't changing, only callers)
- `pnpm run build` and `pnpm test` are the two commands that must continue to pass

### Integration Points
- `src/index.html` `<script>` tags — two tags need `type="module"` added; the inline `window.LIBRARY_DATA` script remains a classic script (it precedes the modules and sets a global)
- Form event listeners and DOM manipulation in `calculator.js` and `url.js` — behavior preserved; only structure changes

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure*
*Context gathered: 2026-03-29*
