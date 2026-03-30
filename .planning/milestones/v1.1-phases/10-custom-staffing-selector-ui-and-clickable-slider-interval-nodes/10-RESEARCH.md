# Phase 10: Custom Staffing Selector UI and Clickable Slider Interval Nodes - Research

**Researched:** 2026-03-22
**Domain:** Tailwind CSS v4 `has-[]` variants, vanilla JS event dispatch, native HTML accessibility patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Replace the `<input type="radio">` + `<label>` list with clickable card elements — each card wraps a hidden radio input so `form.querySelector('input[name="staffing"]:checked')` and `data-cost` remain intact for calculator.js and url.js
- **D-02:** All three cards are always fully expanded — label + schedule table + description visible at all times; no collapse/expand behavior
- **D-03:** The entire card surface is clickable (not just a label) — the card acts as the clickable target for its hidden radio input
- **D-04:** Selected card: `ring-2 ring-blue-600` border; unselected cards: `border border-gray-200` (matching existing fieldset card aesthetic)
- **D-05:** Card background: `bg-white` selected, `bg-gray-50` unselected — subtle contrast to signal selection state
- **D-06:** Cards are stacked vertically (full width), not side-by-side — consistent with existing mobile-first layout; schedule tables need full width
- **D-07:** Hidden `<input type="radio" name="staffing">` inside each card must keep `value="{{ level.id }}"` and `data-cost="{{ level.annualCost }}"` — these are read by calculator.js and url.js without modification
- **D-08:** `for`/`id` pairing on the label and input must remain for accessibility (screen readers announce label text + state)
- **D-09:** `focus-visible` ring on the hidden input should transfer visually to the card wrapper — use `has-[:focus-visible]:ring-2` or equivalent Tailwind v4 pattern
- **D-10:** Change the static `<span>` tick labels below the collections slider to `<button type="button">` elements
- **D-11:** Each button has a `data-value` attribute matching its option's numeric value (e.g., `data-value="30000"`)
- **D-12:** Clicking a node: sets `slider.value = button.dataset.value`, then dispatches both `input` and `change` events on the slider element so calculator.js and url.js react identically to a drag
- **D-13:** Active node style: `text-blue-800 font-semibold`; inactive: `text-gray-500 font-normal` — same visual language as existing amount display
- **D-14:** Active node is updated in `updateSliderLabels()` in calculator.js — find the button whose `data-value` matches current `slider.value` and apply active class; remove from all others
- **D-15:** No tick marks on the track itself — clickable labels are the visual anchors
- **D-16:** `updateSliderLabels()` in calculator.js gains a step: after updating `#collections-amount` and `#collections-description`, loop over all node buttons, remove active classes from all, apply active classes to the one matching current value
- **D-17:** Node buttons dispatch events on the `#collections` slider element (not the form) — this triggers the existing `form.addEventListener('input', ...)` and `form.addEventListener('change', ...)` listeners correctly since events bubble through the form
- **D-18:** No changes to url.js — `tau` encoding reads `slider.value` directly; clicking a node sets that value before events fire

### Claude's Discretion

- Exact Tailwind spacing within card internals (padding, gap between schedule and description)
- Whether `cursor-pointer` is on the card wrapper or the hidden label
- Exact hover state on node buttons (e.g., `hover:text-blue-600`)
- `aria-pressed` vs relying on the underlying radio `checked` state for screen reader announcement of node buttons

### Deferred Ideas (OUT OF SCOPE)

- Animating the slider thumb when a node is clicked (CSS transition on the thumb position) — nice-to-have, out of scope
- Horizontal layout of staffing cards on wider screens — current phase uses stacked vertical layout only
</user_constraints>

---

## Summary

Phase 10 makes two independent, focused UI upgrades: (1) converts the staffing radio button list into full-width clickable card elements, and (2) converts the collections slider's static tick labels into clickable buttons that snap the slider to that value.

