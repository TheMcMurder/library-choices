# Pitfalls Research

**Domain:** Adding range slider + schedule display to existing Eleventy static site with vanilla JS calculator and URL encoding
**Researched:** 2026-03-21
**Confidence:** HIGH — grounded in direct codebase inspection of calculator.js, url.js, config.js, index.html plus verified against MDN and W3C official docs

---

## Critical Pitfalls

### Pitfall 1: URL Backward Compatibility — Old Shared Links Break After Slider Replaces Select

**What goes wrong:**
`url.js` currently encodes the collections selection as `collections=30000` (the raw dollar-amount string from `select.value`). Any URL shared before v1.1 deploys carries that encoding. After the slider ships, `restoreFromUrl()` must still accept these old dollar-amount strings and resolve them to the correct slider position. If the restore logic is rewritten to expect a different format (e.g., array index, slug, or relative position), every previously shared link silently falls back to the default — a silent regression the product owner may not detect.

**Why it happens:**
The natural refactor impulse is to encode the slider by index (`collections=2`) or by a new slug since sliders do not have a natural "value" the way `<option value="">` does. Developers forget that the existing URL contract was `collections=<dollar amount string>` and that live shared links already exist in the wild.

**How to avoid:**
Keep encoding the collections value as the dollar-amount integer string. The slider's `value` attribute already holds an integer (set from `config.collections.options[i].value`), so `document.getElementById('collections').value` continues to return `"30000"` exactly as before. The `encodeUrl()` and `restoreFromUrl()` functions in `url.js` do not need to change their format — only the element type changes from `<select>` to `<input type="range">`. The restore logic's existing `validValues` check (lines 58-60 of url.js) continues to guard against out-of-range values. Verify this explicitly in the phase acceptance criteria.

**Warning signs:**
- Changing `params.set('collections', ...)` to write anything other than the numeric dollar string
- Restore logic that calls `parseInt()` on the param and then uses it as an array index
- Phase plan that says "update URL encoding format" for collections

**Phase to address:**
Phase 1 (slider implementation) — verify in acceptance criteria that a URL containing `collections=30000` from before the deploy still restores to the $30,000 node after the slider ships.

---

### Pitfall 2: Calculator Reads `.value` as String — Off-Node Values Produce Wrong Tax Figure

**What goes wrong:**
`calculator.js` line 18: `getCollectionsCost()` calls `parseInt(collectionsSelect.value, 10)`. For a `<select>`, `.value` returns the currently selected `<option>`'s value attribute — a well-formed string like `"30000"`. For `<input type="range">`, `.value` also returns a string, but the browser clamps and snaps it to the nearest valid `step` value. If the slider's `min`/`max`/`step` attributes do not exactly match the option values in `config.js`, the slider can land on a value like `"25000"` that is between defined nodes, causing `parseInt` to return a number that is not a valid collections cost. The calculation silently produces a wrong result — no error, no NaN, just a wrong tax figure.

**Why it happens:**
Developers set `step="1"` or omit `step` (defaults to 1) on the range input, not realising the step must exactly span the configured option intervals. Config has values `[10000, 20000, 30000, 40000, 50000, 60000]` — step should be `10000`, min `10000`, max `60000`. Using `step="1"` allows the slider to stop at 27,431, which `parseInt` happily converts.

**How to avoid:**
Set `min`, `max`, and `step` on the `<input type="range">` derived directly from `config.collections.options` at template render time — not as hardcoded values. In the Nunjucks template, compute `min = options[0].value`, `max = options[last].value`, `step = options[1].value - options[0].value` (assumes uniform spacing, which the current config has). Add an assertion comment noting this assumption. No change needed to `getCollectionsCost()` in `calculator.js` — it already uses `parseInt(..., 10)` which is the correct read strategy for a range `.value`.

**Warning signs:**
- `<input type="range" min="0" max="100">` or any hardcoded min/max not matching config values
- Missing `step` attribute on the range input
- A config change that makes option spacing non-uniform without updating the template

**Phase to address:**
Phase 1 (slider implementation) — template must derive `min`, `max`, `step` from `config.collections.options`. Add a config validation note to the NON-DEVELOPER EDIT GUIDE.

---

### Pitfall 3: `change` Event Not Firing During Drag on Mobile — Live Result Bar Appears Frozen

**What goes wrong:**
`calculator.js` uses a single delegated `form.addEventListener('change', updateResult)`. For `<select>` and radio buttons, `change` fires when the value commits — this is fine. For `<input type="range">` on mobile Safari and some Android browsers, `change` fires only when the user lifts their finger (touchend equivalent). During the drag, the result bar does not update. Users dragging the slider see a frozen dollar amount and may think the control is broken, then release and see a jump. On desktop, keyboard arrow navigation fires `input` (not `change`) on each step, so the result bar also does not update keystroke-by-keystroke.

