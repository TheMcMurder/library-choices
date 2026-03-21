# Phase 2: Data and Controls - Research

**Researched:** 2026-03-20
**Domain:** Eleventy v3 data cascade, Nunjucks templating, data-driven HTML form controls
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-01 | All costs and household counts live in a single `_data/config.js` file with inline comments | Eleventy automatically loads `src/_data/config.js` and exposes it as `config` in all templates; ESM `export default` is confirmed working in this project |
| DATA-02 | Adding or removing a city requires editing only the data file (no template changes) | Nunjucks `{% for city in config.cities %}` loop renders checkboxes dynamically; adding an array entry produces a new checkbox on next build with zero template changes |
| DATA-03 | Data file is simple enough to edit via GitHub's web UI without a local dev environment | GitHub's web editor supports JS file editing and commits directly to main, triggering the existing CI/CD pipeline — no local tooling required |
| CONF-01 | User can select a staffing level via radio buttons | Staffing options stored as array in `config.staffingLevels`; Nunjucks loop renders `<input type="radio">` for each entry |
| CONF-02 | User can toggle collections budget on/off | Boolean-initiatable toggle stored in `config.collections`; renders as `<input type="checkbox">` or toggle switch; cost value lives in data file |
| CONF-03 | User can check/uncheck participating cities | Cities array in `config.cities` with household count; Nunjucks loop renders `<input type="checkbox">` per city |
| TRST-01 | Source citations shown for cost estimates and household counts | Citation strings stored alongside cost values in `config.js`; rendered as `<cite>` or footnote markup in the template loop |
| TRST-02 | Explanatory copy alongside each choice dimension | Description/explainer strings per staffing level and per city stored in config; rendered from data, not hardcoded in template |
</phase_requirements>

---

## Summary

Phase 2 builds on the working Eleventy + Tailwind scaffold to produce all visible form controls from a single data file. The core pattern is straightforward: define structured data arrays in `src/_data/config.js`, then use Nunjucks `{% for %}` loops in `src/index.html` to render radio buttons, checkboxes, and explanatory copy. Because `config.js` is already wired into the Eleventy data cascade (confirmed in Phase 1), it is available as `config` throughout all templates automatically.

The secondary concern is making `config.js` legible and editable to a non-developer via GitHub's web UI. This means the file must have clear inline comments, obvious naming, and no JavaScript logic that would confuse a non-technical editor. GitHub's web editor handles `.js` file edits natively and commits directly to `main`, which triggers the existing GitHub Actions workflow — so a non-developer can update a cost figure, commit via the web UI, and the live site reflects the change within minutes.

The third concern is embedding the config data into the HTML page so that Phase 3's JavaScript calculator can read it. The established pattern is `{{ config | dump | safe }}` in a `<script>` tag to serialize the data as a `window.LIBRARY_DATA` global. This approach is confirmed working in Eleventy/Nunjucks, is XSS-safe for static data, and avoids any additional build tooling.

**Primary recommendation:** Define a `config.js` schema with `staffingLevels` array, `collections` object, and `cities` array — each entry carrying its label, cost value, description, and source citation. Use Nunjucks for loops to render all controls. Embed the full config as `window.LIBRARY_DATA` via `dump | safe` for Phase 3 use.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @11ty/eleventy | ^3.1.5 | Static site generator + data cascade | Already installed; `_data/config.js` auto-loaded |
| Nunjucks | bundled with Eleventy | HTML templating with loops and filters | Default template language for `.html` files in Eleventy; no extra install |
| tailwindcss | ^4.2.2 | Utility CSS for form control layout | Already installed; used for all styling in this project |

No new npm packages are required for Phase 2. The entire phase is data schema design plus template authoring.

**Installation:**
```bash
# No new dependencies — all required packages are already present
pnpm install  # confirms lockfile is current
```

---

## Architecture Patterns

### Recommended `_data/config.js` Schema

This is the central artifact of this phase. The file must be:
- Readable and editable by a non-developer with inline comments
- An ESM `export default` (required by `"type": "module"` in `package.json`)
- Flat enough that GitHub's web UI editing does not require understanding JS syntax beyond changing literal values

