---
phase: 21-show-your-work-totals
verified: 2026-04-15T08:00:00Z
status: human_needed
score: 5/6 must-haves verified
re_verification: false
human_verification:
  - test: "Two-line collapsed result bar (D-01)"
    expected: "Select at least one city, verify the sticky result bar shows: Line 1 (large, semibold) — $X.XX/household/year; Line 2 (smaller, blue-200) — $X,XXX total. Verify both lines are visible and vertically stacked."
    why_human: "DOM rendering and visual layout cannot be verified in Vitest unit layer. The HTML string is correct in code, but actual rendering requires a browser."
  - test: "All 3 cost components shown even when one is $0 (D-04)"
    expected: "Set Physical collections slider to its lowest ($0) value. Open the popover. Verify the Physical row is present with '$0' — not hidden, not conditional."
    why_human: "The code renders all 3 rows unconditionally, but correct behavior at runtime with actual slider state needs visual confirmation."
  - test: "Accounting layout: right-aligned amounts, left-aligned labels (D-05)"
    expected: "Open the popover. Dollar amounts ($X,XXX) are right-aligned in a distinct left column. Labels (Hours Open, Digital, Physical) are left-aligned in the right column. The two columns are clearly separated."
    why_human: "tabular-nums and text-right classes are present in code, but column alignment rendering depends on browser table layout."
  - test: "Horizontal rule separates addends from Total (D-05)"
    expected: "Open the popover. A visible horizontal line appears between the Physical row and the Total row."
    why_human: "border-blue-700 hr is present in code but its visibility against bg-blue-900 background requires human confirmation."
  - test: "Division equation displayed below Total (D-06)"
    expected: "Open the popover. Below the Total row, verify a line reads: $X,XXX ÷ N households = $X.XX/year"
    why_human: "The unicode ÷ (U+00F7) is rendered as a character and must be visually confirmed. Screen reader pronunciation of ÷ is also uncertain and flagged in VALIDATION.md."
  - test: "Empty state clears popover and shows plain message"
    expected: "Uncheck all cities. Verify the result bar shows 'Select at least one city' in smaller subdued text. Open the popover toggle — verify the popover content is empty (no stale table data)."
    why_human: "Correct empty-state wiring is verifiable in code (see below), but user-visible rendering needs confirmation."
---

# Phase 21: show-your-work-totals Verification Report

**Phase Goal:** Expand the result bar so citizens can see the individual cost components (Hours Open, Digital, Physical) that sum to the total, not just the final per-household figure.
**Verified:** 2026-04-15
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Collapsed result bar shows per-household cost on line 1 and total cost on line 2 | ? HUMAN | HTML string correct at lines 56-59; inner spans with `block text-2xl font-semibold` and `block text-sm text-blue-200` confirmed. Rendering needs human. |
| 2 | Popover formula shows all 3 cost components (Hours Open, Digital, Physical) even when $0 | ✓ VERIFIED | Lines 63-67 render all 3 rows unconditionally from `staffingCost`, `digitalCost`, `physicalCost` — no conditionals, no guards. |
| 3 | Popover formula uses accounting-style layout with right-aligned amounts and left-aligned labels | ? HUMAN | `text-right pr-3 tabular-nums` on amount `<td>` and `text-blue-200` on label `<td>` confirmed. Column alignment rendering needs human. |
| 4 | Horizontal rule separates the three addends from the Total row | ✓ VERIFIED | Line 68: `<hr class="border-blue-700" />` inside a `colspan="2"` separator row in `<tfoot>`. Present and structurally correct. |
| 5 | Division equation line appears below Total in the popover | ✓ VERIFIED | Line 70: `colspan="2"` tfoot row with `$X ÷ N households = $X.XX/year` using `\u00f7` for ÷. Placed after Total row. |
| 6 | Empty state (no cities selected) still shows plain text message and clears popover | ✓ VERIFIED | Lines 43-46: `resultAmount.textContent = 'Select at least one city'`, `resultAmount.className = 'text-base text-blue-100'`, `breakdownDetail.innerHTML = ''`. All 3 conditions met. |

**Score:** 4/6 truths programmatically verified; 2 need human visual confirmation (rendering-only — code is correct)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/js/calculator.js` | Two-state display logic in `updateResult()` | ✓ VERIFIED | File exists, 141 lines, `updateResult()` fully rewritten with `innerHTML` for both `resultAmount` and `breakdownDetail`. Not a stub. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/js/calculator.js` | `#result-amount` | `resultAmount.innerHTML =` with two inner spans | ✓ WIRED | Line 56: `resultAmount.innerHTML =` confirmed, writes two `<span>` elements |
| `src/js/calculator.js` | `#breakdown-detail` | `breakdownDetail.innerHTML =` with table element | ✓ WIRED | Line 62: `breakdownDetail.innerHTML =` confirmed, writes full `<table>` with tbody + tfoot |

### Requirements Coverage

REQUIREMENTS.md does not exist as a standalone file. Requirements D-01 through D-06 are defined in `.planning/phases/21-show-your-work-totals/21-CONTEXT.md` under `<decisions>`.

