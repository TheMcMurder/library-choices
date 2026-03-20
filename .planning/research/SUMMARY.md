# Project Research Summary

**Project:** Cache County Library Choices — civic property tax impact configurator
**Domain:** Data-driven static site interactive configurator (civic / government-adjacent)
**Researched:** 2026-03-20
**Confidence:** MEDIUM-HIGH

## Executive Summary

This project is a single-page civic configurator that lets residents of Cache County cities calculate their per-household annual property tax impact under different library staffing, collections, and city-participation scenarios. Experts build tools like this as static sites with data-embedded build-time rendering: a static site generator (Eleventy) consumes a single data file at build time, inlines the scenario numbers as JSON into the HTML, and a small vanilla JavaScript file handles all runtime calculation with zero network requests. The pattern is well-established, has no server requirements, deploys for free on GitHub Pages, and allows a non-developer site owner to update numbers by editing one file.

The recommended stack is Eleventy v3 + Tailwind CSS v4 + vanilla JavaScript. Eleventy's `_data/` convention makes the data file the single source of truth for both the rendered HTML controls and the runtime calculation data. Tailwind v4's CSS-native configuration (no `tailwind.config.js`) simplifies the build pipeline. The entire calculator is approximately 50 lines of arithmetic and DOM manipulation — no component framework is warranted. Alpine.js is available as an upgrade path if shareable URL state encoding (a v1.x feature) creates complex state management needs, but is not required for the MVP.

The three most important risks to mitigate are: (1) GitHub Pages subdirectory path breaking all asset references if root-relative paths are used — fix this at project scaffolding time, not after; (2) Tailwind v4's JIT scanner dropping dynamic class names built from string interpolation — use explicit literal class strings or a lookup object; and (3) floating-point arithmetic producing display errors in the tax calculation — store monetary values as integers and format at display time only. A fourth risk specific to this domain: presenting estimated city data with the same authority as confirmed figures undermines civic credibility — the data schema must include a `status` field and `as_of_date` from day one.

## Key Findings

### Recommended Stack

Eleventy v3 is the right SSG for this project. Its `_data/` filename convention provides the data-embedding pipeline without any configuration: `_data/config.js` is automatically available to all Nunjucks templates as the variable `config`. The `{{ config | dump | safe }}` template expression then inlines the full data object as JSON into a `<script>` tag, making the data synchronously available to `calculator.js` at runtime with no fetch calls. Tailwind v4 (confirmed stable as of April 2025) replaces `tailwind.config.js` with a CSS-native `@theme` block inside `src/css/input.css` and uses `@tailwindcss/postcss` as the PostCSS integration — ARCHITECTURE.md's reference to `tailwind.config.js` reflects a v3 pattern and should not be created.

**Core technologies:**
- Eleventy v3: static site generator — purpose-built for data-driven HTML generation with zero client-side framework cost
- Tailwind CSS v4.1 + `@tailwindcss/postcss`: utility-first CSS — CSS-native config, mobile-first by default, auto content detection
- Vanilla JavaScript (ES2020+): runtime calculator — ~50 lines of arithmetic and DOM mutation, no framework or bundler needed
- Nunjucks v3.2: templating — supports the `| dump | safe` pattern required to embed the data object
- GitHub Actions + `actions/deploy-pages@v4`: CI/CD — reproducible builds, `_site/` never committed to `main`

Alpine.js v3 is the recommended upgrade path (not v1 MVP requirement) if shareable URL state encoding grows complex. Node.js 18+ is required for Eleventy v3.

### Expected Features

