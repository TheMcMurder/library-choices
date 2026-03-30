# Phase 11: Custom City Multi-Select — Research

**Researched:** 2026-03-21
**Domain:** Nunjucks template refactor / Tailwind CSS v4 card UI pattern
**Confidence:** HIGH

---

## Summary

Phase 11 replaces the current city fieldset's inline-checkbox-plus-label pattern with full-width clickable card elements, each showing the city name and household count. The design must match the Phase 10 staffing card pattern exactly. No new libraries, no JavaScript changes, no data schema changes are required.

The implementation is purely a Nunjucks template edit in `src/index.html` (the cities fieldset loop). The existing `calculator.js`, `url.js`, `_data/config.js`, and CSS files are untouched. All interactivity — selected state, keyboard navigation, URL encoding, zero-city guard, and per-city cost calculation — already works correctly through form-level event delegation that reads `input[name="cities"]:checked` and `cb.dataset.households`.

A fully-detailed UI contract already exists in `11-UI-SPEC.md` (status: draft, awaiting sign-off). The spec was produced from direct codebase inspection and is HIGH confidence. Research confirms that spec is accurate and complete for planning purposes.

**Primary recommendation:** One plan, one task — swap the cities fieldset loop from inline checkbox pattern to label-wrapping-checkbox card pattern, following the exact markup in the UI-SPEC. No other files change.

---

## Standard Stack

### Core (no changes from existing project)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Eleventy | v3 (existing) | Static site generator; Nunjucks template engine | Established project stack |
| Tailwind CSS | v4 (existing) | Utility classes for card UI | Established project stack |
| Vanilla JS | ES5 IIFE pattern | Already handles all interactivity | No bundler; pattern locked |

### Supporting

No new packages. No installation step required.

---

## Architecture Patterns

### Card Pattern (from Phase 10 — direct reuse)

The staffing card pattern established in Phase 10 is the authoritative reference. The city cards are a checkbox variant of the same `<label>` wrapping approach.

**Key structural difference from current city markup:**

Current pattern (before):
- `<div class="flex flex-col gap-2">` container
- Separate `<input type="checkbox">` with `accent-blue-600` visible styling
- Separate `<label>` element beside input
- `<cite>` below the div

Target pattern (after):
- `<label>` wrapper IS the card — entire surface is click target
- `<input type="checkbox" class="sr-only">` hidden inside the label
- `has-[:checked]` CSS selector drives selected visual state
- City name, population, and citation all inside the label

### Nunjucks Template Structure

The cities fieldset loop in `src/index.html` (lines 97–118) is the only edit target:

```nunjucks
{# --- Participating Cities --- #}
<fieldset class="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
  <legend class="text-xl font-semibold text-gray-900 px-1">Participating Cities</legend>
  {% for city in config.cities %}
    <label
      for="city-{{ city.id }}"
      class="block cursor-pointer rounded-lg border p-6 transition-colors
             has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600
             bg-gray-50 border-gray-200
             has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600
             min-h-[44px]"
    >
      <input
        type="checkbox"
        name="cities"
        id="city-{{ city.id }}"
        value="{{ city.id }}"
        data-households="{{ city.households }}"
        class="sr-only"
        {% if city.defaultChecked %}checked{% endif %}
      />
      <span class="text-base font-semibold text-gray-900">{{ city.label }}</span>
      <p class="text-sm text-gray-500 mt-1">{{ city.households | toLocaleString }} households</p>
      <cite class="text-sm text-gray-500 not-italic mt-1 block">
        {%- if city.sourceLink -%}
          Source: <a href="{{ city.sourceLink }}" class="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">{{ city.source }}</a>
        {%- else -%}
          Source: {{ city.source }}
        {%- endif -%}
      </cite>
    </label>
  {% endfor %}
</fieldset>
```

**Source:** `src/index.html` line 21–61 (staffing card pattern), `11-UI-SPEC.md` component anatomy

### Integration Points (read-only — no changes)

| File | Role | Contract preserved how |
|------|------|----------------------|
| `calculator.js` | Reads `input[name="cities"]:checked` + `cb.dataset.households` | Attributes `name`, `value`, `data-households` unchanged |
| `url.js` | Reads `input[name="cities"]:checked` + `cb.value` for phi encoding | Attribute `name` and `value` unchanged |
| `_data/config.js` | Provides `city.id`, `city.label`, `city.households`, `city.defaultChecked`, `city.source`, `city.sourceLink` | No new fields, no schema change |
| `src/css/style.css` | No city-specific CSS exists; `has-[:checked]` is standard Tailwind | No CSS changes |

### Anti-Patterns to Avoid

