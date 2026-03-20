---
phase: 03-calculator-and-accessibility
plan: "01"
subsystem: calculator-and-accessibility
tags: [calculator, accessibility, aria, wcag, vanilla-js, tailwind]
dependency_graph:
  requires:
    - Phase 02 index.html form controls (staffing radios, collections select, city checkboxes)
    - Phase 02 window.LIBRARY_DATA global embedded at build time
  provides:
    - Real-time per-household tax calculator (src/js/calculator.js)
    - WCAG 2.1 AA accessible form with aria-live announcements
  affects:
    - src/js/calculator.js
    - src/index.html
tech_stack:
  added: []
  patterns:
    - Event delegation via single change listener on form element
    - Zero-city guard before division (totalHouseholds === 0)
    - aria-live="polite" + aria-atomic="true" for screen reader announcements
    - min-h-[44px] + items-center for WCAG 2.1 SC 2.5.5 touch targets
    - focus-visible:outline utilities for keyboard focus visibility
key_files:
  created:
    - src/js/calculator.js
  modified:
    - src/index.html
decisions:
  - "Collections cost reads select.value (live property), not select.dataset.cost (frozen build-time attribute)"
  - "IIFE + 'use strict' wrapping for calculator module encapsulation"
  - "font-semibold used for per-household display value per UI-SPEC (not font-bold as in RESEARCH example)"
metrics:
  duration: "2 min"
  completed_date: "2026-03-20"
  tasks: 2
  files_changed: 2
---

# Phase 03 Plan 01: Real-Time Calculator and WCAG 2.1 AA Accessibility Summary

**One-liner:** Vanilla JS IIFE calculator with event delegation, zero-city guard, aria-live result announcements, and 44px touch targets for WCAG 2.1 AA compliance.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Implement calculator.js with event delegation and zero-city guard | de6cc0f | src/js/calculator.js |
| 2 | Add ARIA live region, touch targets, and focus indicators to index.html | 63bcc7f | src/index.html |

## What Was Built

**Task 1 — calculator.js (53 lines):**
- IIFE with `'use strict'` wrapping all logic
- `getStaffingCost()`: reads checked radio `data-cost` attribute
- `getCollectionsCost()`: reads `select.value` (live property, not stale `data-cost`)
- `getTotalHouseholds()`: reduces checked city checkboxes' `data-households`
- `updateResult()`: zero-city guard shows friendly message, otherwise formats per-household cost with `toFixed(2)` and total with `toLocaleString('en-US')`
- Single delegated `change` listener on `#configurator` form
- Initial `updateResult()` call at end of IIFE for default state display

**Task 2 — index.html accessibility:**
- `aria-live="polite"` and `aria-atomic="true"` on `#result` div
- `items-baseline` replaced with `items-center` and `min-h-[44px]` added to all radio/checkbox wrapper divs (7 instances)
- `focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2` added to all radio and checkbox inputs (7 instances)
- Select element focus ring left unchanged (`focus:ring-2 focus:ring-blue-600`)

## Verification Results

All automated criteria passed:
- `pnpm run build` exits 0
- `_site/js/calculator.js` is 53 lines, non-empty
- `addEventListener`, `totalHouseholds === 0`, `toFixed(2)`, `collectionsSelect.value` all present in built output
- `aria-live="polite"`: 1 occurrence in `_site/index.html`
- `aria-atomic="true"`: 1 occurrence in `_site/index.html`
- `min-h-[44px]`: 7 occurrences (covers all staffing radio + city checkbox wrappers)
- `focus-visible:outline`: 7 occurrences (covers all radio and checkbox inputs)
- `items-baseline`: 0 occurrences (fully replaced)

## Deviations from Plan

None — plan executed exactly as written. The RESEARCH.md code example used `font-bold` for the display value, but the PLAN.md action text specified `font-semibold` (per UI-SPEC). The plan's explicit instruction was followed.

## Self-Check: PASSED

- `/Users/mcmurdie/Development/personal/library-choices/src/js/calculator.js` — exists, 53 lines
- `/Users/mcmurdie/Development/personal/library-choices/src/index.html` — exists, contains all required attributes
- `/Users/mcmurdie/Development/personal/library-choices/_site/js/calculator.js` — exists, non-empty
- `/Users/mcmurdie/Development/personal/library-choices/_site/index.html` — exists, all accessibility attributes verified
- Commit `de6cc0f` — Task 1 calculator.js
- Commit `63bcc7f` — Task 2 index.html accessibility
