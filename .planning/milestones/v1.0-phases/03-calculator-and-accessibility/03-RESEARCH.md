# Phase 3: Calculator and Accessibility - Research

**Researched:** 2026-03-20
**Domain:** Vanilla JavaScript DOM event handling, real-time calculation, WCAG 2.1 AA accessibility
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONF-04 | Tax impact result updates in real time as any selection changes | `change` event on `<form>` with event delegation covers all three control types; `data-cost` on radios and select, `data-households` on checkboxes supply the arithmetic inputs from the DOM |
| CONF-05 | Zero-city guard — friendly explanatory message shown when no cities are selected (no NaN/error displayed) | Defensive guard before division: `if (totalHouseholds === 0)` branch writes a message string instead of a number; no library needed |
| TRST-03 | WCAG 2.1 AA — `aria-live` on result region, full keyboard navigation, 44px minimum touch targets | `aria-live="polite"` on `#result` satisfies screen-reader announcement; native `<input>` and `<select>` controls are keyboard-accessible by default; 44px touch targets require CSS min-height/padding additions to checkbox and radio wrappers |
</phase_requirements>

---

## Summary

Phase 3 connects the already-wired Phase 2 form controls to a calculator and makes the result region accessible. The arithmetic is simple integer division with a single guard clause. The DOM data is fully available: staffing radios carry `data-cost`, the collections select carries `data-cost` (set at build time to the default; Phase 3 must read the live selected option value instead), and city checkboxes carry `data-households`. The `window.LIBRARY_DATA` global contains the full config for any logic that prefers reading from structured data rather than the DOM.

