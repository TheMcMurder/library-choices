# Requirements: Cache County Library Choices

**Defined:** 2026-03-21
**Core Value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## v1.2 Requirements

Requirements for the current service level indicator milestone.

### Current Service Indicators

- [x] **CURR-01**: Staffing card marked `isCurrentServiceLevel: true` displays an amber border that is visible in both selected and unselected states — the blue selection ring remains fully intact and coexists with the amber border
- [x] **CURR-02**: Staffing card marked `isCurrentServiceLevel: true` displays a small amber "Current level" badge in the top-right corner, visible in both selected and unselected states
- [x] **CURR-03**: Collections slider tick for the option marked `isCurrentServiceLevel: true` is styled amber and persists regardless of slider position — the tick's active/inactive visual state is otherwise unchanged
- [x] **CURR-04**: All indicators are template-driven from the `isCurrentServiceLevel` config flag — no option IDs or values hardcoded in templates
- [x] **CURR-05**: Screen reader text communicates "Current level" for the badge (color alone is not the only signal)

## v1.3 Requirements

Requirements for separating digital and physical collections.

### Separate Collections

- [x] **COLL-01**: `collections` config key replaced with `collectionsDigital` and `collectionsPhysical` top-level keys, each with independent tier options — old blended key removed entirely
- [x] **COLL-02**: Reusable Nunjucks macro (`collectionSlider`) renders both sliders from the same template with different parameters
- [x] **COLL-03**: Two stacked sliders inside the Collections Budget fieldset — digital on top, physical below, each with own description and source citation
- [x] **COLL-04**: Total tax = staffing cost + digital budget + physical budget (additive, no floor/ceiling)
- [x] **COLL-05**: URL encoding uses `tau` for physical collections index and `delta` for digital collections index — old tau values out of range for new physical tiers silently fall to default
- [x] **COLL-06**: Both sliders display Phase 13 amber current-level tick independently via `isCurrentServiceLevel` flag and `data-current-level` attribute
- [x] **COLL-07**: NON-DEVELOPER EDIT GUIDE in config.js updated to document both `collectionsDigital` and `collectionsPhysical` keys

## v1.4 Requirements

Requirements for the unit test suite.

### Unit Tests

- [x] **TEST-01**: Vitest installed as devDependency with `vitest.config.js` at project root and `"test": "vitest run"` script in package.json — `pnpm test` runs successfully
- [x] **TEST-02**: `calculatePerHousehold(staffingCost, digitalCost, physicalCost, households)` extracted as a pure ESM export in `src/js/lib/calculator-helpers.js` — returns per-household cost or null for zero households
- [x] **TEST-03**: `encodeIndices` and `decodeIndices` extracted as pure ESM exports in `src/js/lib/url-helpers.js` — encode selections to URLSearchParams and decode with bounds checking
- [x] **TEST-04**: Config structure validation tests verify `config.js` exports staffingLevels, collectionsDigital, collectionsPhysical, cities arrays with correct shape (ids, costs, household counts, isCurrentServiceLevel flags)
- [x] **TEST-05**: Calculator math tests cover happy path, zero-households edge case, all-zeros case, and single-city scenario
- [x] **TEST-06**: URL encode/decode tests cover round-trip, out-of-bounds fallback to null, empty params, and non-numeric values
- [x] **TEST-07**: Non-blocking `test.yml` GitHub Actions workflow runs `pnpm test` on push to main and pull requests — does not block `deploy.yml`

## v1.5 Requirements

Requirements for migrating browser scripts to use extracted helpers.

### Calculator and URL Module Migration

- [x] **CALC-01**: `calculator.js` converted from IIFE to flat ES module with `import { calculatePerHousehold } from './lib/calculator-helpers.js'` — no IIFE wrapper remains
- [x] **CALC-02**: `updateResult()` calls imported `calculatePerHousehold(staffingCost, digitalCost, physicalCost, totalHouseholds)` instead of inline `totalCost / totalHouseholds` math
- [x] **CALC-03**: DOM-reading getters (`getStaffingCost`, `getDigitalCost`, `getPhysicalCost`) have defensive fallbacks returning 0 when DOM element is missing
- [x] **CALC-04**: `url.js` converted from IIFE to flat ES module with `import { encodeIndices, decodeIndices } from './lib/url-helpers.js'` — no IIFE wrapper remains
- [x] **CALC-05**: `url.js` restructured into four-stage model: `getCurrentSelections()` pulls DOM state, `encodeUrl()` calls `encodeIndices`, `restoreFromUrl()` reads URL params, `applySelections()` writes decoded indices to DOM
- [x] **CALC-06**: Both `<script>` tags in `src/index.html` have `type="module"` attribute; inline `window.LIBRARY_DATA` script remains classic (no type="module")
- [x] **CALC-07**: All existing tests (`pnpm test`) and build (`pnpm run build`) continue to pass with no test modifications

## v1.6 Requirements

Requirements for incorporating librarian feedback into config data.

### Librarian Data Updates

