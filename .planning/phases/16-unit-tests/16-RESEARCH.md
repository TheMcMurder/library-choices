# Phase 16: unit-tests - Research

**Researched:** 2026-03-28
**Domain:** Vitest, ESM module extraction, GitHub Actions CI
**Confidence:** HIGH

## Summary

This phase adds a unit test suite for the correctness-critical JavaScript in a static Eleventy site. The approach is minimal extraction: two IIFEs (`calculator.js` and `url.js`) each export a single pure function while keeping their DOM orchestration logic untouched. `config.js` is already a pure ESM export and requires no modification. Vitest is the locked framework choice — ESM-native, zero-config for this project's `"type": "module"` setup. jsdom is pinned to v26.1.0 because jsdom v27+ has a confirmed ESM/CJS conflict with Vitest (reported December 2025, still unresolved as of March 2026).

CI is a separate non-blocking `test.yml` workflow. The existing `deploy.yml` is untouched, preserving the site owner's push-to-deploy experience.

**Primary recommendation:** Extract `calculatePerHousehold` and URL index helpers as named ESM exports, wire Vitest with `environment: 'jsdom'` pinned to v26.1.0, write three focused test files, add non-blocking GitHub Actions workflow.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Hybrid approach — extract `calculatePerHousehold(staffing, digital, physical, households)` as a pure exported function from `calculator.js`. Extract URL index encode/decode helpers (URLSearchParams logic) from `url.js` as pure functions. Keep IIFEs as thin DOM-orchestration wrappers calling the extracted functions.
- **D-02:** The goal of extraction is testability of the math contract and URL round-trip — not a full refactor of the IIFE architecture. Slider label updates, breakdown toggle, and DOM event wiring remain in the IIFEs and are NOT tested.
- **D-03:** Vitest — ESM-native, minimal config, JSDOM environment available via single config line. Pin jsdom to v26 (or use happy-dom) to avoid a known v27 ESM conflict.
- **D-04:** Add `vitest` and `jsdom` (or `happy-dom`) as devDependencies. Add `vitest.config.js` at project root.
- **D-05:** Add `"test": "vitest run"` script to `package.json`.
- **D-06:** Three test targets:
  1. **Config structure validation** — verify `config.js` exports staffingLevels, collectionsDigital, collectionsPhysical, cities arrays with correct shape (ids, costs, household counts, isCurrentServiceLevel flags).
  2. **Tax calculation math** — test `calculatePerHousehold(staffing, digital, physical, households)` with happy path, zero-households edge case, and all-zeros case.
  3. **URL encode/decode round-trip** — test that encoding a set of selections and decoding them returns the original indices. Test out-of-bounds values fall back to defaults silently.
- **D-07:** Slider label logic, breakdown toggle, and DOM event behavior are explicitly out of scope.
- **D-08:** New non-blocking `test.yml` GitHub Actions workflow (runs on push to main, does NOT block deployment). Existing `deploy.yml` is unchanged.
- **D-09:** Rationale: site owner is a non-developer pushing via GitHub web UI — blocking deployment on test failures would disrupt content updates.
- **D-10:** The `test.yml` can be promoted to blocking in a single line once a developer is actively monitoring CI runs.

### Claude's Discretion

- Test file naming and directory structure (e.g., `test/` or `src/js/__tests__/`) — Claude decides.
- Whether URLSearchParams extraction is in `url.js` itself or a new `src/js/lib/url-helpers.js` — Claude decides based on what's cleanest.
- Specific assertion style and test descriptions — Claude decides.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | 4.1.2 | Test runner + assertion library | ESM-native, Vite-ecosystem, minimal config for `"type": "module"` projects |
| jsdom | 26.1.0 (pinned) | DOM environment for Vitest | jsdom v27+ has confirmed ESM/CJS conflict with Vitest (open issue Dec 2025) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| happy-dom | 20.8.9 | Alternative DOM environment | If jsdom v26 proves problematic; lighter weight but less spec-complete |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| jsdom@26.1.0 | happy-dom@20.8.9 | happy-dom is faster/lighter; jsdom is more spec-complete. Since tests are pure math + URLSearchParams (no actual DOM), happy-dom is a safe alternative if jsdom causes friction |
| jsdom pinned | jsdom@latest (v29) | jsdom v27+ ERR_REQUIRE_ESM error with Vitest — confirmed broken, do not use |

