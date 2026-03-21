# Phase 7: Collections Budget Slider - Research

**Researched:** 2026-03-21
**Domain:** Native HTML range input, cross-browser CSS styling, ARIA accessibility, URL state restoration
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SLDR-01 | User can adjust the collections budget via a range slider (replaces the dropdown) | Native `<input type="range">` with `min`, `max`, `step` replacing `<select id="collections">` |
| SLDR-02 | Slider snaps to 6 discrete nodes matching existing dollar amounts ($10k–$60k in $10k steps) | `min="10000" max="60000" step="10000"` — 6 valid positions exactly; no JS snapping needed |
| SLDR-03 | Each node displays an "Available books/digital" description; lowest node describes digital-only (Beehive/Libby) | Description strings added to `config.js` `collections.options[*].description`; JS reads LIBRARY_DATA and updates a `<p>` on `input` event |
| SLDR-04 | Description text and tax result update live during drag and keyboard navigation — not only on release | `form.addEventListener('input', updateResult)` added alongside existing `change` listener; already flagged in STATE.md |
| SLDR-05 | Screen reader hears citizen-meaningful label via `aria-valuetext` | `setAttribute('aria-valuetext', ...)` called synchronously in `input` event handler; native `<input type="range">` has implicit `role="slider"` |
| SLDR-06 | Dollar amount labels visible below slider on all browsers (CSS label row, not datalist-only) | Flexbox `<div>` row of `<span>` elements, one per node, positioned below slider using `justify-between`; datalist NOT relied upon |
| SLDR-07 | Slider thumb and track are custom styled to match site's civic design (blue-800) | `@layer base` CSS rules targeting `::-webkit-slider-thumb`, `::-moz-range-thumb`, `::-webkit-slider-runnable-track`, `::-moz-range-track`; or Tailwind arbitrary variants in markup |
| SLDR-08 | Previously shared URLs containing `?collections=30000` restore the correct slider node | `url.js` `restoreFromUrl()` switches from `Array.from(select.options)` to `LIBRARY_DATA.collections.options.map(...)`; sets `slider.value` instead of `select.value`; STATE.md already flags this |
</phase_requirements>

---

## Summary

Phase 7 replaces the existing `<select id="collections">` with a native `<input type="range">` element. The work is primarily a controlled swap in HTML plus coordinated updates to three existing files: `config.js` (add description strings), `calculator.js` (add `input` listener and `getCollectionsCost` update), and `url.js` (fix `restoreFromUrl` validation path). No new libraries are needed; no new JS files are needed.

The most design-sensitive requirement is SLDR-06 (browser-visible dollar labels). `<datalist>` labels are unreliable — Firefox shows no labels, Chrome shows tick marks only. The correct approach is a separate flexbox `<div>` row of `<span>` elements rendered by Nunjucks from `config.collections.options`, positioned below the slider and justified to align with the six slider positions. This is a static HTML pattern, not a JS-computed layout.

SLDR-05 (screen reader `aria-valuetext`) requires one `setAttribute` call in the `input` event handler. Native `<input type="range">` carries implicit `role="slider"`, so `aria-valuetext` is valid without any role override. The initial value must be set at page load (matching the default node) and updated on every `input` event.

**Primary recommendation:** Implement the slider in a single focused plan: (1) extend `config.js` with per-node descriptions, (2) swap the HTML `<select>` for `<input type="range">` with static label row, (3) update `calculator.js` for live `input` event and new `getCollectionsCost`, (4) update `url.js` `restoreFromUrl` for slider, (5) add range-input CSS to `style.css`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Native `<input type="range">` | HTML Living Standard | Slider control | Built-in keyboard nav, focus, ARIA role=slider, no dependencies |
| Tailwind CSS v4 | v4 (already in project) | Utility styling | Already in project; `@layer base` for pseudo-element CSS |
| Vanilla JS (IIFE + 'use strict') | ES5 compatible | Event handling | Established project pattern; no bundler |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `<datalist>` | HTML Living Standard | Tick mark hints | Use ONLY for semantic correctness as progressive enhancement — never for visual labels |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native range input | noUiSlider or similar JS slider library | Library adds ~20KB, introduces dependency, solves nothing native doesn't; avoid |
| CSS label row (flexbox `<span>`s) | `<datalist>` labels | datalist labels not supported in Firefox — CSS row is the only reliable cross-browser approach |
| `@layer base` pseudo-element CSS | Tailwind arbitrary variants in markup | Both work; `@layer base` keeps HTML cleaner and is consistent with project's minimal-markup style |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Change Set

