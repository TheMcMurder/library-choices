# Roadmap: Cache County Library Choices

## Milestones

- ✅ **v1.0 MVP** — Phases 1–6 (shipped 2026-03-21) — [archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 UX — Citizen-Meaningful Controls** — Phases 7–12 (shipped 2026-03-22) — [archive](milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 — Current Service Level Indicators** — Phase 13 (shipped 2026-03-22)
- 🚧 **v1.3 — Separate Digital and Physical Collections** — Phase 14 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–6) — SHIPPED 2026-03-21</summary>

- [x] Phase 1: Scaffolding (2/2 plans) — completed 2026-03-20
- [x] Phase 2: Data and Controls (2/2 plans) — completed 2026-03-20
- [x] Phase 3: Calculator and Accessibility (1/1 plan) — completed 2026-03-20
- [x] Phase 4: Visual Polish and Shareability (2/2 plans) — completed 2026-03-21
- [x] Phase 5: Documentation Gap Fixes (1/1 plan) — completed 2026-03-21
- [x] Phase 6: Tech Debt Cleanup and Browser Verification (2/2 plans) — completed 2026-03-21

Full phase details: [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

<details>
<summary>✅ v1.1 UX — Citizen-Meaningful Controls (Phases 7–12) — SHIPPED 2026-03-22</summary>

- [x] Phase 7: Collections Budget Slider (2/2 plans) — completed 2026-03-21
- [x] Phase 8: Hours Open Schedule Display (1/1 plan) — completed 2026-03-21
- [x] Phase 9: Compact URL Encoding (1/1 plan) — completed 2026-03-21
- [x] Phase 10: Custom Staffing Selector + Clickable Nodes (1/1 plan) — completed 2026-03-22
- [x] Phase 11: Custom City Card Multi-Select (1/1 plan) — completed 2026-03-22
- [x] Phase 12: Fix Focus Ring Visibility (1/1 plan) — completed 2026-03-22

Full phase details: [milestones/v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)

</details>

### v1.2 — Current Service Level Indicators (Complete)

**Milestone Goal:** Visually distinguish the staffing card and collections slider tick marked `isCurrentServiceLevel: true` so citizens always see the current service baseline regardless of their active selection.

- [x] **Phase 13: Current Service Level Indicators** — Amber border, badge, and slider tick that persist across all selection states; driven by config flag; screen reader accessible (completed 2026-03-22)

## Phase Details

### Phase 13: Current Service Level Indicators
**Goal**: Citizens can always see which staffing level and collections funding amount represent the current service baseline, regardless of what they have selected
**Depends on**: Phase 12
**Requirements**: CURR-01, CURR-02, CURR-03, CURR-04, CURR-05
**Success Criteria** (what must be TRUE):
  1. The staffing card marked `isCurrentServiceLevel: true` has an amber border visible when the card is unselected, and that border coexists visibly with the blue selection ring when the card is selected
  2. The same staffing card displays a small "Current level" badge in the top-right corner that is visible in both selected and unselected states
  3. The collections slider tick for the option marked `isCurrentServiceLevel: true` is styled amber and remains amber regardless of where the slider is positioned
  4. Selecting a different staffing card or moving the slider does not remove or hide the current-level indicators on the baseline option
  5. A screen reader announces "Current level" for the badge — the indicator is not conveyed by color alone
**Plans**: 1 plan

Plans:
- [x] 13-01-PLAN.md — Amber ring, badge, and slider tick indicators with JS guard

### Phase 14: Separate Digital and Physical Collections
**Goal**: Replace the single blended collections slider with two independently-controlled sliders (digital and physical) rendered by a shared Nunjucks macro, with additive tax calculation and extended URL encoding
**Depends on**: Phase 13
**Requirements**: COLL-01, COLL-02, COLL-03, COLL-04, COLL-05, COLL-06, COLL-07
**Success Criteria** (what must be TRUE):
  1. Two independent sliders (digital and physical) appear inside the Collections Budget fieldset, each with own description and source
  2. Moving one slider does not affect the other slider's value or display
  3. Total cost in the result bar equals staffing cost + digital budget + physical budget
  4. Shared URL encodes both slider positions (delta for digital, tau for physical) and restores them correctly on page load
  5. Amber current-level tick appears on the correct tick for each slider independently
  6. NON-DEVELOPER EDIT GUIDE documents both new config keys
**Plans**: 1 plan

Plans:
- [x] 14-01-PLAN.md — Config restructure, Nunjucks slider macro, calculator and URL refactor

### Phase 15: Hours Update

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 14
**Plans:** 1/1 plans complete

Plans:
- [ ] TBD (run /gsd:plan-phase 15 to break down)

### Phase 16: Unit Tests

**Goal:** Add a unit test suite covering JavaScript business logic (tax calculation math, URL encode/decode round-trip, config data structure integrity) with non-blocking CI
**Depends on:** Phase 15
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04, TEST-05, TEST-06, TEST-07
**Success Criteria** (what must be TRUE):
  1. `pnpm test` runs Vitest and exits 0 with all tests passing
  2. `calculatePerHousehold` is extracted as a pure ESM function and tested for happy path, zero-households, and all-zeros
  3. `encodeIndices` and `decodeIndices` are extracted as pure ESM functions and round-trip correctly with bounds checking
  4. Config structure tests validate shape of staffingLevels, collectionsDigital, collectionsPhysical, and cities
  5. Non-blocking `test.yml` CI workflow runs on push to main without blocking deploy.yml
  6. Original IIFE files (calculator.js, url.js) are unchanged
**Plans**: 2 plans

Plans:
- [x] 16-01-PLAN.md — Setup Vitest, extract pure functions, write unit tests
- [x] 16-02-PLAN.md — Non-blocking CI workflow

### Phase 17: Migrate to Calculator Helpers and Testable Code Structure

**Goal:** Convert calculator.js and url.js from IIFEs to ES modules that import the Phase 16 extracted helpers, eliminating logic duplication between browser scripts and tested helper functions
**Depends on:** Phase 16
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, CALC-07
**Success Criteria** (what must be TRUE):
  1. calculator.js imports and calls calculatePerHousehold from calculator-helpers.js instead of inline math
  2. url.js imports and calls encodeIndices/decodeIndices from url-helpers.js instead of inline encode/decode logic
  3. Both script tags in index.html have type="module"
  4. No IIFE wrappers remain in either file
  5. url.js follows four-stage model: pull DOM state, encode via helper, pull URL params, decode+restore via helper
  6. DOM-reading getters have defensive fallbacks for missing elements
  7. All existing tests pass unchanged and build succeeds
**Plans**: 1 plan

Plans:
- [ ] 17-01-PLAN.md — Refactor calculator.js and url.js to ES modules importing helpers, update script tags

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Scaffolding | v1.0 | 2/2 | Complete | 2026-03-20 |
| 2. Data and Controls | v1.0 | 2/2 | Complete | 2026-03-20 |
| 3. Calculator and Accessibility | v1.0 | 1/1 | Complete | 2026-03-20 |
| 4. Visual Polish and Shareability | v1.0 | 2/2 | Complete | 2026-03-21 |
| 5. Documentation Gap Fixes | v1.0 | 1/1 | Complete | 2026-03-21 |
| 6. Tech Debt Cleanup and Browser Verification | v1.0 | 2/2 | Complete | 2026-03-21 |
| 7. Collections Budget Slider | v1.1 | 2/2 | Complete | 2026-03-21 |
| 8. Hours Open Schedule Display | v1.1 | 1/1 | Complete | 2026-03-21 |
| 9. Compact URL Encoding | v1.1 | 1/1 | Complete | 2026-03-21 |
| 10. Custom Staffing Selector + Clickable Nodes | v1.1 | 1/1 | Complete | 2026-03-22 |
| 11. Custom City Card Multi-Select | v1.1 | 1/1 | Complete | 2026-03-22 |
| 12. Fix Focus Ring Visibility | v1.1 | 1/1 | Complete | 2026-03-22 |
| 13. Current Service Level Indicators | v1.2 | 1/1 | Complete    | 2026-03-22 |
| 14. Separate Digital and Physical Collections | v1.3 | 1/1 | Complete    | 2026-03-28 |
| 16. Unit Tests | v1.4 | 2/2 | Complete    | 2026-03-29 |
| 17. Calculator Helpers Migration | v1.5 | 0/1 | Planned    | — |
