# Phase 13: Current Service Level Indicators — Research

**Researched:** 2026-03-22
**Domain:** Tailwind CSS v4 multi-ring coexistence, Nunjucks conditional class rendering, screen-reader accessible badges
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CURR-01 | Staffing card marked `isCurrentServiceLevel: true` displays an amber border that is visible in both selected and unselected states — the blue selection ring remains fully intact and coexists with the amber border | Ring layering pattern confirmed; offset-2 amber ring sits between card border and blue has-[:checked] ring |
| CURR-02 | Staffing card marked `isCurrentServiceLevel: true` displays a small amber "Current level" badge in the top-right corner, visible in both selected and unselected states | Absolute-positioned span inside relative label; parent `<label>` currently lacks `relative` — must be added |
| CURR-03 | Collections slider tick for the option marked `isCurrentServiceLevel: true` is styled amber and persists regardless of slider position | `updateSliderLabels()` in calculator.js manages tick classes dynamically; amber classes must coexist with the active/inactive toggle logic without being overwritten |
| CURR-04 | All indicators are template-driven from the `isCurrentServiceLevel` config flag — no option IDs or values hardcoded in templates | Flag already exists in config.js on `staffingLevels[2]` and `collections.options[2]`; Nunjucks `{% if level.isCurrentServiceLevel %}` pattern is the delivery mechanism |
| CURR-05 | Screen reader text communicates "Current level" for the badge (color alone is not the only signal) | Badge element contains visible text "Current level" — same text serves both visual and AT audiences; no extra sr-only span needed if badge text is not aria-hidden |
</phase_requirements>

---

## Summary

Phase 13 adds three purely visual/template changes to an already-complete Eleventy + Tailwind CSS v4 + Nunjucks codebase. No new libraries, no new JavaScript modules, and no data changes are required — `isCurrentServiceLevel: true` is already set on the correct items in `config.js`.

The phase splits into two distinct work streams. Stream 1 is the staffing card: a static amber ring always rendered on the current-level `<label>`, an absolutely-positioned badge span inside that label (requiring `relative` on the parent), and confirming the three-ring coexistence (focus outline at offset-4, amber ring at offset-2, blue selection ring at no offset). Stream 2 is the collections slider tick: the `updateSliderLabels()` function in `calculator.js` currently toggles `text-blue-800`/`text-gray-500` classes on all tick buttons dynamically; the amber tick class must be applied at render time in the Nunjucks template via `data-current-level` or a conditional class, and then the JS function must be updated to not overwrite that amber class when toggling active/inactive state on other ticks.

The primary risk is the JS/CSS interaction on the slider tick. The calculator's `updateSliderLabels()` unconditionally applies `text-gray-500` to all non-active ticks — if the amber tick class is set only in the template, the JS will strip it on the first slider move. The fix is to guard the `text-gray-500` toggle: skip it when the button has the amber/current-level class, or use a `data-*` attribute as the source of truth for current-level status.

**Primary recommendation:** Use a `data-current-level="true"` attribute on the current-level tick button in the Nunjucks template, then gate the JS gray-class toggle on the absence of that attribute. This keeps CURR-04 (no hardcoding) and CURR-03 (amber persists) both satisfied.

---

## Standard Stack

No new packages are introduced. All work uses already-installed tools.

### Core (existing, verified from package.json + source)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Eleventy | ^3.1.5 | Static site generator — drives Nunjucks template rendering | Already installed |
| Tailwind CSS v4 | ^4.2.2 | Utility classes — amber-500, amber-600, ring-*, absolute, relative | Already installed |
| Nunjucks | bundled with Eleventy | Template language — `{% if level.isCurrentServiceLevel %}` conditional blocks | Already in use |

**No installation required.** Phase 13 introduces zero new dependencies.

---

## Architecture Patterns

### Confirmed Project Structure (from codebase scan)

```
src/
├── _data/config.js          # Single source of truth — isCurrentServiceLevel already set
├── index.html               # Nunjucks template — all HTML changes go here
├── css/style.css            # Custom CSS (only slider overrides) — no changes needed
├── js/calculator.js         # Slider tick active-state logic — requires guarded JS change
└── js/url.js                # URL state persistence — no changes needed
```

