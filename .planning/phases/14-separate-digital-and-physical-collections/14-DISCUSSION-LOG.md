# Phase 14: Separate Digital and Physical Collections - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 14-separate-digital-and-physical-collections
**Areas discussed:** Cost model, UI layout, Config structure, Current level indicator, URL params, Backward compat, Calculator, Non-developer edit guide, Reusable component

---

## Cost Model

| Option | Description | Selected |
|--------|-------------|----------|
| Additive | Digital budget + Physical budget = total collections cost. Both sliders contribute independently to the tax calculation. | ✓ |
| Single total, split view | Total budget is still one number but citizens see two labeled breakdowns. Informational only. | |
| Replace tiers entirely | Old 6-tier blended options go away with new combined cost formula. | |

**User's choice:** Additive — digital + physical both contribute independently to the total tax calculation.

**Follow-up — Tier ranges:**

| Option | Description | Selected |
|--------|-------------|----------|
| New independent scales | Digital has its own range, physical has its own range. Fresh values defined in config.js. | ✓ |
| Re-use existing $10k–$60k range | Same scale for both, now independent sliders. | |
| You decide | Leave exact ranges to planning. | |

**User's choice:** New independent scales for each dimension.

---

## UI Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Two stacked sliders | Digital on top, physical below — both inside Collections Budget fieldset. | ✓ |
| Side by side | Two sliders horizontally adjacent. | |
| Tabbed | Single slider switching between Digital/Physical via tabs. | |

**User's choice:** Two stacked sliders.

**Follow-up — Descriptions:**

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — each slider has its own description + source | Same pattern as current slider. | ✓ |
| Shared description area | One area updates to whichever was last moved. | |
| No descriptions, labels only | Simpler but loses explanatory text. | |

**User's choice:** Each slider has its own description + source citation.

---

## Config Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Two top-level keys: collectionsDigital + collectionsPhysical | Replace collections with two clearly-named keys. | ✓ |
| Nested under collections: collections.digital + collections.physical | Keep collections as container key. | |
| Single key with typed options | Add type: 'digital' \| 'physical' field to each option. | |

**User's choice:** Two top-level keys.

**Follow-up — Migration:**

| Option | Description | Selected |
|--------|-------------|----------|
| Replace entirely | Remove old 6-tier blended options. New keys get fresh values. | ✓ |
| Keep as legacy, add new | Preserve old collections key for backward compat. | |
| You decide | Leave migration strategy to planning. | |

**User's choice:** Replace entirely with new values.

---

## Current Level Indicator

| Option | Description | Selected |
|--------|-------------|----------|
| One option in each slider | Each type has its own isCurrentServiceLevel: true. Both show amber tick independently. | ✓ |
| Only on the physical slider | Digital-only is new — no current digital level. | |
| Remove current-level indicators | Concept doesn't map cleanly to split model. | |

**User's choice:** One per slider — both show amber tick independently.

---

## URL Params

| Option | Description | Selected |
|--------|-------------|----------|
| Two new params: tau-d + tau-p | New params for both. Old tau links break. | |
| Reuse tau for physical, add new param for digital | tau keeps encoding physical. New short param for digital. | ✓ |
| You decide | Leave URL param naming to planner. | |

**User's choice:** tau = physical, new param for digital.

---

## Backward Compat for Old URLs

| Option | Description | Selected |
|--------|-------------|----------|
| Silently fall back to defaults | Out-of-range tau values use default physical tier. | |
| Best-effort mapping | Map old indices to closest new physical tier by value. | |
| No special handling | Old URLs are invalid. Fall to defaults with no detection logic. | ✓ |

**User's choice:** No special handling — old tau values that don't match fall to default.

---

## Calculator Impact

| Option | Description | Selected |
|--------|-------------|----------|
| Additive, no floor/ceiling | Total collections = digital + physical. No minimum enforced. | ✓ |
| Minimum total collections enforced | Floor prevents both from being at zero. | |
| You decide | Leave to planning. | |

**User's choice:** Additive, no constraints.

---

## Non-Developer Edit Guide

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — update in same phase | Guide reflects new two-key structure in Phase 14. | ✓ |
| Defer to later cleanup phase | Update separately after structure is stable. | |
| Remove collections section | Split is self-documenting. | |

**User's choice:** Update in same phase.

---

## Reusable Component

User added via free text: "I'd like the slider to be extracted into a reusable component."

| Option | Description | Selected |
|--------|-------------|----------|
| Nunjucks macro | Reusable macro accepting config params. Both sliders call the same macro. | ✓ |
| Nunjucks include/partial | Template partial included twice with context variable. | |
| You decide | Leave component mechanism to planning. | |

**User's choice:** Nunjucks macro — locked requirement.

---

## Claude's Discretion

- Exact dollar values and tier counts for collectionsDigital and collectionsPhysical options
- Name of the new URL param for digital collections index
- Internal element IDs for the two sliders
- Macro file location within Eleventy project structure
- Whether the fieldset legend wording changes

## Deferred Ideas

None — discussion stayed within phase scope.