| Requirement | Source | Description | Status | Evidence |
|-------------|--------|-------------|--------|----------|
| D-01 | 21-CONTEXT.md | Two lines when collapsed: large `$X.XX/household/year` + smaller secondary total line | ✓ SATISFIED | Lines 56-59: two spans with correct classes |
| D-02 | 21-CONTEXT.md | Use existing `breakdown-detail` element; switch from `textContent` to `innerHTML` for clearing | ✓ SATISFIED | Line 45: `breakdownDetail.innerHTML = ''`; line 62: `breakdownDetail.innerHTML =` |
| D-03 | 21-CONTEXT.md | Popover floats above sticky bar (`bottom-full`); bar does not expand downward | ✓ SATISFIED | No changes to `src/index.html`; popover positioning unchanged (index.html is read-only per plan) |
| D-04 | 21-CONTEXT.md | Show all 3 cost components always, even if $0 — no conditional hiding | ✓ SATISFIED | Lines 63-67: all 3 rows rendered unconditionally without `if` guards |
| D-05 | 21-CONTEXT.md | Right-aligned amounts, left-aligned labels; horizontal rule separates addends from Total | ✓ SATISFIED | `tabular-nums text-right pr-3` on amount cells; `border-blue-700` hr in tfoot separator row |
| D-06 | 21-CONTEXT.md | Labels: "Hours Open", "Digital", "Physical"; division equation below Total | ✓ SATISFIED | Labels present on lines 64-66; division equation on line 70 |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | — |

No TODO/FIXME/placeholder comments found. No stub return values. No empty handlers. All three cost rows are unconditionally rendered from live variables — not hardcoded empty data.

### Human Verification Required

#### 1. Two-line collapsed result bar

**Test:** Run `pnpm dev`, open the app, select at least one city.
**Expected:** Sticky result bar shows `$X.XX/household/year` on a large semibold line, then `$X,XXX total` on a smaller blue-200 line below it. Both lines stack vertically.
**Why human:** DOM rendering; the HTML string is confirmed correct in code but visual stacking requires a browser.

#### 2. All 3 cost components shown when one is $0

**Test:** Set Physical collections slider to its lowest value (ensure it evaluates to $0). Open the popover via the info icon.
**Expected:** Hours Open, Digital, and Physical rows are all present. Physical shows `$0` — not hidden.
**Why human:** The code renders all 3 rows unconditionally, but correct behavior at runtime with actual slider state needs visual confirmation.

#### 3. Accounting layout: column alignment

**Test:** Open the popover with a few cities selected.
**Expected:** Dollar amounts right-align in the left column; labels (Hours Open, Digital, Physical) left-align in the right column.
**Why human:** `tabular-nums` and `text-right` are in the code, but table column rendering needs a browser.

#### 4. Horizontal rule visibility

**Test:** Open the popover.
**Expected:** A visible line separator appears between the Physical row and the Total row. The line should be visible but not harsh against the dark `bg-blue-900` background.
**Why human:** `border-blue-700` on `bg-blue-900` — contrast is a judgment call requiring visual inspection.

#### 5. Division equation rendering (including ÷ symbol)

**Test:** Open the popover.
**Expected:** Row below Total reads: `$X,XXX ÷ N households = $X.XX/year`. The ÷ symbol renders correctly (not as raw escape code).
**Why human:** Unicode `\u00f7` should render as ÷ in browsers, but screen-reader pronunciation of ÷ is flagged as uncertain in VALIDATION.md and may need an `aria-label` override.

#### 6. Mobile viewport fit (D-06 constraint)

**Test:** Resize to 375px width (or use DevTools mobile emulation). Select cities and open the popover.
**Expected:** Formula table fits within the popover without horizontal overflow. Labels are short enough to coexist with right-aligned amounts.
**Why human:** Layout overflow on narrow viewports requires visual inspection.

### Gaps Summary

No automated gaps. All code-verifiable criteria are satisfied:

- `resultAmount.innerHTML` replaces `textContent` for the happy path (line 56)
- `breakdownDetail.innerHTML` replaces `textContent` for the formula (line 62)
- `breakdownDetail.innerHTML = ''` replaces `textContent` for empty state clearing (line 45)
- `resultAmount.className = ''` clears outer classes on happy path (line 59)
- All 3 labels ("Hours Open", "Digital", "Physical") present (lines 64-66)
- "Total" label present in tfoot row (line 69)
- `border-blue-700` hr separator present (line 68)
- `tabular-nums` on all amount cells (lines 64-66, 69)
- `text-blue-200` on labels and secondary line (lines 57-58, 64-66, 70)
- `text-2xl font-semibold` inside innerHTML span (line 57)
- `text-sm text-blue-200` inside innerHTML span (line 58)
- Empty state preserves `resultAmount.textContent` and `resultAmount.className = 'text-base text-blue-100'` (lines 43-44)
- All 72 tests pass (`pnpm test` green)

Human verification covers rendering behavior only — the underlying code is complete and correct.

---

_Verified: 2026-04-15_
_Verifier: Claude (gsd-verifier)_
