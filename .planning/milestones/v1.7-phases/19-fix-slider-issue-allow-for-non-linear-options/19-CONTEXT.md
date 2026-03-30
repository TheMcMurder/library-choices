# Phase 19: Fix Slider Issue — Allow for Non-Linear Options - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix the `collectionSlider` Nunjucks macro and associated JavaScript so sliders with non-linearly-spaced options work correctly. Apply the fix to both sliders for consistency.

**Root cause:** `slider.njk` derives `step` from `options[1].value - options[0].value`, which assumes all gaps are equal. The digital collections options ($5k/$15k/$30k/$55k/$65k) have unequal gaps, so the slider has 7 physical positions but only 5 valid ones — dragging to $25k/$35k/$45k leaves `updateSliderLabels` unable to find a matching option and silently fails.

This is a bug fix + refactor only — no new UI capabilities, no new sliders, no data changes.

</domain>

<decisions>
## Implementation Decisions

### Slider value model — index-based

- **D-01:** Change the HTML `<input type="range">` to use `min=0`, `max=N-1`, `step=1`. The slider's `value` is now a 0-based index into the options array. This guarantees the slider always lands on a valid option regardless of spacing.
- **D-02:** In `slider.njk`, the `value` attribute (initial position) must be the index of the option with `isDefault: true`. Use `loop.index0` inside the Nunjucks for-loop to compute this.
- **D-03:** Tick buttons (`data-value`) change from storing the dollar amount to storing the option index. The click-to-snap handler (`slider.value = btn.dataset.value`) remains correct — it now writes an index rather than a dollar amount.
- **D-04:** Tick button labels (`$5k`, `$15k`, etc.) continue to display `opt.value / 1000` as before — the label is derived from the option value, not from `data-value`.

### Fix scope — both sliders

- **D-05:** Apply the index-based approach to both `collections-digital` and `collections-physical` sliders. Physical options are currently linearly spaced so technically work today, but unifying the pattern prevents future breakage if physical options change and keeps the codebase consistent.

### encodeIndices interface — update to accept indices directly

- **D-06:** Change `encodeIndices(data, staffingId, digitalValue, physicalValue, cityIds)` to `encodeIndices(data, staffingId, digitalIdx, physicalIdx, cityIds)` where `digitalIdx` and `physicalIdx` are 0-based option indices (not dollar amounts). Remove the `findIndex` lookup for those two parameters — just bounds-check and set directly. Update JSDoc accordingly.
- **D-07:** Update `url.js` → `getCurrentSelections()` to read slider `.value` as an integer index directly for both collection sliders. Remove the dollar-value reads for those fields.
- **D-08:** Update `url.js` → `applySelections()` to write `digSlider.value = String(indices.digitalIdx)` and `physSlider.value = String(indices.physicalIdx)` (index string, not dollar amount).
- **D-09:** Update `test/url.test.js` to pass option indices instead of dollar values when calling `encodeIndices`.

### calculator.js updates

- **D-10:** Update `getDigitalCost()` and `getPhysicalCost()` to read the slider index and look up the actual dollar value: `var idx = parseInt(el.value, 10); return window.LIBRARY_DATA.collectionsDigital.options[idx].value;`.
- **D-11:** Update `updateSliderLabels()` to look up the option by index: `var idx = parseInt(slider.value, 10); var node = options[idx];` — remove the `for` loop that searched by value.
- **D-12:** Tick button active-state comparison in `updateSliderLabels` stays `btn.dataset.value === String(slider.value)` — now both are index strings, so comparison is still correct.
- **D-13:** Display and `aria-valuetext` still show `node.value` (the dollar amount from the options array) — user-facing behavior is unchanged.

### Claude's Discretion
- Whether to add a defensive bounds check on the index read in `getDigitalCost`/`getPhysicalCost` (e.g., clamp to 0..N-1) — Claude may add this if it improves robustness.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files being modified
- `src/_includes/macros/slider.njk` — The shared macro to fix. Read before touching.
- `src/js/calculator.js` — Reads slider value for cost calculation and manages label/tick updates. Read before touching.
- `src/js/url.js` — Reads slider state for URL encoding; applies decoded indices on restore. Read before touching.
- `src/js/lib/url-helpers.js` — `encodeIndices` signature changing. Read before touching.
- `test/url.test.js` — Tests calling `encodeIndices` with dollar values — must be updated. Read before touching.

### Context and patterns
- `.planning/phases/14-separate-digital-and-physical-collections/14-CONTEXT.md` — Established `delta`/`tau` URL params as 0-based indices. The index-based slider aligns with this existing convention.
- `src/_data/config.js` — Source of option arrays for both sliders. Read to confirm option counts and current structure.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `slider.njk` — The single macro used for both sliders. One change fixes both.
- `window.LIBRARY_DATA` — Config injected into the page; available in all browser JS for option lookups.

### Established Patterns
- URL encoding is already index-based (`delta`, `tau`, `pi`, `phi`) — the slider fix aligns the DOM state with the encoding layer.
- `data-current-level="true"` attribute on tick buttons drives the amber styling in `updateSliderLabels` — must be preserved.
- `btn.dataset.value === String(slider.value)` active-state check in `updateSliderLabels` — works correctly with index-as-string comparison.
- All changes are confined to `slider.njk`, `calculator.js`, `url.js`, `url-helpers.js`, and `test/url.test.js`. No HTML, CSS, config, or other test files change.

### Integration Points
- `calculator.js` → reads `#collections-digital` and `#collections-physical` slider values → must return dollar amounts for `calculatePerHousehold`.
- `url.js` → reads slider values → passes to `encodeIndices` → must be indices after this change.
- `url.js` → `applySelections` → writes to slider → must write index strings after this change.
- `pnpm test` — run after changes to confirm all 21 tests still pass (plus any new/updated url tests).

</code_context>

<specifics>
## Specific Ideas

- The fix should be transparent to users — the only observable change is that the digital slider no longer allows dragging to values between labeled ticks.
- The tick click-to-snap behavior continues to work identically from the user's perspective.
- URL sharing/restoration continues to work — the encoding layer was already index-based.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 19-fix-slider-issue-allow-for-non-linear-options*
*Context gathered: 2026-03-30*
