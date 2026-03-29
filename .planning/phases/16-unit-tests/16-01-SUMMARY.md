---
phase: 16-unit-tests
plan: "01"
subsystem: testing
tags: [vitest, unit-tests, pure-functions, esm]

# Dependency graph
requires:
  - phase: 14-separate-digital-and-physical-collections
    provides: Two-slider model (collectionsDigital, collectionsPhysical) and url.js encode/decode logic
provides:
  - Vitest test suite covering config structure, calculator math, URL round-trip
  - calculator-helpers.js — pure ESM export of calculatePerHousehold
  - url-helpers.js — pure ESM exports of encodeIndices and decodeIndices
affects: [16-02-PLAN.md, future config edits]

# Tech tracking
tech-stack:
  added: [vitest@2.1.9, jsdom@26.1.0]
  patterns: [extract-pure-function-for-testability, tdd-green-from-start]

key-files:
  created:
    - vitest.config.js
    - src/js/lib/calculator-helpers.js
    - src/js/lib/url-helpers.js
    - test/config.test.js
    - test/calculator.test.js
    - test/url.test.js
  modified:
    - package.json

key-decisions:
  - "Vitest downgraded from 4.x to 2.x for Node 18 compatibility (node:util styleText missing in Node 18)"
  - "IIFEs in calculator.js and url.js left unchanged; pure helpers extracted as separate ESM modules"
  - "No DOM environment (jsdom) needed for tests — pure functions use no globals"

patterns-established:
  - "Extract pure function from IIFE: create src/js/lib/X-helpers.js with ESM exports, IIFE imports nothing"
  - "Config structure tests: validate shape contract so non-developer edits break tests if schema violated"

requirements-completed: [TEST-01, TEST-02, TEST-03, TEST-04, TEST-05, TEST-06]

# Metrics
duration: 3min
completed: 2026-03-29
---

# Phase 16 Plan 01: Unit Tests Summary

**Vitest 2.x test suite with 21 passing tests covering config schema validation, calculatePerHousehold math, and URL encode/decode round-trip via extracted pure ESM helpers**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-29T19:13:35Z
- **Completed:** 2026-03-29T19:16:30Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Installed Vitest 2.x (Node 18 compatible) and created vitest.config.js
- Extracted calculatePerHousehold as pure ESM function for testability (IIFEs unchanged)
- Extracted encodeIndices and decodeIndices as pure ESM functions for testability (IIFEs unchanged)
- 21 unit tests passing across 3 test files (config structure, calculator math, URL round-trip)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Vitest, create config, extract pure functions** - `48fcd9c` (feat)
2. **Task 2: Write unit tests for config, calculator, and URL round-trip** - `cd0a9da` (test)

**Plan metadata:** (docs commit to follow)

_Note: TDD task 2 was implemented alongside Task 1's infrastructure — tests pass from the start (green from first run)._

## Files Created/Modified
- `vitest.config.js` - Vitest configuration, node environment, no jsdom needed
- `src/js/lib/calculator-helpers.js` - Pure ESM export: calculatePerHousehold(staffingCost, digitalCost, physicalCost, households)
- `src/js/lib/url-helpers.js` - Pure ESM exports: encodeIndices, decodeIndices
- `test/config.test.js` - Config schema structure validation (11 tests)
- `test/calculator.test.js` - Tax math correctness (4 tests)
- `test/url.test.js` - URL encode/decode round-trip and bounds checking (6 tests)
- `package.json` - Added `"test": "vitest run"` script and vitest/jsdom devDependencies

## Decisions Made
- Downgraded Vitest from 4.x (latest) to 2.x to support Node 18 runtime (current environment). Node 18 lacks `styleText` in `node:util`, which Vitest 4.x requires. Vitest 2.1.9 runs cleanly on Node 18.
- IIFEs in calculator.js and url.js are left byte-identical — pure helpers live in a new `src/js/lib/` directory only for test consumption.
- No jsdom environment set in vitest.config.js — the extracted functions are pure and don't touch DOM globals.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Downgraded Vitest from 4.x to 2.x for Node 18 compatibility**
- **Found during:** Task 1 (Install Vitest)
- **Issue:** Vitest 4.x uses `styleText` from `node:util`, added in Node 20.12.0. The environment runs Node 18.20.7, causing `SyntaxError: The requested module 'node:util' does not provide an export named 'styleText'`
- **Fix:** Ran `pnpm add -D vitest@^2.0.0` which resolved to vitest@2.1.9 — compatible with Node 18
- **Files modified:** package.json, pnpm-lock.yaml
- **Verification:** `pnpm exec vitest run --passWithNoTests` exits 0
- **Committed in:** 48fcd9c (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required for any tests to run. No scope creep — same tool, older compatible version.

## Issues Encountered
None beyond the Vitest version incompatibility documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `pnpm test` is fully operational, all 21 tests green
- Plan 16-02 can proceed to add integration or additional tests as specified
- Config edits that break the schema contract will now fail CI

---
*Phase: 16-unit-tests*
*Completed: 2026-03-29*
