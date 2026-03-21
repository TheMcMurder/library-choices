# Stack Research

**Domain:** Civic interactive static site — adding accessible range slider and weekly schedule display to existing Eleventy v3 + Tailwind v4 + vanilla JS stack
**Researched:** 2026-03-21
**Confidence:** HIGH (slider behavior from MDN; Tailwind v4 patterns from official docs + community; browser support from caniuse and MDN)

---

## Summary: No New Dependencies

Both v1.1 features are implementable with zero new npm packages. Everything needed is either already in the browser or already in the existing stack.

---

## Recommended Stack Additions

### Core Technologies

No additions. The existing stack handles both features:

| Technology | Version | Already Present | Why No Addition Needed |
|------------|---------|-----------------|------------------------|
| `<input type="range">` | Browser-native | Yes (HTML5) | Baseline Widely Available since March 2017 across all modern browsers; no polyfill needed |
| `aria-valuetext` | Browser-native ARIA | Yes | Standard ARIA attribute on `<input type="range">` to give screen readers a formatted string ("$30,000/year") instead of raw integer |
| Nunjucks `{% for %}` loop | Bundled with Eleventy | Yes | Renders both the slider node labels and the schedule table from config.js data |
| Vanilla JS `input` event | Browser-native | Yes | Updates `aria-valuetext` and the per-node description text on slider move |
| Tailwind v4 CSS | `^4.2.2` (installed) | Yes | `@layer base` handles vendor pseudo-elements for track/thumb styling |

### Supporting Libraries

None required. Specific justifications:

| Library Considered | Decision | Rationale |
|--------------------|----------|-----------|
| range-slider npm packages (e.g., `ion.rangeSlider`, `noUiSlider`) | Do NOT add | Overkill for 6 discrete integer values; adds JS bundle; creates new dependency to maintain; native `<input type="range">` with `step` is fully keyboard accessible and WCAG 2.1 AA compliant |
| `flatpickr` or schedule display libraries | Do NOT add | Weekly schedule is static display-only data; a Nunjucks loop over config.js into a `<dl>` or styled `<div>` grid is sufficient; no interactivity needed |
| Polyfills for range input | Do NOT add | IE11 is irrelevant to this project; all browsers supporting GitHub Pages have had range input since 2017 |

---

## Integration Points With Existing Stack

### 1. Range Slider (Collections Budget)

**HTML (`src/index.html`):**

Replace `<select id="collections">` with `<input type="range">`. Key attributes:

- `min="10000"` / `max="60000"` / `step="10000"` — maps exactly to the 6 existing config options
- `value="{{ defaultValue }}"` — rendered by Nunjucks from config.js `isDefault` flag
- `aria-valuetext="$30,000/year"` — set initially by Nunjucks; updated dynamically by JS on `input` event
- `list="collections-ticks"` paired with a `<datalist>` — tick marks in Chrome/Safari/Edge; Firefox silently ignores (acceptable degradation — the step constraint still works)

**Node labels (dollar amounts + descriptions below slider):**

Build a positioned label row in Nunjucks alongside the slider:

```html
<div class="relative flex justify-between mt-2">
  {% for opt in config.collections.options %}
    <span class="text-xs text-gray-500">{{ opt.value | toCurrency }}</span>
  {% endfor %}
</div>
```

These are pure CSS/HTML — no JS required for positioning (flexbox `justify-between` on 6 evenly-spaced items maps to the 6 step nodes).

**Per-node description text:**

Embed all descriptions as `data-` attributes on the slider or in a parallel JSON blob (via `window.LIBRARY_DATA`, already present). On `input` event in calculator.js, read the current slider value and update a description `<p>` element — same pattern as the existing `getCollectionsCost()` function.

**`calculator.js` change:**

Replace `getCollectionsCost()` body: change from `parseInt(collectionsSelect.value, 10)` on a `<select>` to the same read from `rangeInput.value` — identical semantics, one-line change.

**URL state (`url.js`):**

The existing `URLSearchParams` serialization reads control values; `rangeInput.value` returns a string integer just like `selectElement.value`. No URL encoding logic change needed.