```
src/
├── _data/config.js          # Add .description to each collections option
├── index.html               # Swap <select> for <input type="range"> + label row
├── js/calculator.js         # Add 'input' listener; update getCollectionsCost()
├── js/url.js                # Fix restoreFromUrl collections path for slider
└── css/style.css            # Add range input pseudo-element rules in @layer base
```

### Pattern 1: Discrete Slider via min/max/step

**What:** `<input type="range">` with `min="10000"`, `max="60000"`, `step="10000"` produces exactly 6 valid snapping positions. The browser enforces step quantization natively — no JS rounding needed.

**When to use:** Any time you have a small fixed set of options that map to a linear numeric range.

**Example:**
```html
<!-- Source: MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range -->
<input
  type="range"
  id="collections"
  name="collections"
  min="10000"
  max="60000"
  step="10000"
  value="30000"
  aria-valuetext="30,000 dollars — Print collection + digital"
/>
```

### Pattern 2: Live Update with `input` Event

**What:** The `input` event fires continuously during drag and on every keyboard step. The `change` event fires only on release. Both must be handled to satisfy SLDR-04 and SLDR-08 (URL encoding on release is fine; description/result must update on drag).

**When to use:** Any slider that must provide live feedback.

**Example:**
```javascript
// Source: MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
// In calculator.js — add alongside existing change listener
form.addEventListener('input', updateResult);

// getCollectionsCost updated to read slider value
function getCollectionsCost() {
  var slider = document.getElementById('collections');
  return parseInt(slider.value, 10);
}
```

**Critical note:** `url.js` dispatches `form.dispatchEvent(new Event('change'))` on page load to trigger recalculation after restoring URL state. After adding the `input` listener, this remains correct — `change` is still a valid trigger. No change needed in url.js initialization sequence.

### Pattern 3: Dynamic `aria-valuetext` Update

**What:** Set `aria-valuetext` on the slider element every time its value changes. Initial value set at page load from the default node. Updated in the same `input` handler that updates the description text.

**When to use:** Whenever the numeric `value` attribute is meaningless to citizens (raw integers like `30000` are not citizen-friendly).

**Example:**
```javascript
// Source: MDN https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext
function getNodeDescription(value) {
  var options = window.LIBRARY_DATA.collections.options;
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      return (value / 1000).toLocaleString('en-US') + ',000 dollars \u2014 ' + options[i].description;
    }
  }
  return String(value);
}

slider.setAttribute('aria-valuetext', getNodeDescription(parseInt(slider.value, 10)));
```

### Pattern 4: CSS Label Row (Cross-Browser)

**What:** A `<div>` with `display: flex; justify-content: space-between` rendered by Nunjucks below the slider, one `<span>` per option value. This is the only approach that works in Firefox, Safari, and Chrome.

**When to use:** Any range slider with a small fixed set of labeled positions.

**Example:**
```html
{# Source: Requirements SLDR-06 — datalist labels not cross-browser #}
<div class="flex justify-between text-xs text-gray-500 mt-1" aria-hidden="true">
  {% for opt in config.collections.options %}
    <span>${{ (opt.value / 1000) | int }}k</span>
  {% endfor %}
</div>
```

`aria-hidden="true"` is correct here: the slider's `aria-valuetext` already communicates the current value to screen readers; the label row is a visual aid only.

### Pattern 5: Range Input CSS Styling in Tailwind v4

**What:** Tailwind v4 does not provide built-in utilities for range input pseudo-elements. Use `@layer base` in `style.css` for cross-browser thumb/track styling. This keeps the HTML clean and aligns with the project's minimal-markup pattern.

**When to use:** When `accent-color` alone is insufficient (e.g., custom thumb size or track height needed per SLDR-07).

**Example:**
```css
/* Source: CSS-Tricks https://css-tricks.com/sliding-nightmare-understanding-range-input/ */
/* In style.css, inside @layer base (or as a plain rule — Tailwind v4 processes both) */
@layer base {
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;
  }
  /* Webkit (Chrome, Safari, Edge) */
  input[type='range']::-webkit-slider-runnable-track {
    background-color: theme(colors.blue.200);
    border-radius: 0.5rem;
    height: 0.5rem;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background-color: theme(colors.blue.800);
    border-radius: 50%;
    height: 1.25rem;
    width: 1.25rem;
    margin-top: -0.375rem; /* (thumb height - track height) / 2 */
  }
  /* Firefox */
  input[type='range']::-moz-range-track {
    background-color: theme(colors.blue.200);
    border-radius: 0.5rem;
    height: 0.5rem;
  }
  input[type='range']::-moz-range-thumb {
    background-color: theme(colors.blue.800);
    border: none;
    border-radius: 50%;
    height: 1.25rem;
    width: 1.25rem;
  }
  input[type='range']:focus-visible {
    outline: 2px solid theme(colors.blue.600);
    outline-offset: 2px;
  }
}
```

