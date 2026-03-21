# Architecture Research

**Domain:** Data-driven static site interactive configurator (civic tax calculator)
**Researched:** 2026-03-21 (v1.1 update); original 2026-03-20
**Confidence:** HIGH (all v1.1 analysis based on direct codebase inspection)

## Standard Architecture

### System Overview

```
BUILD TIME (Eleventy on developer machine or CI)
┌─────────────────────────────────────────────────────────────┐
│                    Source Repository                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  _data/      │  │  src/        │  │  src/js/           │ │
│  │  config.js   │  │  index.html  │  │  calculator.js     │ │
│  │  (costs,     │  │  (Nunjucks   │  │  url.js            │ │
│  │  households) │  │   template)  │  │  (IIFEs)           │ │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘ │
│         │                 │                   │             │
│         └─────────────────┴───────────────────┘             │
│                           │                                 │
│                    ┌──────▼──────┐                          │
│                    │   Eleventy  │                          │
│                    │   Build     │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │ produces
                            ▼
STATIC OUTPUT (_site/)
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   index.html    │  │  style.css   │  │ calculator.js  │  │
│  │  (data embedded │  │  (Tailwind   │  │ url.js         │  │
│  │   as JSON in    │  │   purged)    │  │  (standalone,  │  │
│  │  <script> tag)  │  └──────────────┘  │   no deps)     │  │
│  └────────┬────────┘                    └────────────────┘  │
└───────────┼─────────────────────────────────────────────────┘
            │ deployed to
            ▼
RUNTIME (Browser)
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────────────┐   ┌──────────────────────────────┐ │
│  │    calculator.js     │   │          url.js              │ │
│  │  (IIFE, runs first)  │   │  (IIFE, runs second)         │ │
│  │                      │   │                              │ │
│  │  form#configurator   │   │  window.LIBRARY_DATA         │ │
│  │  delegated change    │   │  restoreFromUrl()            │ │
│  │  updateResult()      │   │  encodeUrl()                 │ │
│  │  getStaffingCost()   │   │  form.dispatchEvent(change)  │ │
│  │  getCollectionsCost()│   │                              │ │
│  │  getTotalHouseholds()│   │                              │ │
│  └──────────────────────┘   └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `_data/config.js` | Single source of truth for all numbers and display data | ESM default export; Eleventy injects at build time as `config` |
| `src/index.html` | HTML template — layout, UI controls, result display area | Nunjucks loops over config; embeds `window.LIBRARY_DATA` inline |
| `src/js/calculator.js` | All runtime calculation logic; responds to form input | IIFE; delegated `change` listener on `form#configurator` |
| `src/js/url.js` | URL encode/restore for shareability | IIFE; reads `window.LIBRARY_DATA` to validate params |

## Recommended Project Structure

```
library-choices/
├── src/
│   ├── _data/
│   │   └── config.js          # ALL data: costs, households, descriptions, schedules
│   ├── index.html             # Single page Nunjucks template
│   ├── css/
│   │   ├── style.css          # Tailwind source
│   │   └── compiled.css       # Tailwind output (built by standalone CLI)
│   └── js/
│       ├── calculator.js      # Runtime calculation + description update logic
│       └── url.js             # URL encode/restore
├── _site/                     # Build output (gitignored)
├── .eleventy.js               # Eleventy config
└── package.json               # Build scripts
```

### Structure Rationale

- **`_data/`:** Eleventy's conventional global data directory. Non-developers edit only `config.js`.
- **`src/js/calculator.js`:** Contains all form interaction logic. Kept separate for readability. url.js handles URL state; both are passthrough-copied by Eleventy.
- **`_site/`:** Never committed to main; CI deploys via GitHub Actions.

## Architectural Patterns

### Pattern 1: Data Embedding via Script Tag

**What:** Eleventy template embeds the config as a JSON literal assigned to `window.LIBRARY_DATA` in a `<script>` tag before any other scripts.
**When to use:** Dataset is small, single page, zero extra HTTP requests needed.
**Trade-offs:** No fetch/async complexity. Data always in sync with template. Data duplicated in HTML (not an issue at this scale).

**Example:**
```html
<script>
  window.LIBRARY_DATA = {{ config | dump | safe }};
</script>
<script src="/js/calculator.js"></script>
<script src="/js/url.js"></script>
```

