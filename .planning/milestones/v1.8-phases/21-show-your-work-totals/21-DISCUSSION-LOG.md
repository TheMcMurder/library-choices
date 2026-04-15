# Phase 21: show-your-work-totals - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-15

---

## Areas Selected

User selected: Breakdown content, Location & visibility, Format & style
(Label naming was not selected — left to Claude's discretion)

---

## Breakdown Content

**Q: What line items should the breakdown show?**
Options presented: 3 components + total / 3 components only / Full equation
**Selected:** Other (user provided freeform description)

User's description:
> "When the bar is collapsed I want to show 'Total' and 'Cost per household per year'. When
> the bar is not collapsed (is open) I want to show a mathematical formula:
> X - Staffing / Y - Digital collection / Z - Physical collection / --- / T - Total
> Then show the T / N = TcpH"

**Q: Should $0 line items still appear?**
Options: Always show all 3 / Hide $0 lines
**Selected:** Always show all 3

---

## Location & Visibility

**Q: How should the expanded breakdown work?**
Options: Same toggle button / Tap bar itself / Always open
**Selected:** Same toggle button, bigger popover (Recommended)

**Q: When expanded, should bar grow or breakdown float above?**
Options: Float above / Bar expands downward
**Selected:** Float above (popover, current pattern)

---

## Format & Style

**Q: How should the formula lines be laid out?**
Options: Right-aligned amounts (accounting) / Label-left amount-right (table)
**Selected:** Right-aligned amounts, left-aligned labels (Recommended)

Preview selected:
```
  $56,440  Hours Open
  $55,000  Digital
  $15,000  Physical
──────────────────────
 $126,440  Total

$126,440 ÷ 1,234 households
= $102.46/year
```

**Q: When collapsed, what should the result bar show?**
Options: Per-household + total on separate line / Per-household only (current)
**Selected:** Per-household + total on separate line

---

## Completion

User confirmed ready to create context after 3 areas discussed.