The research identifies 9 must-have features for the v1 launch (what's needed for a city council meeting), 3 should-have features for v1.x (add after validation), and 2 deferred to v2+.

**Must have (table stakes):**
- Real-time calculation display — the entire purpose of the tool; update on every input event
- Single prominent output number (annual cost per household) — large typographic treatment, above fold on mobile
- Labeled controls with plain-language explanatory copy — civic audiences are not specialists
- Source/methodology transparency block — citizens distrust numbers without provenance
- Mobile-responsive layout with 44px+ touch targets — majority of civic web traffic is mobile
- WCAG 2.1 AA accessibility — keyboard navigation, `aria-live` on result region, 4.5:1 contrast
- Edge-case handling: zero cities selected shows guidance message, not NaN or $Infinity
- Data-last-updated date — numbers are actively changing; users must see when data was current
- Print stylesheet (`@media print`) — council meeting use case requires paper output

**Should have (v1.x differentiators):**
- Shareable URL encoding — encode staffing/collections/city state in URL query params for sharing scenarios
- Scenario summary auto-generated text — plain-English sentence of current configuration removes ambiguity
- Cost breakdown display (staffing / collections subtotals) — helps citizens understand where money goes

**Defer (v2+):**
- Multi-language support (Spanish) — defer until non-English-speaker engagement is confirmed
- Embed/iframe mode — defer unless a city website explicitly requests it

**Explicitly out of scope (anti-features):** User accounts, per-parcel property tax rate display, animated number output, comparison mode, embedded comment section, real-time external data sync.

### Architecture Approach

The architecture is a clean three-layer pipeline: build-time data embedding, static HTML output, and pure-runtime calculation. `_data/config.js` is the single source of truth — it feeds both the Nunjucks template (which renders form controls from the data arrays at build time) and the runtime calculator (via the embedded `window.LIBRARY_DATA` JSON object). Calculator logic lives in a separate `src/js/calculator.js` file that Eleventy passthrough-copies to `_site/`, keeping logic independently testable. The build pipeline is `npm run build` → Eleventy renders templates + PostCSS transforms CSS; no bundler is needed because `calculator.js` has no npm imports. GitHub Actions deploys `_site/` to GitHub Pages; `_site/` is gitignored on `main`.

**Major components:**
1. `_data/config.js` — single source of truth for all costs, household counts, city names, status flags, and `as_of_date`
2. `src/index.njk` — Nunjucks template that renders HTML controls from data arrays and embeds data as JSON; build-time only
3. `src/js/calculator.js` — runtime calculator: reads `window.LIBRARY_DATA`, attaches change listeners, updates DOM result on every input event
4. `src/css/input.css` — Tailwind v4 entry point (`@import "tailwindcss"` + `@theme` block)
5. `.eleventy.js` — Eleventy config: input/output dirs, passthrough copies, PostCSS plugin wire-up
6. `.github/workflows/deploy.yml` — GitHub Actions: `npm ci && npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`

### Critical Pitfalls

1. **GitHub Pages subdirectory path (asset 404s)** — Use relative asset paths (`./css/main.css` not `/css/main.css`) or configure Eleventy's `pathPrefix` to `/repo-name/` from day one. Verify the deployed URL explicitly as a done-criterion for the initial deploy phase.

2. **Tailwind JIT drops dynamically assembled class names** — Never build class strings via concatenation or template literals. Use explicit literal strings or a lookup object (`{ low: 'text-green-700', high: 'text-red-700' }`). Run a production build and inspect the output CSS for all conditional classes before shipping.

3. **Floating-point arithmetic in tax calculation** — Store all monetary values in the data file as integers (dollars or cents). Format with `toFixed(2)` only at the final display step, never on intermediate values. Unit-test the calculation function with edge-case values before wiring to UI.

4. **Partial/estimated data presented as authoritative** — The data file schema must include a `status` field (`"confirmed"` vs `"estimated"`) and an `as_of_date` field from the start. Template must render caveats for estimated figures. Retrofitting this after launch when civic trust is damaged is costly.

5. **Non-developer data file update workflow breaks** — Use a flat, readable data file format (JSON or the JS module with comments). Validate the data file in CI on every push. Explicitly test the non-developer update flow (simulate a GitHub web editor edit) before launch.

## Implications for Roadmap

Based on research, the natural phase structure follows the data dependency chain: infrastructure first, then data schema, then UI components, then calculation logic, then polish and accessibility hardening.

### Phase 1: Project Scaffolding and Initial Deploy

**Rationale:** The GitHub Pages subdirectory path pitfall (Pitfall 1) must be resolved before any asset references are written. Establishing the Eleventy + Tailwind + PostCSS pipeline and verifying a deployed "Hello World" page eliminates the most catastrophic failure mode before any real work is done. Cache key strategy for GitHub Actions must also be set correctly here.

**Delivers:** Working build pipeline, verified GitHub Pages deployment with correct asset paths, CI/CD workflow, `_site/` gitignored, Node 18 pinned.

**Addresses:** Foundation for all subsequent phases; no features yet.

**Avoids:** Pitfall 1 (GitHub Pages subdirectory path), Pitfall 7 (stale CI cache).

**Research flag:** Standard patterns, well-documented. No additional research needed.

### Phase 2: Data File Schema and Nunjucks Template Shell

**Rationale:** The data file schema must be locked before templates are written against it — retrofitting a `status`/`as_of_date` field after templates and calc logic are complete is painful. This phase also establishes the non-developer update workflow (format choice, CI validation, documentation) before the owner has any reason to touch the file under time pressure.

**Delivers:** `_data/config.js` with finalized schema (staffing options, cities with household counts, `status`, `as_of_date`, collections cost); `src/index.njk` rendering all controls from data arrays; data embedded as `window.LIBRARY_DATA` in `<script>` tag; labeled controls with plain-language copy; data-last-updated date in footer; print stylesheet skeleton.

**Addresses:** Source/methodology transparency, data-last-updated date, labeled controls (all table-stakes features), Pitfall 4 (estimated data), Pitfall 6 (fragile update workflow).

**Avoids:** Anti-pattern of hardcoded numbers in templates; anti-pattern of fetching data at runtime.

**Research flag:** Standard patterns. No additional research needed. Verify `{{ config | dump | safe }}` output in actual Eleventy v3 build.

### Phase 3: Calculator Logic and Accessibility

**Rationale:** Calculation logic is independent of UI styling and should be written and unit-tested before the visual layer is polished. Accessibility controls (native `<input>` elements, `aria-live`, touch targets) are cheapest to implement correctly from the start — retrofitting after custom `<div>` controls are styled is painful. Floating-point arithmetic correctness is validated in this phase before the output is trusted.

**Delivers:** `src/js/calculator.js` with all arithmetic (staffing cost + optional collections cost, divided by total participating-city households), `aria-live` result region, edge-case zero-cities guard, integer arithmetic with `toFixed(2)` display formatting, unit tests for the calculation function, keyboard navigation verified, 44px touch targets on all controls, real-time update on every input event.

**Addresses:** Real-time calculation display, single prominent output, WCAG 2.1 AA, edge-case handling, mobile touch targets (all table-stakes P1 features).

**Avoids:** Pitfall 3 (floating-point errors), Pitfall 5 (custom div checkboxes breaking accessibility), anti-pattern of one giant script block in template.

**Research flag:** Standard patterns for vanilla JS DOM manipulation and ARIA. No additional research needed. Run `axe` or Lighthouse accessibility audit as done-criterion.

### Phase 4: Styling and Mobile Polish

**Rationale:** With working structure and logic, Tailwind utility classes can be applied confidently. This is where Pitfall 2 (dynamic class name purging) surfaces — establishing the lookup-object pattern for conditional classes here prevents styling regressions in production builds.

**Delivers:** Full Tailwind responsive layout (mobile-first), prominent output number typography, source/methodology block styled, print stylesheet complete (`@media print` hides controls, shows scenario summary), production build verified with all conditional CSS classes present in output.

**Addresses:** Mobile-responsive layout, print-friendly rendering (completing all table-stakes P1 features).

**Avoids:** Pitfall 2 (Tailwind JIT dropping dynamic classes).

**Research flag:** Standard patterns. Tailwind v4 `@theme` block and peer/sibling selector patterns for custom-styled native inputs are well-documented. No additional research needed.

### Phase 5: v1.x Enhancements (Post-Validation)

**Rationale:** These features are valuable but not required for the initial council meeting use case. Adding them after v1 validation ensures they respond to real observed needs rather than anticipated ones.

**Delivers:** Shareable URL encoding (all form state in `URLSearchParams`), auto-generated scenario summary text, cost breakdown display (staffing / collections subtotals). Optionally: Alpine.js if URL state management complexity warrants the upgrade.

**Addresses:** Shareable URL (P2), scenario summary (P2), cost breakdown (P2).

**Research flag:** Shareable URL encoding with `URLSearchParams` is standard. If Alpine.js is introduced, its `x-data` / `$store` patterns for state serialization will benefit from a focused research spike — but this is unlikely to be needed.

### Phase Ordering Rationale

- Infrastructure before content: Deploying a broken page from day one (wrong paths) is demoralizing and wastes all subsequent effort.
- Data schema before templates: Templates cannot be written correctly until the data shape is stable; and schema changes after templates exist require coordinated changes across multiple files.
- Logic before styling: A correctly calculated number in unstyled HTML is more valuable than a beautifully styled calculator that produces wrong output.
- Styling before v1.x features: Polish the core experience before adding shareable URL complexity.
- This order also naturally stages the pitfall mitigations: infrastructure pitfalls in Phase 1, data pitfalls in Phase 2, calculation and accessibility pitfalls in Phase 3, styling pitfalls in Phase 4.

### Research Flags

Phases with standard patterns (skip research-phase):
- **Phase 1:** GitHub Pages + GitHub Actions deployment is thoroughly documented and stable.
- **Phase 2:** Eleventy `_data/` convention and Nunjucks `| dump | safe` pattern are well-established.
- **Phase 3:** Vanilla JS DOM manipulation, ARIA live regions, and WCAG touch target requirements are well-documented stable standards.
- **Phase 4:** Tailwind v4 utility classes and peer selector patterns for native input styling are documented.

Phases that may benefit from a research spike:
- **Phase 5 (if Alpine.js is introduced):** Alpine v3 `x-data` + `URLSearchParams` integration pattern is moderately documented but the specific state serialization for URL encoding merits a focused spike before implementation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | Tailwind v4 versions confirmed from official sources (HIGH). Eleventy v3 and Alpine.js v3 from training data through August 2025 (MEDIUM — current patch versions unverified but major version and APIs are stable). |
| Features | MEDIUM | WCAG standards are stable and HIGH confidence. Civic UX patterns (shareable URLs, source transparency) are well-established community practice (MEDIUM). Competitor feature sets unverified live. |
| Architecture | HIGH | Eleventy data cascade and GitHub Pages Actions deployment are well-established, stable patterns. Data embedding pattern is industry-standard for this class of tool. |
| Pitfalls | HIGH | GitHub Pages path behavior, Tailwind JIT scanner behavior, IEEE 754 floating-point, and WCAG touch targets are all verified against official documentation or stable specifications. Civic data credibility pattern is domain knowledge (MEDIUM). |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Eleventy v3 current patch version:** Training data is reliable for the v3 API but the exact current patch release is unverified. Run `npm info @11ty/eleventy version` at project setup and pin to the current release in `package.json`.
- **Alpine.js state serialization pattern:** If Alpine is introduced in Phase 5, validate the `x-data` + `URLSearchParams` round-trip pattern against the current Alpine v3 docs before implementing — this is the one area where training data confidence is lower.
- **Actual household count and cost figures:** The data file schema is designed, but the real numbers (household counts per city, confirmed vs. estimated staffing costs) must be sourced from Cache County records or city council documents before launch. This is a content gap, not a technical one.
- **Non-developer edit simulation:** The PITFALLS research recommends explicitly testing a non-developer edit of `_data/config.js` via GitHub's web editor before launch. This test must be performed by or with the actual site owner, not just assumed to work.

## Sources

### Primary (HIGH confidence)
- Tailwind CSS official blog — v4.0 stable (January 22, 2025), v4.1 release (April 3, 2025): https://tailwindcss.com/blog/tailwindcss-v4 and https://tailwindcss.com/blog/tailwindcss-v4-1
- Tailwind CSS installation docs — v4.2 current, PostCSS integration: https://tailwindcss.com/docs/installation
- Tailwind CSS content configuration — JIT scanner behavior, dynamic class names: https://tailwindcss.com/docs/content-configuration
- MDN Web Docs — ARIA checkbox role, native input best practices: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role
- WCAG 2.5.5 — Touch target minimum 44x44px: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- GitHub Pages Actions deployment pattern — `actions/deploy-pages` (established since 2022)

### Secondary (MEDIUM confidence)
- Eleventy v3 global data files and data cascade — training data through August 2025: https://www.11ty.dev/docs/data-global/
- Alpine.js v3 bundle size (~15KB), reactive model — training data
- Civic technology UX patterns — Code for America, Sunlight Foundation community practice: shareable URLs, source transparency, plain-language labeling
- Astro v5.0 (December 2024) — comparison point for alternatives

### Tertiary (LOW confidence / needs live validation)
- Competitor civic tool feature sets (Balancing Act, OpenGov) — training data, may have evolved
- Civic tech "estimated vs. confirmed" data distinction pattern — domain knowledge, post-mortem inference

---
*Research completed: 2026-03-20*
*Ready for roadmap: yes*