### Pattern 2: Data-Attribute Bridge for Per-Element Values

**What:** Build-time data baked into HTML `data-*` attributes; JS reads them without needing `window.LIBRARY_DATA`.
**When to use:** Value is tied to a specific DOM element (e.g., `data-cost` on each radio, `data-households` on each checkbox).
**Trade-offs:** Simple and self-contained. Inflexible when the same data is needed across multiple values with no fixed element binding.

The slider description does NOT use this pattern — descriptions are per-value, not per-element. Use `window.LIBRARY_DATA` lookup instead.

### Pattern 3: Delegated Form Listener

**What:** Single `form.addEventListener('change', updateResult)` catches all control changes.
**When to use:** Multi-control forms where any change triggers recalculation.
**Trade-offs:** Covers all control types with one binding. Range `input` events (continuous drag) are a separate concern — they require their own listener and are not caught by the delegated `change` listener.

---

## v1.1 Integration: Collections Budget Slider

### What Changes in `config.js`

The `collections.options` array gains a `description` field per node:

```js
options: [
  { value: 10000, isDefault: false, description: "Digital only — Beehive Digital Library and Libby access" },
  { value: 20000, isDefault: false, description: "..." },
  { value: 30000, isDefault: true,  description: "..." },
  { value: 40000, isDefault: false, description: "..." },
  { value: 50000, isDefault: false, description: "..." },
  { value: 60000, isDefault: false, description: "..." },
]
```

No other structural change is required. The `isDefault` flag continues to drive initial state.

### What Changes in the Nunjucks Template

The Collections fieldset replaces the `<select>` block with:

1. `<input type="range" id="collections">` with `min`, `max`, `step`, and initial `value` from the default option.
2. A tick-mark label row (presentational, rendered via Nunjucks loop).
3. `<p id="collections-description">` — initial text is the default node's description (rendered server-side). JS updates it on slider movement.

Descriptions are already embedded in `window.LIBRARY_DATA.collections.options[n].description`. No new data attribute is needed.

**Minimal shape:**
```html
<input
  type="range"
  id="collections"
  name="collections"
  min="{{ config.collections.options[0].value }}"
  max="{{ config.collections.options | last | attr('value') }}"
  step="10000"
  value="{{ config.collections.options | selectattr('isDefault') | first | attr('value') }}"
/>
<p id="collections-description" class="text-sm text-gray-600">
  {{ config.collections.options | selectattr('isDefault') | first | attr('description') }}
</p>
```

### What Changes in `calculator.js`

`getCollectionsCost()` reads `parseInt(element.value, 10)`. A `<input type="range">` exposes `.value` identically to a `<select>`. **No change to `getCollectionsCost()` is required.**

The delegated `form.addEventListener('change', updateResult)` fires on range `change` events. **No change to the event binding is required.**

One addition is needed: an `input` event listener that updates the description text while the user drags. This belongs in `calculator.js` (not a new file):

```js
var collectionsSlider = document.getElementById('collections');
var collectionsDesc = document.getElementById('collections-description');
var collectionsData = window.LIBRARY_DATA.collections.options;

collectionsSlider.addEventListener('input', function () {
  var val = parseInt(collectionsSlider.value, 10);
  var opt = collectionsData.find(function (o) { return o.value === val; });
  if (opt && collectionsDesc) {
    collectionsDesc.textContent = opt.description;
  }
});
```

`window.LIBRARY_DATA` is embedded before `calculator.js` in script order, so this read is safe.

### What Changes in `url.js`

`encodeUrl()` reads `document.getElementById('collections').value` — this works identically for `<input type="range">`. **No change to `encodeUrl()` is required.**

`restoreFromUrl()` currently validates against `Array.from(select.options).map(o => o.value)`. After replacing `<select>` with `<input type="range">` this path breaks — there are no `.options` on a range input.

**Required fix — `restoreFromUrl()` collections block:**

```js
// BEFORE (broken after slider migration):
var validValues = Array.from(select.options).map(function (o) { return o.value; });

// AFTER (use LIBRARY_DATA instead):
var validValues = data.collections.options.map(function (o) { return String(o.value); });
if (validValues.indexOf(collectionsParam) !== -1) {
  var slider = document.getElementById('collections');
  if (slider) { slider.value = collectionsParam; }
}
```

