---
phase: 08-hours-open-schedule-display
plan: 01
subsystem: ui
tags: [eleventy, nunjucks, tailwind, schedule, config]

# Dependency graph
requires:
  - phase: 07-collections-budget-slider
    provides: url.js with URL restoration pattern, slider/fieldset interaction baseline
provides:
  - Hours Open schedule tables rendered inline for all 3 staffing levels
  - formatDays Nunjucks filter converting ISO weekday numbers to locale-aware English names
  - schedule arrays on each staffingLevel in config.js with {days, open, close} shape
  - NON-DEVELOPER EDIT GUIDE extended with schedule editing section and copy-pasteable example
affects: [phase-09-compact-url-encoding]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Intl.DateTimeFormat with UTC-anchored reference date for locale-safe weekday formatting at build time"
    - "Structured {days, open, close} arrays as schedule data shape in config.js"
    - "Semantic HTML schedule tables with scope=\"col\" headers inside Nunjucks for loop"

key-files:
  created: []
  modified:
    - src/_data/config.js
    - eleventy.config.js
    - src/index.html

key-decisions:
  - "formatDays filter uses 2024-01-01T12:00:00Z noon-UTC reference date to prevent cross-midnight timezone bugs in CI/CD"
  - "timeZone: UTC in Intl.DateTimeFormat prevents CI/CD server timezone drift affecting day name output"
  - "User adjusted staffing labels to Basic/Extended/Current and tuned schedule hours post-checkpoint; docs updated to match"
  - "<time> elements wrap open/close values per UI-SPEC accessibility guidance"
  - "en dash (Unicode 2013) used between day range names (Monday-Friday) and between open/close times (&ndash;)"

patterns-established:
  - "Pattern 1: Build-time Nunjucks filter for locale-aware date formatting — avoids client-side JS for static display"
  - "Pattern 2: NON-DEVELOPER EDIT GUIDE extended with domain-specific copy-pasteable examples"

requirements-completed: [HOURS-01, HOURS-02, HOURS-03, HOURS-04, HOURS-05]

# Metrics
duration: 22min
completed: 2026-03-21
---

# Phase 8 Plan 01: Hours Open Schedule Display Summary

**Staffing section reframed as "Hours Open" with inline semantic schedule tables driven by {days, open, close} config arrays and a locale-aware formatDays Nunjucks filter**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-03-21T21:28:50Z
- **Completed:** 2026-03-21T21:50:49Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 3

## Accomplishments

- All 3 staffing levels now display an inline schedule table (Days / Hours columns) directly below their radio label, always visible without JavaScript
- formatDays Nunjucks filter converts ISO weekday range strings ("1-5", "6") to locale-aware English names (Monday-Friday, Saturday) at build time with UTC-safe reference date
- NON-DEVELOPER EDIT GUIDE extended with schedule editing instructions and copy-pasteable two-row example so site owner can update times via GitHub web UI
- "Hours Open" heading confirmed visible; "Staffing Level" removed; cite elements removed from staffing section only (collections and cities cites preserved); data-cost attributes and url.js untouched

## Task Commits

Each task was committed atomically:

1. **Task 1: Add schedule data to config.js and register formatDays filter** - `82ca175` (feat)
2. **Task 2: Update index.html — rename heading, add schedule tables, remove cites** - `dbb0784` (feat)
3. **Task 3: Visual and functional verification** - approved by user (no code commit)
4. **Post-checkpoint: Update labels and schedule data to match built UI** - `68a496d` (docs)

## Files Created/Modified

- `src/_data/config.js` - schedule arrays added to all 3 staffingLevel objects; NON-DEVELOPER EDIT GUIDE extended with schedule editing section
- `eleventy.config.js` - formatDays filter registered immediately after toLocaleString filter
- `src/index.html` - legend changed to "Hours Open"; staffing loop now renders schedule table per level; cite elements removed from staffing only

## Decisions Made

- formatDays uses `2024-01-01T12:00:00Z` (noon UTC) as reference Monday to prevent midnight timezone crossing on CI/CD servers
- `timeZone: "UTC"` in `Intl.DateTimeFormat` options locks output regardless of server timezone
- User-adjusted staffing labels (Basic / Extended / Current) and schedule hours post-checkpoint; committed as docs update to keep changes tracked
- `<time>` elements wrap open/close values for semantic correctness per UI-SPEC

## Deviations from Plan

None - plan executed exactly as written. Post-checkpoint user adjustments to labels and schedule times were incorporated by the user directly and committed.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 8 complete. v1.1 milestone (Phases 7-8) is now done.
- Phase 9 (Compact URL Encoding / easter egg param aliases) can begin. url.js and config.js are stable; the URL format established in Phases 4 and 7 is the base to encode.

---
*Phase: 08-hours-open-schedule-display*
*Completed: 2026-03-21*
