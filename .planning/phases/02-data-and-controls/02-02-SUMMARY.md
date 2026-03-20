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
  - Complete data-driven form with staffing radio buttons, collections budget dropdown, and city checkboxes
  - window.LIBRARY_DATA embedding for Phase 3 calculator
  - data-cost attributes on staffing radios and collections select element
  - data-households attributes on city checkboxes
  - Source citations and explanatory descriptions via <cite> and <p> elements
affects:
  - 03 (calculator.js reads window.LIBRARY_DATA; data-cost and data-households attributes are ready; collections is now a select not checkbox)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "htmlTemplateEngine: 'njk' in eleventy.config.js return object — required for Nunjucks dump filter and loop.first in .html files"
    - "config | dump | safe pattern for embedding JSON in <script> tags without &quot; escaping"
    - "loop.first for pre-checking first radio button in a Nunjucks for loop"
    - "isDefault flag on option objects drives pre-selected dropdown state at build time"
    - "data-cost and data-households attributes on form inputs as Phase 3 contract"

key-files:
  created:
    - .planning/phases/02-data-and-controls/02-02-SUMMARY.md
  modified:
    - src/index.html
    - src/_data/config.js
    - eleventy.config.js

key-decisions:
  - "htmlTemplateEngine: 'njk' added to eleventy.config.js — .html files process as Liquid by default in Eleventy, which lacks the dump filter; Nunjucks was the intended engine per research"
  - "Collections budget uses a select dropdown ($10k-$60k, $30k default) rather than a checkbox — allows users to explore budget scenarios"
  - "$10k minimum is a placeholder, marked with inline comment in config.js options array"
  - "select data-cost attribute holds the default value at build time; Phase 3 JS must update it on change events"

patterns-established:
  - "Form controls rendered via Nunjucks {% for %} loops from _data/config.js — adding a city means only editing config.js"
  - "window.LIBRARY_DATA = {{ config | dump | safe }} pattern for Phase 3 JS access to build-time data"
  - "data-cost and data-households attributes set at build time for DOM-based calculator reads in Phase 3"
  - "isDefault flag on option objects controls pre-selected state in select dropdowns"

requirements-completed: [CONF-01, CONF-02, CONF-03, TRST-01, TRST-02]

# Metrics
duration: 15min
completed: 2026-03-20
---

# Phase 02 Plan 02: Data-Driven Form Controls Summary

**Complete Nunjucks form with 3 staffing radios, 1 collections budget dropdown ($10k-$60k, $30k default), and 4 city checkboxes — all rendered from config.js with data-cost/data-households attributes and window.LIBRARY_DATA for Phase 3**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-20T19:43:32Z
- **Completed:** 2026-03-20T20:10:00Z
- **Tasks:** 2 (code task + user change at human-verify checkpoint)
- **Files modified:** 3 (src/index.html, src/_data/config.js, eleventy.config.js)

## Accomplishments

- Replaced the pipeline-verification placeholder in `src/index.html` with a complete Nunjucks template rendering all form controls from `config.js` data — zero hardcoded values in the template
- At human-verify checkpoint, user requested collections section use a dropdown instead of a checkbox — implemented select element with 6 options ($10k-$60k), $30k pre-selected as default
- config.js collections restructured from single `annualCost` scalar to `options` array with `isDefault` flag per option; $10k marked as placeholder with inline comment
- All verification criteria passed: 3 radios, 4 city checkboxes, 1 select with 6 options, 4 data-cost, 4 data-households, 8 cite elements, window.LIBRARY_DATA with valid unescaped JSON

## Task Commits

1. **Task 1: Replace index.html with data-driven form controls** - `69ccf13` (feat)
2. **User-requested change: Replace collections checkbox with dropdown select** - `eb2b143` (feat)

## Files Created/Modified

- `src/index.html` - Complete Nunjucks template: Staffing Level fieldset (3 radio buttons), Collections Budget fieldset (select dropdown with 6 options), Participating Cities fieldset (4 checkboxes), result placeholder, window.LIBRARY_DATA script embed
- `src/_data/config.js` - collections restructured: annualCost replaced with options array; each option has value and isDefault; $10k option has placeholder comment
- `eleventy.config.js` - Added `htmlTemplateEngine: "njk"` to return config object (Rule 3 auto-fix in Task 1)

## Decisions Made

- `htmlTemplateEngine: "njk"` is the correct fix for the Liquid vs. Nunjucks engine conflict — adding it to the Eleventy config return object makes `.html` files process as Nunjucks
- Collections budget is now a dropdown not a checkbox: allows residents to see cost impact across budget scenarios rather than a binary include/exclude
- $10,000 minimum is a placeholder; marked with `// PLACEHOLDER — update with real minimum` in config.js for the site owner
- select `data-cost` is set to the default value (30000) at build time; Phase 3 JS must listen to `change` events on the select and update accordingly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added htmlTemplateEngine: "njk" to eleventy.config.js**
- **Found during:** Task 1 (Replace index.html with data-driven form controls)
- **Issue:** Eleventy processes `.html` files with Liquid by default, not Nunjucks. Build failed with "undefined filter: dump".
- **Fix:** Added `htmlTemplateEngine: "njk"` to the return object in `eleventy.config.js`.
- **Files modified:** eleventy.config.js
- **Verification:** `pnpm run build` exits 0; all acceptance criteria pass
- **Committed in:** 69ccf13 (Task 1 commit)

### User-Directed Change at Checkpoint

**Collections checkbox replaced with select dropdown (user-directed at human-verify gate)**
- **Requested during:** Task 2 checkpoint (human-verify)
- **Change:** Collections section converted from a single checkbox to a select with 6 options ($10k, $20k, $30k, $40k, $50k, $60k); $30k pre-selected
- **Config change:** collections.annualCost replaced with collections.options array; each entry has value + isDefault
- **Template change:** checkbox input replaced with select/option Nunjucks loop; data-cost set to default value (30000) at build time
- **Committed in:** eb2b143

---

**Total deviations:** 1 auto-fixed (blocking) + 1 user-directed change
**Impact on plan:** Auto-fix required for correctness. User change improves the product — collections budget is now exploratory rather than binary.

## Issues Encountered

Liquid vs. Nunjucks engine conflict: Eleventy's default template engine for `.html` files is Liquid (LiquidJS), not Nunjucks. The plan assumed Nunjucks patterns would work in `.html` files. Build failed on first attempt. The fix (`htmlTemplateEngine: "njk"`) was already documented in RESEARCH.md as a potential Wave 0 gap — adding it resolved the issue immediately.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/index.html` is the complete Phase 2 UI contract: all form controls rendered, all data attributes set, `window.LIBRARY_DATA` embedded
- Phase 3 calculator.js can read `window.LIBRARY_DATA.collections.options` for the options array; the default value is the option where `isDefault === true`
- Phase 3 must listen to the collections `<select>` `change` event and read `event.target.value` (not a static data-cost) since the user can select different budget levels
- `data-cost` on staffing radios and `data-households` on city checkboxes remain unchanged from original plan

---
*Phase: 02-data-and-controls*
*Completed: 2026-03-20*