**CSS (`src/css/style.css` via `@layer base`):**

Vendor pseudo-elements for cross-browser thumb/track styling must be written in `@layer base` (not Tailwind utility classes) because the pseudo-elements require `appearance: none` and duplicate declarations for webkit vs. moz:

```css
@layer base {
  input[type="range"] {
    appearance: none;
    -webkit-appearance: none;
  }
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    /* size, color, border-radius */
  }
  input[type="range"]::-webkit-slider-runnable-track {
    /* height, border-radius, background */
  }
  input[type="range"]::-moz-range-thumb { /* Firefox */ }
  input[type="range"]::-moz-range-track { /* Firefox */ }
}
```

Tailwind arbitrary variant syntax (`[&::-webkit-slider-thumb]:bg-blue-600`) works in HTML class attributes but is verbose for multi-property pseudo-elements. `@layer base` in `style.css` is cleaner for this use case.

**Progress fill (filled track behind thumb):**

`::-moz-range-progress` exists only in Firefox. Chrome/Safari have no equivalent CSS pseudo-element. For a purely decorative filled track, use a JS `input` listener that updates a CSS custom property:

```js
slider.addEventListener('input', function() {
  var pct = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.setProperty('--slider-pct', pct + '%');
});
```

Then in CSS: `background: linear-gradient(to right, blue var(--slider-pct), gray var(--slider-pct))` on the track. This is a ~5-line addition to `calculator.js`.

**If progress fill is skipped:** A flat-color track with a visually distinct thumb is fully WCAG 2.1 AA compliant. Progress fill is purely decorative and can be omitted to keep the JS minimal.

### 2. Weekly Schedule Display (Staffing / Hours Open)

**`config.js` data structure addition:**

Add a `schedule` array to each staffing level object. Recommended structure:

```js
{
  id: "1fte",
  label: "1 Full-Time Librarian",
  annualCost: 150000,
  description: "...",
  schedule: [
    { day: "Monday",    open: "9:00 AM", close: "6:00 PM" },
    { day: "Tuesday",   open: "9:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Thursday",  open: "9:00 AM", close: "8:00 PM" },
    { day: "Friday",    open: "9:00 AM", close: "5:00 PM" },
    { day: "Saturday",  open: "10:00 AM", close: "2:00 PM" },
    { day: "Sunday",    open: null,       close: null }
  ]
}
```

Using `null` for closed days is cleaner than an empty string — Nunjucks `{% if day.open %}` handles the conditional naturally.

**Nunjucks rendering:**

A `<dl>` (definition list) is semantically correct for day → hours pairs and is accessible without ARIA additions:

```html
{% for day in level.schedule %}
  <div class="flex justify-between">
    <dt class="text-sm font-medium text-gray-700">{{ day.day }}</dt>
    <dd class="text-sm text-gray-600">
      {% if day.open %}{{ day.open }} – {{ day.close }}{% else %}Closed{% endif %}
    </dd>
  </div>
{% endfor %}
```

No JavaScript needed — this is build-time template rendering.

**Showing schedule per radio selection:**

The three staffing levels already render as separate radio options with descriptions. Two approaches:

1. **Always-visible per-option:** Render each level's schedule inline below its radio button description (like the existing `<p class="text-sm text-gray-600">{{ level.description }}</p>`). Simple, no JS.
2. **Show on selection:** Use `hidden` attribute on schedule `<div>`s; add a small JS listener on the `staffing` radio group `change` event to toggle visibility. Consistent with the existing delegated `form.addEventListener('change', updateResult)` pattern.

Option 1 is recommended for v1.1 — no additional JS, zero accessibility risk, consistent with the existing design pattern of showing all option details inline.

---

## What NOT to Add

