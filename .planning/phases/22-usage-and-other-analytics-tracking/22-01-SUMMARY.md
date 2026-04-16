---
phase: 22-usage-and-other-analytics-tracking
plan: "01"
subsystem: analytics
tags: [ga4, google-analytics, vitest, jsdom, privacy]

# Dependency graph
requires:
  - phase: 17-migrate-to-calculator-helpers-and-more-easily-testable-code-structure
    provides: lib helper ESM module pattern (JSDoc, named exports) that analytics.js follows
  - phase: 16-unit-tests
    provides: Vitest test infrastructure and test file conventions
provides:
  - analytics.js wrapper with 6 named GA4 event tracking functions and gtag guard
  - Unit tests (13 tests) for all tracking functions using jsdom environment
  - ga4MeasurementId config field with non-developer edit instructions
  - Conditional GA4 snippet in index.html with privacy config and localhost guard
affects: [22-02-event-wiring]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@vitest-environment jsdom docblock for tests that access window"
    - "typeof window.gtag === 'function' guard for browser-only APIs in shared ESM modules"

key-files:
  created:
    - src/js/lib/analytics.js
    - test/analytics.test.js
  modified:
    - src/_data/config.js
    - src/index.html

key-decisions:
  - "Used @vitest-environment jsdom comment in test file rather than changing global vitest config — preserves node environment for all other test files"
  - "GA4 snippet uses privacy-minimized config: storage none, no Google Signals, no ad personalization — per RESEARCH.md privacy requirements"
  - "Hostname guard (localhost / 127.0.0.1) prevents GA4 from initializing in local dev, keeping analytics production-only"

patterns-established:
  - "Analytics wrapper pattern: thin named-export functions delegating to an internal fireEvent guard — keeps callsites readable and guard logic centralized"

requirements-completed: [ANA-01, ANA-02, ANA-03, ANA-04, ANA-05]

# Metrics
duration: 4min
completed: 2026-04-16
---

# Phase 22 Plan 01: Analytics Foundation Summary

**GA4 analytics.js wrapper module with 6 named event functions and gtag guard, plus conditional privacy-minimized GA4 snippet in HTML controlled by a config.js toggle**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-16T09:08:44Z
- **Completed:** 2026-04-16T09:12:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created `src/js/lib/analytics.js` with 6 named exports (trackStaffingSelected, trackDigitalSliderChanged, trackPhysicalSliderChanged, trackCityToggled, trackBreakdownOpened, trackSharedUrlLoaded) and an internal `fireEvent` guard using `typeof window.gtag === 'function'`
- Created `test/analytics.test.js` with 13 tests covering all tracking functions for both gtag-present and gtag-absent scenarios; all 37 tests pass across 4 test files
- Added `ga4MeasurementId: null` to config.js with a non-developer edit guide entry explaining how to set the G-XXXXXXXXXX measurement ID
- Added conditional GA4 script snippet to index.html with privacy-minimized config (storage: none, no Google Signals, no ad personalization) and hostname guard preventing initialization on localhost

## Task Commits

Each task was committed atomically:

1. **Task 1: Create analytics.js wrapper module and unit tests** - `116c61f` (feat)
2. **Task 2: Add ga4MeasurementId to config.js and GA4 snippet to index.html** - `05a0812` (feat)

## Files Created/Modified
- `src/js/lib/analytics.js` - GA4 event wrapper with fireEvent guard and 6 named export functions
- `test/analytics.test.js` - 13 unit tests using jsdom environment; covers gtag-present and gtag-absent paths
- `src/_data/config.js` - Added ga4MeasurementId field and NON-DEVELOPER EDIT GUIDE entry
- `src/index.html` - Added conditional GA4 snippet in head with privacy config and localhost guard

## Decisions Made
- Used `// @vitest-environment jsdom` comment in analytics test file rather than setting jsdom globally in vitest.config.js — preserves node environment for all existing test files which don't need DOM
- GA4 snippet is privacy-minimized per phase research: `'storage': 'none'`, `allow_google_signals: false`, `allow_ad_personalization_signals: false`
- Hostname guard `location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'` prevents GA4 from firing in local development

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added @vitest-environment jsdom to test file**
- **Found during:** Task 1 (TDD GREEN phase)
- **Issue:** `window is not defined` — vitest uses node environment by default; analytics tests need `window.gtag` to exist
- **Fix:** Added `// @vitest-environment jsdom` docblock comment to `test/analytics.test.js`; this scopes jsdom to analytics tests only without changing global vitest config
- **Files modified:** test/analytics.test.js
- **Verification:** All 13 analytics tests pass; existing 24 tests unaffected
- **Committed in:** 116c61f (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Required for tests to access `window` object. No scope creep — minimal targeted fix.

## Issues Encountered
- pnpm install was needed in the worktree (node_modules missing) before tests could run. Installed, then proceeded normally.

## User Setup Required
None — `ga4MeasurementId` is set to `null` by default, which disables GA4 entirely. To enable analytics after obtaining a GA4 property, site owner sets `ga4MeasurementId: 'G-XXXXXXXXXX'` in config.js via GitHub web UI.

## Next Phase Readiness
- analytics.js module is complete and tested; Plan 02 can import and call track* functions from existing JS files (calculator.js, url.js) with no infrastructure work needed
- The gtag guard means Plan 02 event calls are safe to add even before a GA4 measurement ID is configured

---
*Phase: 22-usage-and-other-analytics-tracking*
*Completed: 2026-04-16*
