---
phase: 04-visual-polish-and-shareability
plan: "01"
subsystem: ui
tags: [eleventy, nunjucks, tailwind, vanilla-js, civic-design, responsive]

# Dependency graph
requires:
  - phase: 03-calculator
    provides: calculator.js IIFE + form structure targeting #result
  - phase: 02-data-and-controls
    provides: config.js data shape, Nunjucks template patterns, fieldset layout

provides:
  - Civic header bar (blue-800, site name + subtitle) above form
  - Sticky result bar fixed at bottom (#result-bar, #result-amount, #breakdown-detail)
  - Breakdown tooltip with toggle button and click-outside dismissal
  - Footer with attribution and config-driven civic links
  - DRAFT overlay watermark controlled by config.draft boolean
  - Mobile-first px-4 sm:px-8 padding preventing 375px horizontal scroll
  - draft + footerLinks fields in config.js with NON-DEVELOPER EDIT GUIDE comments

affects:
  - 04-02 (url.js plan — reads #result-bar, depends on new config fields)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Heroicons SVG copied inline (single icon, no npm install)"
    - "Nunjucks conditional for config.draft DRAFT overlay"
    - "Nunjucks for loop over config.footerLinks for footer links"
    - "Fixed sticky bar (z-50) with relative positioning for absolute tooltip (bottom-full)"
    - "IIFE var declarations for calculator.js (ES5-compatible, avoids TDZ issues with duplicated var)"

key-files:
  created: []
  modified:
    - src/_data/config.js
    - src/index.html
    - src/js/calculator.js

key-decisions:
  - "Kept var (not const/let) in calculator.js rewrite to maintain IIFE + ES5-compatible pattern established in Phase 3"
  - "breakdownDetail declared twice (inside updateResult + outer scope) — inner reference is function-scoped, outer is for toggle listeners; deliberate separation"

patterns-established:
  - "Sticky bar relative positioning pattern: #result-bar is relative so #breakdown-detail can use absolute bottom-full"
  - "DRAFT overlay z-index hierarchy: z-40 for overlay, z-50 for sticky bar (sticky bar always on top)"

requirements-completed: [DESG-01, DESG-02, DESG-03]

# Metrics
duration: 3min
completed: 2026-03-21
---

# Phase 4 Plan 01: Civic UI Layout Summary

**Civic-quality production layout with blue-800 header bar, sticky result bar replacing #result, footer with config-driven civic links, DRAFT watermark overlay, and mobile-first responsive corrections**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-21T00:25:13Z
- **Completed:** 2026-03-21T00:27:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `draft: true` and `footerLinks` array to `config.js` with NON-DEVELOPER EDIT GUIDE comment for the DRAFT watermark toggle
- Restructured `index.html` from bare form layout to civic page with header bar, mobile-corrected main, footer with civic links, DRAFT overlay, and sticky result bar
- Rewrote `calculator.js` to target `#result-amount` (dollar display) and `#breakdown-detail` (breakdown text) with breakdown toggle + click-outside dismissal logic

## Task Commits

Each task was committed atomically:

1. **Task 1: Add config.js data fields + restructure index.html template** - `11a59f5` (feat)
2. **Task 2: Retarget calculator.js to sticky result bar with breakdown toggle** - `d3e937c` (feat)

## Files Created/Modified
- `src/_data/config.js` - Added draft boolean, footerLinks array, DRAFT watermark guide comment
- `src/index.html` - Full page restructure: header bar, mobile-safe main, footer, DRAFT overlay conditional, sticky result bar with breakdown tooltip
- `src/js/calculator.js` - Retargeted to #result-amount and #breakdown-detail; added breakdown toggle + click-outside handler

## Decisions Made
- Kept `var` (not `const`/`let`) in `calculator.js` rewrite to stay consistent with the IIFE + `'use strict'` ES5-compatible module pattern established in Phase 3
- `breakdownDetail` is declared both inside `updateResult()` (function-scoped local) and in the outer IIFE scope (for toggle listeners) — deliberate design matching the plan spec

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Civic layout is complete and build passes
- `#result-bar`, `#result-amount`, `#breakdown-detail`, `#breakdown-toggle` IDs are stable for url.js to reference in Plan 02
- `config.footerLinks` and `config.draft` are in place for site owner to update via GitHub web UI
- `window.LIBRARY_DATA` still embedded (unchanged) for url.js to read at runtime in Plan 02

---
*Phase: 04-visual-polish-and-shareability*
*Completed: 2026-03-21*