This is the only breaking change in `url.js` for this feature.

---

## v1.1 Integration: Staffing Schedule ("Hours Open")

### What Changes in `config.js`

Each `staffingLevels` entry gains a `schedule` array. The `label` may also be renamed to citizen-facing language (data change only, not a schema change):

```js
staffingLevels: [
  {
    id: "1fte",
    label: "Basic Hours",
    annualCost: 150000,
    description: "...",
    source: "...",
    schedule: [
      { days: "Mon–Fri", open: "9:00 AM", close: "5:00 PM" }
    ]
  },
  {
    id: "1fte-1pte",
    label: "Extended Hours",
    annualCost: 190000,
    description: "...",
    source: "...",
    schedule: [
      { days: "Mon–Fri", open: "9:00 AM", close: "7:00 PM" },
      { days: "Saturday", open: "10:00 AM", close: "4:00 PM" }
    ]
  },
  // ...
]
```

Each schedule entry is `{ days: string, open: string, close: string }`. Multiple entries cover different day ranges. The field is new and optional — a `{% if level.schedule %}` guard in the template handles entries without it.

### What Changes in the Nunjucks Template

The fieldset legend can be renamed to "Hours Open". Inside the `{% for level in config.staffingLevels %}` loop, add a schedule block after the existing description paragraph:

```html
{% if level.schedule and level.schedule.length %}
  <ul class="text-sm text-gray-600 mt-1 space-y-0.5"
      aria-label="Weekly schedule for {{ level.label }}">
    {% for row in level.schedule %}
      <li>{{ row.days }}: {{ row.open }} – {{ row.close }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

This is pure server-side rendering. No JavaScript involvement.

### What Changes in `calculator.js`

Staffing cost reads `data-cost` from the checked radio — set from `level.annualCost` in the template. This is unchanged. **No changes to `calculator.js` are required.**

### What Changes in `url.js`

URL encoding for staffing encodes `staffing.value` (the radio's `value` attribute = `level.id`). IDs are unchanged. **No changes to `url.js` are required.**

---

## Component Change Summary

| Component | Feature: Slider | Feature: Schedule | Change Type |
|-----------|----------------|-------------------|-------------|
| `config.js` | Add `description` to each `collections.options` entry | Add `schedule` array to each `staffingLevels` entry | Schema extension (additive) |
| `index.html` (Nunjucks) | Replace `<select>` with `<input type="range">` + `<p id="collections-description">` | Add `<ul>` inside staffing loop; rename legend to "Hours Open" | Template modification |
| `calculator.js` | Add `input` listener to update description text | None | New code block (8 lines) |
| `url.js` | Fix `restoreFromUrl()` — replace `select.options` validation with `LIBRARY_DATA` validation | None | One block replaced (breaking fix) |

---

## Data Flow

### v1.1 Collections Data Flow

```
config.js options[].value + options[].description
    → Nunjucks: <input type="range" value="..."> + <p id="collections-description">
    → window.LIBRARY_DATA.collections.options[] (unchanged embed)
    → getCollectionsCost(): parseInt(slider.value) — identical to before
    → calculator.js (NEW): slider 'input' event → update description via LIBRARY_DATA lookup
    → url.js encodeUrl(): collections.value — identical to before
    → url.js restoreFromUrl(): validates via LIBRARY_DATA.collections.options[] (CHANGED)
```

### v1.1 Staffing Schedule Data Flow

```
config.js staffingLevels[].schedule (new field)
    → Nunjucks: <ul> inside staffing loop (new block)
    → Static rendered HTML — no JS reads schedule at runtime
    → calculator.js: unchanged (reads data-cost only)
    → url.js: unchanged (encodes level.id only)