```javascript
// src/_data/config.js
// Source: Eleventy data cascade — https://www.11ty.dev/docs/data-js/
// NON-DEVELOPER EDIT GUIDE:
//   - Change number values (e.g., annualCost: 85000) to update costs
//   - Add a city object to the cities array to add a new city
//   - Do NOT change property names or remove curly braces

export default {
  siteName: "Cache County Library Choices",

  // --- Staffing Levels ---
  // Three options shown as radio buttons.
  // annualCost: total cost in whole dollars (no commas, no $ sign)
  staffingLevels: [
    {
      id: "1fte",
      label: "1 Full-Time Librarian",
      annualCost: 65000,
      description: "Basic reference service, 40 hours/week, standard holiday schedule.",
      source: "Cache County HR salary schedule FY2025"
    },
    {
      id: "1fte-1pte",
      label: "1 Full-Time + 1 Part-Time",
      annualCost: 85000,
      description: "Extended evening and weekend hours, one additional part-time staff.",
      source: "Cache County HR salary schedule FY2025"
    },
    {
      id: "1fte-2pte",
      label: "1 Full-Time + 2 Part-Time",
      annualCost: 105000,
      description: "Full week coverage including Saturdays, two part-time staff.",
      source: "Cache County HR salary schedule FY2025"
    }
  ],

  // --- Collections Budget ---
  // Toggle this on/off independently of staffing.
  collections: {
    annualCost: 20000,
    description: "New books, periodicals, and digital media added each year.",
    source: "Cache County Library Services budget proposal FY2025"
  },

  // --- Participating Cities ---
  // Each city appears as a checkbox.
  // households: number of participating households (used to split the cost)
  // To add a city: copy one object block, change the values, add a comma after }
  cities: [
    {
      id: "providence",
      label: "Providence",
      households: 2100,
      source: "Cache County Assessor 2024"
    },
    {
      id: "nibley",
      label: "Nibley",
      households: 1800,
      source: "Cache County Assessor 2024"
    },
    {
      id: "millville",
      label: "Millville",
      households: 950,
      source: "Cache County Assessor 2024"
    },
    {
      id: "river-heights",
      label: "River Heights",
      households: 620,
      source: "Cache County Assessor 2024"
    }
  ]
};
```

### Recommended Project Structure (Phase 2 additions)

```
src/
├── _data/
│   └── config.js         # Expanded schema (all costs, cities, staffing)
├── _includes/
│   └── base.njk          # Optional base layout (head, body wrapper)
├── css/
│   └── style.css         # Unchanged from Phase 1
│   └── compiled.css      # Built artifact, gitignored or passthrough
├── js/
│   └── calculator.js     # Placeholder; not wired yet (Phase 3)
└── index.html            # Template consuming config via for loops
```

### Pattern 1: Data-Driven Form Controls via Nunjucks For Loop

**What:** Nunjucks iterates over arrays in `config` to render form controls. No values are hardcoded in the template.

**When to use:** All three control types (staffing radio buttons, collections toggle, city checkboxes).

**Example — staffing radio buttons:**
```nunjucks
{# Source: Nunjucks templating docs — https://mozilla.github.io/nunjucks/templating.html #}
<fieldset>
  <legend>Staffing Level</legend>
  {% for level in config.staffingLevels %}
    <label>
      <input
        type="radio"
        name="staffing"
        value="{{ level.id }}"
        {% if loop.first %}checked{% endif %}
      >
      {{ level.label }}
      <span class="description">{{ level.description }}</span>
      <cite>{{ level.source }}</cite>
    </label>
  {% endfor %}
</fieldset>
```

**Example — city checkboxes:**
```nunjucks
<fieldset>
  <legend>Participating Cities</legend>
  {% for city in config.cities %}
    <label>
      <input
        type="checkbox"
        name="cities"
        value="{{ city.id }}"
        data-households="{{ city.households }}"
        checked
      >
      {{ city.label }}
      <span class="households">{{ city.households }} households</span>
      <cite>{{ city.source }}</cite>
    </label>
  {% endfor %}
</fieldset>
```

**Example — collections toggle:**
```nunjucks
<label>
  <input type="checkbox" id="collections" checked>
  Collections Budget (+${{ config.collections.annualCost }}/year)
  <span class="description">{{ config.collections.description }}</span>
  <cite>{{ config.collections.source }}</cite>
</label>
```

