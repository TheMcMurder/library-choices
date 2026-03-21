# Phase 6: Tech Debt Cleanup and Browser Verification - Research

**Researched:** 2026-03-20
**Domain:** Eleventy/Nunjucks template cleanup, config-driven defaults, browser QA, product decision documentation
**Confidence:** HIGH

---

## Summary

Phase 6 is a cleanup-and-close phase. It has three distinct workstreams: (1) mechanical dead code removal — deleting `postcss.config.mjs` and stripping `data-cost` from the collections `<select>`; (2) a template refactor to make city checkbox defaults config-driven rather than hardcoded `checked`; and (3) a human-executed browser verification pass covering all items deferred from phases 2, 3, and 4, plus a product-owner decision on CONF-02.

The technical scope is small and well-understood — all target files exist and have been read. No new libraries are needed. The browser verification workstream produces documentation artifacts (a checklist SUMMARY) rather than code changes. CONF-02 requires a documented product-owner decision, not a code implementation, unless the owner decides a "zero/off" collections option is needed.

**Primary recommendation:** Split into two plans — 06-01 for the three code changes (dead code removal + config-driven defaults), and 06-02 for the browser verification checklist and CONF-02 decision documentation.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONF-02 | User can toggle collections budget on/off independently of staffing | Product decision: owner confirms select satisfies requirement OR zero/off option added to config.js options array |
| DESG-01 | Polished, trustworthy visual design appropriate for civic engagement | Browser verification: confirm civic design reads as credible on real browser/device |
| DESG-02 | Mobile-first responsive layout — full functionality on a phone without zooming | Browser verification: confirm 375px layout at actual device width |
| DESG-03 | Clean, simple design language using Tailwind CSS v4 | Browser verification: confirm Tailwind v4 build produces correct output |
| CONF-06 | Shareable URL — current selections encoded in query string | Browser verification: confirm URL round-trip works end-to-end |
</phase_requirements>

---

## Standard Stack

No new libraries required. All tools are already installed.

### Core (already in project)
| Tool | Version | Purpose |
|------|---------|---------|
| Eleventy | ^3.1.5 | Static site generation + Nunjucks template processing |
| Tailwind CSS v4 CLI | ^4.2.2 | CSS build via `@tailwindcss/cli` |
| Nunjucks | bundled with Eleventy | Template engine for `src/index.html` |
| pnpm | 8.6.0 | Package manager; build via `pnpm run build` |

### Build commands
```bash
pnpm run build        # Full build: CSS then Eleventy
pnpm run build:css    # CSS only
pnpm run build:11ty   # Eleventy only
```

### Why `postcss.config.mjs` is dead
The build command is `tailwindcss -i src/css/style.css -o src/css/compiled.css` (Tailwind standalone CLI). The standalone CLI does NOT load `postcss.config.mjs`. The `@tailwindcss/postcss` plugin in the config file is only used when running through a PostCSS pipeline (e.g., `postcss` CLI or a bundler like Vite/webpack). Since this project uses the Tailwind CLI directly — not PostCSS — the file is never read. Deleting it removes a misleading artifact with zero build impact.

**Confirmation:** `package.json` `devDependencies` includes `postcss` and `@tailwindcss/postcss`, but neither is referenced in any build script. They can remain as deps without consequence (or be pruned), but the config file itself is definitively dead.

---

## Architecture Patterns

### Pattern 1: Config-driven checked default for city checkboxes

**Current state (hardcoded):**
```nunjucks
{# src/index.html line 78 — HARDCODED, all cities always checked #}
<input
  type="checkbox"
  name="cities"
  id="city-{{ city.id }}"
  value="{{ city.id }}"
  data-households="{{ city.households }}"
  checked
/>
```

**Target state (config-driven):**
Add a `defaultChecked` boolean flag to each city object in `config.js`:
```js
// src/_data/config.js — cities array
cities: [
  {
    id: "providence",
    label: "Providence",
    households: 2100,
    defaultChecked: true,   // <-- new flag
    source: "Cache County Assessor 2024",
  },
  // ... repeat for all 4 cities
],
```

Then in the template:
```nunjucks
<input
  type="checkbox"
  name="cities"
  id="city-{{ city.id }}"
  value="{{ city.id }}"
  data-households="{{ city.households }}"
  {% if city.defaultChecked %}checked{% endif %}
/>
```

**NON-DEVELOPER EDIT GUIDE comment** must be added to `config.js` explaining `defaultChecked`. Follow the existing block-comment guide pattern already established in Phase 2.

**Important:** All 4 cities should have `defaultChecked: true` initially (matching current behavior). This is a refactor, not a behavior change.

