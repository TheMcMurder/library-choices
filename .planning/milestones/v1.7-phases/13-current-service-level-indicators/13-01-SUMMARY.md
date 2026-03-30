---
phase: 13-current-service-level-indicators
plan: "01"
subsystem: ui

tags: [tailwind, nunjucks, eleventy, accessibility, css]

# Dependency graph
requires:
  - phase: 12-focus-ring-offset
    provides: outline-offset-4 pattern that amber ring must coexist with
  - phase: 10-staffing-cards
    provides: has-[:checked] CSS-only card selection pattern and sr-only input pattern
provides:
  - Amber ring (ring-2 ring-amber-500 ring-offset-2) on current-level staffing card in all selection states
  - "Current level" badge (absolute-positioned, amber background) in top-right of current-level staffing card
  - Amber tick (text-amber-600 font-semibold) on current-level collections slider option
  - JS guard in updateSliderLabels preserving amber tick when slider moves away from current-level value
  - All indicators driven by isCurrentServiceLevel flag in config.js with no hardcoded IDs or values
affects: [post-v1.2 indicator changes, any future config-driven visual state]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - data-current-level HTML attribute bridges Nunjucks config flag to JavaScript behavior
    - ring-offset layering: blue selection ring (no offset) / amber current ring (offset-2) / focus outline (offset-4)
    - JS class toggle guards using dataset attribute to prevent overwrite by dynamic class logic

key-files:
  created: []
  modified:
    - src/index.html
    - src/js/calculator.js

key-decisions:
  - "text-amber-600 (not amber-500) used for slider tick to satisfy WCAG AA contrast on white background"
  - "Badge text 'Current level' is visible plain text (not aria-hidden) to serve both sighted and screen reader users (CURR-05)"
  - "data-current-level='true' attribute on tick button bridges Nunjucks isCurrentServiceLevel flag to JS guard without hardcoding values"
  - "relative class added to ALL staffing labels unconditionally so absolute-positioned badge works regardless of isCurrentServiceLevel state"

patterns-established:
  - "Config-flag-to-DOM-attribute bridge: Nunjucks conditional sets data-* attribute; JS reads dataset property — avoids hardcoded values in JS"
  - "Class toggle guard pattern: check dataset attribute before toggling color/weight classes to prevent dynamic JS from overwriting template-set state"

requirements-completed: [CURR-01, CURR-02, CURR-03, CURR-04, CURR-05]

# Metrics
duration: ~25min
completed: 2026-03-22
---

# Phase 13 Plan 01: Current Service Level Indicators Summary

**Amber ring, badge, and amber slider tick added to mark the current service baseline, all driven by the isCurrentServiceLevel config flag with no hardcoded IDs**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-22T20:45:39Z
- **Completed:** 2026-03-22 (human verification approved)
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 2

## Accomplishments

- Staffing card for the current service level (index 2) gains a persistent amber ring (ring-2 ring-amber-500 ring-offset-2) and a "Current level" badge (amber pill, top-right corner) visible in both selected and unselected states
- Collections slider tick at $30k gains amber styling (text-amber-600 font-semibold) that persists when the slider moves to any other position
- JS guard in updateSliderLabels prevents the dynamic class-toggle loop from overwriting amber with gray when the slider is inactive on the current-level tick

## Task Commits

Each task was committed atomically:

1. **Task 1: Add amber ring, badge, and amber tick to Nunjucks template** - `70b9e05` (feat)
2. **Task 2: Add JS guard in updateSliderLabels to preserve amber tick** - `a74016f` (feat)
3. **Task 3: Visual verification of all current-level indicators** - human-approved checkpoint (no code commit)

## Files Created/Modified

- `src/index.html` - Amber ring classes and relative positioning on staffing label; "Current level" badge span; data-current-level attribute and amber classes on collections tick button
- `src/js/calculator.js` - updateSliderLabels forEach guard using dataset.currentLevel to preserve amber-600/font-semibold state when tick is inactive

## Decisions Made

- Used text-amber-600 (not amber-500) for the slider tick to satisfy WCAG AA 4.5:1 contrast ratio on white background
- Badge "Current level" text is plain visible text, not aria-hidden — satisfies CURR-05 without any extra aria markup
- data-current-level="true" attribute bridges the Nunjucks template flag to the JS guard, keeping the JS free of hardcoded values (CURR-04)
- Added relative class to ALL staffing labels unconditionally so the absolute-positioned badge works on whichever card has isCurrentServiceLevel regardless of DOM order

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- v1.2 milestone complete — all five CURR requirements satisfied
- Remaining blocker before public launch: actual household count and cost figures must be sourced from Cache County records (content gap, not technical)
- Non-developer edit workflow should be explicitly tested with site owner via GitHub web UI before launch

---
*Phase: 13-current-service-level-indicators*
*Completed: 2026-03-22*
