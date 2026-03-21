# Feature Research

**Domain:** Civic tax calculator — citizen-facing UX controls
**Researched:** 2026-03-21 (v1.1 update)
**Confidence:** HIGH (slider/accessibility patterns verified against W3C WAI APG, USWDS, MDN; schedule display pattern verified against real library sites; implementation dependencies verified from codebase inspection)

---

## v1.1 Scope

This document focuses on the **two new features** in v1.1:
1. Collections budget: replace `<select>` dropdown with a range slider with discrete nodes and per-node description text
2. Staffing section: reframe as "Hours Open" with structured weekly schedule from config.js

All v1.0 features (radio buttons, city checkboxes, live tax calculation, URL shareability) are shipped and validated. The v1.0 feature landscape is preserved at the bottom of this document for reference.

---

## Feature Landscape — v1.1

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Slider snaps to discrete nodes only | Config has exactly 6 fixed values ($10k–$60k); arbitrary values break the cost model; users should explore defined options, not free-form numbers | LOW | Use `step` attribute matching fixed increment. With 6 options at $10k intervals: `min=10000 max=60000 step=10000`. Browser enforces snapping natively — no JS needed. |
| Per-node description text updates live during drag | "$10,000" is meaningless. "Digital only — Beehive and Libby services" is meaningful. Users expect immediate context as they explore options | MEDIUM | Update a `<p>` element on the `input` event (fires during drag) not `change` (fires only on release). Descriptions defined in `config.js` per option. |
| Slider announces human-readable value to screen readers | `aria-valuenow` alone announces a raw number. Screen reader users need the same descriptive context sighted users see. | LOW | Set `aria-valuetext` dynamically on every `input` event. Value: the node's short label (e.g., "Digital only" or "$30,000 — standard budget"). W3C WAI APG slider pattern requires this for non-numeric or contextually enriched values. |
| Keyboard operability (arrow keys, Page Up/Down) | WCAG 2.1 AA requirement; `<input type="range">` has full native keyboard support | LOW | Native browser behavior for `<input type="range">`. Left/right arrow: step by 1 increment. Same `input` event fires for keyboard navigation — description and aria-valuetext update automatically. |
| Dollar value of selected node is visible | Standard affordance — users need to see the dollar amount they're selecting | LOW | Display above or below slider track, updating on `input` event. Can be part of the description or a standalone label. |
| URL encodes slider value and restores it | Existing URL shareability (url.js) must continue working without breaking shared links | MEDIUM | `url.js` reads `document.getElementById('collections').value`. `<input type="range">` has `.value` too — same string-integer API. URL param format unchanged (`collections=30000`). Only change: validation logic must replace `Array.from(select.options)` with config-data check. |
| Tax calculator reads slider value correctly | `calculator.js` uses `parseInt(element.value, 10)` from the collections element | LOW | `<input type="range">` returns `.value` as a string integer, identical to `<select>`. `parseInt` works unchanged. Zero code changes to calculator.js if element `id="collections"` is preserved. |
| "Hours Open" section heading | Users have no frame of reference for "1 FTE + 2 PTE". "Hours Open" is immediately meaningful to any citizen. | LOW | Template change only: update `<legend>` text. Internal config `id` and `annualCost` values are unchanged. |
| Structured weekly schedule renders per staffing level | Users expect actual days and times, not internal staffing jargon or generic descriptions. Real library sites uniformly display "M–F 10–6, Sat 10–4" style. | MEDIUM | Add `schedule` array to each `staffingLevels` entry in `config.js`. Nunjucks template loops over the array and renders human-readable text. No new JS required. |
| Schedule format matches civic convention | Livermore, Torrance, Chula Vista libraries all use abbreviated day ranges with 12-hour times. Deviating creates friction for general public. | LOW | "M–F 12–4pm & Sat 10am–2pm" format. Consistent with every U.S. civic library site observed. |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Lowest slider node = digital-only with named services | Makes the floor option concrete. Citizens recognize "Beehive" and "Libby" — not "$10k digital budget". Anchors the bottom of the range in reality. | LOW | Single config entry with `label: "Digital only"` and `description: "Beehive and Libby digital services — no physical collection."`. Template can conditionally style this node distinctly if desired. |
| Description changes during drag, not on release | Real-time contextual feedback while exploring. If description only updated on `change` (release), keyboard users would still get it but mouse drag would lag. Consistent live feedback builds confidence. | LOW | `input` event fires during both drag and keyboard navigation. Use `input` for description + aria-valuetext updates. Calculator.js already uses `change`; add `input` listener on form OR rely on `input` event bubbling (it does bubble from range input through form). |
| Schedule data entirely in config.js, non-developer editable | Site maintainer (city council member, civic tech advocate) can update hours as the library's operational plans evolve — no template edits needed. Consistent with existing NON-DEVELOPER EDIT GUIDE pattern. | LOW | Structured array with `{ days, open, close }` objects. Plain-language instructions added to EDIT GUIDE. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Continuous (arbitrary-value) slider | "More flexible budget exploration" | 6 discrete values are the real budget options. Arbitrary values break the cost model — `annualCost` is defined per option, not interpolated. Free-form inputs also invite confusion about which values are "real choices". | `step` attribute forces discrete snapping. `datalist` can add visual tick marks if desired. |
| Custom-styled slider track/thumb | Better visual polish | Cross-browser slider CSS requires vendor-prefixed pseudo-elements (`::-webkit-slider-thumb`, `::-moz-range-thumb`). High maintenance surface. Custom styles can break or visually confuse native accessibility affordances (focus ring, thumb size). | Use `accent-blue-600` (already in use for radio/checkbox) — applies to native range thumb in modern browsers with zero complexity. Keep native browser rendering. |
| Debounce slider `input` event for URL updates | "Prevent URL thrash during drag" | With only 6 discrete nodes, slider fires at most 5 distinct `input` events during a full drag sweep. `history.replaceState` is cheap. Debouncing adds complexity for zero measurable benefit at this scale. | No debounce. Fire on every node change. |
| Keep dropdown alongside slider as fallback | "Some users prefer the dropdown" | Doubles the UI surface. Removes the UX clarity goal of the milestone. The slider IS the intended UX — the dropdown was the placeholder. | Remove `<select>` entirely. The slider is more accessible for this use case (visible current position, keyboard increments, contextual labels). |
| 24-hour time format in schedule ("16:00") | "Technically unambiguous" | No U.S. civic library website uses 24-hour format. General public audience — most citizens parse "4pm" faster than "16:00". Creates unnecessary friction. | 12-hour format. Omit am/pm for clearly daytime blocks where context is unambiguous (e.g., "10–4") or include consistently. Spell out noon/midnight for those boundary cases. |
| Animated number or schedule transition on slide | "Feels more dynamic" | Motion can trigger vestibular disorders (WCAG 2.3.3). Delays the user reaching the correct information. Adds JS/CSS complexity for no comprehension benefit. | Instant DOM update. Already the pattern in v1.0 calculator. |

