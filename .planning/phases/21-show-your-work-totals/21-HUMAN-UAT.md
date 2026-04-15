---
status: partial
phase: 21-show-your-work-totals
source: [21-VERIFICATION.md]
started: 2026-04-15T06:43:34Z
updated: 2026-04-15T06:43:34Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Two-line collapsed bar stacks vertically
expected: Sticky result bar shows large `$X.XX/household/year` on line 1, smaller `$X,XXX total` in blue-200 on line 2 (block stacking, not inline)
result: [pending]

### 2. Physical $0 row renders when slider at minimum
expected: Physical row shows `$0` in the popover even when physicalCost is zero — not hidden or omitted
result: [pending]

### 3. Accounting column alignment
expected: Dollar amounts are right-aligned, labels are left-aligned in the popover table
result: [pending]

### 4. Horizontal rule visible on dark background
expected: `<hr class="border-blue-700">` separator is visible between addends and Total row against the `bg-blue-900` popover background
result: [pending]

### 5. Division equation ÷ symbol renders
expected: `$X,XXX ÷ N households = $X.XX/year` appears below Total; ÷ symbol renders correctly
result: [pending]

### 6. Mobile fit at 375px
expected: Formula table fits within popover width (w-64) at 375px viewport without horizontal overflow
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
