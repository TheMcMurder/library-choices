---
phase: 21-show-your-work-totals
plan: 01
subsystem: ui
tags: [vanilla-js, tailwind, dom, innerHTML, table]

requires: []
provides:
  - Two-line collapsed result bar showing per-household cost and total cost
  - Accounting-style formula popover with Hours Open / Digital / Physical breakdown
  - HTML table with tabular-nums alignment, border-blue-700 separator, Total and division equation

affects: []

tech-stack:
  added: []
  patterns:
    - innerHTML string-building for structured DOM output in calculator.js
    - Inner spans carry their own Tailwind classes; outer element className cleared

key-files:
  created: []
  modified:
    - src/js/calculator.js
    - test/config.test.js

key-decisions:
  - "Used innerHTML with inner <span> elements for two-line collapsed bar per UI-SPEC D-01"
  - "Used <table> with tabular-nums for accounting-style popover per D-05"
  - "Cleared resultAmount.className = '' on happy path to prevent class cascade onto inner spans"
  - "Fixed pre-existing config.test.js stale expectation ($15k → $10k) uncovered during pnpm test run"

patterns-established:
  - "resultAmount uses innerHTML with block spans for two-line display; textContent reserved for empty state"
  - "breakdownDetail uses innerHTML = '' (not textContent) for clearing, since it now holds HTML children"

requirements-completed:
  - D-01
  - D-02
  - D-03
  - D-04
  - D-05
  - D-06

duration: 15min
completed: 2026-04-15
---

# Phase 21: show-your-work-totals — Plan 01 Summary

**Two-line result bar (per-household + total) and accounting-style formula popover (Hours Open / Digital / Physical) replacing single-textContent writes in updateResult()**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-15T07:36:00Z
- **Completed:** 2026-04-15T07:41:00Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- `updateResult()` now writes `innerHTML` for `#result-amount` — two inner `<span>` elements: large `$X.XX/household/year` line and smaller `$X,XXX total` line in blue-200
- `#breakdown-detail` popover now renders an HTML `<table>` with Hours Open, Digital, Physical rows (right-aligned `tabular-nums` amounts), `border-blue-700` `<hr>` separator, semibold Total row, and division equation — all 3 rows always rendered even at $0
- Empty state correctly uses `textContent` for the message and `innerHTML = ''` to clear the popover (per D-02 pitfall)
- Fixed pre-existing stale test expectation in `test/config.test.js` (collectionsPhysical current service level $15k → $10k) uncovered during verification
- Human visual verification approved — two-line bar and formula popover confirmed on desktop

## Task Commits

1. **Task 1: Update updateResult() with two-line bar and formula popover** — `aa00858` (feat)
2. **Test fix: config.test.js stale expectation** — `b1459ad` (fix)

## Files Created/Modified

- `src/js/calculator.js` — updateResult() rewritten with innerHTML for bar and popover
- `test/config.test.js` — corrected collectionsPhysical current service level expectation

## Decisions Made

- Followed RESEARCH.md reference implementation exactly — no deviations
- Fixed stale test rather than ignoring it, since plan acceptance criterion requires `pnpm test` exits 0

## Deviations from Plan

### Auto-fixed Issues

**1. Stale test expectation in test/config.test.js**
- **Found during:** Task 1 verification (`pnpm test`)
- **Issue:** `config.test.js` expected `collectionsPhysical.isCurrentServiceLevel` to be $15,000, but config was updated in d35424e to mark $10,000 as current service level. Pre-existing failure unrelated to phase 21 changes.
- **Fix:** Updated test description and `toBe` value from 15000 to 10000
- **Files modified:** test/config.test.js
- **Verification:** `pnpm test` 72/72 passing
- **Committed in:** b1459ad

---

**Total deviations:** 1 auto-fixed (stale test)
**Impact on plan:** Fix was necessary to satisfy `pnpm test exits 0` acceptance criterion. No scope creep.

## Issues Encountered

None beyond the stale test — resolved as above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 21 display layer complete and human-verified
- All 72 tests passing
- No known blockers for next phase

---
*Phase: 21-show-your-work-totals*
*Completed: 2026-04-15*