### Pattern 2: Removing `data-cost` from the collections `<select>`

**Current state (dead markup):**
```nunjucks
{# src/index.html line 53 #}
<select
  id="collections"
  name="collections"
  data-cost="{% for opt in config.collections.options %}{% if opt.isDefault %}{{ opt.value }}{% endif %}{% endfor %}"
  ...
>
```

**Why it's dead:** `calculator.js` explicitly documents "Must read `.value`, not `.dataset.cost` — data-cost is frozen at build-time default" (line 16). The JS never touches `select.dataset.cost` at runtime. The attribute holds a stale build-time value that diverges from the live selection as soon as the user picks a different option.

**Target state:** Remove the `data-cost` attribute entirely from the `<select>` element. No JS change needed — calculator.js already uses `collectionsSelect.value`.

### Pattern 3: Browser verification checklist format

The browser verification plan (06-02) produces a `06-02-SUMMARY.md` with a documented checklist. Each item records: the item description, the browser/device tested, the result (pass/fail), and any notes. This is documentation, not code. The planner should structure 06-02 as a human-verify task with the checklist embedded.

**Full browser verification scope (from roadmap success criteria):**

Phase 04 items (9 total):
1. Civic design — header bar renders as blue-800, site name visible
2. Sticky result bar — fixed at bottom, shows per-household cost on load
3. Breakdown tooltip — info button opens detail, click-outside dismisses
4. URL round-trip — selecting options updates URL; copying and opening in new tab restores selections
5. Fallback — invalid URL params (e.g., `?staffing=INVALID`) silently use defaults
6. Back button behavior — browser back navigates away (not to previous form state)
7. Mobile 375px — no horizontal scroll, form fully usable, cost prominently visible
8. DRAFT overlay — `config.draft: true` shows watermark; changing to `false` and rebuilding removes it
9. Zero-city guard — unchecking all cities shows "Select at least one city" message

Phase 02 items:
10. Collections layout — select dropdown renders with correct options ($10k-$60k), $30k pre-selected
11. `window.LIBRARY_DATA` — browser console `window.LIBRARY_DATA` returns correct object

Phase 03 items:
12. Screen reader — aria-live region announces result changes (test with VoiceOver/NVDA or axe DevTools)
13. Keyboard focus rings — Tab through all controls shows visible focus outlines
14. Touch targets — all checkboxes/radios/select visually have adequate tap area (min-h-[44px] present)

CONF-02 decision:
15. Product owner confirms: does the collections `<select>` satisfy "toggle on/off independently of staffing"? If no, a zero/off option must be added.

### Anti-Patterns to Avoid
- **Changing behavior during cleanup:** The city defaultChecked refactor must produce identical initial page state. All 4 cities start checked. This is a structural change only.
- **Removing data-cost from staffing radios:** The `data-cost` attribute on `<input type="radio">` staffing inputs IS still read by calculator.js (`checked.dataset.cost`). Only the `<select>` element's `data-cost` is dead.
- **Treating CONF-02 as automatically closed:** Phase 02 summary records `requirements-completed: [CONF-01, CONF-02, CONF-03, ...]` but REQUIREMENTS.md still marks CONF-02 as pending. The requirement says "toggle on/off" — the current implementation is a dropdown with 6 budget levels (no off/zero option). A product-owner decision is needed. If they confirm the select satisfies the requirement as-is, CONF-02 is closed by documentation. If they want an off option, a code change to `config.js` (add `{ value: 0, isDefault: false }` option) and a template/JS guard is needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Nunjucks conditional attribute | Custom JS default injection | `{% if city.defaultChecked %}checked{% endif %}` in template |
| URL query string serialization | Custom parser | Already implemented via URLSearchParams in url.js |
| Accessibility audit | Manual color inspection | axe DevTools browser extension (free) for WCAG checks |

---

## Runtime State Inventory

> Included because this phase touches config.js and template structure.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no database, no server-side state. All state is in URL query string or DOM. | None |
| Live service config | GitHub Pages deployment — live site reflects current `main` branch after CI runs. No external service config to update. | None |
| OS-registered state | None | None |
| Secrets/env vars | None — no secrets in this project. `config.js` uses placeholder values. | None |
| Build artifacts | `_site/` directory — stale after any source change; regenerated by `pnpm run build`. `src/css/compiled.css` — regenerated by `build:css`. Both are gitignored. | `pnpm run build` after changes |

**Note on `data-cost` removal:** The `data-cost` attribute exists in `_site/index.html` (built output). After removing it from `src/index.html`, any existing `_site/` is stale until rebuilt. The `_site/` directory is gitignored and never committed, so no data migration is needed — a build refresh resolves it.

