# Phase 21: show-your-work-totals - Research

**Researched:** 2026-04-15
**Domain:** Vanilla JS DOM manipulation + Tailwind CSS v4 display layer
**Confidence:** HIGH

## Summary

This is a pure display-layer change to two existing files: `src/js/calculator.js` and `src/index.html`. No new libraries, no new data sources, no new DOM elements. The `updateResult()` function already computes all three cost components (`staffingCost`, `digitalCost`, `physicalCost`, `totalCost`, `perHousehold`) — this phase simply exposes that data in the UI rather than discarding the components after summing them.

The collapsed result bar gains a secondary total line. The existing `#breakdown-detail` popover (already wired to the `ℹ️` toggle) gains a structured accounting-style formula table replacing the current single-line `textContent` write. All styling uses classes already present elsewhere in the project (`bg-blue-900`, `text-white`, `text-sm`, `tabular-nums`).

The UI-SPEC (21-UI-SPEC.md) is already approved and provides the exact HTML structure, Tailwind class names, and copywriting required — the planner should treat it as a fully-specified blueprint, not a suggestion.

**Primary recommendation:** Implement in a single plan targeting only `updateResult()` in `calculator.js`. All HTML structure is injected via `innerHTML` in JS — no changes to `index.html` template markup are required.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Two lines when collapsed: large primary `$X.XX/household/year` + smaller secondary line showing the total cost (e.g., `$126,440 total`). Currently only the per-household line exists — the total line is new.
- **D-02:** Use the existing `breakdown-detail` element and `ℹ️` toggle button — same pattern, bigger content. No new UI elements needed.
- **D-03:** The popover floats above the sticky bar (`bottom-full` positioning, current behavior). Bar does not expand downward.
- **D-04:** Show all 3 cost components always, even if $0 (e.g., Physical at $0). Consistent layout — no conditional hiding.
- **D-05:** Right-aligned dollar amounts, left-aligned labels (accounting style). A horizontal rule separates the addends from the Total row. The division line follows below.
- **D-06:** Use the same labels as the form section headers: Staffing → `Hours Open`, Digital collections → `Digital`, Physical collections → `Physical`. Labels must fit on mobile at 375px alongside right-aligned amounts.

### Claude's Discretion

- Exact typography sizing and spacing within the popover (consistent with existing dark-blue `bg-blue-900 text-white text-sm` style of `breakdown-detail`)
- Whether to use a `<table>` or flex/grid layout for alignment of amounts and labels
- Horizontal rule implementation (`<hr>`, CSS border, or Unicode `─`)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS (ES module) | browser-native | DOM manipulation in `calculator.js` | Already used — no framework overhead |
| Tailwind CSS | v4 (already installed) | Utility classes for layout/color/type | Already the project's only styling tool |
| HTML table element | browser-native | Accounting-column alignment in popover | Used elsewhere in `index.html` (lines 49-64); the UI-SPEC mandates this approach |

### Supporting

No additional libraries. This phase is additive DOM writes inside one function.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `<table>` for column alignment | CSS grid / flex | `<table>` chosen (UI-SPEC, D-05) — most reliable for variable-width number column alignment on mobile; already pattern-matched in codebase |
| `innerHTML` for rich DOM | `document.createElement` tree | `innerHTML` is simpler for a string-building pattern already used in this function; locked by existing code style |
| `<hr>` for separator | Unicode `─` repeated / CSS `border-top` on row | `<hr>` with `border-blue-700` chosen (UI-SPEC) — semantic and styleable with one Tailwind class |

**Installation:** No installation required. Zero new dependencies.

---

## Architecture Patterns

### Recommended Project Structure

No structural changes. All changes are inside two existing files:

```
src/
├── index.html          # No template markup changes needed (HTML injected via JS)
└── js/
    └── calculator.js   # updateResult() — the only function that changes
```

### Pattern 1: Switching from textContent to innerHTML for structured output

**What:** `updateResult()` currently writes `resultAmount.textContent` and `breakdownDetail.textContent`. Both must switch to `innerHTML` to render the nested `<span>` and `<table>` structures.

