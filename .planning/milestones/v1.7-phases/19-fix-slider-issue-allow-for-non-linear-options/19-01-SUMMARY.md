---
phase: 19-fix-slider-issue-allow-for-non-linear-options
plan: 01
subsystem: ui
tags: [range-input, slider, url-encoding, vitest, nunjucks, javascript]

# Dependency graph
requires:
  - phase: 18-incorporate-feedback-from-library-notes
    provides: real digital/physical collections tiers with non-linear values ($5k/$15k/$30k/$55k/$65k)
provides:
  - Index-based slider HTML (min=0, max=N-1, step=1) eliminating phantom positions
  - Calculator index-to-dollar lookup via config options array
  - URL encode/decode layer accepting indices directly (no findIndex for digital/physical)
  - All 48 tests passing with updated round-trip test
affects: [future-slider-changes, url-encoding, calculator]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Slider value domain = 0-based index into options array, not dollar amount"
    - "Dollar display resolved at read time via options[idx].value lookup"
    - "URL encode accepts indices directly; no value-to-index conversion needed"

key-files:
  created: []
  modified:
    - src/_includes/macros/slider.njk
    - src/js/calculator.js
    - src/js/url.js
    - src/js/lib/url-helpers.js
    - test/url.test.js

key-decisions:
  - "Slider value domain switched from dollar amounts to 0-based indices (0 through N-1), fixing phantom positions on non-linearly-spaced digital collections ($5k/$15k/$30k/$55k/$65k)"
  - "encodeIndices signature changed from digitalValue/physicalValue to digitalIdx/physicalIdx — removes dollar-to-index findIndex lookups, simpler and more direct"
  - "Defensive bounds check added to getDigitalCost/getPhysicalCost — returns 0 if index out of range"

patterns-established:
  - "Index-as-slider-value: all new sliders with non-uniform options should use index-based value domain"

requirements-completed:
  - SLIDER-01
  - SLIDER-02
  - SLIDER-03
  - SLIDER-04
  - SLIDER-05
  - SLIDER-06
  - SLIDER-07

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 19 Plan 01: Fix Slider Issue — Allow for Non-Linear Options Summary

**Index-based range inputs (min=0/max=N-1/step=1) replacing dollar-value domain, eliminating phantom positions on non-linearly-spaced digital collections slider**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-30T20:58:53Z
- **Completed:** 2026-03-30T21:01:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Slider range input now uses 0-based index values (0–4) for both digital and physical sliders — no phantom positions between ticks for non-linear option sets
- Calculator resolves dollar amounts at read time via `options[idx].value` lookup rather than parsing dollar value from slider
- URL encoding/decoding layer simplified: `encodeIndices` now receives indices directly, removing the `findIndex` value-to-index conversions for digital/physical
- All 48 tests pass including updated round-trip test that passes indices 2 and 3 directly

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert slider.njk to index-based and update calculator.js** - `774862a` (feat)
2. **Task 2: Update url-helpers.js, url.js, and url tests for index-based sliders** - `de5486e` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `src/_includes/macros/slider.njk` - Range input: min=0, max=N-1, step=1, value and data-value use loop.index0; labels still display dollar amounts
- `src/js/calculator.js` - getDigitalCost/getPhysicalCost read index and look up opts[idx].value; updateSliderLabels uses direct index access
- `src/js/url.js` - getCurrentSelections reads/returns digitalIdx/physicalIdx; applySelections writes index string directly to slider
- `src/js/lib/url-helpers.js` - encodeIndices signature updated to digitalIdx/physicalIdx; bounds check replaces findIndex lookups
- `test/url.test.js` - Round-trip test passes indices 2 and 3 directly instead of dollar values

## Decisions Made
- Slider value domain switched from dollar amounts to 0-based indices — the root cause of phantom positions on non-linearly spaced options
- encodeIndices signature simplified: receives indices, bounds-checks them, no longer searches by value
- Defensive bounds check added to cost getters (idx < 0 || idx >= opts.length → return 0)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both collection sliders are now constrained to exactly 5 valid positions
- Cost calculation, label display, and URL sharing all work correctly with index-based sliders
- Ready for QA/verification: dragging either slider should only land on labeled tick positions

---
*Phase: 19-fix-slider-issue-allow-for-non-linear-options*
*Completed: 2026-03-30*

## Self-Check: PASSED

- FOUND: src/_includes/macros/slider.njk
- FOUND: src/js/calculator.js
- FOUND: src/js/url.js
- FOUND: src/js/lib/url-helpers.js
- FOUND: test/url.test.js
- FOUND: .planning/phases/19-fix-slider-issue-allow-for-non-linear-options/19-01-SUMMARY.md
- FOUND commit: 774862a (Task 1)
- FOUND commit: de5486e (Task 2)