---

## Feature Dependencies

```
Collections slider
    └──replaces──> Collections <select id="collections"> (DOM element removed)
    └──requires──> config.js options have per-node label + description fields
    └──must preserve──> id="collections" on new <input type="range">
    └──must preserve──> .value API (string integer) — used by url.js and calculator.js
    └──requires (url.js change)──> replace Array.from(select.options) validation
                                   with config-data-driven validation
    └──requires (new listener)──> input event handler for description text + aria-valuetext

Hours Open schedule display
    └──requires──> config.js staffingLevels entries gain schedule[] array
    └──enhances──> Existing staffing radio buttons (radio inputs unchanged)
    └──no conflict with──> URL encoding (staffing param reads radio name="staffing")
    └──no conflict with──> Tax calculation (data-cost on radio inputs unchanged)
    └──template-only change──> no new JS
```

### Dependency Notes

- **id="collections" must be preserved:** Both `url.js` (`document.getElementById('collections')`) and `calculator.js` (same) rely on this id. Keeping it on the new `<input type="range">` means zero changes to either script's element reference.
- **`.value` API is identical:** `<input type="range">` returns `.value` as a string integer, same as `<select>`. `parseInt(element.value, 10)` in calculator.js works unchanged. `params.set('collections', element.value)` in url.js works unchanged.
- **url.js validation is the one required change:** Current code iterates `select.options` to build a list of valid values. Replace with `data.collections.options.map(o => String(o.value))` using `window.LIBRARY_DATA` (already available). One line change.
- **calculator.js needs input event coverage:** `calculator.js` listens for `change` on the form. For `<input type="range">`, `change` fires on release but not during drag. Add `form.addEventListener('input', updateResult)` to cover live drag. This is additive — existing radio/checkbox inputs only emit `change`, so no double-firing occurs.
- **Schedule display has zero JS dependencies:** Adding `schedule[]` to config.js and rendering it in the Nunjucks template has no impact on calculator.js, url.js, or any event handling. Pure data + template change.

