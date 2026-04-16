---
phase: 22-usage-and-other-analytics-tracking
plan: "02"
subsystem: analytics
tags: [ga4, google-analytics, event-wiring, calculator, url-sharing]

# Dependency graph
requires:
  - phase: 22-01
    provides: analytics.js wrapper with 6 named GA4 event tracking functions and gtag guard
  - phase: 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure
    provides: ESM import pattern for browser scripts (calculator.js, url.js)
provides:
  - calculator.js wired with 5 analytics events (staffing_selected, digital_slider_changed, physical_slider_changed, city_toggled, breakdown_opened)
  - url.js wired with shared_url_loaded event on URL param detection
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Delegated change listener pattern: single form.addEventListener('change') dispatches updateResult then analytics based on e.target identity checks"
    - "City label resolved from window.LIBRARY_DATA not DOM — avoids scraping visible text for event params"
    - "Analytics only on change events, never on input events — prevents flooding on slider drag"

key-files:
  created: []
  modified:
    - src/js/calculator.js
    - src/js/url.js

key-decisions:
  - "Analytics events wired into the existing single delegated change listener on the form — no new event listeners added; target identity checks (e.target.matches, e.target.id) route to the correct track* call"
  - "trackBreakdownOpened fires only on open (isHidden === true before toggle) not on close, per D-08"
  - "trackSharedUrlLoaded placed after applySelections() inside restoreFromUrl(), guarded by the existing if (!params.toString()) return — fires only on shared URL loads, never on plain page loads"

patterns-established:
  - "Analytics wiring pattern: import track* from analytics.js, insert calls into existing change listeners using target identity checks"

requirements-completed: [ANA-06]

# Metrics
duration: 6min
completed: 2026-04-16
---

# Phase 22 Plan 02: Analytics Event Wiring Summary

**GA4 event calls wired into calculator.js and url.js — 5 interaction events (staffing, sliders, cities, breakdown) and 1 URL sharing event, all firing via the analytics.js gtag guard**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-16T10:10:00Z
- **Completed:** 2026-04-16T10:16:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added import of 5 analytics functions to calculator.js; replaced single-line `form.addEventListener('change', updateResult)` with a delegated handler that calls updateResult then dispatches the appropriate track* function based on e.target identity
- Added `trackBreakdownOpened()` to the breakdown toggle click handler; fires only on open (not close) per D-08
- Added import of `trackSharedUrlLoaded` to url.js; call placed at end of `restoreFromUrl()` after `applySelections()` and behind the existing empty-params guard
- All 37 tests pass with no regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire analytics events into calculator.js** - `28f6f3b` (feat)
2. **Task 2: Wire shared_url_loaded event into url.js** - `ef9e4c4` (feat)

## Files Created/Modified
- `src/js/calculator.js` - Added analytics import and 5 event calls in change listener and breakdown toggle handler
- `src/js/url.js` - Added analytics import and trackSharedUrlLoaded() call inside restoreFromUrl()

## Decisions Made
- Used a single delegated `form.addEventListener('change')` handler that both calls `updateResult()` and dispatches analytics — no additional event listeners added, keeping the existing single-listener architecture
- City label resolved from `window.LIBRARY_DATA.cities.find()` not from DOM text content — consistent with the established LIBRARY_DATA pattern and avoids fragile DOM scraping
- Analytics calls placed in `change` listener only, not in `input` listener — the `input` listener is for live UI updates during drag and must not generate analytics floods

## Deviations from Plan

### Pre-task Setup

**[Rule 3 - Blocking] Merged Plan 01 branch before executing**
- **Found during:** Setup (before Task 1)
- **Issue:** analytics.js from Plan 01 (`worktree-agent-acee6e02`) was not yet present in this worktree's branch (`worktree-agent-ac46843c`). Plan 02 depends on importing from analytics.js.
- **Fix:** `git merge worktree-agent-acee6e02` to bring analytics.js, test/analytics.test.js, config.js ga4MeasurementId, and index.html GA4 snippet into this branch before proceeding with Task 1.
- **Files added:** src/js/lib/analytics.js, test/analytics.test.js, src/_data/config.js (ga4MeasurementId), src/index.html (GA4 snippet)
- **Verification:** `ls src/js/lib/analytics.js` confirmed present; pnpm test showed all 37 tests passing
- **Committed as:** merge commit (pre-task setup)

---

**Total deviations:** 1 blocking (branch merge needed to get Plan 01 foundation)
**Impact on plan:** Required infrastructure step. No scope creep — merge brought only what Plan 01 already built.

## Issues Encountered
- pnpm install was needed in this worktree (node_modules missing) before tests could run. Installed with `--ignore-scripts`, then tests passed normally.

## User Setup Required
None — analytics events fire through the gtag guard; no additional configuration needed. GA4 only activates when `ga4MeasurementId` is set in config.js (set up in Plan 01).

## Next Phase Readiness
- Analytics integration is complete end-to-end: GA4 snippet in HTML, wrapper module with 6 named exports, event calls in both calculator.js and url.js
- All 6 planned events (ANA-01 through ANA-06) are implemented and guarded
- No further analytics wiring needed

---
*Phase: 22-usage-and-other-analytics-tracking*
*Completed: 2026-04-16*