**Note:** `accent-color: theme(colors.blue.800)` is the fast path if the project only needs color matching with no custom dimensions. Use it as a starting point; if visual requirements demand custom thumb size, move to full pseudo-element approach above. The two approaches are mutually exclusive on a given element — once `-webkit-appearance: none` is set, `accent-color` has no effect on the thumb.

### Pattern 6: URL Restoration for Slider (SLDR-08)

**What:** `url.js` currently validates `collectionsParam` against `Array.from(select.options).map(o => o.value)` — this references the `<select>` DOM that will no longer exist. Must be changed to validate against `LIBRARY_DATA.collections.options.map(o => String(o.value))`, then set `slider.value = collectionsParam`. The URL format `?collections=30000` is preserved unchanged.

**When to use:** Required for backward-compatible URL sharing.

**Example:**
```javascript
// Source: url.js existing pattern — updated for slider
var collectionsParam = params.get('collections');
if (collectionsParam) {
  var slider = document.getElementById('collections');
  var validValues = data.collections.options.map(function (o) { return String(o.value); });
  if (validValues.indexOf(collectionsParam) !== -1) {
    slider.value = collectionsParam;
    // Update aria-valuetext to match restored value
    slider.setAttribute('aria-valuetext', getNodeDescription(parseInt(collectionsParam, 10)));
  }
}
```

### Anti-Patterns to Avoid