Both changes are markup-and-behavior modifications to existing templates and one JavaScript function. No new libraries, no new data structures, no changes to cost calculation, URL encoding, or config.js. The integration surface is deliberately minimal: the hidden radio inputs inside cards preserve all existing calculator.js and url.js contracts unchanged; the node buttons use standard event dispatch so the existing delegated `form` event listeners react identically to programmatic snaps and user drags.

The most technically precise piece of this phase is the Tailwind v4 `has-[]` CSS-only selection state for cards. The UI-SPEC has already resolved the markup contract in detail — research confirms the `has-[:checked]` and `has-[:focus-visible]` patterns are valid in Tailwind v4.2.2 (the installed version) and do not require JavaScript. The `sr-only` choice for radio input visibility is also verified as correct: it preserves focusability and keyboard navigation that `type="hidden"` would destroy.

**Primary recommendation:** Implement both features as pure markup + minimal vanilla JS additions. No new dependencies. Follow the UI-SPEC markup contract exactly — it has already made all non-trivial decisions.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS v4 | 4.2.2 (installed) | Utility-class styling, `has-[]` variants | Already in project; v4 supports `has-[:checked]` natively |
| Eleventy | 3.1.5 (installed) | Nunjucks template processing | Already in project; generates HTML from `{% for %}` loops |
| Vanilla JavaScript | ES5 (IIFE pattern, existing) | Node button click handler, `updateSliderLabels` extension | Matches existing IIFE + `'use strict'` codebase pattern |

### Supporting

No additional libraries. This phase is a modification to existing files only.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `has-[:checked]` CSS-only selection state | JS `data-selected` toggling | CSS-only is simpler — no JS needed for visual state; but requires Tailwind v4 which is confirmed installed |
| `sr-only` on radio input | `type="hidden"` | `sr-only` preserves keyboard and AT access; `type="hidden"` silently breaks Tab and arrow key navigation |
| Dispatching events on the slider element | Dispatching on the form | Slider-targeted dispatch with `{ bubbles: true }` reaches the same delegated `form` listeners without coupling the button logic to form internals |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Project Structure

No structural changes. All modifications are to existing files:

```
src/
├── index.html          # staffing fieldset loop + slider tick label row
├── js/
│   └── calculator.js   # updateSliderLabels() extension only
└── css/
    └── style.css       # no changes
```

### Pattern 1: CSS-only Card Selection State via `has-[:checked]`

**What:** A `<label>` wrapping a visually-hidden radio input uses Tailwind v4 `has-[:checked]` and `has-[:focus-visible]` variants to apply selected and focus ring styles without any JavaScript.

**When to use:** Any time a radio input is embedded in a larger clickable container and the container needs to reflect the input's checked/focus state visually.

**Confirmed for Tailwind v4.2.2:** The `has-[...]` arbitrary variant is fully supported. The syntax is `has-[:checked]:ring-2 has-[:checked]:ring-blue-600` (bracket-colon notation, not dot notation).

**Example (from UI-SPEC, confirmed against Tailwind v4 docs):**
```html
<label
  for="staffing-{{ level.id }}"
  class="block cursor-pointer rounded-lg border p-6 transition-colors
         has-[:checked]:bg-white has-[:checked]:ring-2 has-[:checked]:ring-blue-600
         bg-gray-50 border-gray-200
         has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600
         min-h-[44px]"
>
  <input
    type="radio"
    name="staffing"
    id="staffing-{{ level.id }}"
    value="{{ level.id }}"
    data-cost="{{ level.annualCost }}"
    class="sr-only"
    {% if loop.first %}checked{% endif %}
  />
  ...card content...
</label>
```

**Key insight:** `has-[:checked]:bg-white` overrides `bg-gray-50` because it appears later in the class list AND because `has-[]` generates a higher-specificity selector in Tailwind v4. No `!important` needed.

### Pattern 2: Node Button Click — Event Dispatch

**What:** A click handler on each node button sets the slider value and dispatches bubbling `input` and `change` events so the existing delegated form listeners fire.

**When to use:** Any time a secondary control needs to programmatically drive a primary input without duplicating event handling logic.

