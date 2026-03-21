# Phase 8: Hours Open Schedule Display - Research

**Researched:** 2026-03-21
**Domain:** Eleventy 3 / Nunjucks filters / Intl.DateTimeFormat / HTML table markup / config.js data structure extension
**Confidence:** HIGH

## Summary

Phase 8 is a pure build-time, no-JavaScript change. All work falls into four zones: (1) rename the `<legend>` text, (2) extend each staffing level object in `config.js` with a `schedule` array, (3) register a `formatDays` Nunjucks filter in `eleventy.config.js` using `Intl.DateTimeFormat`, and (4) render a `<table>` inside the `{% for level in config.staffingLevels %}` loop. The URL encoding layer (`url.js`) is untouched — staffing `id` values are URL-immutable and unchanged.

The `Intl.DateTimeFormat` weekday approach has been verified against Node.js 20+ runtime: using 2024-01-01 (confirmed Monday) as a reference anchor, offset arithmetic on ISO weekday numbers (1=Monday … 7=Sunday) produces correct full-day names for all single-day and contiguous-range inputs. No external packages are needed.

The NON-DEVELOPER EDIT GUIDE in `config.js` must be extended with a schedule-editing section and a two-row copy-pasteable example.

**Primary recommendation:** Follow the locked decisions in CONTEXT.md exactly. This phase introduces no new runtime dependencies and no JavaScript changes — all complexity is in the `formatDays` filter logic and in writing a clear edit guide.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Change `<legend>` text from "Staffing Level" to "Hours Open" — no other heading text referencing "staffing level" visible anywhere
- **D-02:** Add a `schedule` array to each staffing level object: `{ days: "1-5", open: "9am", close: "5pm" }`
- **D-03:** `days` is an ISO weekday number range string — `"1"` = Monday, `"7"` = Sunday. Single day: `"6"`. Contiguous range: `"1-5"`. Non-contiguous days require separate rows.
- **D-04:** `open` and `close` use 12-hour format with no space: `"9am"`, `"4pm"`, `"12pm"`. Locked by HOURS-03.
- **D-05:** Multiple schedule rows per staffing option are supported (e.g., Mon–Fri row + Saturday row)
- **D-06:** A Nunjucks filter `formatDays` is registered in `eleventy.config.js` using `Intl.DateTimeFormat` (build-time Node.js) to convert ISO weekday numbers to locale-aware full names
- **D-07:** Single day input `"6"` → `"Saturday"`. Range input `"1-5"` → `"Monday–Friday"`. Uses a fixed reference Monday (e.g., 2024-01-01) to anchor `Intl.DateTimeFormat` calls.
- **D-08:** The filter should accept a locale option (default `"en-US"`) so future localization requires no filter rewrite
- **D-09:** Schedule renders as an HTML `<table>` with `<thead>` and `<tbody>` — semantic, screen readers announce column headers per cell
- **D-10:** Header row columns: "Days" | "Hours" — bold, `text-sm text-gray-800`
- **D-11:** Each `schedule` row is a `<tr>` with `<td>` for days (rendered via `formatDays` filter) and `<td>` for hours (`open–close`)
- **D-12:** Schedule table appears first below each radio label, before the description paragraph
- **D-13:** Order: radio input + label → schedule table → description paragraph
- **D-14:** Source citations (`<cite>`) are removed from staffing option blocks entirely
- **D-15:** `?staffing=1fte`, `?staffing=1fte-1pte`, `?staffing=1fte-2pte` encoding is unchanged — HOURS-05 is preserved. No changes to `url.js` staffing restoration logic.
- **D-16:** Staffing `id` values in config.js (`"1fte"`, `"1fte-1pte"`, `"1fte-2pte"`) are URL-immutable; mark them with a comment in config.js per existing STATE.md flag
- **D-17:** Add a schedule editing section to the block comment in `config.js` covering: how to update times, how to add/remove rows, and what the `days` field means
- **D-18:** Include a copy-pasteable example showing a two-row schedule (weekdays + Saturday)

### Claude's Discretion
- Exact Tailwind spacing within the schedule table cells
- Whether to use `mt-2` or `mt-3` between schedule table and description paragraph
- `<time>` element wrapping for open/close values (semantic improvement, if appropriate)

