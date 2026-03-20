---
phase: 02-data-and-controls
plan: 02
subsystem: ui
tags: [eleventy, nunjucks, tailwind, forms, data-driven]

# Dependency graph
requires:
  - phase: 02-data-and-controls/02-01
    provides: Full config.js data schema with staffingLevels, collections, cities, and toLocaleString Nunjucks filter

provides:
  - Complete data-driven form with staffing radio buttons, collections toggle, and city checkboxes
  - window.LIBRARY_DATA embedding for Phase 3 calculator
  - data-cost attributes on staffing radios and collections checkbox
  - data-households attributes on city checkboxes
  - Source citations and explanatory descriptions via <cite> and <p> elements
affects:
  - 03 (calculator.js reads window.LIBRARY_DATA; data-cost and data-households attributes are ready)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "htmlTemplateEngine: 'njk' in eleventy.config.js return object — required for Nunjucks dump filter and loop.first in .html files"
    - "config | dump | safe pattern for embedding JSON in <script> tags without &quot; escaping"
    - "loop.first for pre-checking first radio button in a Nunjucks for loop"
    - "data-cost and data-households attributes on form inputs as Phase 3 contract"

key-files:
  created:
    - .planning/phases/02-data-and-controls/02-02-SUMMARY.md
  modified:
    - src/index.html
    - eleventy.config.js

key-decisions:
  - "htmlTemplateEngine: 'njk' added to eleventy.config.js — .html files process as Liquid by default in Eleventy, which lacks the dump filter; Nunjucks was the intended engine per research"
  - "Staffing costs displayed inline in label as '$X/year' pattern (from CONTEXT.md recommendation)"
  - "All 8 cite elements render source citations from config data — no hardcoded source strings in template"

patterns-established:
  - "Form controls rendered via Nunjucks {% for %} loops from _data/config.js — adding a city means only editing config.js"
  - "window.LIBRARY_DATA = {{ config | dump | safe }} pattern for Phase 3 JS access to build-time data"
  - "data-cost and data-households attributes set at build time for DOM-based calculator reads in Phase 3"

requirements-completed: [CONF-01, CONF-02, CONF-03, TRST-01, TRST-02]

# Metrics
duration: 1min
completed: 2026-03-20
---

# Phase 02 Plan 02: Data-Driven Form Controls Summary

**Complete Nunjucks form with 3 staffing radios, 1 collections toggle, and 4 city checkboxes — all rendered from config.js loops with data-cost/data-households attributes and window.LIBRARY_DATA for Phase 3**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-20T19:43:32Z
- **Completed:** 2026-03-20T19:44:52Z
- **Tasks:** 1 of 2 (Task 2 is human visual verification — see checkpoint below)
- **Files modified:** 2 (src/index.html, eleventy.config.js)

## Accomplishments

- Replaced the pipeline-verification placeholder in `src/index.html` with a complete 95-line Nunjucks template rendering all form controls from `config.js` data — zero hardcoded values in the template
- All acceptance criteria passed: 3 radios, 5 checkboxes, 4 data-cost, 4 data-households, 8 cite elements, window.LIBRARY_DATA with valid unescaped JSON, toLocaleString formatting working
- Fixed blocking issue (Rule 3): added `htmlTemplateEngine: "njk"` to `eleventy.config.js` — Eleventy defaults to Liquid for `.html` files, which lacks the `dump` filter required by the plan's Nunjucks patterns

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace index.html with data-driven form controls** - `69ccf13` (feat)

**Plan metadata:** TBD (docs commit pending after human verification)

## Files Created/Modified

- `src/index.html` - Complete Nunjucks template: Staffing Level fieldset (3 radio buttons), Collections Budget fieldset (1 checkbox), Participating Cities fieldset (4 checkboxes), result placeholder, window.LIBRARY_DATA script embed
- `eleventy.config.js` - Added `htmlTemplateEngine: "njk"` to return config object

## Decisions Made

- `htmlTemplateEngine: "njk"` is the correct fix for the Liquid vs. Nunjucks engine conflict — adding it to the Eleventy config return object makes `.html` files process as Nunjucks, enabling `dump | safe`, `{% for %}`, and `loop.first` patterns that the plan specified

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added htmlTemplateEngine: "njk" to eleventy.config.js**
- **Found during:** Task 1 (Replace index.html with data-driven form controls)
- **Issue:** Eleventy processes `.html` files with Liquid by default, not Nunjucks. The Nunjucks `dump` filter, `{# comment #}` syntax, and `loop.first` variable are not available in Liquid. Build failed with "undefined filter: dump".
- **Fix:** Added `htmlTemplateEngine: "njk"` to the return object in `eleventy.config.js`. This was already anticipated as a Wave 0 gap item in 02-RESEARCH.md Open Question 3.
- **Files modified:** eleventy.config.js
- **Verification:** `pnpm run build` exits 0; all 14 acceptance criteria pass
- **Committed in:** 69ccf13 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required for correctness — without it, no Nunjucks features work. Explicitly anticipated in RESEARCH.md as a Wave 0 gap.

## Issues Encountered

Liquid vs. Nunjucks engine conflict: Eleventy's default template engine for `.html` files is Liquid (LiquidJS), not Nunjucks. The plan assumed Nunjucks patterns (`dump | safe`, `loop.first`, `{# comment #}`) would work in `.html` files. Build failed on first attempt. The fix (`htmlTemplateEngine: "njk"`) was already documented in RESEARCH.md as a potential Wave 0 gap — adding it resolved the issue immediately.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/index.html` is the complete Phase 2 UI contract: all form controls rendered, all data attributes set, `window.LIBRARY_DATA` embedded
- Phase 3 calculator.js can read `window.LIBRARY_DATA` for config values, `data-cost` from staffing radios and collections checkbox, and `data-households` from city checkboxes — no template changes needed in Phase 3
- `htmlTemplateEngine: "njk"` is established in eleventy.config.js for any future `.html` templates in this project

## Checkpoint: Human Visual Verification

**Task 2 requires human browser verification.** The automated checks confirm structural correctness; visual confirmation is the plan gate.

To verify:
1. Run `pnpm start` from the project root
2. Open the local URL (typically `http://localhost:8080/library-choices/`)
3. Confirm: page heading, 3 staffing radios with costs, collections checkbox, 4 city checkboxes with household counts, citations under each section, result placeholder
4. Open DevTools console and type `window.LIBRARY_DATA` — confirm full config object is present

---
*Phase: 02-data-and-controls*
*Completed: 2026-03-20*