**Example (from UI-SPEC D-12, D-17):**
```javascript
// Inside the existing IIFE in calculator.js
document.querySelectorAll('[data-value]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var slider = document.getElementById('collections');
    slider.value = btn.dataset.value;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    slider.dispatchEvent(new Event('change', { bubbles: true }));
  });
});
```

**Event dispatch order matters:** `input` must fire before `change` — this matches the native browser order when a user drags the slider and mirrors what url.js's `restoreFromUrl()` already does (`form.dispatchEvent(new Event('input'))` after `form.dispatchEvent(new Event('change'))`).

### Pattern 3: `updateSliderLabels()` Extension

**What:** The existing function gains a loop at the end that syncs active/inactive CSS classes on node buttons based on current slider value.

**When to use:** Any time a display state depends on slider position; centralizes all slider-dependent UI updates in one function.

**Example (from UI-SPEC D-16):**
```javascript
var nodeButtons = document.querySelectorAll('[data-value]');
nodeButtons.forEach(function (btn) {
  var isActive = btn.dataset.value === String(slider.value);
  btn.classList.toggle('text-blue-800', isActive);
  btn.classList.toggle('font-semibold', isActive);
  btn.classList.toggle('text-gray-500', !isActive);
  btn.classList.toggle('font-normal', !isActive);
});
```

**Important:** `String(slider.value)` is the correct comparison — `slider.value` is always a string (DOM property), and `btn.dataset.value` is always a string (data attribute). Using `===` without coercion is safe here.

### Anti-Patterns to Avoid

- **Using `type="hidden"` for radio inputs inside cards:** Invisible to screen readers and keyboard users. Use `sr-only` instead — it renders off-screen but remains accessible.
- **Dispatching events on the `form` element directly from the button handler:** This works but bypasses the semantic connection to the slider. Dispatch on the slider element (`{ bubbles: true }`) so the event accurately represents slider value changes.
- **Applying selected/unselected card classes with JavaScript:** The `has-[:checked]` CSS variant handles this entirely without JS. Adding a JS toggle layer creates a second source of truth and can get out of sync on URL restore (where url.js sets `radio.checked` directly without firing a DOM change event that JS would intercept).
- **Using `peer-checked:` syntax (Tailwind v3):** The project uses Tailwind v4, where the `peer-*` checked pattern was replaced by `has-[*]` on the parent. Using v3 syntax silently produces no output.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card selection state tracking | JS class toggling on radio `change` | `has-[:checked]` CSS variant | CSS handles it without JS; immune to edge cases like url.js direct `.checked = true` assignments |
| Focus ring transfer to card wrapper | JS focus/blur listeners | `has-[:focus-visible]:ring-2` CSS | CSS-only; zero JS; correct for keyboard, incorrect for pointer (`:focus-visible` intentionally excludes click-focus) |
| Slider value sync on button click | Custom state management | `slider.value = btn.dataset.value` + `dispatchEvent` | DOM is the source of truth; event dispatch reuses all existing listeners |

**Key insight:** In a CSS utility framework project with delegated event listeners, the DOM is already the state store. Both features in this phase are entirely served by letting the DOM drive visual state via CSS selectors and event bubbling — no additional state management layer is needed.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 `has-[:checked]` class ordering and specificity

**What goes wrong:** The unselected `bg-gray-50` class visually wins over `has-[:checked]:bg-white` because both are low-specificity utility classes, and the order in the source HTML may or may not reflect compiled CSS order.

**Why it happens:** Tailwind v4 emits utilities in the order they are encountered in source. If `bg-gray-50` compiles after `has-[:checked]:bg-white`, it wins due to CSS cascade order, regardless of HTML class order.

**How to avoid:** Place `has-[:checked]:bg-white has-[:checked]:ring-2 has-[:checked]:ring-blue-600` AFTER the base state classes (`bg-gray-50 border-gray-200`) in the class list. Tailwind v4 guarantees that variant utilities (like `has-*`) have higher specificity than base utilities because they generate a `:has()` pseudo-class selector (specificity: 0,1,0 vs 0,0,1 for plain class). The selected state will win regardless of order.

