# Phase 20: update hours selection with new data - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-05
**Phase:** 20-update-hours-selection-with-new-data
**Areas discussed:** Tier count, Cost mapping, Labels & descriptions, Schedules, Current service level

---

## Tier Count

| Option | Description | Selected |
|--------|-------------|----------|
| Keep 3 tiers, map to PDF | Map PDF options to 3 tiers by hours + cost level | ✓ |
| 6 tiers — one per PDF option | Each PDF option becomes a card | |
| 2 tiers — just two hours levels | 35 hrs/week and 44 hrs/week | |

**User's choice:** Keep 3 tiers
**Notes:** "Options 1, 2, and 3 are the same. Option 4 and 5 are the same while option 6 unique. Let's map those 3 tiers into our 3 tiers."

---

## Cost Mapping (annualCost)

| Option | Description | Selected |
|--------|-------------|----------|
| Staff + overhead | annualCost = wages + ILS + programs + supplies | ✓ (initially selected) |
| Staff wages only | Just the salary/wages lines | ✓ (clarified in follow-up) |
| Total budget minus collections | Equivalent to staff + overhead | |

**User's choice:** Staff wages only — "Lets pull out the overhead and just use staffing costs."
**Notes:** The initial option selected was "Staff + overhead" but the user's text clarification overrode this. annualCost = wages only.

---

## Tier 2 Cost

| Option | Description | Selected |
|--------|-------------|----------|
| $68,640 (Option 4 rate) | Director $20/hr + 3PT | |
| $76,440 (Option 5 rate) | Director $25/hr + 3PT | ✓ |

**User's choice:** $76,440

---

## Schedules

| Option | Description | Selected |
|--------|-------------|----------|
| Draft reasonable schedules | Claude creates schedule rows consistent with PDF | ✓ |
| I'll provide exact hours | User provides specific open/close times | |

**User's choice:** Claude drafts schedules

---

## Labels

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Basic / Extended / Full Service | Rename Current → Full Service | |
| Use PDF option names | e.g. 'Part Time — 35hrs' | |
| You decide | Claude picks citizen-friendly labels | ✓ |

**User's choice:** Claude decides (Essential / Standard / Full Service chosen)

---

## Current Service Level

| Option | Description | Selected |
|--------|-------------|----------|
| Tier 2 — 44hrs PT (Option 4/5) | Closest to existing Current tier | ✓ |
| Tier 3 — FTE+3PT ($160k) | If current op is closer to Option 6 | |
| None | Remove indicator from staffing cards | |

**User's choice:** Tier 2 (44hrs PT)

---

## Claude's Discretion

- Exact label wording ("Essential", "Standard", "Full Service")
- Description text for each tier (drafted from PDF language)
- Specific schedule times (consistent with 35/44 hrs/week targets from PDF)
- `source` field on each tier (auditability)

## Deferred Ideas

- Collections slider updates from PDF data — future phase if needed
- Verbose URL migration shim for old staffing IDs
- Overhead costs (ILS, programs, supplies) modeling
