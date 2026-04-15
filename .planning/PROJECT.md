# Cache County Library Choices

## What This Is

An interactive, mobile-first static website that helps Cache County citizens understand the fiscal choices around keeping their county library open. Users configure their own scenario — staffing level ("Hours Open"), collections funding, and which cities participate — and instantly see the resulting property tax impact per household. All controls are citizen-meaningful: a slider with per-level descriptions, inline weekly schedules for each hours option, and city cards showing name and household count. The site is built as a static site (Eleventy + Tailwind) with a separate data file so numbers can be updated without touching templates.

## Core Value

Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## Current State (v1.8 shipped 2026-04-15)

All milestones shipped. The configurator now shows an itemized breakdown — each cost component (Hours Open, Digital, Physical) visible alongside the per-household total. Real Providence Library wage data drives staffing costs. All 72 tests passing.

- **Live at:** https://mcmurdie.github.io/library-choices/
- **Tech stack:** Eleventy v3 ESM + Tailwind CSS v4 (standalone CLI) + Nunjucks templates
- **Data file:** `src/_data/config.js` — all costs, city names, household counts, staffing levels, schedules
- **Build:** `pnpm run build` → `_site/` | CI: GitHub Actions deploys on push to `main`
- **Tests:** Vitest 2.x — 48 tests across 3 files (`test/config.test.js`, `test/calculator.test.js`, `test/url.test.js`); non-blocking CI via `.github/workflows/test.yml`
- **Codebase:** ~1,400 LOC across src/ (HTML, Nunjucks, JS, CSS) + pure helper ESM modules in `src/js/lib/`
- **URL sharing:** Compact pi/tau/phi params (~20 chars) with backward-compatible verbose decode
- **Sliders:** Both collection sliders use 0-based index domain (not dollar amounts); calculator resolves index → dollar at read time via `options[idx].value`
- **Real data:** Digital collections ($5k/$15k/$30k/$55k/$65k, $55k current), physical ($15k current), all sourced from librarian's NOTES.md

## Requirements

### Validated (v1.0)

- ✓ Deploy to GitHub Pages — v1.0
- ✓ All dollar amounts and household counts live in a single data file — v1.0
- ✓ Staffing level options with radio buttons — v1.0
- ✓ City participation checkboxes (Providence, Nibley, Millville, River Heights) — v1.0
- ✓ Live configurator with three independent choice dimensions — v1.0
- ✓ Tax calculation: total annual cost ÷ total participating households — v1.0
- ✓ Mobile-first responsive design (375px+) — v1.0
- ✓ Civic-appropriate visual design (blue-800 header, sticky result bar) — v1.0
- ✓ URL shareability — copy URL restores exact selections — v1.0
- ✓ WCAG 2.1 AA: screen reader aria-live, keyboard focus rings, 44px touch targets — v1.0
- ✓ Collections select satisfies independent toggle — v1.0

### Validated (v1.1)

- ✓ Collections budget slider with 6 citizen-meaningful description nodes — v1.1
- ✓ Live drag and keyboard updates; URL restoration syncs slider labels — v1.1
- ✓ Screen reader aria-valuetext with citizen-meaningful label on every change — v1.1
- ✓ Staffing section reframed as "Hours Open" with inline weekly schedules — v1.1
- ✓ Schedule data in config.js; NON-DEVELOPER EDIT GUIDE covers schedule editing — v1.1
- ✓ Compact pi/tau/phi URL params (~72% shorter); backward-compatible verbose decode — v1.1
- ✓ Staffing options as full-width clickable card elements (CSS-only via has-[:checked]) — v1.1
- ✓ Slider tick labels as clickable buttons that snap slider to value — v1.1
- ✓ City options as full-width clickable card elements with name, household count, citation — v1.1
- ✓ Keyboard focus indicators use outline-offset so focus ring appears outside selection ring — v1.1

### Validated (v1.2)

- ✓ Persistent "current service level" indicator on staffing cards (CURR-01) — Validated in Phase 13
- ✓ Persistent "current service level" indicator on collections slider tick (CURR-02) — Validated in Phase 13
- ✓ Indicator driven by `isCurrentServiceLevel` flag in config.js — not hardcoded (CURR-03) — Validated in Phase 13
- ✓ Amber ring and "Current level" badge on current staffing card; persists alongside blue selection ring (CURR-04) — Validated in Phase 13
- ✓ Amber tick styling preserved by JS guard as slider moves; returns to amber when step deselected (CURR-05) — Validated in Phase 13