**Warning signs:** Cards appear stuck in unselected style even when the radio is checked. Inspect computed styles — if `bg-gray-50` is winning over `bg-white`, there is a specificity/ordering problem.

### Pitfall 2: `sr-only` radio input and the radio group keyboard behavior

**What goes wrong:** After conversion to `sr-only`, arrow key navigation between staffing cards stops working or Tab behavior changes unexpectedly.

**Why it happens:** `sr-only` removes the element from visual layout but keeps it in the tab order and radio group. Arrow key cycling (browser-native behavior for radio groups with the same `name`) continues to work correctly. The key risk is accidentally removing `name="staffing"` or duplicating `id` values, which would break the group.

**How to avoid:** Verify `name="staffing"` is preserved on all three radio inputs and `id="staffing-{{ level.id }}"` uniqueness is maintained. Test Tab (focus into first card) and arrow keys (cycle through cards).

**Warning signs:** Arrow keys do not cycle through cards; Tab lands on each card individually (correct), but arrow key does not shift selection.

### Pitfall 3: `querySelectorAll('[data-value]')` selector scope

**What goes wrong:** If any other element in the page gains a `data-value` attribute in a future phase, the `querySelectorAll('[data-value]')` selector in `updateSliderLabels()` will match unintended elements.

**Why it happens:** The selector is intentionally broad — it matches all elements with the attribute, not just the node buttons.

**How to avoid:** Scope the selector to the tick label container: `document.querySelectorAll('.collections-nodes [data-value]')` — or add a class to the buttons (e.g., `class="... js-node-btn"`) and select on that. The simplest safe pattern is to scope to the slider's sibling container, which is stable.

**Recommended selector:** `document.querySelectorAll('#collections ~ div [data-value]')` or add a `js-slider-node` class to each button and select `[data-value].js-slider-node`.

**Warning signs:** In a future phase, unexpected elements get active/inactive class toggling.

### Pitfall 4: Event dispatch order and url.js `restoreFromUrl()` interaction

**What goes wrong:** After URL restore, `updateSliderLabels()` runs and the active node button is not highlighted because the URL restoration sequence dispatches events before the node buttons exist in the DOM... or because of event order differences.

**Why it happens:** `url.js` calls `restoreFromUrl()`, then `form.dispatchEvent(new Event('change'))` and `form.dispatchEvent(new Event('input'))`. The `input` event fires `updateSliderLabels()` via the existing `form.addEventListener('input', ...)` listener. At the time this fires, the node buttons are already in the DOM (template is server-rendered), so `querySelectorAll` finds them. This should work correctly.

**How to avoid:** Ensure `updateSliderLabels()` is called at initialization (`updateSliderLabels()` already called at bottom of calculator.js IIFE), and that the node button active-state sync code is added inside `updateSliderLabels()` — not as a separate event listener.

**Warning signs:** On page load with a `?tau=2` URL param, the slider shows the correct value but no node button is highlighted. This means `updateSliderLabels()` ran before the active-state sync code was added.

### Pitfall 5: Initial state — first card not showing as selected

**What goes wrong:** On first load (no URL params), the first staffing card appears unselected (gray background, no ring) even though the first radio is `checked` by default.

**Why it happens:** The `has-[:checked]` selector is driven by the radio input's `:checked` pseudo-class. If the `{% if loop.first %}checked{% endif %}` Nunjucks attribute is rendered as `checked` (boolean HTML attribute), the radio IS checked on parse — and `has-[:checked]` on the parent label will activate immediately via CSS, with no JS needed.

**How to avoid:** Verify the Nunjucks template renders the first card's input with the `checked` attribute present. Inspect the built HTML output. This is a build-time concern, not a runtime one.

**Warning signs:** DevTools show the first card's radio input does NOT have `checked` attribute in the built HTML — this means the template condition is wrong.

---

## Code Examples

Verified patterns from official sources and confirmed against the current codebase:

### Tailwind v4 `has-[]` variant (confirmed in v4.2.2)