**When to use:** Whenever a JS function needs to render markup rather than plain text. Security note: all values in this template are numbers formatted by `toLocaleString` / `toFixed` — no user-supplied strings, so `innerHTML` injection is safe here.

**Collapsed bar pattern (from UI-SPEC):**
```javascript
// Source: 21-UI-SPEC.md — Collapsed Bar Layout Contract
resultAmount.innerHTML =
  '<span class="block text-2xl font-semibold">$' + perHousehold.toFixed(2) + '/household/year</span>' +
  '<span class="block text-sm text-blue-200">$' + totalCost.toLocaleString('en-US') + ' total</span>';
resultAmount.className = '';  // clear the class — inner spans carry their own classes
```

**Expanded popover pattern (from UI-SPEC):**
```javascript
// Source: 21-UI-SPEC.md — Layout Contract — Breakdown Popover Formula
breakdownDetail.innerHTML =
  '<table class="w-full"><tbody>' +
  '<tr><td class="text-right pr-3 tabular-nums">$' + staffingCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Hours Open</td></tr>' +
  '<tr><td class="text-right pr-3 tabular-nums">$' + digitalCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Digital</td></tr>' +
  '<tr><td class="text-right pr-3 tabular-nums">$' + physicalCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Physical</td></tr>' +
  '</tbody><tfoot>' +
  '<tr><td colspan="2" class="pt-1 pb-1"><hr class="border-blue-700" /></td></tr>' +
  '<tr><td class="text-right pr-3 tabular-nums font-semibold">$' + totalCost.toLocaleString('en-US') + '</td><td class="font-semibold">Total</td></tr>' +
  '<tr><td colspan="2" class="pt-1 text-blue-200">$' + totalCost.toLocaleString('en-US') + ' \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households = $' + perHousehold.toFixed(2) + '/year</td></tr>' +
  '</tfoot></table>';
```

### Pattern 2: className management when switching to innerHTML

**What:** `resultAmount.className` is currently set to `'text-2xl font-semibold'` on the happy path and `'text-base text-blue-100'` on the empty state. When switching `#result-amount` to use inner `<span>` elements that carry their own classes, the outer element's className must be cleared on the happy path (the inner spans carry sizing), but the empty-state path still sets `textContent` (no spans) — keep `text-base text-blue-100` on the outer element for that case.

**When to use:** Any time an element carries both display-mode-specific classes and innerHTML.

### Anti-Patterns to Avoid

- **Setting `className = 'text-2xl font-semibold'` on `#result-amount` when using innerHTML:** This would double-apply font sizes — the inner spans already declare `text-2xl`. Clear `className` (or set `className = ''`) on the happy path.
- **Conditional hiding of $0 rows:** D-04 explicitly requires all three rows always rendered. Do not add `if (physicalCost > 0)` guards.
- **Changing `index.html` template markup:** The bar and popover containers already exist. All content is written by JS. Editing the template is unnecessary and risks breaking the Nunjucks build.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Number formatting with commas | Custom comma-insertion | `Number.toLocaleString('en-US')` | Already used throughout codebase; handles thousands separators correctly |
| Column alignment in popover | CSS float tricks / manual spaces | `<table>` with `text-right` on amount column | HTML table column alignment is inherently synchronized; flex gap approximations break at different screen widths |

**Key insight:** All required utilities (`toLocaleString`, `toFixed`, `<table>`) are already used in this codebase. There is nothing to install or invent.

---

## Common Pitfalls

### Pitfall 1: className collision on #result-amount

**What goes wrong:** `resultAmount.className = 'text-2xl font-semibold'` (line 56 of calculator.js) applied to the outer element while inner spans also carry `text-2xl font-semibold` — font size cascades into the inner spans even though they declare it explicitly. The outer `text-2xl` is redundant and harmless, but `font-semibold` may add extra weight unintentionally to the `text-blue-200` secondary span.

**Why it happens:** The current code sets className on the outer element when there was only one text node. When switching to inner spans, the outer className becomes structural interference.