---

## Common Pitfalls

### Pitfall 1: Removing `data-cost` from staffing radios by mistake
**What goes wrong:** calculator.js `getStaffingCost()` reads `checked.dataset.cost` from the staffing radio input. If the `data-cost="{{ level.annualCost }}"` on `<input type="radio">` is removed, staffing costs silently become NaN.
**Why it happens:** Both the staffing radios and the collections select have `data-cost` attributes. Only the select's `data-cost` is dead.
**How to avoid:** Scope the removal to the `<select id="collections">` element only. The `<input type="radio" name="staffing">` elements must keep `data-cost`.
**Warning signs:** Calculator shows NaN or $0.00/household.

### Pitfall 2: City default refactor changes behavior
**What goes wrong:** If `defaultChecked: false` is set on any city, that city starts unchecked, changing the initial cost calculation result.
**Why it happens:** Refactor scope creep, or mistaking the flag name for something else.
**How to avoid:** Set `defaultChecked: true` on all 4 cities. The refactor converts a hardcoded `checked` to a config-driven `checked` — the initial state is identical.
**Warning signs:** On fresh page load (no URL params), not all 4 cities are checked.

### Pitfall 3: CONF-02 closed without a decision
**What goes wrong:** Phase 6 completes but CONF-02 remains technically open because no product-owner confirmation was documented.
**Why it happens:** The Phase 02 summary marks CONF-02 as `requirements-completed`, but REQUIREMENTS.md disagrees — it's still Pending. This ambiguity needs an explicit resolution.
**How to avoid:** 06-02 plan must explicitly produce a documented decision: either "product owner confirmed select satisfies requirement" or "zero/off option added per product owner request."
**Warning signs:** REQUIREMENTS.md still shows CONF-02 as Pending after Phase 6 closes.

### Pitfall 4: postcss config removal breaks future dev
**What goes wrong:** If someone later adds a PostCSS-based tool, they won't find the config file.
**Why it happens:** Misunderstanding that the file was "just not needed yet."
**How to avoid:** Leave a comment in `package.json` or in the commit message explaining the build uses Tailwind CLI (not PostCSS pipeline). The file deletion commit message should be explicit.
**Warning signs:** This is a documentation concern, not a runtime concern.

### Pitfall 5: Browser verification against localhost only
**What goes wrong:** Some issues (path prefix, asset 404s) only appear on the deployed GitHub Pages URL (which uses `/library-choices/` prefix), not on `localhost`.
**Why it happens:** Eleventy's `pathPrefix: "/library-choices/"` transforms asset URLs for production but not local dev.
**How to avoid:** Browser verification should be done against the deployed GitHub Pages URL, not `localhost`. Use the live URL after the 06-01 changes deploy.
**Warning signs:** Assets 404 in production, work fine locally.

---

## Code Examples

### Adding `defaultChecked` to config.js cities (verified pattern from reading source)
```js
// src/_data/config.js
cities: [
  {
    id: "providence",
    label: "Providence",
    households: 2100,
    defaultChecked: true,   // Controls initial checked state in template
    source: "Cache County Assessor 2024",
  },
  // ... same for nibley, millville, river-heights
],
```

### Nunjucks conditional checked attribute
```nunjucks
{# src/index.html — replaces hardcoded `checked` on line 78 #}
<input
  type="checkbox"
  name="cities"
  id="city-{{ city.id }}"
  value="{{ city.id }}"
  data-households="{{ city.households }}"
  class="accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
  {% if city.defaultChecked %}checked{% endif %}
/>
```

### Collections `<select>` after `data-cost` removal
```nunjucks
{# src/index.html — remove data-cost attribute entirely #}
<select
  id="collections"
  name="collections"
  class="border border-gray-300 rounded px-3 py-2 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
>
```

### Adding a zero/off option to config.js (only if CONF-02 decision requires it)
```js
// src/_data/config.js — optional, only if product owner requests off option
options: [
  { value: 0, isDefault: false },         // No collections budget
  { value: 10000, isDefault: false },     // PLACEHOLDER
  // ... rest of options
],
```

If a zero option is added, the template label `${{ opt.value | toLocaleString }}/year` would render as `$0/year` — acceptable. The calculator already handles zero collections cost gracefully (adds 0 to staffing cost).

---

## Validation Architecture