- [x] **DATA-01**: `collectionsDigital.options` has exactly 5 tiers with values $5k/$15k/$30k/$55k/$65k — `isCurrentServiceLevel: true` and `isDefault: true` on the $55k option — descriptions reflect Beehive consortium trade-offs from librarian notes
- [x] **DATA-02**: `collectionsPhysical` options: `isCurrentServiceLevel: true` moved from $10k to $15k option — $15k description includes books, DVDs, exploration kits, and equipment — $10k description reflects reduced core collection
- [x] **DATA-03**: Staffing level descriptions updated to reflect librarian's operational context — hours outside 9-5 enabling working citizens, staff coverage patterns, accessibility impact of reduced hours
- [x] **DATA-04**: Programming cost data (~$2,300-$4,800/year breakdown) documented as comment block in config.js for future reference — not modeled as a slider
- [x] **DATA-05**: Source attribution on `collectionsDigital` and `collectionsPhysical` updated to reference librarian notes instead of old FY2025 budget proposal
- [x] **DATA-06**: `draft: true` remains unchanged — staffing costs still PLACEHOLDER pending Cache County HR data

## v1.7 Requirements

Requirements for fixing the non-linear slider bug.

### Slider Index Fix

- [ ] **SLIDER-01**: `slider.njk` range input uses `min="0"`, `max="{{ options | length - 1 }}"`, `step="1"` — slider value is a 0-based index into the options array, not a dollar amount
- [ ] **SLIDER-02**: `slider.njk` initial value attribute uses `loop.index0` of the option with `isDefault: true` — slider starts at the correct index position
- [ ] **SLIDER-03**: Tick buttons use `data-value="{{ loop.index0 }}"` (index, not dollar amount) — click-to-snap writes an index to slider.value
- [ ] **SLIDER-04**: `calculator.js` `getDigitalCost()` and `getPhysicalCost()` read the slider index and look up the dollar value via `window.LIBRARY_DATA[key].options[idx].value` — with bounds checking
- [ ] **SLIDER-05**: `calculator.js` `updateSliderLabels()` looks up the option by index directly (`options[idx]`) instead of searching by value in a for-loop — display still shows dollar amounts
- [ ] **SLIDER-06**: `url-helpers.js` `encodeIndices` accepts `digitalIdx` and `physicalIdx` (0-based indices) instead of dollar values — removes `findIndex` lookups for digital and physical parameters
- [ ] **SLIDER-07**: `url.js` reads slider value as index in `getCurrentSelections()`, passes indices to `encodeIndices`, and writes indices (not dollar amounts) in `applySelections()` — `test/url.test.js` updated to pass indices

## Future Requirements

- Scenario summary text — human-readable sentence describing the selected combination (ENH-01)
- Print stylesheet — printable version of the configured scenario (ENH-02)
- Real household counts and cost figures sourced from Cache County records
- Non-developer edit workflow tested with site owner via GitHub web UI

## Out of Scope

| Feature | Reason |
|---------|--------|
| City "current" indicators | All four cities currently participate — no city has `isCurrentServiceLevel`; not needed |
| Animated transition between indicator states | Motion disorder risk; instant update is more accessible |
| DOM/UI behavior tests | Slider label updates, breakdown toggle, DOM event wiring — out of scope per D-07 |
| Programming slider | Cost data captured as comment; new UI capability deferred to future phase |
| Staffing annualCost real values | Needs Cache County HR data; tracked as known PLACEHOLDER |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CURR-01 | Phase 13 | Complete |
| CURR-02 | Phase 13 | Complete |
| CURR-03 | Phase 13 | Complete |
| CURR-04 | Phase 13 | Complete |
| CURR-05 | Phase 13 | Complete |
| COLL-01 | Phase 14 | Complete |
| COLL-02 | Phase 14 | Complete |
| COLL-03 | Phase 14 | Complete |
| COLL-04 | Phase 14 | Complete |
| COLL-05 | Phase 14 | Complete |
| COLL-06 | Phase 14 | Complete |
| COLL-07 | Phase 14 | Complete |
| TEST-01 | Phase 16 | Complete |
| TEST-02 | Phase 16 | Complete |
| TEST-03 | Phase 16 | Complete |
| TEST-04 | Phase 16 | Complete |
| TEST-05 | Phase 16 | Complete |
| TEST-06 | Phase 16 | Complete |
| TEST-07 | Phase 16 | Complete |
| CALC-01 | Phase 17 | Planned |
| CALC-02 | Phase 17 | Planned |
| CALC-03 | Phase 17 | Planned |
| CALC-04 | Phase 17 | Planned |
| CALC-05 | Phase 17 | Planned |
| CALC-06 | Phase 17 | Planned |
| CALC-07 | Phase 17 | Planned |
| DATA-01 | Phase 18 | Planned |
| DATA-02 | Phase 18 | Planned |
| DATA-03 | Phase 18 | Planned |
| DATA-04 | Phase 18 | Planned |
| DATA-05 | Phase 18 | Planned |
| DATA-06 | Phase 18 | Planned |
| SLIDER-01 | Phase 19 | Planned |
| SLIDER-02 | Phase 19 | Planned |
| SLIDER-03 | Phase 19 | Planned |
| SLIDER-04 | Phase 19 | Planned |
| SLIDER-05 | Phase 19 | Planned |
| SLIDER-06 | Phase 19 | Planned |
| SLIDER-07 | Phase 19 | Planned |

**Coverage:**
- v1.2 requirements: 5 total, 5 complete
- v1.3 requirements: 7 total, 7 complete
- v1.4 requirements: 7 total, 7 complete
- v1.5 requirements: 7 total, 0 complete
- v1.6 requirements: 6 total, 0 planned
- v1.7 requirements: 7 total, 0 planned
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-30 — Phase 19 slider fix requirements added*