### Pattern 2: Embedding Config as `window.LIBRARY_DATA` for Phase 3

**What:** The Nunjucks `dump` filter calls `JSON.stringify` on any data value. Combined with `safe` (which prevents HTML-escaping the output), this embeds the entire config object as a JSON literal in a `<script>` tag.

**When to use:** Once in the page `<head>` or at end of `<body>`. Phase 3's calculator JS reads `window.LIBRARY_DATA` instead of duplicating cost constants.

**Example:**
```nunjucks
{# Source: https://mastereleventy.com/blog/json-stringify-with-nunjucks-dump-filter/ #}
{# Source: https://www.seanmcp.com/articles/send-data-to-the-window-with-eleventy/ #}
<script>
  window.LIBRARY_DATA = {{ config | dump | safe }};
</script>
```

This is XSS-safe for this use case because `config.js` is a static build-time file, not user input. The `dump` filter produces a valid JSON literal.

### Pattern 3: Nunjucks Loop Variables

**What:** Nunjucks exposes `loop.first`, `loop.last`, `loop.index`, `loop.index0` inside a for block.

**When to use:** `loop.first` marks the default-checked radio button (staffing level 1 is pre-selected). `loop.index0` can generate unique `id` attributes.

```nunjucks
{% for level in config.staffingLevels %}
  <input
    type="radio"
    name="staffing"
    value="{{ level.id }}"
    id="staffing-{{ loop.index0 }}"
    {% if loop.first %}checked{% endif %}
  >
  <label for="staffing-{{ loop.index0 }}">{{ level.label }}</label>
{% endfor %}
```

### Anti-Patterns to Avoid

- **Hardcoding any cost or label in the template:** Every editable value must come from `config`. A non-developer must be able to update any number by editing only `config.js`.
- **Using `module.exports` in `config.js`:** The project has `"type": "module"` in `package.json`, so CommonJS syntax will throw a SyntaxError. Use `export default`.
- **Nesting JS logic inside `config.js`:** Keep the file as a plain object literal with no functions, conditionals, or computed properties. GitHub's web UI editor does not provide JS syntax help, and logical errors break the build.
- **Relying on Nunjucks `set` to capture async content:** `{% set %}` cannot capture async output. This is not needed for Phase 2 (all data is synchronous), but avoid introducing async patterns.
- **Skipping `data-households` attributes on checkbox inputs:** Phase 3's calculator reads cost-per-household from the DOM via data attributes. Set them now so Phase 3 has no template changes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON serialization of config into page | Custom Eleventy filter or shortcode for JSON embedding | `{{ config \| dump \| safe }}` | Nunjucks `dump` is built-in; handles nested objects correctly |
| Unique IDs for form controls | JS post-processing to add IDs | `loop.index0` in Nunjucks loop | Built-in loop variable; generates `0`-based integer ID suffix at build time |
| Iterating config arrays | Any server-side or client-side JS loop | Nunjucks `{% for %}` loop | Rendered at build time into static HTML; no client-side cost |

**Key insight:** All three control types (radio, checkbox, toggle) are structurally identical to template authors — they are just different `<input type>` values inside a `{% for %}` loop. Treating them consistently simplifies the template.

---

## Common Pitfalls

### Pitfall 1: `export default` vs `module.exports` in config.js

**What goes wrong:** `module.exports = {...}` throws `ReferenceError: module is not defined` because `package.json` has `"type": "module"`.

**Why it happens:** Node treats all `.js` files as ES modules when `"type": "module"` is set. `module.exports` is CommonJS syntax.

**How to avoid:** Always use `export default {...}` in `config.js`. This is already confirmed working from Phase 1.

**Warning signs:** `pnpm run build` fails with `ReferenceError: module is not defined` pointing to `config.js`.

### Pitfall 2: Nunjucks HTML-Escapes the `dump` Output

**What goes wrong:** `{{ config | dump }}` produces `&quot;` instead of `"` inside the script tag, making the JSON invalid JavaScript.