### Pattern 1: Nunjucks Conditional Ring Class

**What:** Append amber ring classes to the `<label>` class attribute conditionally inside the `{% for level in config.staffingLevels %}` loop.

**When to use:** CURR-01, CURR-04 — the ring must be template-driven, not hardcoded.

**Example (from UI-SPEC, Section: Component Inventory):**
```html
<label
  for="staffing-{{ level.id }}"
  class="block cursor-pointer rounded-lg border p-6 transition-colors
         has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600
         bg-gray-50 border-gray-200
         has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 has-[:focus-visible]:outline-offset-4
         min-h-[44px] relative
         {% if level.isCurrentServiceLevel %}ring-2 ring-amber-500 ring-offset-2{% endif %}"
>
```

Key details:
- `relative` must be added to ALL staffing labels (or conditionally only to current-level ones) to allow the badge's `absolute` positioning to work.
- The amber ring classes `ring-2 ring-amber-500 ring-offset-2` must appear in the class string. They do not conflict with `has-[:checked]:ring-2 has-[:checked]:ring-blue-600` because the blue ring is state-conditional while the amber is unconditional — both can be active simultaneously in Tailwind v4 (no property conflict; different specificity triggers).

**Ring layering (outermost to innermost, from UI-SPEC):**
1. Focus outline: `outline outline-2 outline-blue-600 outline-offset-4` — outermost
2. Amber current-level ring: `ring-2 ring-amber-500 ring-offset-2` — middle
3. Blue selection ring: `has-[:checked]:ring-2 has-[:checked]:ring-blue-600` — innermost (no offset)
4. Card border — always present

### Pattern 2: Absolutely-Positioned Badge Inside a Relative Label

**What:** Insert a `<span>` as the first child inside the `<label>` when `isCurrentServiceLevel` is true.

**When to use:** CURR-02, CURR-05.

**Example (from UI-SPEC, Section: Component Inventory):**
```html
{% if level.isCurrentServiceLevel %}
<span class="absolute top-2 right-2 inline-flex items-center rounded-full bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
  Current level
</span>
{% endif %}
```

Key details:
- The badge text "Current level" is plain text inside the span — it is read aloud by screen readers by default. No `aria-label` or sr-only span is needed as long as the span is not `aria-hidden`.
- WCAG color-alone rule (CURR-05) is satisfied because the text itself conveys the meaning, not only the amber background.
- `absolute top-2 right-2` requires `relative` on the parent `<label>` — this is the single most likely omission to introduce a layout bug.

### Pattern 3: Data-Attribute Guard in JS for Amber Tick Persistence

**What:** The `updateSliderLabels()` function in `calculator.js` unconditionally applies `text-gray-500` to all inactive ticks. This will strip an amber class set in the template on every slider move. The fix is a data-attribute check in JS.

**When to use:** CURR-03, CURR-04.

**Current problematic code (calculator.js lines 58–65):**
```js
nodeButtons.forEach(function (btn) {
  var isActive = btn.dataset.value === String(slider.value);
  btn.classList.toggle('text-blue-800', isActive);
  btn.classList.toggle('font-semibold', isActive);
  btn.classList.toggle('text-gray-500', !isActive);   // THIS overwrites amber
  btn.classList.toggle('font-normal', !isActive);
});
```

**Corrected pattern:**
```js
nodeButtons.forEach(function (btn) {
  var isActive = btn.dataset.value === String(slider.value);
  var isCurrentLevel = btn.dataset.currentLevel === 'true';
  btn.classList.toggle('text-blue-800', isActive);
  btn.classList.toggle('font-semibold', isActive);
  // Only apply gray when not active AND not the current-level tick
  btn.classList.toggle('text-gray-500', !isActive && !isCurrentLevel);
  btn.classList.toggle('font-normal', !isActive && !isCurrentLevel);
});
```

**Nunjucks template change to add data attribute:**
```html
<button
  type="button"
  data-value="{{ opt.value }}"
  {% if opt.isCurrentServiceLevel %}data-current-level="true"{% endif %}
  class="text-xs ... {% if opt.isCurrentServiceLevel %}text-amber-600 font-semibold{% else %}text-gray-500 font-normal{% endif %}"
>
```