---

## MVP Definition

### Launch With (v1.1)

- [ ] Replace `<select id="collections">` with `<input type="range" id="collections" min step max>` — preserves id, preserves .value API
- [ ] Per-node `label` and `description` fields added to `config.js` collections options
- [ ] Description text `<p>` element updates on `input` event (via new inline script or additions to existing JS)
- [ ] `aria-valuetext` updated dynamically on `input` event to match node label
- [ ] Lowest node ($10k) description explicitly names Beehive and Libby services
- [ ] `form.addEventListener('input', updateResult)` added to calculator.js (or equivalent) for live drag recalculation
- [ ] url.js validation updated: replace `.options` iteration with `window.LIBRARY_DATA.collections.options` check
- [ ] `schedule[]` array added to each `staffingLevels` entry in `config.js`
- [ ] Nunjucks template renders schedule as human-readable text (no new JS)
- [ ] Section heading changed from "Staffing Level" to "Hours Open"

### Add After Validation (v1.x)

- [ ] Tick marks below slider (via `<datalist>` + `list` attribute + CSS labels) — adds visual node indicators; browser tick rendering is inconsistent across platforms so defer until core UX is validated
- [ ] Dollar value prominently displayed above slider thumb as a separate element — description text already contextualizes the value, but an explicit "$30,000" label above the thumb is cleaner

### Future Consideration (v2+)

- [ ] Animated schedule transition when staffing level changes — not warranted for a static civic info tool; instant update is more accessible

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Collections slider replacing dropdown | HIGH | LOW | P1 |
| Per-node description text (live update) | HIGH | LOW | P1 |
| aria-valuetext dynamic update | HIGH | LOW | P1 |
| Lowest node = digital-only (Beehive/Libby) | HIGH | LOW | P1 |
| "Hours Open" section heading | HIGH | LOW | P1 |
| schedule[] in config.js + template render | HIGH | LOW | P1 |
| url.js validation fix for slider | HIGH — breaks sharing if omitted | LOW | P1 |
| calculator.js input event coverage | HIGH — live drag does not recalculate otherwise | LOW | P1 |
| Tick marks / datalist labels | MEDIUM | MEDIUM | P2 |
| Dollar amount label above thumb | MEDIUM | LOW | P2 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add when capacity allows
- P3: Nice to have, future consideration

---

## Implementation Reference

### Slider Event Strategy

Use `input` event for:
- Updating visible description `<p>` text
- Updating `aria-valuetext`
- Triggering tax recalculation (add `form.addEventListener('input', updateResult)` to calculator.js)

`change` event continues to fire on keyboard commit and mouse release — keep existing `change` listener. `input` listener is additive and handles drag. Both bubble from `<input type="range">` through the form element.

### url.js Validation: One-Line Change

Current (select-specific):
```js
var validValues = Array.from(select.options).map(function (o) { return o.value; });
```
Replace with:
```js
var validValues = data.collections.options.map(function (o) { return String(o.value); });
```
`window.LIBRARY_DATA` (aliased to `data` in url.js) is already set before scripts run. No other changes to url.js needed.

### config.js Collections Options Shape (Recommended)

```js
{ value: 10000, isDefault: false, label: "Digital only",       description: "Beehive and Libby digital services only — no physical collection." }
{ value: 20000, isDefault: false, label: "Very limited",       description: "Roughly 200 new physical items per year." }
{ value: 30000, isDefault: true,  label: "Standard",           description: "Current collections budget — about 300 new items per year." }
{ value: 40000, isDefault: false, label: "Enhanced",           description: "About 400 new items plus expanded digital titles." }
{ value: 50000, isDefault: false, label: "Robust",             description: "About 500 new items with strong digital and periodical coverage." }
{ value: 60000, isDefault: false, label: "Full service",       description: "Maximum collections investment — about 600 new items per year." }
```