The accessibility work is largely additive to the existing HTML. Native `<input type="radio">`, `<input type="checkbox">`, and `<select>` elements are keyboard-operable by default — no JavaScript is needed for keyboard navigation. What is needed: (1) `aria-live="polite"` on `#result` so screen readers announce updates, (2) visible focus indicators (the `accent-blue-600` class already applies color but focus ring visibility needs Tailwind's `focus-visible:` utilities on the wrappers), and (3) 44px minimum touch targets on the small native radio and checkbox inputs.

The collections select has one important distinction from the Phase 2 research assumption: the `data-cost` attribute on the `<select>` element is set to the default option value (`30000`) at build time. Phase 3 must read `select.value` (or the selected `<option>`'s `value` attribute, which equals the cost in dollars) on each `change` event, not the stale `data-cost` attribute.

**Primary recommendation:** Write a single `calculator.js` that (1) listens for `change` on `#configurator` via event delegation, (2) reads staffing cost from the checked radio's `data-cost`, (3) reads collections cost from `select.value`, (4) sums checked-city `data-households`, (5) guards against zero total households, and (6) writes the formatted result into `#result` which carries `aria-live="polite"`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JavaScript | ES2020 (browser) | Calculator logic and DOM manipulation | Already the stack decision; no framework; static site |
| Tailwind CSS | ^4.2.2 | Touch target sizing via padding utilities | Already installed; add `min-h-[44px]` and `py-3` to control wrappers |

No new npm packages are required for Phase 3. The entire phase is JavaScript authoring plus HTML attribute additions.

**Installation:**
```bash
# No new dependencies — pnpm install confirms lockfile is current
pnpm install
```

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | — | — | All requirements are achievable with the existing stack |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS event delegation | Alpine.js or similar | Alpine would add a dependency and a build step for zero functional gain here; vanilla JS is 15-20 lines for this calculator |
| `aria-live="polite"` | `aria-live="assertive"` | `assertive` interrupts the user mid-sentence; `polite` waits for an idle moment — correct choice for a result display that updates as they interact |

---

## Architecture Patterns

### Recommended Project Structure (Phase 3 changes)

```
src/
├── _data/
│   └── config.js         # Unchanged — no data schema changes needed
├── css/
│   └── style.css         # Unchanged
├── js/
│   └── calculator.js     # Currently a 2-line placeholder — Phase 3 implements this
└── index.html            # Add aria-live to #result; add touch-target classes to control wrappers
```

Phase 3 changes two files: `src/js/calculator.js` (implement the calculator) and `src/index.html` (add ARIA attribute and touch-target sizing).

### Pattern 1: Event Delegation on `<form>`

**What:** A single `change` event listener on `#configurator` fires for every control change regardless of type. No need to attach separate listeners to each radio, checkbox, and select.

**When to use:** Any time multiple heterogeneous controls should trigger the same recalculation.

**Example:**
```javascript
// Source: MDN Web Docs — EventTarget.addEventListener
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
const form = document.getElementById('configurator');
form.addEventListener('change', () => {
  updateResult();
});
```

### Pattern 2: Reading Control Values from the DOM

**What:** Each control type requires a different DOM query to extract its value.

**When to use:** Always — the DOM is the source of truth for current user selections.

**Staffing level (radio group):**
```javascript
// The checked radio in the staffing group carries data-cost (integer, set at build time)
const checkedStaffing = form.querySelector('input[name="staffing"]:checked');
const staffingCost = parseInt(checkedStaffing.dataset.cost, 10);
```

**Collections budget (select):**
```javascript
// IMPORTANT: Read select.value, NOT select.dataset.cost
// data-cost on the <select> element is frozen at the build-time default (30000)
// select.value reflects the currently selected option — which equals the dollar cost
const collectionsSelect = document.getElementById('collections');
const collectionsCost = parseInt(collectionsSelect.value, 10);
```

**Participating cities (checkboxes):**
```javascript
// Sum data-households across all checked city checkboxes
const checkedCities = form.querySelectorAll('input[name="cities"]:checked');
const totalHouseholds = Array.from(checkedCities).reduce(
  (sum, cb) => sum + parseInt(cb.dataset.households, 10),
  0
);
```

### Pattern 3: Zero-City Guard and Result Writing

**What:** Before dividing, check that at least one city is checked. Write the result or a friendly message into `#result`.

**When to use:** Always — without this guard, dividing by zero produces `Infinity` in JavaScript.

**Example:**
```javascript
// Source: MDN — Number.prototype.toFixed()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
function updateResult() {
  const staffingCost = parseInt(
    form.querySelector('input[name="staffing"]:checked').dataset.cost, 10
  );
  const collectionsCost = parseInt(
    document.getElementById('collections').value, 10
  );
  const totalHouseholds = Array.from(
    form.querySelectorAll('input[name="cities"]:checked')
  ).reduce((sum, cb) => sum + parseInt(cb.dataset.households, 10), 0);

  const resultEl = document.getElementById('result');

  if (totalHouseholds === 0) {
    resultEl.innerHTML =
      '<h2 class="text-xl font-semibold text-gray-900">Annual cost per household</h2>' +
      '<p class="text-sm text-gray-600 mt-2">Select at least one participating city to see the estimated cost.</p>';
    return;
  }

  const totalCost = staffingCost + collectionsCost;
  const perHousehold = totalCost / totalHouseholds;

  resultEl.innerHTML =
    '<h2 class="text-xl font-semibold text-gray-900">Annual cost per household</h2>' +
    '<p class="text-3xl font-bold text-blue-700 mt-2">$' + perHousehold.toFixed(2) + '</p>' +
    '<p class="text-sm text-gray-500 mt-1">$' + totalCost.toLocaleString('en-US') + ' total ÷ ' +
    totalHouseholds.toLocaleString('en-US') + ' households</p>';
}
```

### Pattern 4: `aria-live` for Screen Reader Announcements

**What:** Adding `aria-live="polite"` to the result region causes assistive technologies to announce updated content when the region changes.

**When to use:** Any time content updates dynamically without a page load. `polite` is the correct value here — it waits for the user to finish their current interaction before speaking the update.

**HTML change (one attribute addition to `index.html`):**
```html
<!-- Before (Phase 2 output): -->
<div id="result" class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">

<!-- After (Phase 3): -->
<div
  id="result"
  class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg"
  aria-live="polite"
  aria-atomic="true"
>
```

`aria-atomic="true"` ensures screen readers announce the entire result region content when it updates, not just the changed text node. This prevents a reader from only announcing "$" or "per household" in isolation.

### Pattern 5: 44px Touch Target Sizing

**What:** WCAG 2.1 Success Criterion 2.5.5 (Level AA) requires interactive targets to be at least 44×44 CSS pixels. Native `<input type="radio">` and `<input type="checkbox">` elements are typically 13–20px square rendered by the browser.

**The correct approach:** Make the clickable area 44px by adding vertical padding to the wrapper `<div>` containing each input+label pair, OR by wrapping the input in a block-level `<label>` with minimum height. Since Phase 2 uses a `<div class="flex items-baseline gap-2">` wrapper, the cleanest fix is to add `min-h-[44px] items-center` to that wrapper class.

**HTML change (in `index.html` for radio and checkbox wrappers):**
```html
<!-- Before: -->
<div class="flex items-baseline gap-2">

<!-- After: -->
<div class="flex items-center gap-2 min-h-[44px]">
```

**Note:** `items-baseline` is replaced with `items-center` because `items-baseline` aligns to the text baseline, which positions the input at the top of a tall wrapper. `items-center` vertically centers the input within the 44px wrapper, which is both visually correct and ensures the tap target height actually covers the input.

**The `<select>` (collections):** Already has `py-2 px-3` which gives adequate tap target height on most platforms. Verify rendered height with DevTools; add `min-h-[44px]` if needed.

### Pattern 6: Keyboard Navigation and Focus Visibility

**What:** Native radio, checkbox, and select controls are keyboard-focusable and operable by default (Tab to reach, Space/arrow keys to operate). No JavaScript is needed for basic keyboard access.

**What IS needed:** Visible focus indicators. Tailwind's browser CSS reset removes the default blue outline in some contexts. The existing `focus:ring-2 focus:ring-blue-600` class on the `<select>` is correct. The radio/checkbox inputs use `accent-blue-600` but do not have an explicit focus ring class. Adding `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2` to the input elements (or relying on browser default outline if Tailwind's reset preserves it) is the fix.

**Verification:** Tab through the page with keyboard. Every control must have a visible focus indicator. The `:focus-visible` pseudo-class targets keyboard focus without affecting mouse click states.

### Anti-Patterns to Avoid

- **Reading `select.dataset.cost` instead of `select.value`:** The `data-cost` attribute on the `<select>` is frozen at the build-time default value. The selected option's cost is correctly read from `select.value`, which the browser keeps in sync with the user's selection.
- **Dividing before checking `totalHouseholds > 0`:** JavaScript division by zero returns `Infinity`, not an error. The result element would display "$Infinity" — visually confusing and violates CONF-05.
- **Using `innerHTML` with user-generated content:** The calculator only injects computed number strings and literal markup — no user input is ever interpolated into innerHTML. This is safe for this use case, but must not be extended to interpolate any value that could come from a URL parameter or external source.
- **Attaching individual listeners per control:** Attaching a `change` listener to each radio, checkbox, and select is unnecessary complexity. A single delegated listener on the `<form>` covers all three control types.
- **`aria-live="assertive"`:** Assertive live regions interrupt the user's current screen reader announcement. `polite` is always correct for a result display that is not a time-sensitive alert.
- **Calling `updateResult()` before the DOM is loaded:** The script tag is at the bottom of `<body>`, after all form elements, so the DOM is ready when the script executes. No `DOMContentLoaded` listener is needed, but the initial `updateResult()` call must come after the form element is queryable.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dollar number formatting | Custom string padding or regex | `Number.toFixed(2)` + `toLocaleString('en-US')` | Built into JavaScript; handles all edge cases including floating-point rounding |
| Screen reader announcement | Custom focus management or `setTimeout` polling | `aria-live="polite"` | The browser-ARIA contract handles announcement timing correctly; setTimeout polling is fragile and breaks on slow machines |
| Keyboard navigation | JavaScript keydown handlers for Tab, Space, Arrow | Native `<input>` browser behavior | Native controls are keyboard-operable without any JS |
| Zero-division protection | `try/catch` around division | `if (totalHouseholds === 0)` guard before dividing | JS does not throw on division by zero — it returns `Infinity`; a guard is needed, not a try/catch |

**Key insight:** WCAG 2.1 AA compliance for this specific page is almost entirely achievable through HTML attributes and CSS, not JavaScript. The form controls are already semantic native elements. Phase 3's accessibility work is attribute additions and CSS sizing, not framework integration.

---

## Common Pitfalls

### Pitfall 1: `select.dataset.cost` Is Stale

**What goes wrong:** The calculator reads `document.getElementById('collections').dataset.cost` and always gets `30000` regardless of what the user selected.

**Why it happens:** The `data-cost` attribute on the `<select>` element is rendered at build time to the `isDefault` option's value. It is a static HTML attribute — the browser does not update it when the user picks a different option.

**How to avoid:** Always read `select.value` for the current selected option's value. `select.value` is a live property that reflects the selected `<option value="...">`.

**Warning signs:** Changing the collections dropdown from $30,000 to any other value has no effect on the result.

### Pitfall 2: `Infinity` Instead of Zero-City Message

**What goes wrong:** When all city checkboxes are unchecked, `totalHouseholds` is 0, and `totalCost / 0` is `Infinity`. The result displays "$Infinity" or "Infinity per household."

**Why it happens:** JavaScript division by zero does not throw — it returns the special `Infinity` value. `Infinity.toFixed(2)` returns `"Infinity"`.

**How to avoid:** Add a guard: `if (totalHouseholds === 0) { /* show message, return */ }` before the division.

**Warning signs:** Unchecking all city checkboxes shows "Infinity" or "NaN" in the result area.

### Pitfall 3: `aria-live` Region Must Contain Content on Load

**What goes wrong:** Screen readers may not announce the result when it first updates if the `aria-live` region was empty when the page loaded.

**Why it happens:** Some screen reader / browser combinations only announce `aria-live` region changes if the region was populated (even partially) when it was first rendered. An empty `aria-live` region can be ignored.

**How to avoid:** Phase 2 already includes a `<p>` placeholder text inside `#result` ("Select options above to see the estimated cost."). This initial content means the region is non-empty on load. Phase 3's `updateResult()` call on page load will immediately replace this with the actual calculation, which is then announced.

**Warning signs:** Screen reader does not announce the result on subsequent changes (not on first load). Testing with VoiceOver (macOS) or NVDA (Windows) required.

### Pitfall 4: `items-baseline` Negates Touch Target Height

**What goes wrong:** Adding `min-h-[44px]` to the checkbox/radio wrapper div but keeping `items-baseline` results in the input being pinned to the text baseline at the top of the 44px container. The tap target is 44px tall but the input is at the top third — tapping the bottom two-thirds activates the label click (which forwards to the input via `for` attribute), which does work, but the visual position of the input does not correspond to where a user would expect to tap.

**Why it happens:** `flex items-baseline` aligns flex children to their text baseline. In a `min-h-[44px]` container, the baseline is near the top.

**How to avoid:** Replace `items-baseline` with `items-center` on touch-target-sized wrappers. This vertically centers the input and label text within the 44px height, which is both correct for tapping and visually consistent.

**Warning signs:** Radio/checkbox inputs appear at the top of a suspiciously tall row instead of centered vertically.

### Pitfall 5: Focus Ring Removed by Tailwind Reset

**What goes wrong:** Keyboard users cannot see which control is focused because Tailwind's preflight CSS removes the default browser focus outline.

**Why it happens:** Tailwind CSS v4 includes a CSS reset (preflight) that removes `outline` from focusable elements in some configurations.

**How to avoid:** Add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2` to radio and checkbox `<input>` elements. The `focus-visible:` prefix targets keyboard focus only (not mouse click focus), which is the correct WCAG behavior.

**Warning signs:** Tabbing through the form shows no visible focus indicator on radio buttons or checkboxes.

### Pitfall 6: Running `updateResult()` Before DOM Is Ready

**What goes wrong:** If `updateResult()` is called at script load time and the script is in `<head>`, `document.getElementById('configurator')` returns `null`, causing a TypeError.

**Why it happens:** Scripts in `<head>` execute before the DOM is parsed.

**How to avoid:** This is a non-issue for this project — `calculator.js` is loaded via `<script src="...">` at the end of `<body>`, after all form elements exist. Call `updateResult()` directly at the bottom of the script without any event listener wrapper. The DOM is fully parsed by the time the script executes.

**Warning signs:** TypeError in the browser console on page load referencing `null`.

---

## Code Examples

### Complete `calculator.js` Structure

```javascript
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/value
// Source: MDN Web Docs — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

(function () {
  'use strict';

  const form = document.getElementById('configurator');
  const resultEl = document.getElementById('result');

  function getStaffingCost() {
    const checked = form.querySelector('input[name="staffing"]:checked');
    return parseInt(checked.dataset.cost, 10);
  }

  function getCollectionsCost() {
    // Must read .value, not .dataset.cost — see research pitfall 1
    return parseInt(document.getElementById('collections').value, 10);
  }

  function getTotalHouseholds() {
    return Array.from(form.querySelectorAll('input[name="cities"]:checked'))
      .reduce((sum, cb) => sum + parseInt(cb.dataset.households, 10), 0);
  }

  function updateResult() {
    const totalHouseholds = getTotalHouseholds();

    if (totalHouseholds === 0) {
      resultEl.innerHTML =
        '<h2 class="text-xl font-semibold text-gray-900">Annual cost per household</h2>' +
        '<p class="text-sm text-gray-600 mt-2">Select at least one participating city to calculate the estimated cost per household.</p>';
      return;
    }

    const totalCost = getStaffingCost() + getCollectionsCost();
    const perHousehold = totalCost / totalHouseholds;

    resultEl.innerHTML =
      '<h2 class="text-xl font-semibold text-gray-900">Annual cost per household</h2>' +
      '<p class="text-3xl font-bold text-blue-700 mt-2">$' + perHousehold.toFixed(2) + '</p>' +
      '<p class="text-sm text-gray-500 mt-1">$' + totalCost.toLocaleString('en-US') +
      ' total ÷ ' + totalHouseholds.toLocaleString('en-US') + ' households</p>';
  }

  // Single delegated listener covers all three control types
  form.addEventListener('change', updateResult);

  // Run immediately to show result for initial (default) state
  // Safe to call here — script is at end of <body>, DOM is ready
  updateResult();
}());
```

### `index.html` Changes for ARIA and Touch Targets

**`#result` div — add `aria-live` and `aria-atomic`:**
```html
<div
  id="result"
  class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg"
  aria-live="polite"
  aria-atomic="true"
>
```

**Radio/checkbox wrapper divs — change `items-baseline` to `items-center` and add `min-h-[44px]`:**
```html
<!-- Before: -->
<div class="flex items-baseline gap-2">

<!-- After: -->
<div class="flex items-center gap-2 min-h-[44px]">
```

**Radio/checkbox inputs — add focus-visible ring:**
```html
<!-- Before: -->
<input type="radio" ... class="accent-blue-600" ...>

<!-- After: -->
<input type="radio" ... class="accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2" ...>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery `$('.selector').val()` | Vanilla `element.value` / `querySelector` | ~2015-2020 shift | No jQuery dependency; native APIs are fast and fully capable |
| `aria-live="assertive"` for all live regions | `aria-live="polite"` for non-urgent updates | WCAG 2.0 → 2.1 guidance refinement | Less disruptive to screen reader users; assertive reserved for errors/alerts only |
| Individual event listeners per control | Event delegation on the parent `<form>` | Standard modern pattern | Fewer listeners; works for dynamically added controls; simpler code |
| `Math.floor()` for per-household display | `Number.toFixed(2)` for dollar amounts | Always correct; rounding choice | Shows cents; clearer to residents than whole dollars |
| WCAG 2.0 (2008) touch targets unspecified | WCAG 2.1 SC 2.5.5 — 44×44px minimum (2018) | WCAG 2.1 release 2018 | Must explicitly size touch targets; browser defaults are smaller |

**Deprecated/outdated:**
- `aria-relevant` attribute — rarely needed; `aria-atomic="true"` is the right companion to `aria-live` for this use case
- `role="status"` as alternative to `aria-live="polite"` — equivalent for this use case but less explicit; stick with `aria-live` for clarity

---

## Open Questions

1. **CONF-02: Collections "on/off" intent — does the select satisfy it?**
   - What we know: Phase 2 verification flagged this as `human_needed`. The select allows choosing a budget amount ($10k–$60k) but does not allow setting collections to zero/off.
   - What's unclear: Whether the product owner intended binary on/off or budget-amount selection when writing CONF-02.
   - Recommendation: Phase 3 should proceed with the select as-is (since the user directed this change at the Phase 2 checkpoint). The calculator reads the select value and includes it in the total. If the product owner later confirms the original on/off intent, a Phase 4 adjustment would add a $0 option or reintroduce a checkbox toggle.

2. **`toFixed(2)` vs whole-dollar display for per-household result**
   - What we know: STATE.md says "format with `toFixed(2)` only at display." The per-household cost will typically be a fraction (e.g., $35.87).
   - What's unclear: Whether residents prefer seeing `$35.87` or `$36` for per-household cost.
   - Recommendation: Use `toFixed(2)` as directed by the STATE.md decision. A whole-dollar version is trivially achievable by substituting `Math.round(perHousehold).toLocaleString('en-US')`.

3. **Focus ring visibility with Tailwind v4 preflight**
   - What we know: Tailwind v4 ships a CSS reset that may affect browser default focus outlines. The `<select>` already has `focus:ring-2 focus:ring-blue-600`. Radio and checkbox inputs do not have explicit focus classes.
   - What's unclear: Whether Tailwind v4 preflight removes outline from `<input type="radio">` and `<input type="checkbox">` in this build configuration.
   - Recommendation: Add explicit `focus-visible:outline` utilities to radio and checkbox inputs as a defensive measure. Verify by keyboard tabbing in a browser after implementation.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No automated test framework — phase verifiable by build + DOM inspection + keyboard walkthrough |
| Config file | None |
| Quick run command | `pnpm run build && node -e "const fs=require('fs'); const h=fs.readFileSync('_site/index.html','utf8'); console.log('aria-live:', h.includes('aria-live') ? 'PASS' : 'FAIL')"` |
| Full suite command | `pnpm run build` + manual browser keyboard test + manual screen reader check |

Phase 3 success criteria mix automated-checkable properties (aria-live attribute present, calculator.js non-empty, DOM attribute presence) with human-verifiable ones (screen reader announcement behavior, keyboard operability, visual focus indicators).

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONF-04 | Result updates in real time on any control change | smoke | `pnpm run build && grep -c 'updateResult\|change' _site/js/calculator.js` (expect > 0) | ❌ Wave 0 — implement calculator.js |
| CONF-04 | Staffing radio change updates result | manual | Open browser, change staffing, verify result changes | — |
| CONF-04 | Collections select change updates result | manual | Open browser, change collections dropdown, verify result changes | — |
| CONF-04 | City checkbox change updates result | manual | Open browser, check/uncheck city, verify result changes | — |
| CONF-05 | Zero cities shows friendly message, not NaN/Infinity | smoke | `pnpm run build && grep -c 'totalHouseholds === 0\|totalHouseholds == 0' _site/js/calculator.js` (expect 1) | ❌ Wave 0 |
| CONF-05 | Zero cities message is visible and friendly | manual | Uncheck all cities in browser, verify message appears instead of error | — |
| TRST-03 | `aria-live="polite"` present on result region | smoke | `pnpm run build && grep -c 'aria-live="polite"' _site/index.html` (expect 1) | ❌ Wave 0 — add to index.html |
| TRST-03 | `aria-atomic="true"` present on result region | smoke | `pnpm run build && grep -c 'aria-atomic="true"' _site/index.html` (expect 1) | ❌ Wave 0 |
| TRST-03 | All controls keyboard-reachable | manual | Tab through page, verify every control receives focus | — |
| TRST-03 | Visible focus indicator on all controls | manual | Tab through page, verify visible ring/outline on each focused control | — |
| TRST-03 | 44px touch targets on radio/checkbox wrappers | smoke | `pnpm run build && grep -c 'min-h-\[44px\]' _site/index.html` (expect count >= number of radio+checkbox inputs) | ❌ Wave 0 — add to index.html |

### Sampling Rate

- **Per task commit:** `pnpm run build && test -f _site/js/calculator.js && test -s _site/js/calculator.js`
- **Per wave merge:** `pnpm run build && grep -c 'aria-live' _site/index.html && grep -c 'min-h-\[44px\]' _site/index.html`
- **Phase gate:** Full build green + manual keyboard walkthrough + at least one screen reader spot-check before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/js/calculator.js` — implement full calculator logic (replace 2-line placeholder)
- [ ] `src/index.html` — add `aria-live="polite"` and `aria-atomic="true"` to `#result`
- [ ] `src/index.html` — change `items-baseline` to `items-center` and add `min-h-[44px]` to radio/checkbox wrapper divs
- [ ] `src/index.html` — add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2` to radio and checkbox `<input>` elements

*(No new npm packages, no new config files, no test framework setup required)*

---

## Sources

### Primary (HIGH confidence)

- MDN Web Docs — `aria-live` — https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live — `polite` vs `assertive` semantics, browser support, interaction with `aria-atomic`
- MDN Web Docs — `aria-atomic` — https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-atomic — ensures full region content is announced
- MDN Web Docs — `HTMLSelectElement.value` — https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/value — live property reflecting current selection
- MDN Web Docs — `Number.prototype.toFixed()` — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed — dollar display formatting
- WCAG 2.1 SC 2.5.5 (Target Size) — https://www.w3.org/TR/WCAG21/#target-size — 44×44 CSS pixel minimum for Level AA
- WCAG 2.1 SC 1.4.13 / 2.4.7 (Focus Visible) — https://www.w3.org/TR/WCAG21/#focus-visible — visible focus indicator requirement at Level AA
- W3C ARIA Authoring Practices Guide — Live Regions — https://www.w3.org/WAI/ARIA/apg/patterns/alert/ — `polite` for non-critical result updates
- Existing project codebase — `_site/index.html` (Phase 2 output) — confirms exact DOM structure, attribute names, and CSS classes that Phase 3 reads and modifies

### Secondary (MEDIUM confidence)

- MDN Web Docs — Event delegation via `addEventListener` on parent — https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation — standard pattern for form event handling
- W3C Understanding WCAG 2.1 — SC 2.5.5 Understanding Target Size — https://www.w3.org/WAI/WCAG21/Understanding/target-size.html — clarifies that padding-based target enlargement satisfies the requirement

### Tertiary (LOW confidence — flagged for validation)

- Focus ring behavior with Tailwind v4 preflight on `<input type="radio">` and `<input type="checkbox">`: unverified whether Tailwind v4 preflight removes browser-default focus outlines on these input types. Add explicit `focus-visible:outline` classes as a defensive measure and verify by keyboard testing.

---

## Metadata

**Confidence breakdown:**
- Standard stack (no new packages): HIGH — all requirements are achievable with the existing stack; verified against Phase 2 output
- Calculator logic: HIGH — arithmetic is simple integer math; DOM API usage verified against MDN; pitfalls are well-understood
- Accessibility (aria-live, keyboard): HIGH — WCAG 2.1 and ARIA specs are authoritative; native controls are keyboard-accessible by default
- Touch target sizing (CSS approach): HIGH — WCAG 2.1 SC 2.5.5 explicitly allows padding-based enlargement
- Focus ring with Tailwind v4 preflight: MEDIUM — behavior verified by reading Tailwind docs; actual rendering needs browser confirmation
- Screen reader announcement behavior in practice: MEDIUM — `aria-live="polite"` with `aria-atomic="true"` is spec-correct; real-world screen reader behavior varies slightly; manual testing required

**Research date:** 2026-03-20
**Valid until:** 2026-06-20 (90 days — WCAG 2.1, ARIA, and MDN DOM APIs are stable; Tailwind v4 is the current major version)