**Why it happens:** Nunjucks auto-escapes HTML special characters in variable output by default (when `autoescape: true`, which is Eleventy's default).

**How to avoid:** Always chain `| safe` after `| dump`: `{{ config | dump | safe }}`. The `safe` filter tells Nunjucks to skip HTML-escaping.

**Warning signs:** The browser console shows a syntax error on the `window.LIBRARY_DATA` line; inspecting the page source shows `&quot;` in the script tag.

### Pitfall 3: `data-households` Attribute Not Set

**What goes wrong:** Phase 3's calculator cannot read household counts from the DOM.

**Why it happens:** If `data-households="{{ city.households }}"` is omitted from checkbox inputs, Phase 3 would need a template change — violating the requirement that Phase 2 is self-contained.

**How to avoid:** Include `data-*` attributes for all values Phase 3 needs (cost identifiers, household counts) during Phase 2 template authoring.

**Warning signs:** Phase 3 calculator produces NaN; `document.querySelector('[data-households]')` returns `null`.

### Pitfall 4: config.js Non-Developer Editability Broken by JS Syntax

**What goes wrong:** A non-developer editing via GitHub web UI accidentally introduces a syntax error (missing comma, extra brace) that breaks the build.

**Why it happens:** GitHub's web editor provides no JavaScript syntax validation. A single missing comma between array objects causes a `SyntaxError` at build time.

**How to avoid:** Add inline comments to `config.js` with explicit guidance (e.g., `// Add a comma after the } above before adding a new city`). Keep the structure visually obvious. Consider adding a `pnpm run build` status badge to the repo README so the site owner can see if a commit broke the build.

**Warning signs:** GitHub Actions shows a red X after a config edit; the deploy step fails with a Node `SyntaxError`.

### Pitfall 5: Placeholder Household/Cost Numbers

**What goes wrong:** Launching with example numbers that differ from real Cache County figures erodes trust.

**Why it happens:** Research phase cannot source official numbers; they must come from Cache County records.

**How to avoid:** Mark placeholder values clearly in `config.js` comments (e.g., `// PLACEHOLDER — replace with official Cache County Assessor 2024 figure`). Block phase verification until real numbers are confirmed or explicitly deferred to a later phase.

**Warning signs:** State.md blocker note: "Actual household count and cost figures must be sourced from Cache County records before launch."

---

## Code Examples

### Full `config.js` with Non-Developer Comments

See "Recommended `_data/config.js` Schema" in Architecture Patterns above.

### Minimal Nunjucks Template Structure for All Controls

```nunjucks
{# src/index.html — data-driven form controls, no hardcoded values #}
{# Source: Nunjucks for loops — https://mozilla.github.io/nunjucks/templating.html #}

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{ config.siteName }}</title>
  <link rel="stylesheet" href="/css/compiled.css">
  <script>
    window.LIBRARY_DATA = {{ config | dump | safe }};
  </script>
</head>
<body>

  <h1>{{ config.siteName }}</h1>

  <form id="configurator">

    {# --- Staffing Level --- #}
    <fieldset>
      <legend>Staffing Level</legend>
      {% for level in config.staffingLevels %}
        <div>
          <input
            type="radio"
            name="staffing"
            id="staffing-{{ level.id }}"
            value="{{ level.id }}"
            data-cost="{{ level.annualCost }}"
            {% if loop.first %}checked{% endif %}
          >
          <label for="staffing-{{ level.id }}">
            {{ level.label }} — ${{ level.annualCost | toLocaleString }}
          </label>
          <p>{{ level.description }}</p>
          <cite>Source: {{ level.source }}</cite>
        </div>
      {% endfor %}
    </fieldset>

    {# --- Collections Budget --- #}
    <fieldset>
      <legend>Collections Budget</legend>
      <div>
        <input
          type="checkbox"
          id="collections"
          name="collections"
          data-cost="{{ config.collections.annualCost }}"
          checked
        >
        <label for="collections">
          Include collections (+${{ config.collections.annualCost }}/year)
        </label>
        <p>{{ config.collections.description }}</p>
        <cite>Source: {{ config.collections.source }}</cite>
      </div>
    </fieldset>

    {# --- Participating Cities --- #}
    <fieldset>
      <legend>Participating Cities</legend>
      {% for city in config.cities %}
        <div>
          <input
            type="checkbox"
            name="cities"
            id="city-{{ city.id }}"
            value="{{ city.id }}"
            data-households="{{ city.households }}"
            checked
          >
          <label for="city-{{ city.id }}">
            {{ city.label }} ({{ city.households }} households)
          </label>
          <cite>Source: {{ city.source }}</cite>
        </div>
      {% endfor %}
    </fieldset>

  </form>

  <div id="result">
    {# Phase 3 will populate this via JS reading window.LIBRARY_DATA #}
    <p>Annual cost per household: calculating…</p>
  </div>

  <script src="/js/calculator.js"></script>

</body>
</html>
```

### Eleventy Custom Filter: `toLocaleString` (optional, for display formatting)

```javascript
// eleventy.config.js addition
// Source: https://www.11ty.dev/docs/filters/
eleventyConfig.addFilter("toLocaleString", (num) =>
  Number(num).toLocaleString("en-US")
);
```

This formats `65000` as `65,000` in templates. Note: STATE.md decision is "Store monetary values as integers; format with toFixed(2) only at display." Display formatting in the template is fine; arithmetic stays in integers.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `module.exports` in `_data/config.js` | `export default` (ESM) | Phase 1 decision — `"type": "module"` in package.json | CommonJS syntax throws at runtime in this project |
| Hardcoded form option labels in template HTML | Data-driven `{% for %}` loops from `_data/config.js` | This phase (Phase 2) | Non-developer can add city with no template touch |
| Separate JS file with duplicated cost constants | `window.LIBRARY_DATA` embedded at build time via `dump \| safe` | This phase (Phase 2) | Single source of truth; no divergence between template and calculator |

**Deprecated/outdated for this project:**
- Hardcoded values in `index.html` from Phase 1 (`siteName` inline string in `<h1>`) — must be replaced by `{{ config.siteName }}`
- `module.exports` syntax — never use in this project

---

## Open Questions

1. **Official household and cost figures**
   - What we know: Placeholder numbers are needed to build and verify the phase; real numbers come from Cache County records (STATE.md blocker)
   - What's unclear: When real figures will be available; whether they differ materially from estimates
   - Recommendation: Build Phase 2 with clearly-commented placeholder values. Phase verification should explicitly note that real figures are pending, not block on them.

2. **Number formatting filter for template display**
   - What we know: STATE.md says "format with `toFixed(2)` only at display"; Nunjucks has no built-in number formatter
   - What's unclear: Whether `toLocaleString` or `toFixed(2)` is preferred for the cost display (e.g., `$65,000` vs `$65000.00`)
   - Recommendation: Add a single `toLocaleString` filter to `eleventy.config.js` for comma-separated integer display in the template. Leave `toFixed(2)` for the Phase 3 calculator's result output. Both are trivial to add.

3. **Template language: `.html` vs `.njk` extension**
   - What we know: `src/index.html` currently uses Nunjucks syntax (confirmed working in Phase 1 — `{{ config.siteName }}` renders). Eleventy processes `.html` files with its configured template engine.
   - What's unclear: Whether the current Eleventy config treats `.html` files as Nunjucks by default or requires explicit configuration
   - Recommendation: Verify that `{% for %}` loops work in the existing `.html` file before assuming the extension change to `.njk` is needed. If not, add `htmlTemplateEngine: "njk"` to `eleventy.config.js`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No automated test framework installed — phase verifiable by build + DOM inspection |
| Config file | None |
| Quick run command | `pnpm run build && grep -c 'type="radio"' _site/index.html` |
| Full suite command | `pnpm run build` + manual DOM inspection of `_site/index.html` |

Phase 2 success criteria are verifiable by static HTML inspection after build. All controls are rendered at build time, so `grep`, `cat`, and browser DevTools serve as the validation layer.

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | `_data/config.js` is the single source of truth for all costs and cities | manual | `grep -c 'hardcoded' src/index.html` (expect 0) | ❌ Wave 0 — create config.js schema |
| DATA-02 | Adding a city to config causes it to appear in output | smoke | `pnpm run build && grep -c 'type="checkbox"' _site/index.html` (count matches city array length + 1 for collections) | ❌ Wave 0 — config.js needs cities array |
| DATA-03 | config.js has comments sufficient for web UI editing | manual | Human review of comments in config.js | ❌ Wave 0 — authoring task |
| CONF-01 | Staffing radio buttons render, count matches config array | smoke | `pnpm run build && grep -c 'type="radio"' _site/index.html` (expect 3) | ❌ Wave 0 — template authoring |
| CONF-02 | Collections toggle renders with correct cost data attribute | smoke | `pnpm run build && grep 'data-cost' _site/index.html` | ❌ Wave 0 |
| CONF-03 | City checkboxes render, count matches config.cities length | smoke | `pnpm run build && grep -c 'data-households' _site/index.html` (expect 4) | ❌ Wave 0 |
| TRST-01 | Source citations visible in rendered HTML | smoke | `pnpm run build && grep -c '<cite>' _site/index.html` (expect > 0) | ❌ Wave 0 |
| TRST-02 | Explanatory copy present for each staffing level | smoke | `pnpm run build && grep -c 'description' _site/index.html` (expect > 0) | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm run build && test -f _site/index.html`
- **Per wave merge:** `pnpm run build && grep -c 'type="radio"' _site/index.html && grep -c 'data-households' _site/index.html`
- **Phase gate:** Full build green + manual browser inspection of all controls before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/_data/config.js` — expand from stub to full schema with staffingLevels, collections, cities arrays
- [ ] `src/index.html` — replace pipeline-verification placeholder with data-driven form controls
- [ ] `eleventy.config.js` — add `htmlTemplateEngine: "njk"` if `.html` Nunjucks for loops do not work; add `toLocaleString` filter if number formatting is needed
- [ ] `src/js/calculator.js` — create as empty placeholder so `addPassthroughCopy("src/js")` does not fail if the directory is empty

---

## Sources

### Primary (HIGH confidence)

- https://www.11ty.dev/docs/data-js/ — JavaScript data files, ESM `export default`, template variable naming (filename = variable name), async support
- https://www.11ty.dev/docs/data-cascade/ — Data cascade priority, global `_data/` directory behavior
- https://www.11ty.dev/docs/languages/nunjucks/ — Nunjucks in Eleventy, `setAsync`, filter support, environment options
- https://mozilla.github.io/nunjucks/templating.html — `{% for %}` loop syntax, `loop.first`/`loop.index0`, `{% if %}`, dot notation property access, iteration over arrays of objects

### Secondary (MEDIUM confidence)

- https://mastereleventy.com/blog/json-stringify-with-nunjucks-dump-filter/ — `dump | safe` pattern for embedding JSON in script tags (verified against Nunjucks docs)
- https://www.seanmcp.com/articles/send-data-to-the-window-with-eleventy/ — `window.__DATA__` shortcode and `dump | safe` patterns; confirms XSS safety for static data
- https://tannerdolby.com/writing/generate-page-content-from-a-global-data-file-using-eleventy/ — Concrete example of Nunjucks for-loop rendering cards from `_data/` JS file
- https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files — GitHub web UI file editing, commit directly to main, triggers Actions workflow

### Tertiary (LOW confidence — for awareness only)

- https://www.seanmcp.com/articles/send-data-to-the-window-with-eleventy/ — Custom `expose` shortcode approach (more robust than `dump | safe` for complex data, but unnecessary here)

---

## Metadata

**Confidence breakdown:**
- Data schema design: HIGH — driven directly by requirements; no external dependency
- Nunjucks for loops: HIGH — verified against official Nunjucks docs and Eleventy integration docs
- `dump | safe` embedding pattern: MEDIUM-HIGH — verified by two independent sources; confirmed consistent with Nunjucks docs autoescape behavior
- GitHub web UI editability: HIGH — GitHub's own documentation confirms JS file editing and commit-to-main workflow
- htmlTemplateEngine question: MEDIUM — Phase 1 confirmed `{{ config.siteName }}` works in `.html`; `{% for %}` loops not yet tested; low risk, easy to resolve in Wave 0

**Research date:** 2026-03-20
**Valid until:** 2026-06-20 (90 days — Eleventy v3 and Nunjucks are stable; data schema is project-specific and does not expire)