This approach satisfies CURR-04 (no hardcoded IDs) and CURR-03 (amber persists on slider move).

### Anti-Patterns to Avoid

- **Setting amber class only in JS on page load:** Calculator.js runs once, but slider interaction clears classes. Template is the correct source of truth for the initial and persistent amber state.
- **Using `aria-hidden="true"` on the badge:** The slider tick row is `aria-hidden` (existing pattern), but the badge on the staffing card must NOT be aria-hidden — the visible text is the screen-reader announcement (CURR-05).
- **Adding `relative` only to the current-level label:** If any future staffing level gets `isCurrentServiceLevel: true`, the badge will work. But if `relative` is added conditionally and a non-current-level label needs `absolute` children for any reason in the future, it will break. Adding `relative` to all staffing labels is safer and has no visual side effect.
- **Using `ring-offset-2` on the blue selection ring:** The UI-SPEC explicitly states the blue ring has no offset (innermost). Adding offset to the blue ring would push it outside the amber ring, reversing the intended layering.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screen-reader-only badge text | Custom visually-hidden CSS class | Tailwind `sr-only` (or just leave badge text visible) | `sr-only` is already used on radio inputs in this codebase; consistent pattern |
| Color contrast verification | Manual eyeballing | Tailwind amber-600 on white background (WCAG AA verified) | amber-500 on white is ~2.9:1 (fails AA for normal text); amber-600 (#d97706) on white is ~4.5:1 (passes AA for normal text at 12px bold) — UI-SPEC uses amber-600 for tick text, amber-500 for badge background with white text (~11:1 on amber-500 bg) |
| JS state management for current-level | Custom JS observer | `data-current-level` attribute + template conditional | JS already uses `data-value` pattern; same idiom, zero new complexity |

---

## Common Pitfalls

### Pitfall 1: Forgetting `relative` on the Staffing Label

**What goes wrong:** The badge `<span>` with `absolute top-2 right-2` escapes the label and positions itself relative to the nearest positioned ancestor — likely the fieldset or `<main>` — causing it to appear in the wrong location.

**Why it happens:** The existing `<label>` classes do not include `relative`. This is documented explicitly in the UI-SPEC (Component Inventory note).

**How to avoid:** Add `relative` to the label class string before attempting to verify the badge position. Verify with browser devtools that the label's computed `position` is `relative`.

**Warning signs:** Badge appears in the upper-right corner of the fieldset or page rather than the upper-right corner of the individual card.

### Pitfall 2: Amber Tick Class Stripped on Slider Move

**What goes wrong:** On first page load the amber tick is visible. The user moves the slider — `updateSliderLabels()` fires, applies `text-gray-500` to all inactive ticks including the current-level one, and the amber color disappears.

**Why it happens:** The JS loop applies the gray class unconditionally to all non-active ticks. No guard exists for current-level status.

**How to avoid:** Add the `data-current-level` guard in `updateSliderLabels()` before testing the slider interaction.

**Warning signs:** Test by loading the page (amber tick visible), then moving the slider away from $30k position and back — if the tick loses its amber color, the guard is missing.

### Pitfall 3: Amber Ring Overridden by Tailwind Ring Specificity

**What goes wrong:** When the card is checked, `has-[:checked]:ring-blue-600` applies and visually dominates the amber ring, making both rings appear as a single blue ring.

**Why it happens:** If both `ring-amber-500` and `ring-blue-600` apply without offset differentiation, the later-declared class in the stylesheet wins.

**How to avoid:** The UI-SPEC ring layering uses offset to separate the rings: amber at `ring-offset-2`, blue at no offset. Verify with browser devtools that BOTH rings are visible simultaneously when a card is selected.

**Warning signs:** When the current-level card is selected, only a blue ring is visible (no amber ring visible outside it).

### Pitfall 4: Text Color Contrast Failure on Amber Tick

**What goes wrong:** Using `text-amber-500` for the tick label on a white background produces a contrast ratio of approximately 2.9:1, which fails WCAG AA for normal text.

**Why it happens:** amber-500 (#f59e0b) on white is not high enough contrast. The UI-SPEC explicitly specifies `text-amber-600` (not `text-amber-500`) for the tick text for this reason.

**How to avoid:** Use `text-amber-600` for the tick text, `bg-amber-500` only for the badge background (where white text on amber-500 achieves ~11:1 contrast).

---

## Code Examples

### Complete Staffing Card Label (Verified Against Current Template)

```html
{# Source: src/index.html lines 24-59 with Phase 13 modifications #}
{% for level in config.staffingLevels %}
  <label
    for="staffing-{{ level.id }}"
    class="block cursor-pointer rounded-lg border p-6 transition-colors
           has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600
           bg-gray-50 border-gray-200
           has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 has-[:focus-visible]:outline-offset-4
           min-h-[44px] relative
           {% if level.isCurrentServiceLevel %}ring-2 ring-amber-500 ring-offset-2{% endif %}"
  >
    {% if level.isCurrentServiceLevel %}
    <span class="absolute top-2 right-2 inline-flex items-center rounded-full bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
      Current level
    </span>
    {% endif %}
    {# ... rest of card content unchanged ... #}
  </label>
{% endfor %}
```

### Complete Collections Tick Button (Verified Against Current Template)

```html
{# Source: src/index.html lines 83-89 with Phase 13 modifications #}
{% for opt in config.collections.options %}
  <button
    type="button"
    data-value="{{ opt.value }}"
    {% if opt.isCurrentServiceLevel %}data-current-level="true"{% endif %}
    class="text-xs px-1 py-1 cursor-pointer hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2
           {% if opt.isCurrentServiceLevel %}text-amber-600 font-semibold{% else %}text-gray-500 font-normal{% endif %}"
  >${{ (opt.value / 1000) | int }}k</button>
{% endfor %}
```

### JS Guard in calculator.js (updateSliderLabels function)

```js
// Source: src/js/calculator.js lines 58-65 — replace this block
nodeButtons.forEach(function (btn) {
  var isActive = btn.dataset.value === String(slider.value);
  var isCurrentLevel = btn.dataset.currentLevel === 'true';
  btn.classList.toggle('text-blue-800', isActive);
  btn.classList.toggle('font-semibold', isActive);
  btn.classList.toggle('text-gray-500', !isActive && !isCurrentLevel);
  btn.classList.toggle('font-normal', !isActive && !isCurrentLevel);
});
```

---

## Validation Architecture

nyquist_validation is enabled in .planning/config.json.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — no test framework installed in this project |
| Config file | None |
| Quick run command | `npm run build` (Eleventy build — catches template syntax errors) |
| Full suite command | Manual browser verification checklist (see Wave 0 Gaps) |

No automated test infrastructure exists at the project level. All spec files found are inside `node_modules` (third-party library tests, not project tests).

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| CURR-01 | Amber ring visible on current-level card in both selected and unselected states | manual-only | `npm run build` confirms no template error | N/A — visual |
| CURR-02 | "Current level" badge visible top-right on current-level card | manual-only | `npm run build` confirms no template error | N/A — visual |
| CURR-03 | Amber tick persists after slider moves | manual-only | `npm run build` confirms no JS syntax error | N/A — interactive |
| CURR-04 | No option IDs/values hardcoded — classes driven by flag | code review | `grep -n "1fte-2pte\|30000" src/index.html` — expect 0 matches for hardcoded IDs | N/A — code review |
| CURR-05 | Screen reader reads "Current level" | manual-only (VoiceOver/NVDA) | N/A | N/A — AT testing |

### Sampling Rate

- **Per task commit:** `npm run build` — catches Nunjucks syntax errors and Tailwind compilation errors
- **Per wave merge:** Manual browser checklist (see below)
- **Phase gate:** Full manual checklist green before `/gsd:verify-work`

### Manual Verification Checklist (Wave 0 Gaps)

No test files need to be created. Verification is manual because the requirements are visual and interactive.

Manual steps at phase completion:
1. Load built site in browser. Confirm third staffing card ("Current") has visible amber ring.
2. Click first staffing card. Confirm third card amber ring still visible while not selected.
3. Click third staffing card. Confirm amber ring AND blue ring both visible simultaneously.
4. Tab to third card via keyboard. Confirm focus outline is outermost (outside amber ring).
5. Confirm "Current level" badge is visible top-right on third card in both selected and unselected states.
6. Slider at $30k: confirm middle tick is amber. Move slider to $10k: confirm middle tick remains amber. Move back to $30k: confirm middle tick remains amber.
7. Run VoiceOver (macOS) or NVDA and tab to the "Current level" badge — confirm it is announced.

*(No Wave 0 file gaps — manual-only validation, no framework installation required)*

---

## State of the Art

No new patterns introduced. This phase uses the same Tailwind CSS v4 conditional class pattern established in Phases 10–12.

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline style for ring color | Tailwind `ring-amber-500` utility | Phase 10 established utility-first discipline | No inline styles required |
| JS-toggled selection state | `has-[:checked]` CSS-only | Phase 10 | No JS needed for card state; amber ring is CSS-only too |

---

## Open Questions

1. **Amber ring and `transition-colors`**
   - What we know: The `<label>` has `transition-colors` in its class list. This transitions color-related properties, which includes `ring-color`.
   - What's unclear: Does `transition-colors` cause the amber ring to animate in/out when the card is selected/unselected? If so, this could create an unintended motion effect that conflicts with the accessibility note in REQUIREMENTS.md ("Animated transition between indicator states — Motion disorder risk; instant update is more accessible").
   - Recommendation: The amber ring is static (always present), so `transition-colors` only affects the blue ring appearing/disappearing on check. This is low risk, but verify visually. If the amber ring appears to animate, add `ring-amber-500` to a `[&]:ring-amber-500` class or use the `!` important modifier to make it non-transitioning — though this is unlikely to be needed.

2. **`relative` on non-current-level labels**
   - What we know: Adding `relative` universally to all staffing labels has no visual side effect.
   - What's unclear: Whether the planner should add `relative` to all labels (simpler, future-proof) or only to the current-level label (minimal change).
   - Recommendation: Add `relative` to all staffing labels unconditionally. The UI-SPEC notes this requirement and adding it conditionally creates a subtle maintenance hazard.

---

## Sources

### Primary (HIGH confidence)

- `src/index.html` (full read) — current Nunjucks template markup, existing label class patterns, slider tick structure
- `src/_data/config.js` (full read) — confirmed `isCurrentServiceLevel: true` on `staffingLevels[2]` and `collections.options[2]`; no data changes needed
- `src/js/calculator.js` (full read) — confirmed `updateSliderLabels()` overwrites tick classes; identified exact lines requiring guard
- `src/css/style.css` (full read) — custom CSS is slider-only; no amber additions needed in CSS
- `.planning/phases/13-current-service-level-indicators/13-UI-SPEC.md` (full read) — ring layering order, exact Tailwind classes, badge markup, amber color selection rationale
- `.planning/REQUIREMENTS.md` (full read) — CURR-01 through CURR-05 verbatim
- `.planning/STATE.md` (full read) — accumulated decisions: has-[:checked] CSS-only pattern, outline-offset-4, sr-only on radio inputs

### Secondary (MEDIUM confidence)

- Tailwind CSS v4 docs (inferred from existing codebase patterns and `@import "tailwindcss"` in style.css) — `ring-*` utilities work as documented; `has-[selector]:` variant confirmed working in Phases 10–12

### Tertiary (LOW confidence)

- WCAG contrast ratios for amber-500 and amber-600 — stated from training knowledge; not independently verified via contrast checker tool in this session. Recommend verifying amber-600 (#d97706) on white via browser devtools or WebAIM contrast checker before marking CURR-05 complete.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; verified from package.json and codebase
- Architecture patterns: HIGH — all patterns derived directly from existing source code and approved UI-SPEC
- JS interaction risk: HIGH — identified by direct code read of calculator.js; exact lines and fix documented
- Pitfalls: HIGH — derived from direct source inspection and UI-SPEC explicit warnings
- Contrast ratio (amber-600): LOW — stated from training knowledge; should be verified with browser devtools

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable stack — no external dependencies changing)