**How to avoid:** Set `resultAmount.className = ''` on the happy path. Each inner span carries its own complete class set.

**Warning signs:** Secondary `$total` line appears too heavy (semibold) even though it should be normal weight.

### Pitfall 2: Empty state still uses textContent — don't innerHTML it

**What goes wrong:** Setting `resultAmount.innerHTML = 'Select at least one city'` instead of `resultAmount.textContent` — no functional difference here, but textContent is safer for plain strings.

**Why it happens:** Reflexive copy-paste after changing the happy path.

**How to avoid:** Keep the zero-households early-return block using `textContent` and keep setting `className = 'text-base text-blue-100'` on the outer element, as today.

### Pitfall 3: breakdownDetail.textContent = '' must become innerHTML = '' in the empty state

**What goes wrong:** Line 45 of calculator.js clears `breakdownDetail.textContent = ''` in the empty state. If the popover was previously shown with the table, `textContent = ''` will clear the text nodes but orphaned `<tr>` elements can remain in some edge cases in older browsers. Use `innerHTML = ''` for the clear operation.

**Why it happens:** The old code never had HTML children in breakdownDetail, so textContent was sufficient. After this change it will have them.

**How to avoid:** Change `breakdownDetail.textContent = ''` to `breakdownDetail.innerHTML = ''` in the early-return block.

### Pitfall 4: Screen reader announces ÷ symbol unpredictably

**What goes wrong:** The division equation uses `÷` (`\u00f7`). Some screen readers announce this as "divided by", others as the raw symbol name or skip it. The `aria-live` region on `#result-bar` will announce the full bar content on every change.

**Why it happens:** Unicode math symbols have inconsistent AT pronunciation across platforms.

**How to avoid:** Per UI-SPEC, monitor for this in manual testing. If pronunciation is poor, wrap the division equation `<td>` with `aria-label="$X divided by N households equals $Y per year"` to provide explicit SR text while displaying the `÷` visually.

---

## Code Examples

### Full updated updateResult() function

```javascript
// Source: derived from existing calculator.js + 21-UI-SPEC.md
function updateResult() {
  var totalHouseholds = getTotalHouseholds();
  var resultAmount = document.getElementById('result-amount');
  var breakdownDetail = document.getElementById('breakdown-detail');

  if (totalHouseholds === 0) {
    resultAmount.textContent = 'Select at least one city';
    resultAmount.className = 'text-base text-blue-100';
    breakdownDetail.innerHTML = '';
    return;
  }

  var staffingCost = getStaffingCost();
  var digitalCost = getDigitalCost();
  var physicalCost = getPhysicalCost();
  var perHousehold = calculatePerHousehold(staffingCost, digitalCost, physicalCost, totalHouseholds);
  var totalCost = staffingCost + digitalCost + physicalCost;

  // Collapsed bar: two-line display
  resultAmount.innerHTML =
    '<span class="block text-2xl font-semibold">$' + perHousehold.toFixed(2) + '/household/year</span>' +
    '<span class="block text-sm text-blue-200">$' + totalCost.toLocaleString('en-US') + ' total</span>';
  resultAmount.className = '';

  // Popover: accounting-style formula table
  breakdownDetail.innerHTML =
    '<table class="w-full"><tbody>' +
    '<tr><td class="text-right pr-3 tabular-nums">$' + staffingCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Hours Open</td></tr>' +
    '<tr><td class="text-right pr-3 tabular-nums">$' + digitalCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Digital</td></tr>' +
    '<tr><td class="text-right pr-3 tabular-nums">$' + physicalCost.toLocaleString('en-US') + '</td><td class="text-blue-200">Physical</td></tr>' +
    '</tbody><tfoot>' +
    '<tr><td colspan="2" class="pt-1 pb-1"><hr class="border-blue-700" /></td></tr>' +
    '<tr><td class="text-right pr-3 tabular-nums font-semibold">$' + totalCost.toLocaleString('en-US') + '</td><td class="font-semibold">Total</td></tr>' +
    '<tr><td colspan="2" class="pt-1 text-blue-200">$' + totalCost.toLocaleString('en-US') + ' \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households = $' + perHousehold.toFixed(2) + '/year</td></tr>' +
    '</tfoot></table>';
}
```

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 2.x |
| Config file | `vite.config.js` (or detected by Vitest) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| D-01 | Two-line collapsed bar renders per-household + total | manual (DOM/browser visual) | n/a — DOM rendering not testable in Vitest unit layer | n/a |
| D-04 | All 3 components rendered even when $0 | manual (browser visual) | n/a — DOM rendering | n/a |
| D-05 | Accounting layout: right-aligned amounts, left-aligned labels | manual (browser visual) | n/a | n/a |
| Pure math | `calculatePerHousehold` correct for all inputs | unit | `pnpm test` (test/calculator.test.js) | ✅ exists |
| Config shape | All cost options have numeric `value` fields | unit | `pnpm test` (test/config.test.js) | ✅ exists |