```

### Script Load Order (must be preserved)

```
1. window.LIBRARY_DATA = {{ config | dump | safe }};  ← inline, before both scripts
2. <script src="/js/calculator.js"></script>           ← initializes form listener
3. <script src="/js/url.js"></script>                  ← reads LIBRARY_DATA; dispatches change
```

`url.js` depends on `calculator.js` having already bound its `change` listener (so the dispatched `change` event triggers recalculation). This order must not change.

---

## Recommended Build Order

1. **`config.js` schema extensions** — add `description` to each collections option and `schedule` to each staffing level. Use placeholder text. This unblocks all template and JS work.

2. **Nunjucks template — schedule display** — no JavaScript dependency. The schedule `<ul>` is pure server-side rendering. Verifiable at build time by inspecting generated HTML.

3. **Nunjucks template — slider HTML** — replace `<select>` with `<input type="range">`. At this point the slider renders but description text is static (default only) and URL restore is broken. Acceptable intermediate state.

4. **`calculator.js` — description update listener** — adds dynamic description behavior on slider drag. Depends on `<p id="collections-description">` existing in DOM (step 3) and `window.LIBRARY_DATA.collections.options` having `description` fields (step 1).

5. **`url.js` — fix `restoreFromUrl()`** — the last integration point. Depends on the slider being in DOM (step 3) and `LIBRARY_DATA.collections.options` being populated (step 1).

6. **QA pass** — verify: slider `change` event triggers `updateResult()`; description updates while dragging; URL round-trip (encode → share → restore → recalculate works); schedule renders for all three staffing levels; screen reader `aria-label` on schedule `<ul>` is correct.

---

## Anti-Patterns

### Anti-Pattern 1: New JS File for Slider Description Logic

**What people do:** Create `slider.js` to handle description updates.
**Why it's wrong:** Adds a third IIFE, a new `<script>` tag, and load-order concerns for approximately 8 lines of code. Violates the project's simplicity constraint.
**Do this instead:** Add the `input` listener block inside `calculator.js` where all other form interaction logic lives.

### Anti-Pattern 2: Encoding Slider Position as Array Index in URL

**What people do:** Encode `collections=2` (index 2 of options array) instead of `collections=30000`.
**Why it's wrong:** Index is fragile — adding or reordering options invalidates every shared URL. The current scheme encodes the actual value and must be preserved.
**Do this instead:** Keep encoding the raw numeric value. Validation in `restoreFromUrl()` checks against `LIBRARY_DATA.collections.options[].value`.

### Anti-Pattern 3: Duplicating Schedule Data in `data-*` Attributes

**What people do:** Render `data-schedule='[...]'` on each radio input, then parse JSON in JS.
**Why it's wrong:** Unnecessary complexity. Schedule is rendered to HTML once at build time. No JS use case requires reading schedule data at runtime — calculator.js does not need it, url.js does not encode it.
**Do this instead:** Render the schedule directly to a `<ul>` in the Nunjucks loop. It is static markup.

### Anti-Pattern 4: Hardcoding Numbers in the Template

**What people do:** Put `$125,000` and `3,800 households` directly in the HTML or JavaScript.
**Why it's wrong:** Numbers change as discussions evolve. Hardcoded values require a developer for every update and create sync errors.
**Do this instead:** Every number lives in `_data/config.js`. Templates and JS reference variable names only.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `config.js` → Template | Eleventy build-time injection | Nunjucks variables; also `window.LIBRARY_DATA` inline script |
| Template → `calculator.js` | DOM `data-cost` attrs on radios; `#collections` element `.value` | Slider `.value` is interface-compatible with select `.value` — getCollectionsCost() unchanged |
| Template → `url.js` | `window.LIBRARY_DATA`; form element IDs | `restoreFromUrl()` sets element values; `encodeUrl()` reads them |
| `url.js` → `calculator.js` | `form.dispatchEvent(new Event('change'))` | url.js triggers recalc after URL restore; load order dependency (url.js runs after calculator.js) |
| `calculator.js` → `url.js` | None — one-way dependency | calculator.js has no dependency on url.js |

---

## Sources

- Codebase: `src/_data/config.js` — inspected 2026-03-21
- Codebase: `src/js/calculator.js` — inspected 2026-03-21
- Codebase: `src/js/url.js` — inspected 2026-03-21
- Codebase: `src/index.html` — inspected 2026-03-21
- MDN: HTMLInputElement range `.value` — https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/value
- MDN: `input` event vs `change` event for range inputs — https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
- Eleventy global data files — https://www.11ty.dev/docs/data-global/
- GitHub Pages with GitHub Actions — https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

---

*Architecture research for: Cache County Library Choices — v1.1 UX integration (slider + schedule)*
*Researched: 2026-03-21*
