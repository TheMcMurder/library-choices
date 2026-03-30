# Phase 19: Fix Slider Issue — Allow for Non-Linear Options - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Mode:** Interactive discuss-phase

---

## Area: Slider value model

**Q:** How should the range input's value be represented internally?

**Options presented:**
- Index-based (min=0, max=N-1, step=1) — slider always lands on a valid option
- Dollar-value + snap — workaround, visual jank possible
- You decide

**Selected:** Index-based

**User note:** "There is currently a problem where some of the snap points do not work because I'm using non-linear values. We need to update the shared component to work with linear and non-linear options to resolve this problem."

---

## Area: Fix scope

**Q:** Should the fix apply to both sliders or just digital?

**Options presented:**
- Both sliders (consistent, future-proof)
- Digital only (minimal change)

**Selected:** Both sliders

---

## Area: encodeIndices interface

**Q:** How should encodeIndices in url-helpers.js be updated?

**Options presented:**
- Update to accept indices directly (cleaner, requires test update)
- Keep dollar-value interface, translate in url.js (no test changes)

**Selected:** Update to accept indices directly