- **Changing `name="cities"` attribute:** Both `calculator.js` and `url.js` query by this attribute name. Any change breaks all city-related interactivity.
- **Changing `value="{city.id}"` format:** `url.js` verbose fallback path and `calculator.js` both depend on city `id` as the value.
- **Removing `data-households`:** `getTotalHouseholds()` in calculator.js reads `cb.dataset.households`. Omitting this attribute silently zeros out all household counts.
- **Using `type="hidden"` instead of `sr-only`:** Hidden inputs cannot receive focus, breaking keyboard navigation. Pattern locked as `sr-only` from Phase 10.
- **Adding JavaScript for selected state:** Phase 10 established `has-[:checked]` CSS-only as the project convention. No JS class toggling.
- **Using `accent-blue-600` on the checkbox:** The checkbox is `sr-only` and not rendered. `accent-blue-600` has no effect and is incorrect. Do not carry forward from old pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card selected state | JS class toggle on click | `has-[:checked]` CSS selector | Already works; proven in Phase 10 |
| Source link conditional | Custom filter | Nunjucks inline `if`/`else` | Two-line template conditional is sufficient |
| Touch target sizing | Custom min-height logic | `min-h-[44px]` Tailwind class | Direct WCAG requirement; matches Phase 10 |

---

## Common Pitfalls

### Pitfall 1: `defaultChecked` rendering — all four cities start checked

**What goes wrong:** The `{% if city.defaultChecked %}checked{% endif %}` attribute must render into HTML as a bare `checked` attribute on the `<input>`. In Nunjucks, this is a conditional outputting an attribute string — not a boolean.

**Why it happens:** Developers may write `checked="{{ city.defaultChecked }}"` which renders `checked="true"` or `checked="false"`. HTML ignores the attribute value; `checked="false"` still checks the box.

**How to avoid:** Use `{% if city.defaultChecked %}checked{% endif %}` — outputs the bare word `checked` or nothing. This is the pattern already used in the existing markup (line 109) and in the staffing card (line 39).

**Warning signs:** All cities appear checked regardless of `defaultChecked: false` values.

---

### Pitfall 2: `has-[:checked]` initial state

**What goes wrong:** All four cities have `defaultChecked: true` in `config.js`. On initial page load, the cards must visually appear selected (blue ring + blue-50 background). This is driven entirely by CSS — no JavaScript runs to add classes on load.

**Why it happens:** `has-[:checked]` responds to the `checked` HTML attribute present in the rendered markup. As long as `{% if city.defaultChecked %}checked{% endif %}` renders correctly, the initial state is correct.

**How to avoid:** Verify the rendered HTML source shows `checked` attribute present on all four city inputs.

**Warning signs:** Cards appear in unselected (gray) state on first load before any JavaScript runs.

---

### Pitfall 3: `sourceLink` conditional — two cities have links, all four have a source string

**What goes wrong:** All four city objects have `source` (string). All four also have `sourceLink` (URL). If the conditional is written incorrectly — e.g., testing for `city.source` instead of `city.sourceLink` — all citations become links or none do.

**How to avoid:** The conditional must test `city.sourceLink` specifically. If `sourceLink` is present, wrap `city.source` in an `<a>` tag pointing to `city.sourceLink`.

**Config data (HIGH confidence — read from file):**
- Providence: `sourceLink` present
- Nibley: `sourceLink` present
- Millville: `sourceLink` present
- River Heights: `sourceLink` present

All four cities in `config.js` currently have `sourceLink` populated. The conditional branch matters for future city additions where `sourceLink` may be absent.

---

### Pitfall 4: Fieldset `space-y-4` class — gap between cards

**What goes wrong:** The fieldset wrapper already has `space-y-4` which adds `margin-top: 1rem` to all direct children except the first. The `<label>` cards are direct children of the fieldset, so this applies automatically.

**Why it matters:** Do not add extra margin classes to the label elements themselves for card-to-card spacing — `space-y-4` on the fieldset parent handles it.

---

## Code Examples

### Complete city card (target state)

```nunjucks
{# Source: 11-UI-SPEC.md Component Anatomy + src/index.html staffing card pattern #}
<label
  for="city-{{ city.id }}"
  class="block cursor-pointer rounded-lg border p-6 transition-colors
         has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600
         bg-gray-50 border-gray-200
         has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600
         min-h-[44px]"
>
  <input
    type="checkbox"
    name="cities"
    id="city-{{ city.id }}"
    value="{{ city.id }}"
    data-households="{{ city.households }}"
    class="sr-only"
    {% if city.defaultChecked %}checked{% endif %}
  />
  <span class="text-base font-semibold text-gray-900">{{ city.label }}</span>
  <p class="text-sm text-gray-500 mt-1">{{ city.households | toLocaleString }} households</p>
  <cite class="text-sm text-gray-500 not-italic mt-1 block">
    {%- if city.sourceLink -%}
      Source: <a href="{{ city.sourceLink }}" class="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">{{ city.source }}</a>
    {%- else -%}
      Source: {{ city.source }}
    {%- endif -%}
  </cite>
</label>
```

