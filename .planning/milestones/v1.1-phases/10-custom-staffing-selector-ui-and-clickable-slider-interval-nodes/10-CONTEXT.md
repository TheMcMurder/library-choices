# Phase 10: Custom Staffing Selector UI and Clickable Slider Interval Nodes - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Two independent UI upgrades to existing controls:
1. Replace the staffing radio button list with visual card-style selectors
2. Make the collections slider interval labels ($10k–$60k) clickable to snap the slider to that value

URL encoding, cost calculation, and data sources are unchanged. No new config.js fields required.

</domain>

<decisions>
## Implementation Decisions

### Staffing selector: visual cards

- **D-01:** Replace the `<input type="radio">` + `<label>` list with clickable card elements — each card wraps a hidden radio input so `form.querySelector('input[name="staffing"]:checked')` and `data-cost` remain intact for calculator.js and url.js
- **D-02:** All three cards are always fully expanded — label + schedule table + description visible at all times; no collapse/expand behavior
- **D-03:** The entire card surface is clickable (not just a label) — the card acts as the clickable target for its hidden radio input
- **D-04:** Selected card: `ring-2 ring-blue-600` border; unselected cards: `border border-gray-200` (matching existing fieldset card aesthetic)
- **D-05:** Card background: `bg-white` selected, `bg-gray-50` unselected — subtle contrast to signal selection state
- **D-06:** Cards are stacked vertically (full width), not side-by-side — consistent with existing mobile-first layout; schedule tables need full width

### Staffing selector: preserved integration points

- **D-07:** Hidden `<input type="radio" name="staffing">` inside each card must keep `value="{{ level.id }}"` and `data-cost="{{ level.annualCost }}"` — these are read by calculator.js and url.js without modification
- **D-08:** `for`/`id` pairing on the label and input must remain for accessibility (screen readers announce label text + state)
- **D-09:** `focus-visible` ring on the hidden input should transfer visually to the card wrapper — use `has-[:focus-visible]:ring-2` or equivalent Tailwind v4 pattern

### Clickable slider interval nodes

- **D-10:** Change the static `<span>` tick labels below the collections slider to `<button type="button">` elements
- **D-11:** Each button has a `data-value` attribute matching its option's numeric value (e.g., `data-value="30000"`)
- **D-12:** Clicking a node: sets `slider.value = button.dataset.value`, then dispatches both `input` and `change` events on the slider element so calculator.js and url.js react identically to a drag
- **D-13:** Active node style: `text-blue-800 font-semibold`; inactive: `text-gray-500 font-normal` — same visual language as existing amount display
- **D-14:** Active node is updated in `updateSliderLabels()` in calculator.js — find the button whose `data-value` matches current `slider.value` and apply active class; remove from all others
- **D-15:** No tick marks on the track itself — clickable labels are the visual anchors

### JavaScript changes

- **D-16:** `updateSliderLabels()` in calculator.js gains a step: after updating `#collections-amount` and `#collections-description`, loop over all node buttons, remove active classes from all, apply active classes to the one matching current value
- **D-17:** Node buttons dispatch events on the `#collections` slider element (not the form) — this triggers the existing `form.addEventListener('input', ...)` and `form.addEventListener('change', ...)` listeners correctly since events bubble through the form
- **D-18:** No changes to url.js — `tau` encoding reads `slider.value` directly; clicking a node sets that value before events fire

### Claude's Discretion

- Exact Tailwind spacing within card internals (padding, gap between schedule and description)
- Whether `cursor-pointer` is on the card wrapper or the hidden label
- Exact hover state on node buttons (e.g., `hover:text-blue-600`)
- `aria-pressed` vs relying on the underlying radio `checked` state for screen reader announcement of node buttons

</decisions>

<specifics>
## Specific Ideas

- Cards should feel like a step up from radio buttons — more visually substantial — without introducing any new colors or component patterns beyond what's already in the design system
- Clicking a slider node label should feel instant and snappy, identical to dragging the slider to that stop

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing implementation to modify
- `src/index.html` — staffing fieldset (lines ~20–60): the `{% for level in config.staffingLevels %}` loop to be converted to card markup; collections tick label row (`{% for opt in config.collections.options %}`) to be converted from `<span>` to `<button type="button">` elements
- `src/js/calculator.js` — `updateSliderLabels()` function: add active node button state sync; no other changes
- `src/_data/config.js` — no data changes required; staffing and collections structures are already correct

### Integration contracts (must not break)
- `src/js/url.js` — `encodeUrl()` reads `form.querySelector('input[name="staffing"]:checked')` and `document.getElementById('collections').value`; `restoreFromUrl()` sets `radio.checked = true` on the matching staffing input. Both must continue to work without modification.
- `src/js/calculator.js` — `getStaffingCost()` reads `form.querySelector('input[name="staffing"]:checked').dataset.cost`. The hidden radio input inside each card must retain `data-cost`.

### Prior phase context
- `.planning/phases/07-collections-budget-slider/07-UI-SPEC.md` — design system reference (colors, spacing, typography tokens) that this phase must match
- `.planning/phases/08-hours-open-schedule-display/08-CONTEXT.md` — D-09 through D-12: schedule table structure rendered per staffing level; cards preserve this table markup

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `bg-gray-50 border border-gray-200 rounded-lg p-6` pattern: existing fieldset card style — unselected staffing cards adopt this, selected card replaces `border-gray-200` with `ring-2 ring-blue-600`
- `accent-blue-600 focus-visible:outline` on radio inputs: existing focus ring pattern — analogous treatment needed on card wrappers
- `min-h-[44px]` on interactive wrappers: existing 44px touch target pattern — each card must meet this

### Established Patterns
- IIFE + `'use strict'` in calculator.js and url.js — any JS additions stay within existing IIFE or are added inline
- `form.addEventListener('input', ...)` + `form.addEventListener('change', ...)` delegation: node button click events should dispatch on the slider element to reach these listeners
- `window.LIBRARY_DATA.collections.options` array: used in `updateSliderLabels()` — node buttons should align their `data-value` attributes with these option values

### Integration Points
- `#collections` slider element: node buttons read and write `.value` on this element
- `form` element (`#configurator`): existing change/input event listeners are the reaction hooks for both slider drags and node clicks

</code_context>

<deferred>
## Deferred Ideas

- Animating the slider thumb when a node is clicked (CSS transition on the thumb position) — nice-to-have, out of scope
- Horizontal layout of staffing cards on wider screens — current phase uses stacked vertical layout only

</deferred>

---

*Phase: 10-custom-staffing-selector-ui-and-clickable-slider-interval-nodes*
*Context gathered: 2026-03-21*
