# Phase 14: Separate Digital and Physical Collections - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the single "Annual collections budget" slider (6 blended tiers, $10k–$60k) with two independently-controlled sliders — one for digital collections and one for physical print collections. Citizens can configure each dimension separately. Both budgets are additive in the tax calculation. The slider HTML block is extracted into a reusable Nunjucks macro used by both new controls.

</domain>

<decisions>
## Implementation Decisions

### Cost Model
- **D-01:** Digital budget + physical budget = total collections cost (additive). Both sliders contribute independently to the tax calculation. No floor/ceiling constraints — citizens can set either to its lowest tier.
- **D-02:** The existing 6-tier blended options ($10k–$60k) are replaced entirely. No legacy `collections` key retained.
- **D-03:** Each dimension has new independent tier scales defined in config.js (not re-using the old $10k–$60k range).

### Config Structure
- **D-04:** Replace `collections` with two top-level keys: `collectionsDigital` and `collectionsPhysical`. Each has its own `description`, `source`, and `options` array. Mirrors the UI structure.
- **D-05:** NON-DEVELOPER EDIT GUIDE in config.js must be updated in this phase to document both new keys so the site owner can update digital and physical tiers independently.

### UI Layout
- **D-06:** Two stacked sliders, both inside the Collections Budget fieldset. Digital slider on top, physical slider below. Consistent with existing fieldset/slider pattern.
- **D-07:** Each slider has its own description text (updates to selected tier's description) and its own source citation. Same pattern as the current single slider.

### Reusable Component
- **D-08:** Extract the slider HTML block into a Nunjucks macro. Both digital and physical sliders are rendered by calling the same macro with different params (id, options, defaultValue, label, descriptionId, etc.). This is a locked requirement — the two sliders must share the same implementation.

### Current Service Level Indicators
- **D-09:** Each slider has its own `isCurrentServiceLevel: true` option. Both sliders display the Phase 13 amber tick independently. The `data-current-level` attribute and JS guard pattern from Phase 13 apply to both sliders via the shared macro.

### URL Encoding
- **D-10:** `tau` param is reused for physical collections index (closest to original intent). A new compact param is added for digital collections index. Old `tau` values that don't match valid physical tier indices fall through to the default physical tier — no special backward-compat mapping needed.

### Calculator
- **D-11:** Total tax = staffing cost + digital budget + physical budget. calculator.js reads both slider values and sums them as the collections component of cost. No minimum or maximum enforced.

### Claude's Discretion
- Exact dollar values and tier counts for `collectionsDigital.options` and `collectionsPhysical.options` — define appropriate ranges for each dimension
- Name of the new URL param for digital index
- Internal IDs for the two sliders (`collections-digital`, `collections-physical` or similar)
- Macro file location (e.g., `src/_includes/macros/slider.njk` or similar Eleventy convention)
- Whether the fieldset legend changes from "Collections Budget" or stays as-is

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Key files to read
- `src/_data/config.js` — Current collections structure to replace; NON-DEVELOPER EDIT GUIDE to update
- `src/index.html` — Current slider HTML block to extract into macro; fieldset structure
- `src/js/calculator.js` — Current single-slider cost calculation to update for two sliders
- `src/js/url.js` — Current tau encoding/decoding to update for two params

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Current slider block in `src/index.html` (lines ~70–101): range input + tick buttons loop + description p + source cite — this is the block to extract into a Nunjucks macro
- `data-current-level="true"` + `data-value` attributes on tick buttons (Phase 13 pattern) — macro must emit these conditionally when `isCurrentServiceLevel` is true
- `calculator.js` `updateSliderLabels()` + `getCollections()`: single-slider JS to refactor for two sliders
- `url.js` tau encode/decode: add parallel encode/decode for digital param

### Established Patterns
- `config.js` top-level keys (staffingLevels, collections, cities) — new keys follow same pattern
- Nunjucks `{% for opt in config.X.options %}` loops — macro will use passed-in options array
- `window.LIBRARY_DATA = {{ config | dump | safe }}` — both new keys automatically available in JS
- `isCurrentServiceLevel: true` flag on config options → `data-current-level` attr on tick → JS guard preserves `text-amber-600` class

### Integration Points
- calculator.js: replace single `getCollections()` with two separate getters; update total cost formula
- url.js: add digital param alongside tau; both encode on change, both restore on load
- index.html: replace inline slider block with two macro calls; keep fieldset wrapper

</code_context>

<specifics>
## Specific Ideas

- User explicitly wants the slider extracted into a Nunjucks macro — this is not optional
- `tau` stays as the physical collections URL param (continuity); new param name for digital is Claude's discretion

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 14-separate-digital-and-physical-collections*
*Context gathered: 2026-03-28*
