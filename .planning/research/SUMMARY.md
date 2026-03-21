# Project Research Summary

**Project:** Cache County Library Choices — v1.1 UX Improvements
**Domain:** Civic interactive static site — range slider + schedule display on existing Eleventy v3 + Tailwind v4 + vanilla JS stack
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

This is a targeted v1.1 improvement to a shipped civic tax calculator. The two features are well-scoped: replace the collections budget `<select>` dropdown with a native `<input type="range">` with discrete nodes and live descriptions, and add structured weekly schedule data to the staffing section (reframed as "Hours Open"). Research confirms both features are fully achievable with zero new npm dependencies — everything needed is already in the browser, in the Eleventy/Tailwind stack, or in the existing JavaScript files. No `package.json` changes are expected.

The recommended approach is additive and conservative. The collections slider preserves the existing element id (`id="collections"`) and `.value` API so that `calculator.js` and `url.js` require minimal changes — only `url.js`'s `restoreFromUrl()` validation logic needs a one-line fix to replace `select.options` iteration with a `LIBRARY_DATA` lookup. The schedule display is pure Nunjucks server-side rendering with zero JavaScript footprint. Both features extend `config.js` with new fields (`description`/`label` on collections options; `schedule[]` on staffing levels) and require NON-DEVELOPER EDIT GUIDE updates so the non-technical product owner can maintain the site.

The two primary risks are URL backward compatibility and accessibility. Shared links already exist containing `collections=30000` — any change to encoding format silently breaks them. The slider must also update `aria-valuetext` dynamically or screen reader users will hear meaningless integers instead of citizen-meaningful labels. Both risks have well-defined, low-effort prevention strategies confirmed by official sources. A natural two-phase structure keeps the riskier slider work (which touches four files) isolated from the lower-risk schedule reframe (config + template only).

## Key Findings

### Recommended Stack

No additions to the existing stack are required. The project already has Eleventy v3.1.5, Tailwind v4.2.2 (standalone CLI), and vanilla JS IIFEs. Native `<input type="range">` is Baseline Widely Available since 2017 across all modern browsers. Range slider npm packages (noUiSlider, ion.rangeSlider) and schedule display libraries are explicitly ruled out — both add bundle weight and maintenance burden for problems the native platform solves directly.