- **Relying on `<datalist>` for visible labels:** Firefox (as of 2025) does not render labels from `<datalist>` options. This is a known open bug (Bugzilla #841942). Never rely on datalist for required UI text.
- **Using `change` event only for live feedback:** `change` fires only on mouse/touch release. Drag feedback requires `input` event. Both must be registered.
- **Setting `aria-valuetext` once at build time:** The value must be updated on every `input` event. A stale `aria-valuetext` is worse than no `aria-valuetext` — it misinforms screen reader users.
- **Forgetting to initialize `aria-valuetext` at page load:** The attribute must reflect the initial/restored value, not just subsequent changes.
- **Custom JS snapping logic:** With `min="10000" max="60000" step="10000"`, the browser snaps natively. Adding JS rounding introduces drift on edge cases.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slider snapping to discrete values | JS rounding/quantization | `step` attribute | Browser enforces step natively; keyboard nav respects it automatically |
| Keyboard navigation (arrow keys, Home/End) | Custom keydown handlers | Native `<input type="range">` | Arrow keys, Page Up/Down, Home/End all work for free |
| Focus visible ring | Custom focus JS | CSS `focus-visible` pseudo-class | Native focus management; already used in project for radio/checkbox |
| Cross-browser range styling | Vendor-detected CSS injection | `@layer base` static CSS rules | Static CSS covering webkit + moz covers all three target browsers |

**Key insight:** The native range input solves keyboard navigation, focus management, value quantization, and ARIA role in one element. The only genuinely custom work is visual styling (CSS) and human-readable labels (one JS setAttribute call + one static HTML row).

---

## Common Pitfalls

### Pitfall 1: Firefox Datalist Labels Not Rendered
**What goes wrong:** Developer adds `<datalist>` with labeled `<option>` elements expecting dollar labels to appear below slider in Firefox. Firefox shows nothing.
**Why it happens:** Firefox has never implemented the visual datalist label rendering for range inputs. Bugzilla #841942 has been open since 2013.
**How to avoid:** Always use a separate flexbox `<div>` with `<span>` elements for visible labels. Datalist can be included for semantic tick marks (Chrome) but must never carry the labeling responsibility.
**Warning signs:** If you test only in Chrome and see tick marks, the feature will silently fail in Firefox.

### Pitfall 2: `aria-valuetext` Not Updated on Every Step
**What goes wrong:** `aria-valuetext` is set at page load but not in the `input` handler. Screen reader announces the initial label on every change because the attribute never updates.
**Why it happens:** Developer conflates "set once" initialization with "update on change."
**How to avoid:** Call `setAttribute('aria-valuetext', ...)` in the same function that updates the description text. If both updates share a single `updateDescription(value)` function, this is automatically correct.
**Warning signs:** Screen reader announces same label regardless of slider position.

### Pitfall 3: `getCollectionsCost()` Still Reads `select.value`
**What goes wrong:** After swapping the HTML, `calculator.js` still calls `document.getElementById('collections')` and reads `.value` — this still works since the new `<input type="range">` has the same `id` and a `.value` property. But `data-cost` is not present on the range input, so any future code relying on `dataset.cost` breaks silently.
**Why it happens:** The current `getCollectionsCost()` reads `.value` (live property), not `dataset.cost`. This is already correct — just verify `.value` is still the right read path for the range input (it is).
**How to avoid:** Read `.value` from the range input (correct) and `parseInt(..., 10)` it. No `data-cost` attribute is needed.
**Warning signs:** Cost calculation unexpectedly returns `NaN`.

### Pitfall 4: Thumb Vertical Alignment on Webkit
**What goes wrong:** Custom thumb appears vertically misaligned with the track — the center of the thumb is at the track's top edge, not centered on it.
**Why it happens:** Webkit requires `margin-top: -(thumb_height - track_height) / 2` on the thumb when using `-webkit-appearance: none`.
**How to avoid:** Apply the negative margin-top formula. For a 20px thumb and 8px track: `margin-top: -6px`.
**Warning signs:** Thumb visually rides above or below the track in Chrome/Safari.

### Pitfall 5: URL Restoration Updates Value but Not `aria-valuetext`
**What goes wrong:** A shared URL restores the correct slider position visually, but the screen reader announces the stale initial `aria-valuetext` until the user moves the slider.
**Why it happens:** `restoreFromUrl()` sets `slider.value` but doesn't call the `aria-valuetext` update function.
**How to avoid:** After setting `slider.value` in `restoreFromUrl()`, call the same `getNodeDescription` / `setAttribute` helper used in the `input` handler. Or rely on the existing `form.dispatchEvent(new Event('change'))` in url.js — but note that `aria-valuetext` must be updated by either the `input` or `change` handler for this to work.
**Warning signs:** Screen reader users who open a shared URL hear wrong label until first interaction.

---

## Code Examples

Verified patterns from official sources:

### Complete Slider HTML Structure
```html
{# Nunjucks — replaces the existing <select> block in index.html #}
<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <label for="collections" class="text-base font-semibold text-gray-900">Annual collections budget</label>
    <span id="collections-amount" class="text-base font-semibold text-blue-800">$30,000</span>
  </div>
  <input
    type="range"
    id="collections"
    name="collections"
    min="10000"
    max="60000"
    step="10000"
    value="30000"
    aria-valuetext="30,000 dollars — Print collection + digital"
    class="w-full cursor-pointer"
  />
  {# CSS label row — cross-browser, aria-hidden since slider aria-valuetext covers screen readers #}
  <div class="flex justify-between text-xs text-gray-500 px-0" aria-hidden="true">
    {% for opt in config.collections.options %}
      <span>${{ (opt.value / 1000) | int }}k</span>
    {% endfor %}
  </div>
  <p id="collections-description" class="text-sm text-gray-600 leading-normal">
    {# Populated by JS on input event; initial value set by JS on load #}
  </p>
  <cite class="text-sm text-gray-500 not-italic">Source: {{ config.collections.source }}</cite>
</div>
```

### config.js Extension (per-node descriptions)
```javascript
// Source: existing config.js pattern — extend options with description
options: [
  { value: 10000, isDefault: false, description: "Digital-only access via Beehive and Libby — no physical print collection" },
  { value: 20000, isDefault: false, description: "Small rotating print collection + digital" },
  { value: 30000, isDefault: true,  description: "Print collection + digital" },
  { value: 40000, isDefault: false, description: "Expanded print + digital + periodicals" },
  { value: 50000, isDefault: false, description: "Full print + digital + periodicals + AV materials" },
  { value: 60000, isDefault: false, description: "Full collection + digital + periodicals + AV + special programs" },
],
```

### calculator.js: `input` Listener Addition
```javascript
// Source: MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
// Add after existing `form.addEventListener('change', updateResult)`
form.addEventListener('input', updateResult);
// Also update description text and aria-valuetext in updateResult or a dedicated handler
```

### description + aria-valuetext handler (can be inlined in updateResult or separate)
```javascript
function updateSliderLabels() {
  var slider = document.getElementById('collections');
  var value = parseInt(slider.value, 10);
  var options = window.LIBRARY_DATA.collections.options;
  var node = null;
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === value) { node = options[i]; break; }
  }
  if (!node) return;
  var humanValue = '$' + (value / 1000) + ',000';
  var ariaText = (value / 1000).toLocaleString('en-US') + ',000 dollars \u2014 ' + node.description;
  document.getElementById('collections-amount').textContent = humanValue;
  document.getElementById('collections-description').textContent = node.description;
  slider.setAttribute('aria-valuetext', ariaText);
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<datalist>` labels for slider tick text | CSS flexbox `<span>` row below slider | Firefox never implemented labels; confirmed unfixed as of 2025 | Visual labels require explicit HTML; cannot rely on `<datalist>` |
| Custom JS slider libraries (e.g., noUiSlider) | Native `<input type="range">` | ~2020 onward as browser support matured | Zero dependency cost; full keyboard/ARIA out of the box |
| `accent-color` only | `accent-color` for quick color + pseudo-elements for full custom | CSS `accent-color` added ~2022 | `accent-color` is sufficient for color-only needs; custom dimensions require pseudo-element approach |

**Deprecated/outdated:**
- IE11 compatibility hacks: not in scope; project uses Node 20+, Tailwind v4
- `rangeInput.addEventListener('mouseup', ...)` for "live" updates: superseded by `input` event, which also covers touch and keyboard

---

## Open Questions

1. **Description copy for each $10k node**
   - What we know: SLDR-03 says lowest node must describe "digital-only access (Beehive/Libby)"; other five nodes are not yet defined
   - What's unclear: Exact citizen-meaningful language for nodes $20k–$60k — these are editorial decisions, not technical ones
   - Recommendation: Planner should include placeholder copy in config.js task; site owner can refine via GitHub web UI

2. **Slider initial display value format**
   - What we know: The label row shows `$10k`–`$60k`; current `<select>` shows `$30,000/year`
   - What's unclear: Whether to show the formatted selected value above/inline the slider or rely on description text alone
   - Recommendation: Show current value formatted as `$30,000` next to the label above the slider (see Code Examples); provides immediate dollar context without requiring user to read description

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — this is a static Eleventy + Vanilla JS project |
| Config file | none |
| Quick run command | `pnpm build` (Eleventy build — verifies template and data compilation) |
| Full suite command | Manual browser checks (Firefox, Safari, Chrome per SLDR-06 requirement) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SLDR-01 | Slider renders, replaces dropdown | smoke | `pnpm build` — verify no build errors | ✅ (build script) |
| SLDR-02 | 6 nodes snap to $10k–$60k | manual | Open page, drag/keyboard through all 6 positions | N/A |
| SLDR-03 | Description updates per node | manual | Verify each node shows correct description text | N/A |
| SLDR-04 | Live update during drag | manual (mobile critical) | Drag slider slowly; result bar updates mid-drag | N/A |
| SLDR-05 | Screen reader `aria-valuetext` | manual (screen reader) | VoiceOver/NVDA: confirm meaningful label announced | N/A |
| SLDR-06 | Labels visible in Firefox, Safari, Chrome | manual (3 browsers) | Open in each browser; confirm `$10k`–`$60k` row visible | N/A |
| SLDR-07 | Thumb/track styled blue-800 | manual | Visual inspection across browsers | N/A |
| SLDR-08 | URL `?collections=30000` restores slider | manual | Paste URL in new tab; verify slider at $30k position | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` — confirms Eleventy and Tailwind compile without errors
- **Per wave merge:** Full manual browser check (Firefox, Safari, Chrome) covering all 8 requirements
- **Phase gate:** All 8 requirements verified manually before `/gsd:verify-work`

### Wave 0 Gaps
None — existing build infrastructure covers all automated checks. No test framework install needed. Manual verification steps are documented in the test map above.

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — `<input type="range">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range
- MDN Web Docs — `aria-valuetext`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext
- MDN Web Docs — `input` event vs `change` event for range: confirmed via MDN range input page

### Secondary (MEDIUM confidence)
- CSS-Tricks "A Sliding Nightmare: Understanding the Range Input": https://css-tricks.com/sliding-nightmare-understanding-range-input/
- Tailwind CSS GitHub Discussion #8748 (range thumb styling): https://github.com/tailwindlabs/tailwindcss/discussions/8748
- Mozilla Bugzilla #841942 (datalist labels not implemented in Firefox): https://bugzilla.mozilla.org/show_bug.cgi?id=841942

### Tertiary (LOW confidence)
- None — all claims supported by primary or secondary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — native HTML range input is unambiguous; no library decision needed
- Architecture: HIGH — all patterns verified against MDN and project's own existing code
- Pitfalls: HIGH — datalist Firefox bug verified via MDN and Bugzilla; other pitfalls derived from reading existing codebase

**Research date:** 2026-03-21
**Valid until:** 2026-09-21 (stable HTML/CSS specs; browser datalist behavior is slow-moving)