### Deferred Ideas (OUT OF SCOPE)
- **Compact URL easter egg:** `pi`/`tau`/`phi` as alternative parameter names for staffing/collections/cities respectively, with positional index values (A=option 1, B=option 2, etc.). Full URL scheme redesign — Phase 9.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOURS-01 | Staffing section heading reads "Hours Open" (not "Staffing Level") | D-01: single `<legend>` text change in `src/index.html` line 22 |
| HOURS-02 | Each staffing option displays its weekly schedule inline, always visible below the radio label (no JS toggle needed) | D-09 through D-13: `<table>` inside `{% for level in config.staffingLevels %}` loop; static HTML, no JS |
| HOURS-03 | Schedule data structured in `config.js` as array of `{days, open, close}` entries using 12-hour format | D-02 through D-05: shape confirmed; `Intl.DateTimeFormat` converts `days` at build time |
| HOURS-04 | Site owner can update schedules via GitHub web UI — NON-DEVELOPER EDIT GUIDE covers schedule format with copy-pasteable example | D-17 and D-18: extend existing config.js comment block |
| HOURS-05 | Existing URL encoding for staffing selections (`?staffing=1fte-2pte`) continues to work unchanged | D-15 and D-16: `url.js` not touched; staffing `id` values immutable; confirmed by reading `url.js` |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @11ty/eleventy | 3.1.5 (installed) | Static site generator — Nunjucks template rendering | Already in use; `addFilter` is the established pattern |
| Node.js Intl (built-in) | Node 20+ | `Intl.DateTimeFormat` for build-time weekday name generation | Zero dependencies; verified correct output for all ISO weekday inputs |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | 4.2.2 (installed) | Table cell spacing, header text styling | Table header: `text-sm font-semibold text-gray-800`; cells: `text-sm text-gray-600 py-1 pr-4` |

No new packages are required for this phase.

**Installation:**
```bash
# No new dependencies — all required packages already installed
```

## Architecture Patterns

### Recommended Project Structure

No structural changes. All edits are to existing files:

```
src/
├── index.html          — change <legend>, add <table> inside staffing loop, remove <cite>, reorder content
├── _data/
│   └── config.js       — add schedule[] to each staffingLevel; extend NON-DEVELOPER EDIT GUIDE comment
eleventy.config.js      — register formatDays filter alongside toLocaleString
```

### Pattern 1: Nunjucks Filter Registration (existing pattern — follow exactly)

**What:** `eleventyConfig.addFilter(name, fn)` registers a filter available in all template engines including Nunjucks.
**When to use:** Any build-time transformation of data before rendering. Already established by `toLocaleString`.

```javascript
// Source: existing eleventy.config.js — toLocaleString as reference
eleventyConfig.addFilter("toLocaleString", (num) =>
  Number(num).toLocaleString("en-US")
);

// New filter — add immediately after toLocaleString
eleventyConfig.addFilter("formatDays", (daysStr, locale) => {
  locale = locale || "en-US";
  const REFERENCE_MONDAY = new Date("2024-01-01T12:00:00Z"); // 2024-01-01 is confirmed Monday
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
  const parts = daysStr.split("-").map(Number);

  if (parts.length === 1) {
    const d = new Date(REFERENCE_MONDAY);
    d.setUTCDate(d.getUTCDate() + (parts[0] - 1));
    return fmt.format(d);
  }

  const startDate = new Date(REFERENCE_MONDAY);
  startDate.setUTCDate(startDate.getUTCDate() + (parts[0] - 1));
  const endDate = new Date(REFERENCE_MONDAY);
  endDate.setUTCDate(endDate.getUTCDate() + (parts[1] - 1));
  return fmt.format(startDate) + "\u2013" + fmt.format(endDate);
});
```

**Verification:** Node.js test confirms:
- `"1-5"` → `"Monday–Friday"`
- `"6"` → `"Saturday"`
- `"7"` → `"Sunday"`
- `"2-6"` → `"Tuesday–Saturday"`

### Pattern 2: schedule[] Array Shape in config.js

**What:** Each `staffingLevels` entry gains a `schedule` property — an array of one or more `{days, open, close}` objects.
**When to use:** Always present; Nunjucks loop renders each row as a `<tr>`.

```javascript
// Source: CONTEXT.md D-02 through D-05
{
  id: "1fte",  // URL-IMMUTABLE — do not rename
  label: "1 Full-Time Librarian",
  annualCost: 150000,
  schedule: [
    { days: "1-5", open: "9am", close: "5pm" }
  ],
  description: "Basic reference service and public hours...",
  source: "Cache County HR salary schedule FY2025",
}
```

