---
phase: 20-update-hours-selection-with-new-data
plan: 01
subsystem: data
tags: [config, staffing, wages, library-hours]

# Dependency graph
requires:
  - phase: 19-fix-slider-issue-allow-for-non-linear-options
    provides: 0-based index value domain for staffing slider; calculator resolves index to annualCost at read time
provides:
  - Updated staffingLevels with real annualCost figures (56160, 76440, 160000) from Providence Library budget levels PDF
  - New tier IDs (35hr-pt, 44hr-pt, 44hr-fte) replacing placeholder IDs
  - isCurrentServiceLevel on Tier 2 (Standard, 44hr-pt)
  - Updated schedules matching 35hr/wk and 44hr/wk real operation tiers
affects: [calculator, url-encoding, staffing-card-ui]

# Tech tracking
tech-stack:
  added: []
  patterns: [source field citing PDF document year for auditability]

key-files:
  created: []
  modified:
    - src/_data/config.js
    - test/url.test.js

key-decisions:
  - "annualCost = staff wages only per D-02; no overhead (ILS, programs, supplies) included"
  - "isCurrentServiceLevel moved from Tier 3 to Tier 2 (Standard 44hr-pt) — closest match to current operation"
  - "Tier IDs updated from 1fte/1fte-1pte/1fte-2pte to 35hr-pt/44hr-pt/44hr-fte; compact pi param uses array index so compact URLs remain valid; verbose-format shared links using old ids are a clean break"
  - "URL-IMMUTABLE comment removed from id fields; updated to note compact URL uses array index, verbose id changed from v1"

patterns-established:
  - "source field cites specific document and year for all staffingLevel cost data"

requirements-completed: [HRS-01]

# Metrics
duration: 1min
completed: 2026-04-05
---

# Phase 20 Plan 01: Update Hours Selection with New Data Summary

**Three staffingLevels replaced with real Providence Library wage data: Essential ($56,160), Standard ($76,440, current), Full Service ($160,000) from 2026 budget PDF**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-05T21:32:23Z
- **Completed:** 2026-04-05T21:33:40Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Replaced 3 PLACEHOLDER staffingLevels entries (annualCost 150k/190k/230k) with real wage figures derived from Providence Library budget levels PDF
- New tier IDs (35hr-pt, 44hr-pt, 44hr-fte) replace old structure-based IDs (1fte, 1fte-1pte, 1fte-2pte) that described a different staffing model
- isCurrentServiceLevel moved to Tier 2 Standard (44hr/wk part-time) matching actual current operation; Tier 3 Full Service is aspirational
- Schedules updated to reflect real 35hr/wk and 44hr/wk operation hours with Saturday access
- Updated stale comment in url.test.js reflecting old id value

## Task Commits

Each task was committed atomically:

1. **Task 1: Update staffingLevels data in config.js** - `3e38522` (feat)
2. **Task 2: Update URL test comment and verify all tests pass** - `299d675` (chore)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `src/_data/config.js` - staffingLevels array replaced with real PDF data (3 tiers, real annualCosts, new IDs, real schedules)
- `test/url.test.js` - Stale comment on line 7 updated from `// "1fte-1pte"` to `// "44hr-pt"`

## Decisions Made
- annualCost = staff wages only (no overhead) per D-02 from CONTEXT.md
- Labels: Essential / Standard / Full Service per D-03
- isCurrentServiceLevel on Tier 2 (Standard, 44hr-pt) — closest match to current operation per D-05
- New IDs per D-06: compact URL pi param uses array index so existing compact shared links remain valid; verbose-format URLs using old staffing IDs (1fte etc.) will no longer match — clean break accepted given semantic change
- Added source field citing "Providence Library budget levels (2026)" for data auditability

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- config.js staffingLevels now reflect real wage data from the librarian's PDF
- All 14 config tests, 6 url tests, and 4 calculator tests continue to pass (72 total)
- Calculator and URL encoding require no changes — annualCost is referenced by name, staffing index is position-based
- Remaining content gap: household counts and full cost figures still need Cache County records; draft: true flag remains set in config.js

---
*Phase: 20-update-hours-selection-with-new-data*
*Completed: 2026-04-05*
