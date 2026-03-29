# Phase 16: unit-tests - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a unit test suite covering the JavaScript business logic: tax calculation math, URL encode/decode round-trip, and config data structure integrity. The scope is testability of correctness-critical logic — not DOM behavior, UI interactions, or visual output.

</domain>

<decisions>
## Implementation Decisions

### Architecture

- **D-01:** Hybrid approach — extract `calculatePerHousehold(staffing, digital, physical, households)` as a pure exported function from `calculator.js`. Extract URL index encode/decode helpers (URLSearchParams logic) from `url.js` as pure functions. Keep IIFEs as thin DOM-orchestration wrappers calling the extracted functions.
- **D-02:** The goal of extraction is testability of the math contract and URL round-trip — not a full refactor of the IIFE architecture. Slider label updates, breakdown toggle, and DOM event wiring remain in the IIFEs and are NOT tested.

### Test Framework

- **D-03:** Vitest — ESM-native, minimal config, JSDOM environment available via single config line. Pin jsdom to v26 (or use happy-dom) to avoid a known v27 ESM conflict.
- **D-04:** Add `vitest` and `jsdom` (or `happy-dom`) as devDependencies. Add `vitest.config.js` at project root.
- **D-05:** Add `"test": "vitest run"` script to `package.json`.

### Coverage Scope

- **D-06:** Three test targets:
  1. **Config structure validation** — verify `config.js` exports staffingLevels, collectionsDigital, collectionsPhysical, cities arrays with correct shape (ids, costs, household counts, isCurrentServiceLevel flags). Catches non-developer mis-edit errors.
  2. **Tax calculation math** — test `calculatePerHousehold(staffing, digital, physical, households)` with happy path, zero-households edge case, and all-zeros case.
  3. **URL encode/decode round-trip** — test that encoding a set of selections and decoding them returns the original indices. Test out-of-bounds values fall back to defaults silently.
- **D-07:** Slider label logic, breakdown toggle, and DOM event behavior are explicitly out of scope for this test suite.

### CI Integration

- **D-08:** New non-blocking `test.yml` GitHub Actions workflow (runs on push to main, does NOT block deployment). Existing `deploy.yml` is unchanged.
- **D-09:** Rationale: site owner is a non-developer pushing via GitHub web UI — blocking deployment on test failures would disrupt content updates. Tests are visible in the Actions tab for developer review.
- **D-10:** The `test.yml` can be promoted to blocking (gate on `deploy.yml`) in a single line once a developer is actively monitoring CI runs.

### Claude's Discretion

- Test file naming and directory structure (e.g., `test/` or `src/js/__tests__/`) — Claude decides.
- Whether URLSearchParams extraction is in `url.js` itself or a new `src/js/lib/url-helpers.js` — Claude decides based on what's cleanest.
- Specific assertion style and test descriptions — Claude decides.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source Files to Refactor and Test
- `src/js/calculator.js` — IIFE containing tax math; `calculatePerHousehold` logic to extract
- `src/js/url.js` — IIFE containing URL encode/decode; index lookup helpers to extract
- `src/_data/config.js` — Pure ESM export; target of config structure validation tests

### Project Config
- `package.json` — devDependencies, scripts, `"type": "module"` declaration
- `.github/workflows/` — Existing workflows directory; new `test.yml` goes here

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/_data/config.js` — already a pure ESM export (`export default { ... }`), directly importable in tests with no setup
- `src/js/calculator.js` — IIFE; pure calculation logic is `getStaffingCost() + getDigitalCost() + getPhysicalCost()` / `getTotalHouseholds()` — extractable as `calculatePerHousehold(staffing, digital, physical, households)`
- `src/js/url.js` — IIFE; URL index encode/decode is `findIndex` + `URLSearchParams` — extractable without DOM dependency

### Established Patterns
- Package uses `"type": "module"` — all new test files and helpers must be ESM
- Browser JS deliberately uses IIFE pattern (not ESM) — extraction means creating a new `src/js/lib/` module that IIFEs import, or extracting helpers inline and exporting them for test consumption
- pnpm is the package manager

### Integration Points
- `package.json` scripts — add `test` script
- `.github/workflows/` — add `test.yml`
- `src/js/calculator.js` and `src/js/url.js` — minimal refactor to extract pure functions

</code_context>

<specifics>
## Specific Ideas

- The hybrid extraction approach was chosen specifically to avoid touching the IIFE structure broadly while still making the highest-stakes logic (tax math formula and URL round-trip) directly testable.
- Non-developer edit risk is a key motivation for config validation tests — the site owner edits `config.js` via GitHub web UI.
- The separate non-blocking CI workflow is explicitly chosen over a blocking gate to preserve the owner's push-to-deploy experience.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 16-unit-tests*
*Context gathered: 2026-03-28*
