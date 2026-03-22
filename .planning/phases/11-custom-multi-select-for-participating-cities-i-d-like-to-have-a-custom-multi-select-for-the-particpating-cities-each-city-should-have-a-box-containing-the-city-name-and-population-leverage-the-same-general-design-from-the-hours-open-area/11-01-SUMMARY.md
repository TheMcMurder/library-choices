---
phase: 11-custom-multi-select-participating-cities
plan: 01
subsystem: ui
tags: [tailwind, nunjucks, eleventy, css-only, has-selector]

requires:
  - phase: 10-custom-staffing-selector-ui
    provides: has-[:checked] card pattern with sr-only hidden inputs and CSS-only selection state

provides:
  - City selection cards replacing inline checkbox+label pattern in src/index.html
  - Full-width clickable city cards with name, household count, and source citation
  - CSS-only selection state via has-[:checked] — no JavaScript added

affects:
  - src/index.html
  - Any future phase touching the cities fieldset

tech-stack:
  added: []
  patterns:
    - "has-[:checked] CSS-only card selection (checkbox variant, same as Phase 10 radio variant)"
    - "sr-only hidden checkbox inside label wrapper — keyboard/screen-reader access via label click"
    - "sourceLink conditional in cite — linked or plain text source citation per city"

key-files:
  created: []
  modified:
    - src/index.html

key-decisions:
  - "City cards use same has-[:checked] pattern as staffing cards — visual consistency across all multi-select areas"
  - "sr-only on city checkboxes matches staffing radio pattern from Phase 10 — no accent-blue-600 needed"
  - "sourceLink conditional in cite block allows per-city linked sources when available"

patterns-established:
  - "City card pattern: label[for] wraps sr-only input + span(name) + p(households) + cite(source)"

requirements-completed:
  - CITY-01
  - CITY-02
  - CITY-03
  - CITY-04
  - CITY-05

duration: 1min
completed: 2026-03-21
---

# Phase 11 Plan 01: Custom City Card Multi-Select Summary

**CSS-only city selection cards with name, household count, and source citation matching the Phase 10 staffing card design pattern**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-21T06:33:59Z
- **Completed:** 2026-03-21T06:34:38Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint)
- **Files modified:** 1

## Accomplishments

- Replaced inline checkbox+label city pattern with full-width clickable card elements
- CSS-only selection state via `has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600`
- Checkboxes are `sr-only` — keyboard navigation (Tab + Space) and screen readers work without visible checkbox
- All calculator.js and url.js integration contracts preserved: `name="cities"`, `value="{{ city.id }}"`, `data-households="{{ city.households }}"`
- sourceLink conditional in `<cite>` for linked vs. plain text source citation

## Task Commits

1. **Task 1: Replace city checkbox pattern with card elements** - `5c45b11` (feat)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `src/index.html` - Cities fieldset loop body replaced with card pattern; fieldset wrapper and legend unchanged

## Decisions Made

- City cards use same `has-[:checked]` CSS-only pattern as staffing cards (Phase 10) — no JavaScript added or modified
- `sr-only` on checkboxes matches Phase 10 staffing radio pattern — accent-blue-600 removed (no visual effect on hidden input)
- sourceLink conditional added per UI-SPEC — future cities can have linked census sources

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None. All four cities render from `config.cities` data via Nunjucks loop. `sourceLink` is conditional — cities without a sourceLink show plain text source, which is correct behavior.

## Next Phase Readiness

- City card UI is complete and ready for browser verification (Task 2 checkpoint)
- calculator.js and url.js untouched — all existing functionality preserved
- Design is consistent with staffing cards — Participating Cities section now matches Hours Open visual quality

---
*Phase: 11-custom-multi-select-participating-cities*
*Completed: 2026-03-21*
