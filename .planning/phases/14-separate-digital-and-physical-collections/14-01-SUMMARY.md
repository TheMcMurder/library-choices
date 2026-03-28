---
phase: 14-separate-digital-and-physical-collections
plan: "01"
subsystem: collections-budget
tags: [collections, slider, url-encoding, nunjucks-macro, config-data]
dependency_graph:
  requires: []
  provides: [two-slider-collections-ui, slider-macro, delta-tau-url-params]
  affects: [calculator.js, url.js, index.html, config.js]
tech_stack:
  added: [nunjucks-macro]
  patterns: [parameterized-slider-macro, scoped-tick-buttons, additive-cost-calculation]
key_files:
  created:
    - src/_includes/macros/slider.njk
  modified:
    - src/_data/config.js
    - src/index.html
    - src/js/calculator.js
    - src/js/url.js
decisions:
  - "Reused tau param for physical collections index (per D-10); delta is new param for digital"
  - "Verbose backward-compat URL branch removed — referenced data.collections which no longer exists"
  - "fieldset legend kept as 'Collections Budget' (per RESEARCH open question 3)"
  - "Tick button step computed as options[1].value - options[0].value (requires evenly-spaced options)"
metrics:
  duration: "~4 minutes"
  completed: "2026-03-28"
  tasks_completed: 3
  files_modified: 5
---

# Phase 14 Plan 01: Separate Digital and Physical Collections Summary

**One-liner:** Two independently-controlled collection sliders (digital + physical) rendered by a shared Nunjucks macro with scoped tick buttons, additive cost calculation, and delta+tau URL encoding.

## What Was Built

Replaced the single blended "Annual collections budget" slider with two independent sliders:

- **Digital collections budget** — 4 options ($5k–$20k), default $15k, current-level at $15k
- **Physical print collections budget** — 5 options ($0–$20k), default $15k, current-level at $10k

The two sliders are rendered by a shared Nunjucks macro (`collectionSlider`) that accepts `id`, `name`, `label`, `options`, `source`, `amountId`, and `descriptionId` parameters. This eliminates template duplication and ensures both sliders are styled identically.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Config data restructure and Nunjucks slider macro | d3744ee | src/_data/config.js, src/_includes/macros/slider.njk |
| 2 | Template macro calls and calculator refactor | 99ad120 | src/index.html, src/js/calculator.js |
| 3 | URL encoding for two collection params | 01c4a9f | src/js/url.js |

## Key Changes

**config.js:**
- Replaced `collections` key with `collectionsDigital` (4 opts, values 5k/10k/15k/20k) and `collectionsPhysical` (5 opts, values 0/5k/10k/15k/20k)
- `isCurrentServiceLevel: true` on digital $15k and physical $10k
- NON-DEVELOPER EDIT GUIDE updated with separate digital/physical sections and `delta` param mention

**slider.njk (new):**
- Parameterized macro accepting all slider configuration
- Tick buttons use `data-slider="{{ id }}"` for scoped targeting — prevents cross-slider interference
- Step computed dynamically as `options[1].value - options[0].value`
- Amber current-level styling driven by `data-current-level="true"` conditional

**calculator.js:**
- `getDigitalCost()` + `getPhysicalCost()` replace `getCollectionsCost()`
- `updateResult()` sums staffing + digital + physical
- `updateSliderLabels(sliderId, dataKey, amountId, descriptionId)` is now parameterized
- `updateAllSliderLabels()` wrapper calls both sliders
- Tick click handler scoped via `data-slider` attribute

**url.js:**
- `delta` param encodes digital collections index; `tau` reused for physical collections index
- Verbose backward-compat branch removed (referenced `data.collections` which no longer exists)
- Restore logic handles each param independently with bounds checking

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all wired to real config data.

## Self-Check: PASSED

Files exist:
- src/_includes/macros/slider.njk: FOUND
- src/_data/config.js: FOUND (collectionsDigital + collectionsPhysical keys present)
- src/index.html: FOUND (collectionSlider macro calls present)
- src/js/calculator.js: FOUND (getDigitalCost + getPhysicalCost present)
- src/js/url.js: FOUND (delta + tau encoding present)

Commits exist:
- d3744ee: feat(14-01): restructure collections config and add slider macro
- 99ad120: feat(14-01): replace single slider with two macro calls and refactor calculator
- 01c4a9f: feat(14-01): refactor url.js to encode delta (digital) and tau (physical) params

Eleventy build: PASSED (no errors, 1 file written)