The one cross-browser complication is slider styling: vendor pseudo-elements (`::-webkit-slider-thumb`, `::-moz-range-thumb`, etc.) must be written in `@layer base` in `style.css`. Firefox also does not render `<datalist>` tick marks (Bugzilla #841942, open since 2013), so visual node labels must be a CSS-positioned `<span>` row, not a datalist. `accent-color` provides a zero-complexity baseline styling option if custom thumb/track CSS is deferred.

**Core technologies:**
- `<input type="range">` (browser-native): discrete 6-node slider — no polyfill, no library needed
- `aria-valuetext` (browser-native ARIA): screen-reader-meaningful label, updated dynamically on `input` event
- Nunjucks `{% for %}` loop (Eleventy-bundled): renders slider labels, schedule rows, and all config-driven UI
- Vanilla JS `input` event (browser-native): live description updates during drag; additive to existing `change` listener
- `@layer base` in `style.css` (Tailwind v4): cleanest location for vendor-prefixed slider pseudo-element CSS

### Expected Features

All v1.1 features are P1 (must-have for launch) or P2 (should-have, add when capacity allows). The MVP is small and tightly scoped.

**Must have (table stakes):**
- Collections slider snaps to exactly 6 discrete values — `step` attribute derived from config at template render time
- Per-node description text updates live during drag via `input` event
- `aria-valuetext` updated dynamically — WCAG 2.1 AA requirement; screen readers need label text, not raw integer
- URL backward compatibility preserved — `collections=30000` encoding unchanged; only `restoreFromUrl()` validation changes
- Live recalculation during drag — `form.addEventListener('input', updateResult)` added alongside existing `change` listener
- "Hours Open" section heading — legend text change; internal ids and cost data unchanged
- Structured weekly schedule per staffing level — `schedule[]` array in config.js; Nunjucks `<ul>` render, no JS
- NON-DEVELOPER EDIT GUIDE updated to cover schedule format with copy-pasteable examples

**Should have (differentiators):**
- Tick marks / node labels — `<datalist>` for Chrome/Safari; CSS `<span>` row for cross-browser visual nodes
- Dollar amount label above thumb — explicit `$30,000` above slider in addition to contextual description

**Defer (v2+):**
- Animated schedule transition on staffing change — motion disorder risk; instant update is more accessible

### Architecture Approach

The existing architecture is a clean three-layer static site: `config.js` is the single source of truth, Eleventy/Nunjucks renders it into HTML with `window.LIBRARY_DATA` embedded as a JSON literal, and two IIFEs (`calculator.js`, `url.js`) handle all runtime behavior. V1.1 extends this pattern without introducing new components. The slider's description update logic (~8 lines) belongs in `calculator.js` where all form interaction logic already lives — creating a new `slider.js` would add a third IIFE and load-order concerns for trivial code.

Script load order must be preserved: `window.LIBRARY_DATA` inline script → `calculator.js` → `url.js`. `url.js` depends on `calculator.js` having already bound its `change` listener before url.js dispatches a `change` event to trigger recalculation after URL restore.

**Major components and v1.1 changes:**
1. `_data/config.js` — gains `description`/`label` on each collections option; gains `schedule[]` on each staffing level
2. `src/index.html` (Nunjucks template) — replaces `<select>` with `<input type="range">`; adds schedule `<ul>` inside staffing loop; renames legend to "Hours Open"
3. `src/js/calculator.js` — gains `input` event listener for description + `aria-valuetext` updates (~8 lines additive); gains `form.addEventListener('input', updateResult)`
4. `src/js/url.js` — one block replaced in `restoreFromUrl()`: `Array.from(select.options)` → `LIBRARY_DATA.collections.options.map(...)` validation

### Critical Pitfalls

1. **URL backward compatibility broken by encoding format change** — Keep encoding collections as the dollar-amount string (`collections=30000`). Slider `.value` returns the same string integer as `select.value`. Only `restoreFromUrl()`'s validation needs updating; encoding logic is unchanged. Verify with a pre-v1.1 URL in acceptance criteria.

2. **Calculator produces wrong tax figure when step/min/max are hardcoded** — Derive `min`, `max`, `step` from `config.collections.options` at template render time. Never hardcode — config is owner-editable. The current config has uniform $10k spacing; document this assumption.

3. **Live result bar frozen during mobile drag** — `change` fires only on touchend; `input` fires continuously. Add `form.addEventListener('input', updateResult)` in `calculator.js`. One line. Required for any mobile user.

4. **Screen reader announces raw integer instead of citizen-meaningful label** — `aria-valuetext` must be set dynamically on every `input` event. Omitting this fails WCAG 2.1 AA. Include VoiceOver/NVDA manual test in acceptance criteria.

5. **Staffing `id` values renamed during "Hours Open" reframe — breaks URL contract** — The `id` field in `staffingLevels` (`"1fte"`, `"1fte-1pte"`, `"1fte-2pte"`) is the URL-encoded identifier. Only `label` and `description` are citizen-facing copy; `id` is immutable once deployed. Mark this in `config.js` with a comment.

## Implications for Roadmap

The research points to a natural two-phase structure. The slider is the more architecturally significant change (touches four files and carries all accessibility and URL-contract risk) and should be isolated as Phase 1. The staffing reframe is additive and low-risk (config schema extension + Nunjucks template only) but carries its own URL-contract risk that requires separate verification.

### Phase 1: Collections Budget Slider

**Rationale:** Highest-complexity change in v1.1. Touches four files (`config.js`, `index.html`, `calculator.js`, `url.js`) and carries five of the seven identified pitfalls. Must be implemented atomically — a partial slider leaves `url.js`'s `restoreFromUrl()` broken. Completing this first validates the event model (input vs. change) and confirms URL backward compatibility before any further changes.

**Delivers:** Native `<input type="range">` replacing the dropdown; live description and `aria-valuetext` updates during drag; backward-compatible URL encoding; live drag recalculation on mobile; cross-browser node labels via CSS label row.

**Addresses:** All P1 slider features from FEATURES.md — discrete snap, description text, `aria-valuetext`, URL compatibility, mobile drag recalculation.

**Avoids:** Pitfall 1 (URL encoding format change), Pitfall 2 (hardcoded step/min/max), Pitfall 3 (frozen mobile drag), Pitfall 4 (screen reader raw integer), Pitfall 5 (datalist-only tick marks).

**Acceptance criteria must include:** URL round-trip test with pre-v1.1 `?collections=30000` link; mobile drag result update; VoiceOver/NVDA `aria-valuetext` verification; Firefox + Safari visual test for node labels.

### Phase 2: Hours Open Schedule Display

**Rationale:** Zero JavaScript changes — verifiable entirely at build time by inspecting generated HTML. The only risks are the staffing `id` URL contract (Pitfall 6) and the NON-DEVELOPER EDIT GUIDE gap (Pitfall 7), both of which are documentation and review concerns rather than implementation risks. Deferring to Phase 2 keeps Phase 1 focused.

**Delivers:** `schedule[]` arrays in config.js for all three staffing levels; Nunjucks `<ul>` rendering inside staffing radio loop; "Hours Open" legend rename; updated NON-DEVELOPER EDIT GUIDE with schedule format examples and time format decision documented.

**Addresses:** "Hours Open" heading (P1), structured schedule display (P1), citizen-editable schedule data (P1), edit guide update (P1).

**Avoids:** Pitfall 6 (staffing id URL contract broken by rename); Pitfall 7 (edit guide missing for schedule format).

**Acceptance criteria must include:** Shared URL `?staffing=1fte-2pte` restores correctly after reframe; all three staffing level schedules render; config.js NON-DEVELOPER EDIT GUIDE covers schedule format with a copy-pasteable example.

### Phase Ordering Rationale

- Phase 1 first because it is the only change with breaking-change risk to existing JavaScript files. Isolating it makes the QA surface clear and keeps the broken-state window (when `url.js` validation is temporarily inconsistent) as short as possible.
- Phase 2 second because it has zero JavaScript changes and zero dependency on Phase 1 changes. It could theoretically be done in any order, but sequencing it after Phase 1 means the slider is validated before the template is further modified.
- Both phases are small enough to complete in a single working session each. There is no case for further subdivision.
- CSS slider styling (thumb/track vendor pseudo-elements) belongs in Phase 1. If it proves time-consuming, `accent-color` provides a functional WCAG 2.1 AA baseline while custom styling is deferred to a P2 follow-up.

### Research Flags

Phases with standard patterns (no additional research needed):
- **Phase 1 (slider):** All patterns are well-documented in MDN, W3C WAI APG, and USWDS. Exact code blocks for every required change are provided in ARCHITECTURE.md. No research phase needed.
- **Phase 2 (schedule):** Pure config extension and Nunjucks loop. Zero ambiguity. No research phase needed.

Neither phase requires `/gsd:research-phase` during planning. Research is complete and actionable at the implementation level.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified from `package.json` (direct inspection), MDN official docs, Bugzilla official tracker. No ambiguity about what exists and what to add. |
| Features | HIGH | W3C WAI APG, USWDS, and direct codebase inspection. All feature decisions traced to authoritative sources or observed civic site patterns. |
| Architecture | HIGH | All analysis based on direct codebase inspection (calculator.js, url.js, config.js, index.html). Component change matrix is exact, not inferred. |
| Pitfalls | HIGH | Grounded in direct codebase inspection and official bug trackers (Bugzilla #841942, Chromium #40771904). Recovery costs and prevention steps are specific. |

**Overall confidence:** HIGH

### Gaps to Address

- **Schedule time format decision:** PITFALLS.md flags that the time format (`"9:00 AM"` vs. `"9am"` vs. `"09:00"`) must be decided before writing the Nunjucks template renderer and the edit guide. The format choice must appear in config, template, and EDIT GUIDE consistently. Decide this as the first step of Phase 2 planning.

- **Slider CSS scope decision:** Whether to implement full custom thumb/track styling (vendor pseudo-elements in `@layer base`) or use `accent-color` as a baseline should be decided before Phase 1 starts. Research recommends `accent-color` as a fast path — full custom styling is a P2 option if design requires it.

- **Schedule visibility approach:** STACK.md documents two options: always-visible schedules inline below each radio (Option 1, no JS) vs. show-on-selection (Option 2, JS toggle). Research recommends Option 1 for v1.1. Confirm in requirements before Phase 2 template work begins.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — `<input type="range">` spec, `aria-valuetext`, `input` vs. `change` event model, vendor pseudo-elements
- W3C WAI ARIA Authoring Practices Guide — slider pattern keyboard interaction, `aria-valuetext` requirements, range-related properties
- U.S. Web Design System (USWDS) — range slider component, civic UX conventions
- Mozilla Bugzilla #841942 — Firefox `datalist`+`range` tick marks (open since 2013, unresolved 2026)
- Chromium Issue #40771904 — Chrome hides `<datalist>` option labels on range inputs
- Direct codebase inspection: `src/js/calculator.js`, `src/js/url.js`, `src/_data/config.js`, `src/index.html`, `package.json`

### Secondary (MEDIUM confidence)
- Tailwind CSS v4 GitHub discussion #8748 — range input styling patterns in Tailwind v4
- CSS-Tricks "Styling Cross-Browser Compatible Range Inputs with CSS" — vendor pseudo-element pattern
- CSS-Tricks "A Sliding Nightmare — Understanding the Range Input" — cross-browser tick mark inconsistencies
- Impressive Webs "onchange vs. oninput for Range Sliders" — `change` fires on commit only; `input` needed for live drag
- Real library hours display: Livermore CA, Torrance CA, Chula Vista CA civic sites — schedule format convention confirmed

### Tertiary (LOW confidence)
- caniuse.com datalist browser support — WebSearch result, could not WebFetch directly; findings corroborated by Bugzilla official tracker

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