### Pattern 3: Table Rendering in Nunjucks Loop

**What:** Inside `{% for level in config.staffingLevels %}`, render schedule as a `<table>` between the label `<div>` and the description `<p>`.
**When to use:** Replace current content ordering (radio + label → description → cite) with the D-13 order.

```nunjucks
{# Source: CONTEXT.md D-09 through D-13 #}
<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2 min-h-[44px]">
    <input type="radio" ... />
    <label ...>{{ level.label }} — ${{ level.annualCost | toLocaleString }}/year</label>
  </div>
  <table class="text-sm border-collapse">
    <thead>
      <tr>
        <th class="text-left text-sm font-semibold text-gray-800 pb-1 pr-4">Days</th>
        <th class="text-left text-sm font-semibold text-gray-800 pb-1">Hours</th>
      </tr>
    </thead>
    <tbody>
      {% for row in level.schedule %}
      <tr>
        <td class="text-sm text-gray-600 py-1 pr-4">{{ row.days | formatDays }}</td>
        <td class="text-sm text-gray-600 py-1">{{ row.open }}–{{ row.close }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  <p class="text-sm text-gray-600 leading-normal mt-2">{{ level.description }}</p>
  {# <cite> removed per D-14 #}
</div>
```

### Pattern 4: NON-DEVELOPER EDIT GUIDE Extension

**What:** Extend the block comment at the top of `config.js` with a new schedule-editing section.
**When to use:** Required by D-17 and D-18 to satisfy HOURS-04.

The guide entry must cover:
1. How to update `open`/`close` times (replace the string value, keep quotes, keep `am`/`pm` lowercase with no space)
2. How to add a row (copy a `{ days: ..., open: ..., close: ... }` object and add a comma)
3. How to remove a row (delete the `{ ... },` line, keep at least one row)
4. What `days` means (`"1"` = Monday through `"7"` = Sunday; use `"1-5"` for Monday–Friday)
5. A copy-pasteable two-row example (weekdays + Saturday)

### Anti-Patterns to Avoid

- **Calling `formatDays` in url.js or calculator.js:** The filter is build-time only — it runs in Node.js/Eleventy, not in the browser. The schedule array is never read by runtime JavaScript.
- **Using `weekday` offset without UTC timezone in `Intl.DateTimeFormat`:** Without `timeZone: "UTC"` and a fixed UTC noon time, date arithmetic can cross midnight in some locales and produce the wrong day name.
- **Parsing `days` as a JavaScript date string:** `"1-5"` looks like a partial ISO date. Parse it as a weekday number string, not a date.
- **Changing staffing `id` values:** These are URL-immutable. The `url.js` validation reads `data.staffingLevels.map(l => l.id)`. Any rename breaks shared URLs silently (invalid IDs fall back to first option, no error).
- **Touching url.js:** HOURS-05 is preserved by not touching this file. The staffing radio restoration reads `.value` attributes set from `level.id` in Nunjucks — these are unchanged.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Weekday name localization | Custom weekday name array `["Sunday","Monday",...]` | `Intl.DateTimeFormat` with `weekday: 'long'` | Array approach is locale-locked to English; `Intl` is built into Node 20+ with no dependencies |
| ISO weekday-to-date conversion | Complex date math library | Offset from known Monday reference (`2024-01-01`) | One-line arithmetic, verified correct for all 7 weekdays and contiguous ranges |

**Key insight:** The entire `formatDays` filter is ~15 lines of vanilla Node.js. No npm packages needed.

## Common Pitfalls

### Pitfall 1: `days` Split Ambiguity for Single Days
**What goes wrong:** `"1-5".split("-")` correctly gives `["1","5"]`. But `"6".split("-")` gives `["6"]` — a length-1 array. The filter must branch on `parts.length === 1` vs. `parts.length === 2`.
**Why it happens:** The same delimiter `-` is used in both `"1-5"` (range) and would be absent in `"6"` (single). Easy to write a filter that only handles ranges.
**How to avoid:** Explicit length check: `if (parts.length === 1)` renders the single day, else renders start–end range.
**Warning signs:** Saturday or Sunday showing as `"Saturday–Saturday"` or throwing an error.