**Installation:**
```bash
pnpm add -D vitest jsdom@26.1.0
```

**Version verification (confirmed 2026-03-28):**
- `vitest`: 4.1.2 (current)
- `jsdom`: 26.1.0 (latest v26 patch — v27+ broken with Vitest)
- `happy-dom`: 20.8.9 (current, fallback option)

## Architecture Patterns

### Recommended Project Structure
```
library-choices/
├── src/js/
│   ├── lib/
│   │   ├── calculator-helpers.js   # extracted: calculatePerHousehold()
│   │   └── url-helpers.js          # extracted: encodeIndices(), decodeIndices()
│   ├── calculator.js               # IIFE unchanged, imports from lib/
│   └── url.js                      # IIFE unchanged, imports from lib/
├── test/
│   ├── config.test.js              # config structure validation
│   ├── calculator.test.js          # math contract tests
│   └── url.test.js                 # URL round-trip tests
└── vitest.config.js
```

### Pattern 1: IIFE With Extracted Pure Function
**What:** Move the pure computation out of the IIFE into a `src/js/lib/` ESM module. The IIFE calls the exported function rather than duplicating logic. Both the IIFE and test files import from the same lib module.
**When to use:** IIFE must continue to work in browser (loaded as plain `<script>`); tests need ESM-importable pure functions. Browser `<script>` cannot use ESM `import` unless `type="module"`, but IIFEs can access lib functions if they're co-bundled or the lib is also script-loaded. See Pattern 2 for the correct handling.

**Important:** `calculator.js` and `url.js` are loaded as plain `<script>` tags (not `type="module"`) in the browser. They cannot use `import` statements. The extraction strategy must work around this:

**Option A (cleanest for tests):** Create `src/js/lib/calculator-helpers.js` as ESM. Tests import it directly. The IIFE in `calculator.js` duplicates the tiny formula inline (acceptable since it's 2 lines). Tests cover the extracted function's contract.

**Option B (DRY):** If the Eleventy build concatenates or inlines scripts, the lib file could be included first as a separate `<script>` that assigns to `window.LibCalc = { calculatePerHousehold }`, and the IIFE reads from `window.LibCalc`. This requires a template change.

**Option C (recommended by CONTEXT.md D-01):** The IIFE calls the extracted function. This requires either `type="module"` on the script tag, or concatenation. Given the existing IIFE pattern and no bundler, Option A (lib is ESM for tests, IIFE stays self-contained) is the cleanest path.

### Pattern 2: URL Helpers Extraction
**What:** The URL encode/decode logic in `url.js` uses `URLSearchParams` (available in both browser and Node 18+) and array `findIndex`. These are fully portable without DOM. Extracting them to `src/js/lib/url-helpers.js` as pure functions allows direct import in tests.

**Key insight:** The `encodeIndices(data, staffingId, digitalValue, physicalValue, cityIds)` function doesn't need DOM at all — it maps IDs/values to indices using `data` from `config.js`. The IIFE handles fetching those values from the DOM, then calls the pure function.

### Pattern 3: Config Structure Validation
**What:** Import `config.js` directly (already pure ESM) and assert structural invariants. No mocking needed.
**Example:**
```javascript
// test/config.test.js
import config from '../src/_data/config.js';

describe('config structure', () => {
  it('staffingLevels has required shape', () => {
    expect(Array.isArray(config.staffingLevels)).toBe(true);
    config.staffingLevels.forEach(level => {
      expect(typeof level.id).toBe('string');
      expect(typeof level.annualCost).toBe('number');
      expect(level.annualCost).toBeGreaterThan(0);
    });
  });
  it('exactly one staffingLevel has isCurrentServiceLevel true', () => {
    const current = config.staffingLevels.filter(l => l.isCurrentServiceLevel === true);
    expect(current).toHaveLength(1);
  });
});
```

### Pattern 4: Vitest Config
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```
No additional setup needed for this project. The `"type": "module"` in package.json means all test files are automatically treated as ESM.

### Pattern 5: Non-Blocking GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
# No dependency from deploy.yml — this job does not block deployment
```

### Anti-Patterns to Avoid
- **jsdom v27+:** ERR_REQUIRE_ESM error — confirmed broken with Vitest as of Dec 2025. Stay on v26.1.0.
- **Adding `type="module"` to script tags:** Would change browser loading behavior and break IIFE isolation. Don't touch HTML templates.
- **Mocking `window.LIBRARY_DATA`:** The extracted pure functions should accept `data` as a parameter, not read from `window`. Tests pass the config data directly.
- **Testing DOM behavior:** Slider updates, toggle open/close, event dispatch — all out of scope per D-07.
- **`vitest run --coverage`:** Coverage not requested; don't add `@vitest/coverage-v8` unless asked.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Assertion library | Custom equals/throws helpers | Vitest built-in `expect` | Vitest bundles expect (Chai-compatible) — no separate install |
| DOM simulation | Manual `document.createElement` stubs | jsdom environment (Vitest config) | jsdom provides full DOM globals automatically |
| Test runner | Shell scripts with node | `vitest run` | File watching, parallelism, reporting all built in |
| URLSearchParams mock | Custom parser | Native Node URLSearchParams | Available since Node 10, Node 22 in CI |

**Key insight:** URLSearchParams is a native Node global since Node 10 — no polyfill or mock needed. Tests can directly construct `URLSearchParams` instances.

## Common Pitfalls

### Pitfall 1: jsdom Version Conflict
**What goes wrong:** `pnpm add -D jsdom` installs v29 (current latest), causing `ERR_REQUIRE_ESM` at test startup.
**Why it happens:** jsdom v27+ depends on parse5 as ESM-only; Vitest's internal require path for jsdom triggers a CJS require of this ESM module.
**How to avoid:** Always pin `jsdom@26.1.0` explicitly. Use `pnpm add -D jsdom@26.1.0`.
**Warning signs:** Error contains "ERR_REQUIRE_ESM" and "parse5" at test startup before any tests run.

### Pitfall 2: IIFE Cannot Import ESM
**What goes wrong:** Adding `import { calculatePerHousehold } from './lib/calculator-helpers.js'` to `calculator.js` causes a browser syntax error because the script tag lacks `type="module"`.
**Why it happens:** Plain `<script>` tags run in classic script mode; `import` is only valid in module scripts.
**How to avoid:** Keep IIFEs entirely self-contained. Extracted lib functions exist as a separate ESM file that only test files import. If the IIFE needs the same logic, it either: (a) has a local copy of the 2-line formula, or (b) the lib file is loaded before it as a separate `<script>` assigning to `window`.
**Warning signs:** Browser console shows "Cannot use import statement outside a module".

### Pitfall 3: URL Helper Tests Need `data` Argument
**What goes wrong:** Extracted URL helper uses `window.LIBRARY_DATA` or module-level `data` variable instead of a function parameter — making it impossible to test without a full DOM setup.
**Why it happens:** Copy-paste from IIFE where `var data = window.LIBRARY_DATA` is at top of closure.
**How to avoid:** Extracted pure functions must accept `data` as a parameter: `encodeIndices(data, staffingId, ...)`. Tests pass `config` directly.

### Pitfall 4: Config Import Path
**What goes wrong:** Test imports `../src/_data/config.js` but Vitest resolves from `test/`, giving `../src/_data/config.js`. Wrong if test lives at project root level.
**Why it happens:** Relative import path depends on where test file lives.
**How to avoid:** With `test/` at project root, import path from `test/config.test.js` is `../src/_data/config.js`. Verify once.

### Pitfall 5: `households === 0` Division
**What goes wrong:** `calculatePerHousehold(staffing, digital, physical, 0)` returns `Infinity` or `NaN` rather than a sentinel value.
**Why it happens:** The extracted function doesn't special-case zero households (the IIFE handles it via early return on the UI side).
**How to avoid:** The extracted function should either: (a) return `null` / `0` for zero households and tests assert this, or (b) let callers handle it. Document the contract explicitly. Test D-06 covers this case.

## Code Examples

### calculatePerHousehold Pure Function
```javascript
// src/js/lib/calculator-helpers.js
// Extracted from calculator.js IIFE — DOM-free pure function

/**
 * @param {number} staffingCost - annual staffing cost
 * @param {number} digitalCost  - annual digital collections budget
 * @param {number} physicalCost - annual physical collections budget
 * @param {number} households   - total selected households
 * @returns {number|null} per-household cost, or null if households === 0
 */
export function calculatePerHousehold(staffingCost, digitalCost, physicalCost, households) {
  if (households === 0) return null;
  return (staffingCost + digitalCost + physicalCost) / households;
}
```

### URL Index Helpers Pure Functions
```javascript
// src/js/lib/url-helpers.js
// Extracted from url.js IIFE — uses URLSearchParams (Node native, no DOM needed)

/**
 * Encode selections as URL parameter indices.
 * @param {object} data - config data (staffingLevels, collectionsDigital, collectionsPhysical, cities)
 * @param {string} staffingId
 * @param {number} digitalValue
 * @param {number} physicalValue
 * @param {string[]} cityIds
 * @returns {URLSearchParams}
 */
export function encodeIndices(data, staffingId, digitalValue, physicalValue, cityIds) {
  var params = new URLSearchParams();
  var pi = data.staffingLevels.findIndex(function (l) { return l.id === staffingId; });
  if (pi !== -1) params.set('pi', String(pi));
  var delta = data.collectionsDigital.options.findIndex(function (o) { return o.value === digitalValue; });
  if (delta !== -1) params.set('delta', String(delta));
  var tau = data.collectionsPhysical.options.findIndex(function (o) { return o.value === physicalValue; });
  if (tau !== -1) params.set('tau', String(tau));
  var phi = cityIds.map(function (id) { return data.cities.findIndex(function (c) { return c.id === id; }); })
                   .filter(function (i) { return i !== -1; });
  if (phi.length) params.set('phi', phi.join(','));
  return params;
}

/**
 * Decode URL parameters back to selection indices (with bounds checking).
 * @param {object} data
 * @param {URLSearchParams} params
 * @returns {{ staffingIdx: number|null, digitalIdx: number|null, physicalIdx: number|null, cityIndices: number[] }}
 */
export function decodeIndices(data, params) {
  var pi = params.get('pi');
  var staffingIdx = (pi !== null && !isNaN(+pi) && +pi >= 0 && +pi < data.staffingLevels.length)
    ? +pi : null;
  var delta = params.get('delta');
  var digitalIdx = (delta !== null && !isNaN(+delta) && +delta >= 0 && +delta < data.collectionsDigital.options.length)
    ? +delta : null;
  var tau = params.get('tau');
  var physicalIdx = (tau !== null && !isNaN(+tau) && +tau >= 0 && +tau < data.collectionsPhysical.options.length)
    ? +tau : null;
  var phi = params.get('phi');
  var cityIndices = phi ? phi.split(',').map(Number).filter(function (i) {
    return !isNaN(i) && i >= 0 && i < data.cities.length;
  }) : [];
  return { staffingIdx, digitalIdx, physicalIdx, cityIndices };
}
```

### Tax Calculation Tests
```javascript
// test/calculator.test.js
import { describe, it, expect } from 'vitest';
import { calculatePerHousehold } from '../src/js/lib/calculator-helpers.js';

describe('calculatePerHousehold', () => {
  it('divides total cost by households', () => {
    expect(calculatePerHousehold(230000, 15000, 10000, 6314)).toBeCloseTo(255000 / 6314, 5);
  });
  it('returns null for zero households', () => {
    expect(calculatePerHousehold(230000, 15000, 10000, 0)).toBeNull();
  });
  it('handles all-zeros except households', () => {
    expect(calculatePerHousehold(0, 0, 0, 1000)).toBe(0);
  });
});
```

### URL Round-Trip Tests
```javascript
// test/url.test.js
import { describe, it, expect } from 'vitest';
import { encodeIndices, decodeIndices } from '../src/js/lib/url-helpers.js';
import config from '../src/_data/config.js';

describe('URL encode/decode round-trip', () => {
  it('round-trips all four selection types', () => {
    const staffingId = config.staffingLevels[1].id;
    const digitalValue = config.collectionsDigital.options[2].value;
    const physicalValue = config.collectionsPhysical.options[3].value;
    const cityIds = [config.cities[0].id, config.cities[2].id];

    const params = encodeIndices(config, staffingId, digitalValue, physicalValue, cityIds);
    const decoded = decodeIndices(config, params);

    expect(decoded.staffingIdx).toBe(1);
    expect(decoded.digitalIdx).toBe(2);
    expect(decoded.physicalIdx).toBe(3);
    expect(decoded.cityIndices).toEqual([0, 2]);
  });

  it('out-of-bounds staffing index falls back to null', () => {
    const params = new URLSearchParams('pi=99');
    const decoded = decodeIndices(config, params);
    expect(decoded.staffingIdx).toBeNull();
  });

  it('out-of-bounds physical index falls back to null', () => {
    const params = new URLSearchParams('tau=99');
    const decoded = decodeIndices(config, params);
    expect(decoded.physicalIdx).toBeNull();
  });
});
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.js` (Wave 0 — does not exist yet) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| D-06-1 | Config structure valid (shape, ids, costs, isCurrentServiceLevel) | unit | `pnpm test test/config.test.js` | Wave 0 |
| D-06-2 | calculatePerHousehold happy path | unit | `pnpm test test/calculator.test.js` | Wave 0 |
| D-06-2 | calculatePerHousehold zero-households | unit | `pnpm test test/calculator.test.js` | Wave 0 |
| D-06-2 | calculatePerHousehold all-zeros | unit | `pnpm test test/calculator.test.js` | Wave 0 |
| D-06-3 | URL encode/decode round-trip | unit | `pnpm test test/url.test.js` | Wave 0 |
| D-06-3 | Out-of-bounds index falls to default | unit | `pnpm test test/url.test.js` | Wave 0 |
| D-08 | test.yml runs on push to main (non-blocking) | manual check | GitHub Actions tab | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** All tests green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.js` — Vitest config at project root
- [ ] `src/js/lib/calculator-helpers.js` — extracted pure function
- [ ] `src/js/lib/url-helpers.js` — extracted pure functions
- [ ] `test/config.test.js` — config structure validation
- [ ] `test/calculator.test.js` — math contract tests
- [ ] `test/url.test.js` — URL round-trip tests
- [ ] `.github/workflows/test.yml` — non-blocking CI workflow
- [ ] Framework install: `pnpm add -D vitest jsdom@26.1.0`
- [ ] `package.json` scripts: add `"test": "vitest run"`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Jest + Babel for ESM | Vitest (ESM-native) | 2022-2023 | No transpilation needed for `"type": "module"` projects |
| jsdom as default DOM env | jsdom pinned to v26 | Dec 2025 | v27+ broken with Vitest — must pin |

**Deprecated/outdated:**
- jsdom v27, v28, v29: ERR_REQUIRE_ESM conflict with Vitest — do not use until officially resolved.

## Open Questions

1. **IIFE Import Strategy**
   - What we know: Browser `<script>` cannot use ESM `import`. IIFEs in `calculator.js` and `url.js` must remain self-contained for browser use.
   - What's unclear: Whether the implementer should (a) keep a local copy of the 2-line formula inside the IIFE alongside the exported lib version, or (b) assign extracted function to `window.LibCalc` and have IIFEs read from there.
   - Recommendation: Option A (local copy in IIFE + exported lib for tests) is cleaner — the formula is 2 lines, duplication cost is negligible, no template changes needed. Option B adds complexity.

2. **jsdom vs happy-dom**
   - What we know: No actual DOM is accessed in the extracted pure functions. Both environments would work.
   - What's unclear: Whether the `environment: 'jsdom'` setting is even needed (since test files don't touch DOM).
   - Recommendation: Omit `environment` from vitest.config.js entirely — Vitest defaults to `node` environment. Pure functions don't need DOM globals. This avoids the jsdom version concern entirely for this phase.

## Sources

### Primary (HIGH confidence)
- npm registry (verified 2026-03-28): vitest@4.1.2, jsdom@26.1.0, happy-dom@20.8.9
- Source files read directly: `src/js/calculator.js`, `src/js/url.js`, `src/_data/config.js`, `package.json`, `.github/workflows/deploy.yml`

### Secondary (MEDIUM confidence)
- [jsdom 27 produces error ERR_REQUIRE_ESM · Issue #9281 · vitest-dev/vitest](https://github.com/vitest-dev/vitest/issues/9281) — confirms v27+ broken with Vitest as of Dec 2025
- [Compatibility Issue Between Latest jsdom and Vitest v4 · Issue #9279 · vitest-dev/vitest](https://github.com/vitest-dev/vitest/issues/9279) — corroborating report

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions confirmed via npm registry
- Architecture: HIGH — source files read directly, extraction strategy fully informed by actual code
- Pitfalls: HIGH — jsdom conflict confirmed via open GitHub issues; other pitfalls derived from actual code structure

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (jsdom conflict may be resolved; re-check before implementation)
