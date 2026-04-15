# Phase 21: show-your-work-totals - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Expand the result bar so citizens can see the individual cost components (Hours Open, Digital
Collections, Physical Collections) that add up to the total, not just the final per-household figure.

The result bar has two states:
- **Collapsed:** shows per-household cost (large) + total cost (small secondary line)
- **Expanded (toggle open):** shows a stacked accounting-style formula inside the existing
  `breakdown-detail` popover (floats above the sticky bar)

No new controls, no new data. This is a display-layer change to `index.html` and `calculator.js`.

</domain>

<decisions>
## Implementation Decisions

### Collapsed Result Bar
- **D-01:** Two lines when collapsed: large primary `$X.XX/household/year` + smaller secondary
  line showing the total cost (e.g., `$126,440 total`). Currently only the per-household line
  exists — the total line is new.

### Expanded Breakdown (popover)
- **D-02:** Use the existing `breakdown-detail` element and `ℹ️` toggle button — same pattern,
  bigger content. No new UI elements needed.
- **D-03:** The popover floats above the sticky bar (`bottom-full` positioning, current behavior).
  Bar does not expand downward.
- **D-04:** Show all 3 cost components always, even if $0 (e.g., Physical at $0). Consistent
  layout — no conditional hiding.

### Formula Layout
- **D-05:** Right-aligned dollar amounts, left-aligned labels (accounting style):
  ```
    $56,440  Hours Open
    $55,000  Digital
    $15,000  Physical
  ──────────────────────
   $126,440  Total

  $126,440 ÷ 1,234 households = $102.46/year
  ```
  A horizontal rule separates the addends from the Total row. The division line follows below.

### Component Labels
- **D-06:** Use the same labels as the form section headers:
  - Staffing → `Hours Open`
  - Digital collections → `Digital`
  - Physical collections → `Physical`
  Labels should be short enough to fit on mobile at 375px alongside right-aligned amounts.

### Claude's Discretion
- Exact typography sizing and spacing within the popover (consistent with existing dark-blue
  `bg-blue-900 text-white text-sm` style of `breakdown-detail`)
- Whether to use a `<table>` or flex/grid layout for alignment of amounts and labels
- Horizontal rule implementation (`<hr>`, CSS border, or Unicode `─`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI template
- `src/index.html` — Contains the result bar markup: `#result-bar`, `#result-amount`,
  `#breakdown-toggle`, `#breakdown-detail`. Read fully before editing.

### Calculator JS
- `src/js/calculator.js` — The `updateResult()` function computes `staffingCost`,
  `digitalCost`, `physicalCost`, `totalCost`, and `perHousehold`. Currently writes only
  `resultAmount.textContent` and `breakdownDetail.textContent`. This is where the new
  two-state display logic goes.

### Test file
- `test/config.test.js` — Check for any hardcoded cost expectations that may need updating
  (unlikely for display-only change, but verify).

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `#breakdown-detail` (`div`, `hidden` attribute, `absolute bottom-full`) — already the popover
  container. Just replace the single `textContent` write with richer HTML.
- `#result-amount` — currently set to `$X.XX/household/year`. Needs to also render the total
  secondary line.
- `calculatePerHousehold()` imported from `src/js/lib/calculator-helpers.js` — pure function,
  no changes needed.

### Established Patterns
- `breakdownDetail.textContent` currently set to `'$' + totalCost.toLocaleString('en-US') + ' total \u00f7 ' + totalHouseholds.toLocaleString('en-US') + ' households'`
  — upgrade to `innerHTML` with structured HTML for the formula layout.
- `resultAmount.textContent` currently set to `'$' + perHousehold.toFixed(2) + '/household/year'`
  — upgrade to include the secondary total line.
- Dark-blue popover uses `bg-blue-900 text-white text-sm px-4 py-2` — new formula content
  should stay within this style.
- Result bar uses `bg-blue-800 text-white` — collapsed secondary line should match `text-blue-200`
  or similar subdued white for hierarchy.

### Integration Points
- `updateResult()` in `calculator.js` is the single function that drives all result display.
  All changes are localized to this function's DOM writes.
- The `aria-live="polite" aria-atomic="true"` on `#result-bar` means screen readers will
  announce changes — ensure the formula text is readable when spoken aloud.

</code_context>

<specifics>
## Specific Ideas

- The user described the formula as a "mathematical formula" with a separator line between
  the three addends and the Total, followed by the division equation. Think receipt/accounting
  style, not prose.
- Formula bottom line should read: `$T ÷ N households = $X.XX/year` (matching the user's
  `T / N = TcpH` notation).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 21-show-your-work-totals*
*Context gathered: 2026-04-15*
