---
phase: 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure
plan: "01"
subsystem: ui
tags: [javascript, esm, modules, refactor]

# Dependency graph
requires:
  - phase: 16-unit-tests
    provides: calculator-helpers.js and url-helpers.js pure functions extracted from IIFEs
provides:
  - calculator.js as flat ES module importing calculatePerHousehold
  - url.js as four-stage ES module importing encodeIndices/decodeIndices
  - index.html with type="module" script tags
affects: [future-browser-script-changes, url-encoding]

# Tech tracking
tech-stack:
  added: []
  patterns: [ES module browser scripts, import from lib/helpers, deferred module execution]

key-files:
  created: []
  modified:
    - src/js/calculator.js
    - src/js/url.js
    - src/index.html

key-decisions:
  - "ESM import in browser scripts closes the duplication gap from Phase 16 — browser scripts now call the same pure functions as unit tests"
  - "Module scripts are deferred by default — removed 'scripts at end of body' comment dependency, DOM is guaranteed ready"
  - "Defensive fallbacks added to getStaffingCost/getDigitalCost/getPhysicalCost (return 0 if element absent) per plan spec"
  - "Four-stage url.js structure: getCurrentSelections, encodeUrl, applySelections, restoreFromUrl — matches plan's D-05/D-06 design"

patterns-established:
  - "Browser JS as flat ES modules: no IIFE, strict mode implicit, top-level var for module-level state"
  - "Lib helpers pattern: pure functions in src/js/lib/*.js imported by both browser scripts and unit tests"

requirements-completed: [CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-07]

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 17 Plan 01: Migrate to Calculator Helpers and More Easily Testable Code Structure Summary

**calculator.js and url.js converted from IIFEs to flat ES modules importing pure helper functions extracted in Phase 16, eliminating logic duplication between browser scripts and unit tests**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-30T00:13:15Z
- **Completed:** 2026-03-30T00:14:44Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- calculator.js is now a flat ES module importing calculatePerHousehold from lib/calculator-helpers.js
- url.js is now a four-stage ES module importing encodeIndices/decodeIndices from lib/url-helpers.js
- index.html script tags updated to type="module" for both calculator.js and url.js
- All 21 existing unit tests pass unchanged; build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor calculator.js from IIFE to ES module** - `dfb4b39` (feat)
2. **Task 2: Refactor url.js to four-stage ES module and update index.html script tags** - `5ab4005` (feat)

## Files Created/Modified

- `src/js/calculator.js` - Rewritten as flat ES module; imports calculatePerHousehold, defensive getter fallbacks
- `src/js/url.js` - Rewritten as four-stage ES module; imports encodeIndices/decodeIndices
- `src/index.html` - Both script tags updated to type="module"

## Decisions Made

- ES module import in browser scripts closes the duplication gap from Phase 16 — browser scripts now call the same pure functions as unit tests
- Module scripts are deferred by default so the "scripts at end of body" requirement is naturally satisfied without a DOMContentLoaded wrapper
- Defensive fallbacks added to all three cost getters (return 0 if element absent) per plan spec D-03
- window.LIBRARY_DATA inline script left as classic (non-module) so it runs synchronously before deferred module scripts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Browser scripts and unit tests now share the same pure helper functions — single source of truth for calculation and URL encoding/decoding logic
- No blockers; all tests green and build clean

---
*Phase: 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure*
*Completed: 2026-03-30*