`nyquist_validation` is enabled per `.planning/config.json`.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — this is a static site with no unit test suite |
| Config file | none |
| Quick run command | `pnpm run build` (build verification) |
| Full suite command | `pnpm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| CONF-02 | Collections toggle documented decision | manual-only | n/a | Product owner decision; no automated test possible |
| DESG-01 | Civic design visual quality | manual-only | n/a | Requires human browser inspection |
| DESG-02 | Mobile 375px responsive layout | manual-only | n/a | Requires browser DevTools or real device |
| DESG-03 | Tailwind CSS v4 clean design | build check | `pnpm run build` | Build must exit 0; CSS output verified |
| CONF-06 | Shareable URL round-trip | manual-only | n/a | Requires browser interaction |

**Build verification (automated, ~5 seconds):**
```bash
pnpm run build && echo "BUILD OK"
```
Confirms Nunjucks template changes (city defaultChecked, data-cost removal) compile without errors.

**Structural checks (post-build, automated):**
```bash
# Verify data-cost removed from collections select
grep -c 'data-cost' _site/index.html
# Expected: 3 (staffing radios only — 3 radio inputs keep data-cost)

# Verify postcss.config.mjs is gone
ls postcss.config.mjs 2>/dev/null && echo "STILL EXISTS" || echo "REMOVED OK"

# Verify defaultChecked renders checked on all 4 city checkboxes
grep -c 'name="cities".*checked\|checked.*name="cities"' _site/index.html
# Or simpler: count checked attributes in city section
grep -A2 'name="cities"' _site/index.html | grep -c 'checked'
# Expected: 4 (all cities checked by default)
```

### Wave 0 Gaps
None — no new test infrastructure needed. The build itself is the test. All phase work either produces build-verifiable changes or human-verification documentation.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Hardcoded `checked` in template | Config-driven `defaultChecked` flag | Target state for Phase 6 |
| Dead `data-cost` on `<select>` | No `data-cost` on `<select>` | Target state for Phase 6 |
| Unverified browser items in SUMMARY | Verified + documented checklist | Target state for Phase 6 |
| CONF-02 ambiguously "complete" | Explicitly resolved with product decision | Target state for Phase 6 |

---

## Open Questions

1. **CONF-02: Does the collections select satisfy "toggle on/off"?**
   - What we know: The select has 6 budget levels ($10k-$60k). There is no zero/off option. Phase 02 summary recorded CONF-02 as complete, but REQUIREMENTS.md marks it Pending.
   - What's unclear: Whether "toggle on/off" means binary include/exclude or whether the multi-level select satisfies the intent.
   - Recommendation: Plan 06-02 must include a human-verify task asking the product owner to confirm. If they want a zero/off option, the code change is simple (add `{ value: 0, isDefault: false }` to config.js options).

2. **Browser verification: deployed site vs. localhost**
   - What we know: CI deploys to GitHub Pages on push to main. The pathPrefix `/library-choices/` applies only to the deployed URL.
   - What's unclear: Whether the tester has access to the deployed GitHub Pages URL at verification time.
   - Recommendation: Plan 06-02 should note that verification against the deployed URL is preferred. Localhost is acceptable for purely JS/UX checks (tooltip, URL round-trip, zero-city guard) but not for asset path verification.

---

## Sources

### Primary (HIGH confidence)
- Direct read of `src/index.html` — confirmed `data-cost` on `<select>` (line 53), hardcoded `checked` on city checkboxes (line 78)
- Direct read of `src/js/calculator.js` — confirmed `data-cost` not used on select; confirmed `collectionsSelect.value` is the live read path (line 17-18)
- Direct read of `src/_data/config.js` — confirmed no `defaultChecked` field on cities currently
- Direct read of `package.json` build scripts — confirmed Tailwind CLI is used (not PostCSS pipeline)
- Direct read of `postcss.config.mjs` — confirmed it configures `@tailwindcss/postcss` plugin which is unused by the CLI-based build
- Direct read of `.planning/REQUIREMENTS.md` — confirmed CONF-02, DESG-01, DESG-02, DESG-03, CONF-06 all Pending
- Direct read of phase summaries (02-02, 03-01, 04-01, 04-02) — confirmed browser verification items already executed for Phase 4 but not formally documented as a checklist

### Secondary (MEDIUM confidence)
- Tailwind CSS v4 documentation pattern: the standalone CLI (`@tailwindcss/cli`) does not use `postcss.config` files — confirmed by project build behavior (builds succeed without the config being loaded)

---

## Metadata

**Confidence breakdown:**
- Dead code identification: HIGH — confirmed by source code inspection and build script analysis
- Config-driven defaults pattern: HIGH — confirmed Nunjucks conditional attribute is standard; isDefault flag pattern already used for collections
- Browser verification scope: HIGH — copied from ROADMAP.md success criteria and phase summaries
- CONF-02 resolution: MEDIUM — depends on product owner decision; technical path is clear, decision is not

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable project, no external dependencies changing)
