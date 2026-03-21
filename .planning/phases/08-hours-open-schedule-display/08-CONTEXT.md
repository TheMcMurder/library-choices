# Phase 8: Hours Open Schedule Display - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Rename the staffing section heading to "Hours Open" and add each option's actual weekly schedule — displayed inline, always visible, no JavaScript required. Schedule data lives in `config.js` as a structured array. The NON-DEVELOPER EDIT GUIDE covers schedule editing with a copy-pasteable example. URL encoding for staffing selections is unchanged.

</domain>

<decisions>
## Implementation Decisions

### Section heading
- **D-01:** Change `<legend>` text from "Staffing Level" to "Hours Open" — no other heading text referencing "staffing level" visible anywhere

### Schedule data structure in config.js
- **D-02:** Add a `schedule` array to each staffing level object: `{ days: "1-5", open: "9am", close: "5pm" }`
- **D-03:** `days` is an ISO weekday number range string — `"1"` = Monday, `"7"` = Sunday. Single day: `"6"`. Contiguous range: `"1-5"`. Non-contiguous days require separate rows.
- **D-04:** `open` and `close` use 12-hour format with no space: `"9am"`, `"4pm"`, `"12pm"`. Locked by HOURS-03.
- **D-05:** Multiple schedule rows per staffing option are supported (e.g., Mon–Fri row + Saturday row)

### Day name rendering
- **D-06:** A Nunjucks filter `formatDays` is registered in `eleventy.config.js` using `Intl.DateTimeFormat` (build-time Node.js) to convert ISO weekday numbers to locale-aware full names
- **D-07:** Single day input `"6"` → `"Saturday"`. Range input `"1-5"` → `"Monday–Friday"`. Uses a fixed reference Monday (e.g., 2024-01-01) to anchor `Intl.DateTimeFormat` calls.
- **D-08:** The filter should accept a locale option (default `"en-US"`) so future localization requires no filter rewrite

### Schedule visual layout
- **D-09:** Schedule renders as an HTML `<table>` with `<thead>` and `<tbody>` — semantic, screen readers announce column headers per cell
- **D-10:** Header row columns: "Days" | "Hours" — bold, `text-sm text-gray-800`
- **D-11:** Each `schedule` row is a `<tr>` with `<td>` for days (rendered via `formatDays` filter) and `<td>` for hours (`open–close`)
- **D-12:** Schedule table appears first below each radio label, before the description paragraph

### Content order within each staffing option
- **D-13:** Order: radio input + label → schedule table → description paragraph
- **D-14:** Source citations (`<cite>`) are removed from staffing option blocks entirely

### URL encoding
- **D-15:** `?staffing=1fte`, `?staffing=1fte-1pte`, `?staffing=1fte-2pte` encoding is unchanged — HOURS-05 is preserved. No changes to `url.js` staffing restoration logic.
- **D-16:** Staffing `id` values in config.js (`"1fte"`, `"1fte-1pte"`, `"1fte-2pte"`) are URL-immutable; mark them with a comment in config.js per existing STATE.md flag

### NON-DEVELOPER EDIT GUIDE
- **D-17:** Add a schedule editing section to the block comment in `config.js` covering: how to update times, how to add/remove rows, and what the `days` field means
- **D-18:** Include a copy-pasteable example showing a two-row schedule (weekdays + Saturday)

### Claude's Discretion
- Exact Tailwind spacing within the schedule table cells
- Whether to use `mt-2` or `mt-3` between schedule table and description paragraph
- `<time>` element wrapping for open/close values (semantic improvement, if appropriate)

</decisions>

<specifics>
## Specific Ideas

- The `days` format uses ISO weekday numbers so a future site owner or developer can swap locale with a single parameter change — no data migration needed
- The `formatDays` filter uses `Intl.DateTimeFormat` with weekday: 'long' — same API used in Node.js 18+ without polyfills

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing implementation
- `src/index.html` — current staffing fieldset markup (lines 20–43); schedule table and new heading replace `<legend>` and augment the `{% for level in config.staffingLevels %}` loop
- `src/_data/config.js` — staffing level objects to gain `schedule` array; NON-DEVELOPER EDIT GUIDE comment block to be extended
- `eleventy.config.js` — where `formatDays` Nunjucks filter must be registered (alongside existing `toLocaleString` filter)

### Requirements
- `HOURS-01` through `HOURS-05` in `.planning/REQUIREMENTS.md` — all five must be satisfied by this phase

### Patterns from prior phases
- `src/js/url.js` — staffing URL restoration logic; must NOT be changed (HOURS-05 preserved)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `toLocaleString` Nunjucks filter in `eleventy.config.js`: pattern to follow for registering `formatDays` filter
- `config.collections.options` array pattern: multi-row array in config.js already established — schedule array follows same shape

### Established Patterns
- IIFE + 'use strict' for JS modules — no changes needed for this phase (pure Nunjucks/data change)
- `{% for level in config.staffingLevels %}` loop in `index.html:23` — extend this loop to render `level.schedule`
- `data-cost` attribute on radio input (line 32) — URL encoding reads this; do not touch

### Integration Points
- `eleventy.config.js` filter registration — `formatDays` added alongside `toLocaleString`
- `config.js` comment block — extend with schedule editing instructions
- `index.html` staffing fieldset — change legend text + add table inside the loop

</code_context>

<deferred>
## Deferred Ideas

- **Compact URL easter egg:** `pi`/`tau`/`phi` as alternative parameter names for staffing/collections/cities respectively, with positional index values (A=option 1, B=option 2, etc.). Full URL scheme redesign — own phase.

</deferred>

---

*Phase: 08-hours-open-schedule-display*
*Context gathered: 2026-03-21*