| Avoid | Why | Instead |
|-------|-----|---------|
| noUiSlider / ion.rangeSlider / any slider npm package | Adds JS bundle weight (25–80 KB), external CSS, and a new dependency to maintain. Native `<input type="range">` covers all required functionality. | Native `<input type="range">` with `step`, `aria-valuetext`, vanilla JS for description update |
| `datalist` as the sole tick-mark strategy | Firefox (as of early 2026) has an open bug since 2013 and does not render tick marks from `<datalist>` on range inputs. The `list` attribute still works for snap-to-step behavior in Firefox. | Use `datalist` for Chrome/Safari tick rendering; supplement with CSS-positioned label row for cross-browser visual nodes |
| CSS scroll-driven animations for progress fill | Experimental in 2025–2026; limited browser support; adds complexity without meaningful UX benefit for a 6-step slider | JS `--slider-pct` custom property approach, or skip progress fill entirely |
| A schedule/calendar display library | Static day→hours display is 7 rows of data. Any library is more complexity than the problem warrants. | Nunjucks `{% for %}` loop into a `<dl>` or `<div>` grid |
| Separating schedule data into a new file | Breaks the single-source-of-truth pattern. Non-developer needs one file to edit. | Add `schedule` array directly to each staffing level object in `config.js` |
| PostCSS pipeline change | The project already uses `@tailwindcss/cli` standalone (confirmed from `package.json` — `build:css` script). No PostCSS change needed. | Keep existing `tailwindcss -i ... -o ...` CLI command |

---

## Browser Compatibility Notes

| Feature | Chrome | Firefox | Safari | Notes |
|---------|--------|---------|--------|-------|
| `<input type="range">` | Full | Full | Full | Baseline Widely Available |
| `step` attribute discrete snapping | Full | Full | Full | All modern browsers |
| `datalist` tick marks on range | Yes | No (open bug #841942) | Yes | Visual degradation only; step behavior unaffected in Firefox |
| `aria-valuetext` | Full | Full | Full | Standard ARIA, universally supported |
| `::-webkit-slider-thumb` | Yes | No | Yes | Use `::-moz-range-thumb` for Firefox |
| `::-moz-range-progress` (filled track) | No | Yes | No | Filled-track CSS is Firefox-only; use JS custom property for cross-browser |
| `accent-color` for quick theming | Full | Full | Full | Works without `appearance: none`; gives basic blue thumb/track matching Tailwind `blue-600` |

**Bottom line on Firefox tick marks:** Firefox users see a working slider that snaps to the 6 correct values; they just don't see visual tick marks. The CSS label row below the slider compensates — all 6 dollar values are visible as text regardless of browser.

---

## No Version Compatibility Changes

All v1.1 work uses:

- HTML attributes already supported in the installed browser targets
- Tailwind v4.2.2 (already installed) — no upgrade needed
- Eleventy v3.1.5 (already installed) — no upgrade needed
- Vanilla JS patterns already present in `calculator.js`

No `package.json` changes are expected for v1.1.

---

## Sources

- MDN Web Docs, https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range — range input spec, `step`, `list`, `aria-valuetext` behavior (HIGH confidence — official spec)
- MDN Web Docs, https://developer.mozilla.org/en-US/docs/Web/CSS/::-moz-range-track — Firefox pseudo-element reference (HIGH confidence — official spec)
- Mozilla Bugzilla #841942, https://bugzilla.mozilla.org/show_bug.cgi?id=841942 — Firefox datalist tick mark support (open since 2013, unresolved as of 2026) (HIGH confidence — official bug tracker)
- caniuse.com, https://caniuse.com/datalist — datalist browser support table (MEDIUM confidence — WebSearch, could not WebFetch directly)
- Tailwind CSS v4 GitHub discussion #8748, https://github.com/tailwindlabs/tailwindcss/discussions/8748 — range input styling in Tailwind v4 (MEDIUM confidence — community discussion, consistent with Tailwind v4 docs)
- `package.json` (this repo) — confirmed `@tailwindcss/cli@^4.2.2` standalone CLI, no PostCSS pipeline (HIGH confidence — direct file inspection)
- CSS-Tricks, https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ — vendor pseudo-element pattern for cross-browser styling (MEDIUM confidence — WebSearch, established reference)

---
*Stack research for: v1.1 UX — Collections budget slider + weekly schedule display on Eleventy v3 + Tailwind v4 + vanilla JS static site*
*Researched: 2026-03-21*