**Note:** This phase is a DOM display-layer change. The pure function (`calculatePerHousehold`) is already tested. The new code is string-building HTML inside `updateResult()` — it does not have a seam for unit testing without a DOM. Validation is by visual browser inspection and screen-reader smoke test.

### Sampling Rate

- **Per task commit:** `pnpm test` (confirm existing tests still pass)
- **Per wave merge:** `pnpm test`
- **Phase gate:** All existing tests green + manual browser visual check before `/gsd:verify-work`

### Wave 0 Gaps

None — existing test infrastructure covers all unit-testable phase requirements. New display logic is DOM-only and verified manually.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single `textContent` write for result | `innerHTML` with inner `<span>` elements | Phase 21 (this phase) | Enables two-line collapsed bar |
| Single `textContent` write for breakdown | `innerHTML` with `<table>` formula | Phase 21 (this phase) | Enables accounting-style component layout |

**Deprecated/outdated in this phase:**
- `breakdownDetail.textContent = '$X total ÷ N households'`: replaced by structured table innerHTML
- `resultAmount.textContent = '$X.XX/household/year'`: replaced by two-span innerHTML

---

## Open Questions

1. **Screen reader ÷ symbol pronunciation**
   - What we know: `aria-live="polite" aria-atomic="true"` on `#result-bar` will announce bar content on change
   - What's unclear: Whether `÷` is pronounced naturally by VoiceOver/NVDA or needs an `aria-label` override
   - Recommendation: Implement as specified; add `aria-label` override to the division `<td>` if manual SR testing reveals garbled pronunciation. Low risk — it's one attribute addition.

2. **`resultAmount.className = ''` vs leaving classes on outer element**
   - What we know: The UI-SPEC inner spans carry their own complete class sets
   - What's unclear: Whether leaving `text-2xl font-semibold` on the outer element causes visual regression (cascade onto inner spans)
   - Recommendation: Clear `className` on the outer `#result-amount` element on the happy path. The inner spans are self-contained.

---

## Sources

### Primary (HIGH confidence)

- `src/js/calculator.js` — Full source of `updateResult()`, current textContent writes, variable names
- `src/index.html` — Full markup of `#result-bar`, `#breakdown-detail`, `#breakdown-toggle`, existing `<table>` pattern in staffing cards
- `.planning/phases/21-show-your-work-totals/21-CONTEXT.md` — All locked decisions D-01 through D-06
- `.planning/phases/21-show-your-work-totals/21-UI-SPEC.md` — Exact HTML structure, Tailwind classes, copywriting contract
- `test/calculator.test.js` — Existing test coverage baseline
- `test/config.test.js` — Existing test coverage baseline

### Secondary (MEDIUM confidence)

None required — all authoritative information is in the codebase itself.

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies; all patterns verified directly from codebase
- Architecture: HIGH — UI-SPEC provides exact HTML and class specifications derived from existing code
- Pitfalls: HIGH — identified directly from reading the current `updateResult()` implementation

**Research date:** 2026-04-15
**Valid until:** N/A — no external dependencies; codebase is the source of truth