### Validated (v1.3)

- ✓ Digital collections budget slider (5 options, $5k–$20k, independent) — Validated in Phase 14
- ✓ Physical print collections budget slider (5 options, $0–$20k, independent) — Validated in Phase 14
- ✓ Both sliders rendered by shared Nunjucks macro; additive in tax calculation — Validated in Phase 14
- ✓ URL encodes digital as `delta` (index), physical reuses `tau` (index) — Validated in Phase 14
- ✓ `isCurrentServiceLevel` amber tick on both sliders — Validated in Phase 14
- ✓ Vitest 2.x with 21 tests: config structure, calculator math, URL encode/decode (TEST-01 to TEST-05) — Validated in Phase 16
- ✓ Pure helper ESM modules extracted from calculator.js and url.js IIFEs (TEST-06) — Validated in Phase 16
- ✓ Non-blocking GitHub Actions CI workflow running pnpm test on push/PR (TEST-07) — Validated in Phase 16
- ✓ calculator.js and url.js refactored from IIFEs to flat ES modules importing lib helpers (CALC-01 to CALC-07) — Validated in Phase 17
- ✓ Digital collections 5 real tiers ($5k/$15k/$30k/$55k/$65k), $55k as current service level (DATA-01, DATA-02) — Validated in Phase 18
- ✓ Physical collections $15k as current service level (DATA-03) — Validated in Phase 18
- ✓ Staffing descriptions updated with operational context (DATA-04) — Validated in Phase 18
- ✓ Programming cost comment block in config.js (DATA-05) — Validated in Phase 18
- ✓ Source attributions cite NOTES.md (DATA-06) — Validated in Phase 18

### Validated (v1.7)

- ✓ `slider.njk` range input uses 0-based index as value domain (`min="0"`, `max="{{ options | length - 1 }}"`) — Validated in Phase 19
- ✓ Tick buttons use `data-value="{{ loop.index0 }}"` — click-to-snap writes index to slider.value — Validated in Phase 19
- ✓ `calculator.js` resolves index to dollar amount via `options[idx].value` at read time — Validated in Phase 19
- ✓ `url-helpers.js` `encodeIndices` accepts indices directly, no `findIndex` for digital/physical — Validated in Phase 19
- ✓ `url.js` reads/writes slider index throughout; URL round-trip passes indices — Validated in Phase 19
- ✓ staffingLevels replaced with real Providence Library wage data: Essential ($56,160/yr, 35hr/wk), Standard ($76,440/yr, 44hr/wk, current service level), Full Service ($160,000/yr, 44hr/wk FTE director) — Validated in Phase 20 (HRS-01)

### Validated (v1.8)

- ✓ Two-line result bar: per-household cost (large) + total cost (smaller, blue-200) via innerHTML spans (D-01) — Validated in Phase 21
- ✓ Empty state correctly uses textContent message + innerHTML = '' for popover clear (D-02) — Validated in Phase 21
- ✓ Accounting-style formula popover with Hours Open, Digital, Physical rows (D-03) — Validated in Phase 21
- ✓ All 3 cost rows always rendered even when $0 (D-04) — Validated in Phase 21
- ✓ HTML table with tabular-nums, border-blue-700 separator, semibold Total row, and division equation (D-05) — Validated in Phase 21
- ✓ Human visual verification approved for two-line bar and formula popover on desktop (D-06) — Validated in Phase 21

### Deferred (post-v1.8)

- Scenario summary text — human-readable sentence describing the selected combination (ENH-01)
- Print stylesheet — printable version of the configured scenario (ENH-02)
- Real household counts and cost figures sourced from Cache County records (content gap)
- Non-developer edit workflow tested with site owner via GitHub web UI

### Out of Scope

- Per-city cost breakdown — cost per household is uniform across cities by formula
- Logan, Hyrum, and cities that have already built their own libraries
- Backend / server-side logic — fully static
- User accounts or saved scenarios
- Per-city tax rates — uniform per-household split is the agreed model
- Animated schedule transitions — motion disorder risk; instant update is more accessible

## Context