**Why it happens:**
The difference between `input` (fires continuously during interaction) and `change` (fires on commit) matters for range inputs in a way it does not for select or radio. The existing delegation on `change` is the right choice for select and radio (avoids thrashing), but wrong for range.

**How to avoid:**
Add a second delegated listener: `form.addEventListener('input', updateResult)`. Since `updateResult` is idempotent and cheap (no DOM queries beyond form elements), firing it on both `input` and `change` is safe. No double-firing issue — `change` fires after `input` on commit, but calling `updateResult()` twice with the same value is harmless. This does not require changing the existing `change` listener that `url.js` also relies on for its `encodeUrl()` — URL encoding on commit is the correct behavior.

**Warning signs:**
- Result bar not updating during slider drag in mobile browser testing
- Result bar not updating on keyboard arrow key presses

**Phase to address:**
Phase 1 (slider implementation) — add `form.addEventListener('input', updateResult)` in `calculator.js`. Include mobile drag test in acceptance criteria.

---

### Pitfall 4: Screen Reader Announces Raw Number, Not Citizen-Meaningful Label

**What goes wrong:**
Without `aria-valuetext`, a screen reader on `<input type="range" value="30000">` announces "30000" or "30,000" — a raw dollar integer with no context. The citizen-meaningful label for this node is something like "$30,000/year" or the per-node description. Screen reader users hear a meaningless number and cannot understand what level they are at without visual context.

**Why it happens:**
`aria-valuetext` must be set dynamically via JavaScript whenever the slider value changes. It is not a static HTML attribute that stays current. Developers add the slider, test it visually, and forget that screen reader users need the label text, not the numeric value. This is confirmed in W3C WAI APG: "Authors SHOULD only set aria-valuetext when the rendered value cannot be accurately represented as a number."

**How to avoid:**
In the slider's event handler, set `aria-valuetext` on mount and on every `input`/`change` event. The value should be the human-readable label for the selected node — e.g., `"$30,000 per year"` — mapped from the slider's current `.value` to the matching option in `config.collections.options`. The description text is already in config; adding a `label` field to each option object for this purpose is the clean approach.

**Warning signs:**
- No `setAttribute('aria-valuetext', ...)` call in the slider's event handler
- `aria-valuetext` present only as a static HTML attribute (will go stale when user moves slider)
- Manual screen reader test skipped in acceptance criteria

**Phase to address:**
Phase 1 (slider implementation) — include `aria-valuetext` update in the slider's `input`/`change` handler. Verify with VoiceOver or NVDA in acceptance criteria.

---

### Pitfall 5: Tick Mark Labels Are Visual-Only — Datalist Labels Not Cross-Browser