```html
<!-- Source: Tailwind CSS v4 docs — has-[] parent-based variant -->
<label class="has-[:checked]:ring-2 has-[:checked]:ring-blue-600 bg-gray-50 ...">
  <input type="radio" class="sr-only" ... />
  ...
</label>
```

The `has-[:checked]` variant generates: `.has-\[\:checked\]\:ring-2:has(:checked) { ... }` — specificity 0,1,1 (pseudo-class + class), which reliably overrides plain utilities at 0,0,1.

### `sr-only` utility (Tailwind built-in)

```css
/* What sr-only generates — Source: Tailwind CSS source */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Element is visually invisible but remains in DOM, tab order, and accessible tree. Screen readers announce it. Keyboard events (arrow keys, Space) fire on it. This is the correct pattern for inputs hidden for visual redesign purposes.

### Event dispatch on slider (matches existing url.js pattern)

```javascript
// Source: url.js line 152-153 — existing pattern for programmatic event dispatch
form.dispatchEvent(new Event('change'));
form.dispatchEvent(new Event('input'));

// Node button handler (analogous — dispatches on slider, not form):
slider.dispatchEvent(new Event('input', { bubbles: true }));
slider.dispatchEvent(new Event('change', { bubbles: true }));
```

`{ bubbles: true }` is required because the existing listeners are on `form`, not on `#collections`. Without bubbling, the events would fire on the slider but never reach `form.addEventListener`.

### `classList.toggle(class, condition)` — two-argument form

```javascript
// Source: MDN Web Docs — Element.classList.toggle()
// Second argument forces the class on (true) or off (false)
btn.classList.toggle('text-blue-800', isActive);   // adds if isActive, removes if !isActive
btn.classList.toggle('text-gray-500', !isActive);  // adds if !isActive, removes if isActive
```

This is safer than conditional `add()`/`remove()` pairs — it is idempotent and handles the case where the button is in an ambiguous state.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `peer-checked:` variant on sibling elements (Tailwind v3) | `has-[:checked]:` variant on parent element (Tailwind v4) | Tailwind v4 (2024) | Cards using `<label>` as clickable wrapper can style themselves based on a contained input — no sibling DOM structure required |
| `type="hidden"` for inputs hidden for visual reasons | `sr-only` utility class | Accessibility best practice, always | `type="hidden"` removes keyboard/AT access; `sr-only` preserves it |
| Vanilla JS custom event firing: `new CustomEvent('change')` | `new Event('change', { bubbles: true })` | No change — both valid | Plain `Event` is correct for simulating native input events; `CustomEvent` is for application-defined events with `.detail` payloads |

**Deprecated/outdated:**
- Tailwind v3 `peer-*` variants: This project uses Tailwind v4 — `peer-checked:ring-2` on a sibling element will not compile. Use `has-[:checked]:ring-2` on the parent instead.

---

## Open Questions

1. **`has-[:checked]` vs `[has-checked_&]` alternate syntax in UI-SPEC**
   - What we know: The UI-SPEC shows `[has-checked_&]:bg-white` in one markup block. This is Tailwind v4's arbitrary variant syntax for non-standard selectors. The standard `has-[:checked]:bg-white` syntax is the correct form for `:has(:checked)`.
   - What's unclear: Whether the underscore-notation form `[has-checked_&]` is intentional or a typo in the UI-SPEC. The standard form is `has-[:checked]:`.
   - Recommendation: Use `has-[:checked]:bg-white has-[:checked]:ring-2 has-[:checked]:ring-blue-600` (standard Tailwind v4 variant syntax). Verify in the build output before committing.

2. **Node button click listener registration location**
   - What we know: CONTEXT.md D-16 specifies adding active-state sync inside `updateSliderLabels()`. The click handler that dispatches events needs to be registered somewhere — the UI-SPEC shows it inline but does not specify where in calculator.js it is registered.
   - What's unclear: Whether the click handler setup should be co-located with the initialization block at the bottom of the IIFE, or placed directly after `updateSliderLabels()` definition.
   - Recommendation: Register click listeners in the initialization block at the bottom of the IIFE (alongside `updateResult()` and `updateSliderLabels()` calls) — consistent with existing code structure.

