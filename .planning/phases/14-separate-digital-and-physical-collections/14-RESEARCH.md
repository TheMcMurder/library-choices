# Phase 14: Separate Digital and Physical Collections - Research

**Researched:** 2026-03-28
**Domain:** Eleventy/Nunjucks macro authoring, JavaScript slider refactor, URL encoding extension
**Confidence:** HIGH

## Summary

Phase 14 replaces the single blended "collections budget" slider with two independent sliders — one for digital collections and one for physical print collections. The total collections cost is additive. Three files change in the JavaScript layer (config.js, calculator.js, url.js) and the HTML template is refactored to call a new Nunjucks macro in place of the inline slider block.

All decisions are locked. The research verifies concrete implementation paths and surfaces the specific patterns, pitfalls, and code shapes the planner needs. No external libraries are added — this phase uses only what is already in the stack (Eleventy 3.x, Nunjucks, vanilla JS, Tailwind CSS 4).

**Primary recommendation:** Extract the slider block into a Nunjucks macro first (it is the shared foundation), then update config.js, then update calculator.js and url.js in parallel, then replace the inline slider block in index.html with two macro calls.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Digital budget + physical budget = total collections cost (additive). Both sliders contribute independently to the tax calculation. No floor/ceiling constraints.
- **D-02:** The existing 6-tier blended options ($10k–$60k) are replaced entirely. No legacy `collections` key retained.
- **D-03:** Each dimension has new independent tier scales defined in config.js (not re-using the old $10k–$60k range).
- **D-04:** Replace `collections` with two top-level keys: `collectionsDigital` and `collectionsPhysical`. Each has its own `description`, `source`, and `options` array. Mirrors the UI structure.
- **D-05:** NON-DEVELOPER EDIT GUIDE in config.js must be updated in this phase to document both new keys so the site owner can update digital and physical tiers independently.
- **D-06:** Two stacked sliders, both inside the Collections Budget fieldset. Digital slider on top, physical slider below. Consistent with existing fieldset/slider pattern.
- **D-07:** Each slider has its own description text (updates to selected tier's description) and its own source citation. Same pattern as the current single slider.
- **D-08:** Extract the slider HTML block into a Nunjucks macro. Both digital and physical sliders are rendered by calling the same macro with different params (id, options, defaultValue, label, descriptionId, etc.). This is a locked requirement.
- **D-09:** Each slider has its own `isCurrentServiceLevel: true` option. Both sliders display the Phase 13 amber tick independently. The `data-current-level` attribute and JS guard pattern from Phase 13 apply to both sliders via the shared macro.
- **D-10:** `tau` param is reused for physical collections index (closest to original intent). A new compact param is added for digital collections index. Old `tau` values that don't match valid physical tier indices fall through to the default physical tier — no special backward-compat mapping needed.
- **D-11:** Total tax = staffing cost + digital budget + physical budget. calculator.js reads both slider values and sums them as the collections component of cost. No minimum or maximum enforced.

### Claude's Discretion

- Exact dollar values and tier counts for `collectionsDigital.options` and `collectionsPhysical.options`
- Name of the new URL param for digital index
- Internal IDs for the two sliders (`collections-digital`, `collections-physical` or similar)
- Macro file location (e.g., `src/_includes/macros/slider.njk` or similar Eleventy convention)
- Whether the fieldset legend changes from "Collections Budget" or stays as-is

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Eleventy | ^3.1.5 | Static site generator, Nunjucks template processing | Already in project |
| Nunjucks | bundled with Eleventy | Macro system for reusable HTML blocks | Built into Eleventy's template engine |
| Tailwind CSS | ^4.2.2 | Utility classes for slider + tick styling | Already in project |
| Vanilla JS (ES5 strict mode) | — | Calculator and URL encoding | Existing project convention — no framework |

### No New Dependencies
This phase adds zero npm packages. All required capabilities are already present.

---

## Architecture Patterns

### Recommended Project Structure (after this phase)
```
src/
├── _data/
│   └── config.js          # collectionsDigital + collectionsPhysical replace collections
├── _includes/
│   └── macros/
│       └── slider.njk     # New: reusable slider macro
├── js/
│   ├── calculator.js      # Updated: getDigitalCost() + getPhysicalCost()
│   └── url.js             # Updated: delta (digital) + tau (physical) params
└── index.html             # Updated: import macro, two macro calls inside fieldset
```

The `_includes/` directory does not yet exist — it must be created. Eleventy automatically resolves `{% from "macros/slider.njk" import sliderMacro %}` relative to the configured includes directory (default: `_includes/` inside the input dir).

### Pattern 1: Nunjucks Macro Definition

Eleventy 3.x uses Nunjucks. Macros are defined with `{% macro name(params) %}...{% endmacro %}` in a `.njk` file and imported with `{% from "path" import name %}`.

The `htmlTemplateEngine: "njk"` setting in `eleventy.config.js` means `index.html` is already processed by Nunjucks, so macro imports work without any config change.

**Macro file: `src/_includes/macros/slider.njk`**

The macro must accept these parameters to cover both sliders:
- `id` — element id (e.g. `collections-digital`)
- `name` — form input name attribute
- `label` — human-readable label (e.g. "Digital collections budget")
- `options` — array of `{value, description, isCurrentServiceLevel?, isDefault?}`
- `source` — source citation string
- `amountId` — id for the dollar amount display span
- `descriptionId` — id for the description paragraph

```nunjucks
{# Source: Nunjucks macro docs — https://mozilla.github.io/nunjucks/templating.html#macro #}
{% macro collectionSlider(id, name, label, options, source, amountId, descriptionId) %}
<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <label for="{{ id }}" class="text-base font-semibold text-gray-900">{{ label }}</label>
    <span id="{{ amountId }}" class="text-base font-semibold text-blue-800"></span>
  </div>
  <input
    type="range"
    id="{{ id }}"
    name="{{ name }}"
    min="{{ options[0].value }}"
    max="{{ options[options | length - 1].value }}"
    value="{{ options | selectDefault }}"
    class="w-full cursor-pointer"
  />
  <div class="flex justify-between px-0" aria-hidden="true">
    {% for opt in options %}
      <button
        type="button"
        data-slider="{{ id }}"
        data-value="{{ opt.value }}"
        {% if opt.isCurrentServiceLevel %}data-current-level="true"{% endif %}
        class="text-xs px-1 py-1 cursor-pointer hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2
               {% if opt.isCurrentServiceLevel %}text-amber-600 font-semibold{% else %}text-gray-500 font-normal{% endif %}"
      >${{ (opt.value / 1000) | int }}k</button>
    {% endfor %}
  </div>
  <p id="{{ descriptionId }}" class="text-sm text-gray-600 leading-normal"></p>
  <cite class="text-sm text-gray-500 not-italic">Source: {{ source }}</cite>
</div>
{% endmacro %}
```

**Key detail:** The `step` attribute on the range input must match the spacing between option values. Since digital and physical tiers may have different spacing, the step must be derived from the config options — or set to 1 and the JS validates against actual option values. The existing slider uses `step="10000"` because all options are $10k apart. The macro must handle variable step or use a computed value.

**Recommended approach:** Set `step` to the GCD of option value differences. For clean tiers like $5k, $10k, $15k steps, the step will be obvious. Alternatively, set `step="1"` and use only the tick buttons + JS snap to valid values — the range input visual only snaps to valid ticks via the click handlers.

### Pattern 2: Macro Import in index.html

```nunjucks
{% from "macros/slider.njk" import collectionSlider %}
```

Place at the top of `src/index.html` before any usage. Eleventy resolves from `src/_includes/` by default.

### Pattern 3: Two-Slider Usage in fieldset

```nunjucks
<fieldset class="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
  <legend class="text-xl font-semibold text-gray-900 px-1">Collections Budget</legend>
  {{ collectionSlider(
    "collections-digital",
    "collections-digital",
    "Digital collections budget",
    config.collectionsDigital.options,
    config.collectionsDigital.source,
    "collections-digital-amount",
    "collections-digital-description"
  ) }}
  <hr class="border-gray-200" />
  {{ collectionSlider(
    "collections-physical",
    "collections-physical",
    "Physical print collections budget",
    config.collectionsPhysical.options,
    config.collectionsPhysical.source,
    "collections-physical-amount",
    "collections-physical-description"
  ) }}
</fieldset>
```

### Pattern 4: calculator.js Refactor

The existing `getCollectionsCost()` reads a single element. Replace with two functions:

```javascript
function getDigitalCost() {
  var el = document.getElementById('collections-digital');
  return parseInt(el.value, 10);
}

function getPhysicalCost() {
  var el = document.getElementById('collections-physical');
  return parseInt(el.value, 10);
}
```

`updateResult()` line becomes:
```javascript
var totalCost = getStaffingCost() + getDigitalCost() + getPhysicalCost();
```

`updateSliderLabels()` must be generalized to operate on a slider ID + data key, or duplicated for each slider. The current implementation uses `document.getElementById('collections')` and `window.LIBRARY_DATA.collections.options`. The refactored version must handle both sliders independently.

The tick button `data-value` selector `[data-value]` currently grabs ALL buttons with that attribute, including both sliders' ticks — this will cause cross-contamination if not scoped. The macro adds `data-slider="{{ id }}"` to scope tick buttons to their parent slider.

```javascript
function updateSliderLabels(sliderId, dataKey, amountId, descriptionId) {
  var slider = document.getElementById(sliderId);
  var value = parseInt(slider.value, 10);
  var options = window.LIBRARY_DATA[dataKey].options;
  var node = null;
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === value) { node = options[i]; break; }
  }
  if (!node) return;
  document.getElementById(amountId).textContent = '$' + value.toLocaleString('en-US');
  document.getElementById(descriptionId).textContent = node.description;
  slider.setAttribute('aria-valuetext', value.toLocaleString('en-US') + ' dollars \u2014 ' + node.description);
  document.querySelectorAll('[data-slider="' + sliderId + '"]').forEach(function (btn) {
    var isActive = btn.dataset.value === String(slider.value);
    var isCurrentLevel = btn.dataset.currentLevel === 'true';
    btn.classList.toggle('text-blue-800', isActive);
    btn.classList.toggle('font-semibold', isActive || isCurrentLevel);
    btn.classList.toggle('text-gray-500', !isActive && !isCurrentLevel);
    btn.classList.toggle('font-normal', !isActive && !isCurrentLevel);
    btn.classList.toggle('text-amber-600', !isActive && isCurrentLevel);
  });
}
```

Call twice:
```javascript
updateSliderLabels('collections-digital', 'collectionsDigital', 'collections-digital-amount', 'collections-digital-description');
updateSliderLabels('collections-physical', 'collectionsPhysical', 'collections-physical-amount', 'collections-physical-description');
```

Tick button click handler also needs scoping to the correct slider:
```javascript
document.querySelectorAll('[data-slider]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var sliderId = btn.dataset.slider;
    var slider = document.getElementById(sliderId);
    slider.value = btn.dataset.value;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    slider.dispatchEvent(new Event('change', { bubbles: true }));
  });
});
```

### Pattern 5: url.js Refactor

`tau` stays for physical collections index (D-10). New param for digital.

Recommended new param name: **`delta`** (Greek letter, consistent with the pi/tau/phi naming convention; evokes "difference/change" appropriate for digital collections variability).

Encode additions in `encodeUrl()`:

```javascript
// delta — digital collections index
var digitalEl = document.getElementById('collections-digital');
if (digitalEl) {
  var digitalVal = parseInt(digitalEl.value, 10);
  var digitalIdx = data.collectionsDigital.options.findIndex(function (o) {
    return o.value === digitalVal;
  });
  if (digitalIdx !== -1) params.set('delta', String(digitalIdx));
}

// tau — physical collections index (replaces old tau for blended collections)
var physicalEl = document.getElementById('collections-physical');
if (physicalEl) {
  var physicalVal = parseInt(physicalEl.value, 10);
  var physicalIdx = data.collectionsPhysical.options.findIndex(function (o) {
    return o.value === physicalVal;
  });
  if (physicalIdx !== -1) params.set('tau', String(physicalIdx));
}
```

`useCompact` detection must include `delta`:
```javascript
var useCompact = params.has('pi') || params.has('tau') || params.has('phi') || params.has('delta');
```

Restore logic for physical (tau) re-targets `collectionsPhysical` instead of the old `collections`:
```javascript
var tauParam = params.get('tau');
if (tauParam !== null) {
  var physIdx = parseInt(tauParam, 10);
  var physSlider = document.getElementById('collections-physical');
  if (!isNaN(physIdx) && physIdx >= 0 && physIdx < data.collectionsPhysical.options.length) {
    physSlider.value = String(data.collectionsPhysical.options[physIdx].value);
  }
  // Out-of-bounds falls through to default — as per D-10
}
```

Old `tau` values that addressed the old 6-tier blended scale may now be out-of-bounds for the new physical tier array. Per D-10 they silently fall through to the physical default. No mapping needed.

Verbose backward-compat path (the `else` branch) still references `data.collections` — it will need to be left as dead code or removed since `collections` key no longer exists in config. Removing the verbose path is safe since it only handles pre-Phase-9 URLs (very old, users will get defaults which is acceptable).

### Pattern 6: config.js Structure

Replace:
```javascript
collections: {
  description: "...",
  source: "...",
  options: [...6 options...],
},
```

With:
```javascript
collectionsDigital: {
  description: "Digital materials added to the collection each year.",
  source: "Cache County Library Services budget proposal FY2025",
  options: [
    { value: 5000,  isDefault: false, description: "Beehive and Libby access only — statewide digital lending" },
    { value: 10000, isDefault: false, description: "Beehive, Libby, and supplemental e-book subscriptions" },
    { value: 15000, isDefault: true,  description: "Full digital suite — e-books, audiobooks, streaming media",
      isCurrentServiceLevel: true,
    },
    { value: 20000, isDefault: false, description: "Expanded digital — all formats plus online learning platforms" },
  ],
},

collectionsPhysical: {
  description: "Physical print and media materials added each year.",
  source: "Cache County Library Services budget proposal FY2025",
  options: [
    { value: 0,     isDefault: false, description: "No physical print collection — digital only" },
    { value: 5000,  isDefault: false, description: "Small rotating print collection" },
    { value: 10000, isDefault: false, description: "Core print collection — new titles and replacements",
      isCurrentServiceLevel: true,
    },
    { value: 15000, isDefault: true,  description: "Expanded print — adult, children, and young adult sections" },
    { value: 20000, isDefault: false, description: "Full print + AV materials + periodicals" },
  ],
},
```

**Note on tier values:** The exact dollar amounts and tier counts are Claude's discretion. The values above use $5k increments for digital (4 tiers) and $5k increments for physical (5 tiers). These are placeholders appropriate for the draft state — the site owner will supply real figures before launch.

The existing slider's range input used `min`/`max`/`step` baked into the HTML. The macro must derive these from the options array. Since tier spacing may differ between digital and physical, the macro should compute `min` as `options[0].value` and `max` as `options[options.length-1].value`. Step should be set to 1 (with JS snapping to valid values via tick buttons) OR computed as the smallest difference between adjacent options if all steps are equal.

The simplest approach: set `step` to the difference between the first two options, and document that options must be evenly spaced. This is consistent with the existing pattern.

### Anti-Patterns to Avoid

- **`[data-value]` without slider scoping:** The current calculator.js uses `document.querySelectorAll('[data-value]')` globally. With two sliders, this selector hits tick buttons from both sliders simultaneously. The macro must add `data-slider="{{ id }}"` and JS must scope queries to `[data-slider="collections-digital"]` and `[data-slider="collections-physical"]` separately.

- **Hard-coding min/max/step in macro:** The macro must derive these from the options array, not accept them as separate params. If they drift from the options, the slider thumb can land between ticks.

- **Leaving verbose backward-compat path referencing `data.collections`:** After this phase, `window.LIBRARY_DATA.collections` no longer exists. The verbose path in url.js will throw a TypeError if hit. Either remove the verbose branch entirely or guard with `if (data.collections)`.

- **Placing the macro import inside a block:** Nunjucks macro imports must be at the top level of the template. Placing `{% from ... %}` inside a conditional or loop silently fails.

- **Forgetting to initialize slider values on page load:** Both sliders need `updateSliderLabels()` called on init. The existing pattern calls it once in the immediately-invoked function — this must call both slider label updaters.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reusable HTML block | Custom include/partial system | Nunjucks `{% macro %}` | Macros support params; includes do not |
| Slider value snapping | Custom range input polyfill | Existing tick button + JS dispatchEvent pattern | Already proven in Phase 7–10 |
| URL state serialization | Custom encoding | Existing `URLSearchParams` + `history.replaceState` pattern | Already proven, extend with `delta` param |

**Key insight:** All primitives exist. This phase is pure composition and extension of established patterns.

---

## Common Pitfalls

### Pitfall 1: Nunjucks macro import path
**What goes wrong:** `{% from "macros/slider.njk" import ... %}` fails with "template not found"
**Why it happens:** Eleventy resolves macro paths from the configured `includes` directory. The default is `_includes/` inside the input directory (`src/_includes/`). If the file is placed at `src/macros/slider.njk` (missing the `_includes/` prefix), it won't resolve.
**How to avoid:** Place the macro at `src/_includes/macros/slider.njk`. Create `src/_includes/` and `src/_includes/macros/` directories before writing the macro.
**Warning signs:** Eleventy build error: "template not found" or silent empty output for the macro call.

### Pitfall 2: Nunjucks `length` filter vs `.length` property
**What goes wrong:** `options | length` vs `options.length` — in Nunjucks, array length is accessed via the `length` filter, not the `.length` property. Both work in Nunjucks (it supports dot access on JS arrays), but `options | length` is the idiomatic form.
**How to avoid:** Use `options | length` for consistency with existing template patterns.
**Warning signs:** Works in dev but breaks if Nunjucks version changes behavior.

### Pitfall 3: Range input step mismatch with option values
**What goes wrong:** The range input `step` doesn't match option value spacing. The slider thumb can visually stop between tick marks.
**Why it happens:** Forgetting to compute `step` from options when moving away from the fixed $10k-apart tiers.
**How to avoid:** Compute step as `options[1].value - options[0].value` (assumes uniform spacing). Document that options must be evenly spaced, consistent with the NON-DEVELOPER EDIT GUIDE warning about array order.
**Warning signs:** Slider thumb doesn't align with tick buttons.

### Pitfall 4: Cross-slider tick button interference
**What goes wrong:** Clicking a tick on the digital slider also triggers label updates on the physical slider (or vice versa).
**Why it happens:** The current JS uses `document.querySelectorAll('[data-value]')` globally without scoping.
**How to avoid:** Add `data-slider="{{ id }}"` to each tick button in the macro and scope all JS queries by this attribute.
**Warning signs:** Both slider amounts update simultaneously when one tick is clicked.

### Pitfall 5: `window.LIBRARY_DATA.collections` reference after key removal
**What goes wrong:** url.js verbose backward-compat branch accesses `data.collections.options` which no longer exists, throwing `TypeError: Cannot read properties of undefined`.
**Why it happens:** The verbose branch handles pre-Phase-9 URLs. It still references the old key after config.js removes it.
**How to avoid:** Remove the verbose backward-compat branch entirely (it's ~4 years stale) OR add `if (data.collections)` guard. Removing is cleaner.
**Warning signs:** Console errors when a URL with old `?collections=30000` style param is loaded.

### Pitfall 6: url.js initialization order
**What goes wrong:** `restoreFromUrl()` runs before `updateSliderLabels()` (which is in calculator.js). The slider value is restored, but the displayed amount/description doesn't update.
**Why it happens:** url.js calls `form.dispatchEvent(new Event('input'))` after restoring values — this triggers calculator.js's `input` listener which calls `updateSliderLabels`. This is the existing pattern and must be preserved for both sliders.
**How to avoid:** Ensure the existing `form.dispatchEvent(new Event('change'))` + `form.dispatchEvent(new Event('input'))` calls after `restoreFromUrl()` still trigger both label updaters. The delegated `form.addEventListener('input', ...)` handler handles this automatically if `updateSliderLabels` calls cover both sliders.
**Warning signs:** After page load from a shared URL, slider positions are correct but amount/description labels show stale or empty values.

---

## Code Examples

### Nunjucks Macro Import and Call

```nunjucks
{# At top of src/index.html #}
{% from "macros/slider.njk" import collectionSlider %}

{# Inside Collections Budget fieldset #}
{{ collectionSlider(
  "collections-digital",
  "collections-digital",
  "Digital collections budget",
  config.collectionsDigital.options,
  config.collectionsDigital.source,
  "collections-digital-amount",
  "collections-digital-description"
) }}
```

### Calculator total cost line

```javascript
var totalCost = getStaffingCost() + getDigitalCost() + getPhysicalCost();
```

### Breakdown detail text (both sliders)

The existing breakdown detail shows `$X total ÷ Y households`. No change to this pattern — it uses `totalCost` which now sums three components.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — Phase 16 adds unit tests |
| Config file | None — see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| — | No formal requirement IDs assigned to Phase 14 | — | — | — |

Manual verification checklist (since no test infrastructure exists yet):
- [ ] Digital slider and physical slider are independent (moving one does not affect the other)
- [ ] Total cost bar shows correct sum of staffing + digital + physical
- [ ] Shared URL encodes `delta` (digital) and `tau` (physical) correctly and restores on load
- [ ] Old `tau` values out of range for new physical tiers silently fall to default
- [ ] Amber tick appears on correct tick for each slider independently
- [ ] NON-DEVELOPER EDIT GUIDE in config.js documents both new keys

### Wave 0 Gaps
- No test files exist for any JS logic (deferred to Phase 16)

*(Phase 16 will add unit test infrastructure — this phase relies on manual browser verification.)*

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single blended collections slider | Two independent sliders via shared macro | Phase 14 | Planner and citizen can tune digital vs physical independently |
| `collections` config key | `collectionsDigital` + `collectionsPhysical` | Phase 14 | `window.LIBRARY_DATA.collections` no longer exists after this phase |
| `tau` = blended collections index | `tau` = physical collections index; `delta` = digital collections index | Phase 14 | Old shared URLs with `?tau=N` silently fall to physical default if N out of range |

**Deprecated/outdated after this phase:**
- `config.collections` key: removed entirely (D-02)
- `window.LIBRARY_DATA.collections`: no longer available in browser JS
- Verbose backward-compat URL branch referencing `data.collections`: should be removed (will error otherwise)

---

## Open Questions

1. **Step attribute for uneven tier spacing**
   - What we know: options must be evenly spaced for a range input with a fixed step to align with ticks
   - What's unclear: whether the final dollar values chosen for digital vs physical will happen to have equal spacing within each slider
   - Recommendation: Enforce equal spacing within each options array (document in NON-DEVELOPER EDIT GUIDE); compute step as `options[1].value - options[0].value` in the macro

2. **Physical tier includes $0 value**
   - What we know: `min="0"` on a range input is valid HTML
   - What's unclear: Whether a $0 value causes a `parseInt("", 10)` → NaN issue if the slider is somehow empty
   - Recommendation: Set the physical slider's minimum to 0 and ensure calculator.js handles 0 as a valid integer (it does — `parseInt("0", 10)` is `0`)

3. **Fieldset legend text**
   - What we know: Currently "Collections Budget"; both new sliders live inside this fieldset (D-06)
   - What's unclear: Whether "Collections Budget" still makes sense as the legend when it contains two separate dimensions
   - Recommendation (Claude's discretion): Keep "Collections Budget" — it accurately names the fieldset's purpose. The individual slider labels ("Digital collections budget" / "Physical print collections budget") differentiate the two dimensions within.

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `src/_data/config.js`, `src/index.html`, `src/js/calculator.js`, `src/js/url.js` — all patterns verified from source
- Eleventy config inspection of `eleventy.config.js` — confirms `htmlTemplateEngine: "njk"`, input dir `src/`, default includes dir `src/_includes/`
- Nunjucks macro syntax: https://mozilla.github.io/nunjucks/templating.html#macro — standard Nunjucks documentation

### Secondary (MEDIUM confidence)
- Eleventy includes directory convention: standard Eleventy behavior for `_includes/` relative to input dir, consistent with all Eleventy documentation

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new packages, all from existing project
- Architecture: HIGH — all patterns derived from direct code inspection
- Pitfalls: HIGH — derived from code-level analysis of specific integration points
- Macro location: HIGH — derived from Eleventy config (htmlTemplateEngine + dir.input)

**Research date:** 2026-03-28
**Valid until:** 2026-06-28 (stable — Eleventy 3.x, Nunjucks, vanilla JS; no fast-moving dependencies)