**What goes wrong:**
Using `<datalist>` with `<option label="$10k">` for tick marks looks correct in spec and works visually in Chrome, but Firefox does not render tick marks at all from `datalist` (Bugzilla #1222762 open since 2015), and Chrome hides `label` attribute text by default (Chromium issue #40771904). Developers test in Chrome, see tick marks, ship it, and Firefox users see a plain slider with no visible nodes. The "discrete nodes" requirement is not met on Firefox.

**Why it happens:**
The `datalist`+`range` combination is severely underspecified across browsers. The spec intends for `datalist` to provide snap points and labels, but no browser fully implements both the snapping and the label rendering for `type=range`.

**How to avoid:**
Do not rely on `datalist` for visual tick marks and labels. Render the node labels as static HTML elements positioned below the slider using CSS (e.g., a flex row of `<span>` elements with fixed widths matching the slider track width). This is purely presentational and does not affect the slider's `value`. The node description text (the "Available books/digital" copy per level) should be rendered in a separate `<div>` that updates on slider change — not in the datalist. Use `datalist` only as a progressive enhancement for snapping in browsers that support it, not as the primary visual mechanism.

**Warning signs:**
- Tick mark labels implemented only via `<option label="...">` inside `<datalist>`
- Firefox acceptance test skipped
- Node descriptions rendered inside `<datalist>` option elements

**Phase to address:**
Phase 1 (slider implementation) — design tick label row and node description as separate DOM elements from the start. Cross-browser test (Chrome, Firefox, Safari mobile) in acceptance criteria.

---

### Pitfall 6: Staffing Reframe Changes Radio `value` Attributes — URL Contract Broken

**What goes wrong:**
The staffing section rename to "Hours Open" with a schedule display is a UI reframe, not a data change. The calculator still reads `data-cost` from the checked radio's dataset (calculator.js line 12 — safe regardless of value). But `url.js` validates `staffingParam` against `data.staffingLevels.map(l => l.id)` (line 43-44) and restores by `input[name="staffing"][value="..."]` (line 45). If the refactor changes the radio `value` attributes (e.g., from `"1fte"` to `"basic"` to sound more citizen-friendly), shared URLs containing `staffing=1fte` silently fall back to default after the rename.

**Why it happens:**
Renaming labels feels like a UI-only change. The `value` attribute on radios looks like a label. Developers change `value="1fte"` to `value="basic-hours"` to match the new framing, not realising the value is the URL-encoded identifier.

**How to avoid:**
Never change the `id` values in `config.js` staffingLevels (currently `"1fte"`, `"1fte-1pte"`, `"1fte-2pte"`). The `label` and `description` fields are citizen-facing copy — change those freely. The schedule display is new data added to each staffing level object, rendered in the template, but the `id` field is the URL contract and must be treated as immutable once deployed. Add a comment in `config.js` marking `id` as a URL key.

**Warning signs:**
- Any change to `staffingLevels[].id` values in config.js
- Radio `value` attributes changed from existing id values
- Phase plan that says "rename staffing values" without a URL migration strategy

**Phase to address:**
Phase 2 (staffing reframe) — explicitly lock `id` values in the NON-DEVELOPER EDIT GUIDE. Add acceptance criteria: shared URL `?staffing=1fte-2pte` still restores correctly after the reframe ships.

---

### Pitfall 7: Schedule Data in config.js — NON-DEVELOPER EDIT GUIDE Not Updated

**What goes wrong:**
v1.1 adds structured schedule data (days + open/close times per staffing level) to `config.js`. The NON-DEVELOPER EDIT GUIDE at the top of `config.js` does not cover this new shape. The product owner (a city council member) will attempt to update hours and either: (a) corrupt the structure, causing a build error, or (b) not know they can update it at all, leaving placeholder hours in production.

**Why it happens:**
The edit guide is written last or forgotten. Adding new structured data without updating the guide is a standard oversight on "small" config additions.

**How to avoid:**
Write the edit guide section for the new schedule data at the same time the data structure is added to config.js — not after. The guide entry should show an example day object, explain the time format (e.g., 24h string `"09:00"` vs `"9:00 AM"`), and warn about JSON-valid syntax (no trailing commas). Lock the time format choice before writing the guide so the guide and the template renderer agree.

**Warning signs:**
- Schedule data shape added to config.js without a corresponding NON-DEVELOPER EDIT GUIDE block
- Time format left undocumented (template may expect one format, owner writes another)

**Phase to address:**
Phase 2 (staffing reframe / config extension) — update the NON-DEVELOPER EDIT GUIDE as part of the same commit that adds the schedule data shape.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode `min="10000" max="60000" step="10000"` in HTML instead of deriving from config | Simpler template | Config change by owner breaks slider silently | Never — config is owner-editable |
| Use `datalist` labels as sole tick visual | Zero custom CSS | Broken in Firefox, labels hidden in Chrome | Never for this use case |
| Skip `aria-valuetext` update on slider | Faster implementation | Screen reader users hear meaningless integers | Never — WCAG 2.1 AA is a stated requirement |
| Keep only `form.addEventListener('change', ...)`, no `input` | No change to existing listener | Mobile drag does not update result bar | Never for a range slider |
| Change staffing `id` values during reframe | Cleaner data model | All existing shared URLs silently broken | Never once URLs are in the wild |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| url.js + slider encode | Write slider position as array index (`collections=2`) | Keep encoding as dollar-amount string matching existing URL contract |
| url.js restore + slider | Keep `Array.from(select.options)` validation after replacing select with range | Replace with: check param exists in `config.collections.options.map(o => o.value.toString())` |
| calculator.js + slider | Assume `.value` returns a number | `.value` always returns a string on range inputs; existing `parseInt(..., 10)` handles this correctly |
| config.js + template | Non-uniform option spacing breaks step derivation | Document the uniform-spacing assumption; derive step from config at template render time |
| schedule template + config | Undefined time format in config causes template render error | Define and document time format in config before writing template renderer |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Heavy DOM queries on every `input` event | Janky slider on low-end mobile | Cache element references at init; `updateResult()` already does this pattern | Not a concern at this scale, but avoid DOM thrashing as a habit |
| Updating schedule display on every `input` event (slider) | N/A — slider does not affect schedule display | Schedule display only updates on staffing radio `change`; do not couple it to slider events | Never |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Slider with no visible node labels | User cannot tell what dollar amount each position represents | Render static label row below slider track showing all node values |
| Node description text not updating as slider moves | User sees description for default value regardless of current position | Update description `<div>` on every `input` event tied to current slider value |
| Slider snaps but thumb appears between rendered node markers | Cognitive mismatch — thumb looks like it is "between" options | Set `step` to match exact node spacing so snapping aligns with tick positions |
| "Hours Open" schedule shown for all staffing levels simultaneously | Confusing — only the selected level's schedule is relevant | Show schedule only for the currently checked radio; hide/show via template or JS |
| Range thumb too small on mobile | Users cannot grab the slider | Ensure `::thumb` pseudo-element has at least 44px hit area via CSS |

---

## "Looks Done But Isn't" Checklist

- [ ] **Slider URL compatibility:** Load a URL from before deploy (`?collections=30000&staffing=1fte-2pte&cities=providence,nibley`) and confirm the slider lands on the correct node.
- [ ] **Slider mobile drag:** Drag the slider on a real mobile device (or DevTools touch emulation) and confirm the result bar updates during the drag, not only on release.
- [ ] **Slider keyboard navigation:** Tab to the slider, press left/right arrow keys — confirm result bar updates on each keypress.
- [ ] **Screen reader valuetext:** VoiceOver (macOS) or NVDA + Chrome — navigate to slider and confirm it announces the dollar label, not the raw integer.
- [ ] **Firefox tick marks:** Load in Firefox and confirm node positions and labels are visible (not relying on datalist).
- [ ] **Staffing URL contract:** After Hours Open reframe, confirm `?staffing=1fte` still selects the first staffing level.
- [ ] **config.js schedule edit guide:** The NON-DEVELOPER EDIT GUIDE covers the new schedule data format with a copy-pasteable example.
- [ ] **Node description updates:** Move the slider — confirm the per-node "Available books/digital" description updates without a page reload.
- [ ] **Default restore:** Load the page with no URL params — confirm slider rests on the `isDefault: true` option node.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Shared URLs broken by encoding format change | MEDIUM | Add a URL migration shim in `restoreFromUrl()`: detect old format, convert to new, re-encode; ship as patch release |
| Staffing id values renamed, old URLs broken | MEDIUM | Add forward-map in `restoreFromUrl()` for old → new id values; ship as patch |
| Datalist-only tick marks broken in Firefox | LOW | Add CSS-based tick label row; purely additive, no JS changes |
| Missing aria-valuetext | LOW | Add `setAttribute('aria-valuetext', ...)` call in slider event handler; one-line fix |
| `change`-only listener (frozen mobile drag) | LOW | Add `form.addEventListener('input', updateResult)`; one line in calculator.js |
| Wrong step/min/max causing off-node values | LOW | Correct attributes in template and verify node alignment; no URL or data contract changes |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| URL backward compatibility (slider encoding) | Phase 1 — slider implementation | Load a pre-v1.1 URL; confirm slider lands on correct node |
| Calculator off-node value (step mismatch) | Phase 1 — slider implementation | Drag to each node; confirm result bar shows correct dollar amount |
| `change`-only listener (frozen mobile drag) | Phase 1 — slider implementation | Drag slider on mobile; confirm live result update |
| Screen reader announces raw number | Phase 1 — slider implementation | VoiceOver/NVDA manual test on slider |
| Datalist labels not cross-browser | Phase 1 — slider implementation | Firefox + Safari visual test for tick marks and labels |
| Staffing id renamed, URL contract broken | Phase 2 — staffing reframe | Load `?staffing=1fte` URL; confirm correct radio selected |
| Schedule edit guide missing | Phase 2 — config extension | Code review: config.js edit guide covers schedule shape with example |

---

## Sources

- [MDN: `<input type="range">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) — value always string, step/min/max snapping behavior
- [MDN: aria-valuetext](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext) — must be set dynamically; overrides aria-valuenow for screen readers
- [W3C WAI APG: Communicating Value and Limits for Range Widgets](https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/) — aria-valuenow/valuetext requirements
- [CSS-Tricks: A Sliding Nightmare — Understanding the Range Input](https://css-tricks.com/sliding-nightmare-understanding-range-input/) — cross-browser tick mark inconsistencies
- [Bugzilla #1222762: datalist element with input type=range doesn't work (Firefox)](https://bugzilla.mozilla.org/show_bug.cgi?id=1222762) — Firefox datalist+range not implemented
- [Chromium Issue #40771904: Datalist labels missing on `<input type="range" list="ticks">`](https://issues.chromium.org/issues/40771904) — Chrome hides datalist option labels
- [Impressive Webs: onchange vs. oninput for Range Sliders](https://www.impressivewebs.com/onchange-vs-oninput-for-range-sliders/) — `change` fires on commit only; `input` needed for live feedback during drag
- [W3C WAI: Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/) — accessible schedule table patterns with scope/headers
- Direct codebase inspection: `src/js/calculator.js`, `src/js/url.js`, `src/_data/config.js`, `src/index.html`

---
*Pitfalls research for: Cache County Library Choices v1.1 — range slider + Hours Open reframe*
*Researched: 2026-03-21*