### Fieldset wrapper (unchanged)

```nunjucks
{# Source: src/index.html lines 97-98 #}
<fieldset class="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
  <legend class="text-xl font-semibold text-gray-900 px-1">Participating Cities</legend>
  {# city card loop here #}
</fieldset>
```

### How calculator.js reads city selections (unchanged — for reference)

```javascript
// Source: src/js/calculator.js getTotalHouseholds()
function getTotalHouseholds() {
  return Array.from(form.querySelectorAll('input[name="cities"]:checked'))
    .reduce(function (sum, cb) { return sum + parseInt(cb.dataset.households, 10); }, 0);
}
```

---

## Validation Architecture

Nyquist validation is enabled (`workflow.nyquist_validation: true` in `.planning/config.json`).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — project has no automated test framework |
| Config file | none |
| Quick run command | Manual browser verification |
| Full suite command | Manual browser verification |

No test files exist in this project. This is a static site (Eleventy + vanilla JS) with no test runner configured. All verification is manual browser testing.

### Phase Requirements — Test Map

| Behavior | Test Type | Verification Method |
|----------|-----------|---------------------|
| Each city renders as full-width card | manual | Visual inspection in browser |
| City name (`text-base font-semibold`) displayed | manual | Visual inspection |
| Household count (`text-sm text-gray-500`) displayed | manual | Visual inspection |
| Source citation with link (when `sourceLink` present) | manual | Click citation link, verify navigates |
| All four cities start checked (blue ring on load) | manual | Page load — no interaction — cards show blue ring |
| Clicking anywhere on card toggles checkbox | manual | Click card surface away from text, verify state change |
| Tax result updates when city card toggled | manual | Toggle city, verify result bar updates |
| Keyboard Tab moves focus between cards | manual | Tab through form, verify card focus rings appear |
| Space toggles focused card | manual | Tab to card, press Space, verify toggle |
| Zero-city guard message shows when all unchecked | manual | Uncheck all cities, verify friendly message |
| URL updates with phi param after toggle | manual | Toggle city, check browser URL bar |
| Shared compact URL restores city selections | manual | Copy URL, open new tab, verify cards match |
| Shared legacy verbose URL restores city selections | manual | Craft `?cities=providence,nibley` URL, verify restoration |
| WCAG: 44px minimum touch target on cards | manual | DevTools computed height on label element |

### Wave 0 Gaps

None — no test infrastructure to create. Verification is manual browser testing per project convention.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate input + label elements | Label wraps hidden input | Phase 10 (staffing cards) | Entire card surface is click target; no JS needed |
| `accent-blue-600` visible checkbox | `sr-only` hidden checkbox + `has-[:checked]` CSS | Phase 10 | Full custom styling with CSS-only state management |

---

## Open Questions

None. The UI-SPEC (`11-UI-SPEC.md`) provides a complete, verified markup contract. All integration points are confirmed by reading the source files. The implementation is a single-file template edit.

---

## Sources

### Primary (HIGH confidence)

- `src/index.html` lines 21–61 — Phase 10 staffing card pattern (direct reference implementation)
- `src/index.html` lines 96–118 — current city fieldset markup (before state)
- `src/js/calculator.js` — confirms `input[name="cities"]:checked` + `data-households` contract
- `src/js/url.js` — confirms `input[name="cities"]` name/value contract for phi encoding
- `src/_data/config.js` — confirms city data shape: `id`, `label`, `households`, `defaultChecked`, `source`, `sourceLink`
- `.planning/phases/11-.../11-UI-SPEC.md` — approved design contract with exact target markup
- `.planning/config.json` — confirms `nyquist_validation: true`

### Secondary (MEDIUM confidence)

- MDN Web Docs — `has()` CSS pseudo-class: standard across Chrome 105+, Safari 15.4+, Firefox 121+ (all current — Tailwind v4 `has-[:checked]` syntax already in use in project)

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — reading existing source files
- Architecture: HIGH — UI-SPEC is a direct codebase-derived contract; integration contracts verified by reading JS files
- Pitfalls: HIGH — derived from actual markup analysis and existing Nunjucks patterns in use

**Research date:** 2026-03-21
**Valid until:** Stable — this is pure template/CSS work with no external dependencies that can drift