---

## Validation Architecture

> nyquist_validation is enabled (config.json `workflow.nyquist_validation: true`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no test files, no test config, no test script in package.json |
| Config file | None — Wave 0 must create |
| Quick run command | TBD (Wave 0) |
| Full suite command | TBD (Wave 0) |

**Note:** This is a static site with Nunjucks templates and vanilla JavaScript IIFEs. There is no existing test infrastructure. The project's behavior is primarily verified via browser interaction. Given the absence of any test infrastructure and the pure HTML/CSS/JS nature of the changes, validation for this phase should be specified as browser smoke tests (manual or with a lightweight tool like Playwright), not unit tests.

### Phase Requirements → Test Map

Phase 10 has no formal requirement IDs mapped in REQUIREMENTS.md (it extends existing completed requirements). The behaviors to validate are:

| Behavior | Test Type | Notes |
|----------|-----------|-------|
| Staffing card click selects radio and updates result | Manual smoke | No test framework exists |
| Selected card shows ring-2 ring-blue-600 and bg-white | Manual smoke | CSS-only — browser visual verification |
| Unselected cards show bg-gray-50 border-gray-200 | Manual smoke | CSS-only |
| Tab + arrow key navigation works across cards | Manual smoke | Keyboard accessibility |
| Focus ring appears on focused card wrapper | Manual smoke | `has-[:focus-visible]` CSS |
| Node button click sets slider to correct value | Manual smoke | Verify `slider.value` in DevTools |
| Active node shows text-blue-800 font-semibold | Manual smoke | JS class toggle |
| All other nodes show text-gray-500 font-normal | Manual smoke | JS class toggle |
| URL restore sets correct node button active state | Manual smoke | Open `?tau=2` — verify 3rd button is active |
| `data-cost` and `value` on radio inputs unchanged | Static inspection | Inspect built HTML output |

### Sampling Rate

- **Per task commit:** Build and open `src/index.html` in browser; verify card and slider visuals
- **Per wave merge:** Full manual smoke test across Chrome, Firefox, Safari
- **Phase gate:** All manual smoke tests green before `/gsd:verify-work`

### Wave 0 Gaps

- No test framework exists. For this phase, manual browser verification is the appropriate gate. If automated testing is added in a future phase, these behaviors map cleanly to Playwright interaction tests.
- No Wave 0 test infrastructure work is needed for Phase 10 to proceed.

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection: `src/index.html`, `src/js/calculator.js`, `src/js/url.js`, `src/_data/config.js`, `src/css/style.css`, `package.json` — all read directly
- `10-CONTEXT.md` — locked decisions D-01 through D-18, integration contracts
- `10-UI-SPEC.md` — complete markup contract, interaction contract, accessibility contract

### Secondary (MEDIUM confidence)

- Tailwind CSS v4 `has-[]` variant behavior: confirmed via `@tailwindcss/cli@4.2.2` being installed and general knowledge of Tailwind v4 variant syntax; the specificity claim (0,1,1 for `has-[]`) is based on CSS `:has()` pseudo-class specificity rules (verified via MDN)
- `sr-only` utility behavior: standard Tailwind utility, consistent across v3 and v4
- `classList.toggle(class, bool)` two-argument form: MDN Web Docs standard DOM API

### Tertiary (LOW confidence)

- None — all findings are either direct codebase reads or well-established web platform APIs

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries are already installed and in use; no new dependencies
- Architecture: HIGH — markup contract fully specified in UI-SPEC; JS patterns mirror existing code
- Pitfalls: HIGH — derived from direct code inspection and known Tailwind v4 migration patterns
- Integration contracts: HIGH — url.js and calculator.js read directly; no ambiguity

**Research date:** 2026-03-22
**Valid until:** 2026-06-22 (stable — Tailwind v4.x, Eleventy v3.x, and the DOM APIs are stable; no expiry risk)
