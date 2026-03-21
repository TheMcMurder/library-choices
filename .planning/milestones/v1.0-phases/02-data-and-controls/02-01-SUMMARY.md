---
phase: 02-data-and-controls
plan: 01
subsystem: data
tags: [eleventy, nunjucks, config, data-schema]

# Dependency graph
requires:
  - phase: 01-scaffolding
    provides: Eleventy setup with ESM config, src/_data/ directory, type:module package.json
provides:
  - Full config.js data schema with staffingLevels, collections, and cities arrays
  - toLocaleString Nunjucks filter for comma-formatted number display in templates
  - src/js/calculator.js placeholder creating the js/ passthrough directory for Phase 3
affects:
  - 02-02 (renders form controls from this config data)
  - 03 (calculator.js placeholder location, window.LIBRARY_DATA embedding)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ESM export default in _data/ files — required by type:module in package.json"
    - "All monetary values stored as integers in config.js with PLACEHOLDER comments"
    - "Nunjucks filters registered in eleventyConfig before return statement"

key-files:
  created:
    - src/js/calculator.js
    - .planning/phases/02-data-and-controls/02-01-SUMMARY.md
  modified:
    - src/_data/config.js
    - eleventy.config.js

key-decisions:
  - "Staffing costs: 150000, 190000, 230000 — placeholder values summing near $260K with collections"
  - "Collections cost: 30000 — placeholder, site owner will supply real figure"
  - "City household counts: Providence 2100, Nibley 1800, Millville 950, River Heights 620 — all PLACEHOLDER"
  - "toLocaleString filter uses en-US locale for comma-separated thousands"
  - "Non-developer edit guide as block comment at top of config.js — explains what to change without JavaScript knowledge"

patterns-established:
  - "config.js is single source of truth — all numeric values as integers with PLACEHOLDER comments"
  - "Non-developer edit guide block comment pattern for config files"
  - "Nunjucks filter registration in eleventy.config.js before return statement"

requirements-completed: [DATA-01, DATA-02, DATA-03]

# Metrics
duration: 5min
completed: 2026-03-20
---

# Phase 02 Plan 01: Data Schema Summary

**Full config.js data schema with 3 staffing levels, 4 cities, and collections — plus toLocaleString Nunjucks filter and calculator.js Phase 3 placeholder**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-20T19:41:00Z
- **Completed:** 2026-03-20T19:41:49Z
- **Tasks:** 2
- **Files modified:** 3 (config.js, eleventy.config.js, calculator.js created)

## Accomplishments

- Expanded config.js from a 2-line stub to the full Phase 2 data schema with staffingLevels (3 objects), collections, and cities (4 objects) — all numeric values flagged PLACEHOLDER with 8 total PLACEHOLDER comments
- Added toLocaleString Nunjucks filter to eleventy.config.js for comma-formatting numbers in templates (e.g., 2100 becomes "2,100")
- Created src/js/calculator.js placeholder so the src/js/ passthrough copy has content and Phase 3 has a landing spot for calculator logic

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand config.js to full data schema** - `0af0c78` (feat)
2. **Task 2: Add toLocaleString filter and create calculator.js placeholder** - `c1395f4` (feat)

## Files Created/Modified

- `src/_data/config.js` - Full Phase 2 data schema: siteName, staffingLevels[3], collections, cities[4], with non-developer edit guide block comment
- `eleventy.config.js` - Added toLocaleString filter registering en-US comma-formatted number display
- `src/js/calculator.js` - Phase 3 placeholder comment file; enables src/js/ passthrough copy

## Decisions Made

- Non-developer edit guide is a block comment at the top of config.js explaining how to change costs, city names, household counts, and how to add a new city — no JavaScript knowledge required
- Placeholder values approximate the ~$250K total from PROJECT.md: 230000 (staffing) + 30000 (collections) = 260000

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build passes cleanly. All 8 PLACEHOLDER comments verified. Schema validated via Node.js dynamic import.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- config.js is the single source of truth, ready for Plan 02-02 to render form controls via Nunjucks for-loops
- toLocaleString filter available for city household count display
- data-cost and data-households attribute values are available from config (Phase 02-02 will place them on inputs)
- calculator.js placeholder ensures src/js/ passthrough is active before Phase 3 adds calculator logic

---
*Phase: 02-data-and-controls*
*Completed: 2026-03-20*