The Cache County Council is shutting down the county library program. Several cities — Providence, Nibley, Millville, River Heights, and potentially others — are exploring whether to fund a collaborative library district. The current operation costs ~$250K/year (1 FTE + 2 PTE, full hours, plus collections budget). Citizens need to understand: what combination of service level and city participation leads to what property tax cost?

The site owner (a city council member or civic tech advocate) needs to update numbers as discussions evolve — new cities join, cost estimates shift — without touching HTML or JavaScript logic. The `config.js` NON-DEVELOPER EDIT GUIDE section supports this workflow.

## Constraints

- **Tech Stack**: Eleventy v3 + Tailwind CSS v4 standalone CLI (not PostCSS pipeline)
- **Hosting**: GitHub Pages — static HTML/CSS/JS only
- **Updatability**: All scenario data must live in `src/_data/config.js` — editable via GitHub web UI
- **Simplicity**: No build complexity beyond what's necessary; non-developer maintainable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Eleventy v3 ESM over plain HTML | Separates data from presentation; template-driven city/staffing loops | ✓ Good — `config.js` edit workflow validated |
| Tailwind CSS v4 standalone CLI | Owner preference; avoids PostCSS pipeline complexity | ✓ Good — `postcss.config.mjs` was dead code, removed in Phase 6 |
| Single tax number (not per-city) | Cost per household is uniform across participating cities | ✓ Good — formula confirmed correct |
| All numbers in one data file | Owner can update without touching templates | ✓ Good — NON-DEVELOPER EDIT GUIDE added and extended through v1.1 |
| City defaults via `defaultChecked` flag | Config-driven checked state instead of hardcoded `checked` attr | ✓ Good — added Phase 6, consistent with data-driven pattern |
| CONF-02: select-satisfies (no zero/off option) | Collections select is independent of staffing; "toggle" means independent adjustment | ✓ Decided Phase 6 — product owner confirmed |
| URL encoding via URLSearchParams + history.replaceState | Stateless sharing without server; degrades gracefully on invalid params | ✓ Good — all edge cases verified in Phase 6 browser QA |
| Range slider replacing collections dropdown | Citizens benefit from seeing where their choice sits on a spectrum with descriptions | ✓ Good — slider + descriptions substantially more informative than dropdown |
| Dual event listener (change + input) on slider | change for URL encoding, input for live label updates — mobile critical | ✓ Good — input event gap found and closed in Phase 7-02 |
| url.js validates against LIBRARY_DATA not DOM | Removes dependency on removed select element; works post-slider migration | ✓ Good — collections=30000 URLs continue to restore correctly |
| formatDays filter uses noon-UTC reference date | Prevents CI/CD timezone drift in day name output | ✓ Good — stable across environments |
| Compact pi/tau/phi URL aliases (Phase 9) | ~72% URL reduction; pi/tau/phi as easter egg for math-savvy users | ✓ Good — verbose fallback retains full backward compat |
| 0-based positional indices for compact params | Direct JS array access; no offset arithmetic | ✓ Good — straightforward decode logic |
| has-[:checked] CSS-only selection state for cards | No JavaScript selection state management needed for staffing + city cards | ✓ Good — clean, accessible, easy to extend |
| sr-only on radio/checkbox inputs inside cards | Preserves keyboard/screen-reader access vs type=hidden | ✓ Good — Tab/Space/arrow navigation preserved |
| outline-offset-4 for focus indicators on cards | focus ring appears visibly outside selected-state ring-2 ring-blue-600 | ✓ Good — focus and selection rings are now visually distinct |
| Slider value domain = 0-based index (not dollar amount) | Non-linear digital tiers ($5k/$15k/$30k/$55k/$65k) produced phantom positions when slider value was dollar amount — index domain gives exactly N valid positions with no phantoms | ✓ Good — eliminates phantom positions; calculator resolves index→dollar at read time |
| innerHTML with inner spans for two-line result bar | textContent can't hold two styled lines; inner spans carry their own Tailwind classes; outer className cleared on happy path to prevent cascade | ✓ Good — clean two-line display with per-household + total |
| `<table>` with tabular-nums for formula popover | Accounting-style right-alignment needed for 3 cost rows + total; table gives alignment without manual padding | ✓ Good — Hours Open / Digital / Physical breakdown legible and aligned |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-15 after v1.8 milestone — show-your-work result bar and formula popover shipped (Phases 20-21).*