### Pitfall 2: UTC Timezone in Intl.DateTimeFormat
**What goes wrong:** `new Date("2024-01-01")` without a time component is parsed as UTC midnight. `Intl.DateTimeFormat` without `timeZone: "UTC"` will render in the local timezone. In timezones behind UTC (e.g., America/Denver at UTC-7), `2024-01-01T00:00:00Z` becomes `2023-12-31` locally — producing `"Sunday"` instead of `"Monday"`.
**Why it happens:** Build servers may be in any timezone; Eleventy runs in Node.js, not in the browser.
**How to avoid:** Use `new Date("2024-01-01T12:00:00Z")` (noon UTC prevents cross-midnight) AND `timeZone: "UTC"` in `Intl.DateTimeFormat` options.
**Warning signs:** Day names shift by one on CI/CD builds but work locally.

### Pitfall 3: `<cite>` Removal Breaking Other Sections
**What goes wrong:** Removing `<cite>` from staffing blocks is correct (D-14), but the cities and collections sections also have `<cite>` elements — those must remain.
**Why it happens:** The `<cite>` removal is scoped to the staffing `{% for %}` loop only.
**How to avoid:** Edit only within the staffing fieldset loop (lines 23–42 in current `index.html`). Verify cities and collections `<cite>` elements are still present after the edit.
**Warning signs:** Build succeeds but citations disappear from cities or collections sections.

### Pitfall 4: `data-cost` Attribute Must Not Move
**What goes wrong:** The `data-cost="{{ level.annualCost }}"` attribute on the staffing radio input is read by `calculator.js` at runtime. If the radio input or its `data-cost` attribute is accidentally removed during the table insertion, the cost calculator breaks silently.
**Why it happens:** Refactoring the content order (D-13) requires moving HTML blocks. Easy to accidentally drop an attribute.
**How to avoid:** After any edit to the staffing loop, verify `data-cost` is still on every staffing radio input.
**Warning signs:** Tax result shows `$0` or `NaN` for all staffing selections.

## Code Examples

Verified patterns from existing project code and confirmed logic:

### Filter: formatDays (verified by Node.js test)
```javascript
// Source: CONTEXT.md D-06 through D-08; verified 2026-03-21 against Node 20 Intl
eleventyConfig.addFilter("formatDays", (daysStr, locale) => {
  locale = locale || "en-US";
  const REFERENCE_MONDAY = new Date("2024-01-01T12:00:00Z");
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
  const parts = daysStr.split("-").map(Number);
  if (parts.length === 1) {
    const d = new Date(REFERENCE_MONDAY);
    d.setUTCDate(d.getUTCDate() + (parts[0] - 1));
    return fmt.format(d);
  }
  const startDate = new Date(REFERENCE_MONDAY);
  startDate.setUTCDate(startDate.getUTCDate() + (parts[0] - 1));
  const endDate = new Date(REFERENCE_MONDAY);
  endDate.setUTCDate(endDate.getUTCDate() + (parts[1] - 1));
  return fmt.format(startDate) + "\u2013" + fmt.format(endDate);
});
```

### config.js: staffingLevels schedule array (two-row example for edit guide)
```javascript
// Source: CONTEXT.md D-18 — copy-pasteable two-row example for NON-DEVELOPER EDIT GUIDE
{
  id: "1fte-2pte",  // URL-IMMUTABLE — do not rename
  label: "1 Full-Time + 2 Part-Time",
  annualCost: 230000,
  schedule: [
    { days: "1-5", open: "9am", close: "8pm" },
    { days: "6",   open: "9am", close: "5pm" }
  ],
  description: "Full-week coverage including Saturdays with two part-time staff members.",
  source: "Cache County HR salary schedule FY2025",
}
```

### Nunjucks: em dash for hours range
```nunjucks
{# Use &ndash; (–) between open and close times — matches D-11 #}
{{ row.open }}&ndash;{{ row.close }}
{# Or: {{ row.open }}–{{ row.close }} with literal en dash #}
```

