# Phase 18: Incorporate Feedback from Library Notes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 18-incorporate-feedback-from-library-notes
**Areas discussed:** Source & scope of feedback, Digital collections values, Physical collections current level, Staffing descriptions, Draft watermark, Programming scope

---

## Source & Scope of Feedback

| Option | Description | Selected |
|--------|-------------|----------|
| NOTES.md | Librarian-provided document in phase directory | ✓ |

**User's choice:** NOTES.md is a document sent by the librarian. Analysis of the document was requested to produce a list of updates for the planning section.

**Notes:** Document covers Libby/digital costs, physical collections 2025 actuals, programming costs, and staffing/hours context.

---

## Digital Collections Values

| Option | Description | Selected |
|--------|-------------|----------|
| Use real tiers near actual | Set current-level near $54k, build tiers around it | ✓ |
| Keep dollar values, update descriptions only | Leave placeholder values | |
| Ask librarian for tier breakdown first | Defer values | |

**User's choice:** Use real tiers near actual.

### Digital tier values

| Option | Description | Selected |
|--------|-------------|----------|
| Beehive + 3 own-Libby tiers | Modeled after real fork | |
| 4 own-Libby tiers only | Skip Beehive option | |
| I'll define the tier values | User-specified amounts | ✓ |

**User-defined tiers:**
- $5k: Beehive only — substantially longer wait times
- $15k: Beehive + own digital titles — longer wait times for most, a few accelerated
- $30k: Beehive + expanded — some titles reduced via purchases
- $55k: Current service level
- $65k: Beehive + expanded — shorter wait times for most popular books

---

## Physical Collections Current Level

| Option | Description | Selected |
|--------|-------------|----------|
| Move current marker to $15k | Actual ~$12,515 closer to $15k | ✓ |
| Keep current marker at $10k | Year-to-year variation argument | |
| Use exact figure ~$12,500 | Change tier value to match actual | |

**User's choice:** Move isCurrentServiceLevel to $15,000 option.

---

## Programming Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Defer to a future phase | New capability, out of scope | |
| Add a programming slider | Expand scope | |
| Note in config.js comments only | Reference data without new UI | ✓ |

**User's choice:** Add programming cost data as a comment in config.js only.

---

## Staffing Descriptions

| Option | Description | Selected |
|--------|-------------|----------|
| Update descriptions | Reflect librarian's language and real context | ✓ |
| Leave descriptions as-is | Update everything together later | |

**User's choice:** Update staffing card descriptions using the librarian's framing (accessibility impact, staff ratios).

---

## Draft Watermark

| Option | Description | Selected |
|--------|-------------|----------|
| Keep draft: true | Staffing costs still placeholder | ✓ |
| Remove draft watermark | Set draft: false now | |

**User's choice:** Keep draft: true until all numbers are real.

---

## Claude's Discretion

- Exact wording for updated staffing card descriptions (within the librarian's framing)
- Exact wording for updated physical collections tier descriptions
- Placement of programming cost comment in config.js

## Deferred Ideas

- Programming slider — new capability, future phase
- Staffing annualCost real values — needs Cache County HR data
- Removing draft watermark — deferred until staffing costs finalized