`label` feeds `aria-valuetext`. `description` feeds the visible paragraph. Both should be non-technical plain language — these are the citizen-facing texts.

### config.js Schedule Shape (Recommended)

Single-block example:
```js
schedule: [
  { days: "M–F", open: "12pm", close: "4pm" }
]
```
Multi-block example (non-contiguous days or different hours):
```js
schedule: [
  { days: "M–F", open: "12pm", close: "4pm" },
  { days: "Sat", open: "10am", close: "2pm" }
]
```
Template renders as: "M–F 12–4pm & Sat 10am–2pm"

Instructions for this shape must be added to the NON-DEVELOPER EDIT GUIDE in config.js.

---

## Sources

- [ARIA: aria-valuetext attribute — MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext) — HIGH confidence; canonical reference for screen reader value announcement
- [Slider Pattern — W3C WAI ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) — HIGH confidence; official keyboard interaction and ARIA requirements
- [Communicating Value and Limits for Range Widgets — W3C WAI APG](https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/) — HIGH confidence; guidance on aria-valuenow vs aria-valuetext
- [Range Slider — U.S. Web Design System (USWDS)](https://designsystem.digital.gov/components/range-slider/) — HIGH confidence; federal civic design system, authoritative for government-adjacent UX
- [onchange vs. oninput for Range Sliders — Impressive Webs](https://www.impressivewebs.com/onchange-vs-oninput-for-range-sliders/) — MEDIUM confidence; corroborated by MDN event model docs
- [Designing The Perfect Slider UX — Smashing Magazine](https://www.smashingmagazine.com/2017/07/designing-perfect-slider/) — MEDIUM confidence; 2017 but UX fundamentals unchanged for discrete-value sliders
- Real library hours display patterns observed: Livermore CA, Torrance CA, Chula Vista CA civic library sites — MEDIUM confidence; confirms civic convention for day/time format
- Codebase inspection: `src/js/url.js`, `src/js/calculator.js`, `src/_data/config.js`, `src/index.html` — HIGH confidence; direct source of truth for dependency analysis

---

## v1.0 Feature Landscape (Reference)

*Original research from 2026-03-20. Preserved for historical context. All items below are validated and shipped.*

### Table Stakes (v1.0)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Real-time calculation display | Instant feedback as inputs change | LOW | Pure JS math on every input event |
| Single authoritative output number prominently displayed | Citizens came for "what does this cost me" | LOW | Large type, above fold on mobile |
| Labeled controls with clear descriptive text | Civic audiences are not specialists | LOW | Label wired to input; explanatory `<p>` beneath |
| Mobile-responsive layout with adequate touch targets | Majority of civic web traffic is mobile | LOW-MEDIUM | Tailwind; min 44x44px per WCAG 2.5.5 |
| WCAG 2.1 AA accessibility | Government-adjacent; screen reader + keyboard users | MEDIUM | Semantic HTML, aria-live on result region |
| Source/methodology transparency | Citizens distrust numbers without provenance | LOW | Static copy block with source links |
| Correct and consistent arithmetic | Errors destroy civic credibility | LOW | total cost / total households |

### Differentiators (v1.0)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Shareable URL with full state encoded | Citizens email their scenario to neighbors or council members | LOW-MEDIUM | URLSearchParams + history.replaceState |
| Visible cost breakdown alongside total | Shows where money goes; increases buy-in | LOW | Staffing + collections subtotals displayed |
| Clear "no cities selected" edge-case handling | Division by zero protection; signals thoughtful design | LOW | Guard clause in calculation |

### Anti-Features (v1.0)

| Feature | Why Avoided | Alternative |
|---------|-------------|-------------|
| User accounts / saved scenarios | Backend/auth out of scope for static site | Shareable URL covers this |
| Per-city property tax rate display | False precision without parcel-level data | Annual cost per household (verified average) |
| Animated number output | Motion disorders; adds delay | Instant update |
| Real-time data sync | Network dependency; failure mode | Local config.js; manual update |

---

*Feature research for: Cache County Library Choices v1.1 — citizen-meaningful UX controls*
*Researched: 2026-03-21*