### Optional: `<time>` element wrapping (Claude's discretion)
```nunjucks
{# Source: HTML Living Standard — <time> is appropriate for times of day #}
<td class="text-sm text-gray-600 py-1">
  <time>{{ row.open }}</time>&ndash;<time>{{ row.close }}</time>
</td>
```
Using `<time>` is semantically correct for machine-readable times. Since the format `"9am"` is not the HTML datetime attribute format (`09:00`), omitting the `datetime` attribute is acceptable — the element still provides semantic context for screen readers without requiring format conversion.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Nunjucks-specific `addNunjucksFilter` | `addFilter` (universal) | Eleventy 1.x → 2.x | `addFilter` works for all engines; simpler and already used in project |
| Custom weekday arrays | `Intl.DateTimeFormat` | Node 12+ | Zero deps, locale-aware, already available in Node 20+ |

**No deprecated patterns apply to this phase.**

## Open Questions

1. **Actual schedule data for each staffing level**
   - What we know: The three staffing levels currently have placeholder costs and placeholder descriptions. The schedule data will also be placeholder.
   - What's unclear: The real open/close times for each level are a content decision, not a technical one. Placeholder values (`"9am"`/`"5pm"`) are fine for the phase — the site owner updates them via the edit guide.
   - Recommendation: Use reasonable placeholder schedules that match the existing descriptions (e.g., 1 FTE = Mon–Fri 9am–5pm; 1 FTE+1 PTE = Mon–Fri 9am–8pm + Sat; 1 FTE+2 PTE = Mon–Fri 9am–8pm + Sat + Sun).

2. **`<time>` element — use or omit?**
   - What we know: `<time>` is semantically correct for times of day per HTML spec. The `datetime` attribute requires `HH:MM` format, which differs from the display format.
   - What's unclear: Whether the minor semantic benefit outweighs the added markup verbosity.
   - Recommendation: Add `<time>` wrapping — it's a small improvement with no downside. Marked as Claude's discretion in CONTEXT.md.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — project has no test runner in package.json |
| Config file | None — see Wave 0 |
| Quick run command | `pnpm build` (build-time smoke test — Eleventy will error if filter throws) |
| Full suite command | `pnpm build` + manual browser verification of rendered schedule tables |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOURS-01 | `<legend>` text is "Hours Open" | smoke | `pnpm build && grep -c "Hours Open" _site/index.html` | ❌ Wave 0 |
| HOURS-02 | Schedule `<table>` present inside staffing fieldset, 3 tables total | smoke | `pnpm build && grep -c "<table" _site/index.html` | ❌ Wave 0 |
| HOURS-03 | config.js exports schedule arrays with `days`/`open`/`close` shape | manual | Inspect `_site/index.html` rendered output | N/A |
| HOURS-04 | NON-DEVELOPER EDIT GUIDE covers schedule format | manual | Read config.js comment block | N/A |
| HOURS-05 | `?staffing=1fte-2pte` restores correct radio selection | manual | Open browser, append URL param, verify checked radio | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` (Eleventy errors surfaced immediately)
- **Per wave merge:** `pnpm build` + browser check for schedule tables, URL restoration
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- No formal test infrastructure exists. Build-time smoke tests (`grep` against `_site/index.html`) are the automated verification path.
- [ ] No test files needed — all verification is `pnpm build` + manual browser check per the project's established pattern

*(No test framework installation is needed — all prior phases verified the same way)*

## Sources

### Primary (HIGH confidence)
- Existing project files: `src/index.html`, `src/_data/config.js`, `eleventy.config.js`, `src/js/url.js` — read directly
- Node.js 20 built-in `Intl.DateTimeFormat` — verified by running test against locally installed Node
- CONTEXT.md decisions (D-01 through D-18) — locked by /gsd:discuss-phase session

### Secondary (MEDIUM confidence)
- Eleventy 3.x `addFilter` API — confirmed by existing `toLocaleString` filter in `eleventy.config.js` and installed version 3.1.5
- HTML `<time>` element semantics — HTML Living Standard (well-established, stable)
- Tailwind CSS v4 utility class patterns — consistent with classes observed throughout `src/index.html`

### Tertiary (LOW confidence — none for this phase)
- All claims in this research are verifiable directly from project files or confirmed by local runtime test.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; existing Eleventy + Intl verified in project runtime
- Architecture: HIGH — all patterns follow established project conventions; `formatDays` logic verified by Node.js test
- Pitfalls: HIGH — identified by direct code inspection of `calculator.js` integration points and `Intl` timezone behavior

**Research date:** 2026-03-21
**Valid until:** Stable — no fast-moving dependencies; valid until Eleventy major version change
