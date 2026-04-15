# Phase 20: update hours selection with new data - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the three `staffingLevels` entries in `src/_data/config.js` with real data from the
librarian's "Providence Library budget levels.pdf". Update labels, annualCost values, schedules,
and descriptions to match three tiers derived from the six PDF options. No template, calculator,
or URL logic changes expected — this is a data-only update.

</domain>

<decisions>
## Implementation Decisions

### Tier Count
- **D-01:** Keep 3 staffing tiers (same as current). Map PDF options 1–3 → Tier 1, options 4–5 → Tier 2, option 6 → Tier 3.

### Annual Cost
- **D-02:** `annualCost` = staff wages only (no overhead: no ILS, programs, supplies, or upgrades).
  - Tier 1: $56,160 (Director $20/hr × 30hr/wk = $31,200 + 2 PT Clerks $12/hr × 40hr/wk = $24,960)
  - Tier 2: $76,440 (Director $25/hr × 30hr/wk = $39,000 + 3 PT Clerks $12/hr × 60hr/wk = $37,440)
  - Tier 3: $160,000 (1 FTE + 3 PTE — as a single line item from the PDF)

### Labels
- **D-03:** Claude decides labels. Proposed:
  - Tier 1 → `"Essential"`
  - Tier 2 → `"Standard"` *(isCurrentServiceLevel: true)*
  - Tier 3 → `"Full Service"`

### Schedules
- **D-04:** Claude drafts reasonable schedule rows consistent with PDF descriptions:
  - Tier 1 (35 hrs/week): Mon–Fri 11am–5pm + Sat 10am–3pm (= 30 + 5 = 35 hrs)
  - Tier 2 (44 hrs/week): Mon–Fri 10am–6pm + Sat 10am–2pm (= 40 + 4 = 44 hrs)
  - Tier 3 (44 hrs/week): Same as Tier 2 — same hours, higher-quality staffing

### Current Service Level
- **D-05:** `isCurrentServiceLevel: true` stays on **Tier 2** (44 hrs/week, Part-Time staff) — closest match to the existing operation. Tier 3 is aspirational.

### IDs (URL compatibility)
- **D-06:** Update `id` values to reflect new staffing models. Old IDs (`1fte`, `1fte-1pte`, `1fte-2pte`) described a different structure and are now inaccurate. Proposed new IDs:
  - Tier 1 → `"35hr-pt"`
  - Tier 2 → `"44hr-pt"`
  - Tier 3 → `"44hr-fte"`
  - **NOTE:** Compact URL `pi` param uses array position (index 0/1/2), not the id value, so compact shared links remain valid. Verbose-format URLs using id strings will no longer match — planner should confirm whether any such links need a migration shim or if a clean break is acceptable given the semantic change.

### Descriptions
- **D-07:** Claude drafts citizen-facing descriptions from PDF language. Key points per tier:
  - Tier 1: Part-time staff, 35 hrs/week, some evening and Saturday hours, two staff at a time.
  - Tier 2: Part-time staff, 44 hrs/week, evening and Saturday hours, two staff at a time — the current operation level.
  - Tier 3: Full-time director + three part-time staff, 44 hrs/week. Better programming, outreach, and collaboration. Two or three staff at a time.

### Claude's Discretion
- Exact description wording (tone, length — keep consistent with existing descriptions in config.js)
- Whether to add a `source` field pointing to the PDF filename for auditability

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data file
- `src/_data/config.js` — The file to update. Read it fully before editing to understand the exact schema, comment conventions, and URL-immutability warnings.

### PDF source
- `.planning/phases/20-update-hours-selection-with-new-data/Providence Library budget levels.pdf` — The authoritative source for all cost and staffing data. Options 1–3 → Tier 1, Options 4–5 → Tier 2, Option 6 → Tier 3.

### URL encoding context
- `src/js/url.js` — Check how `pi` (staffing index) is encoded to confirm compact URLs use position, not id value, before deciding on verbose-URL migration approach.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `staffingLevels` array in `src/_data/config.js`: existing 3-element array. Update in place — same positions, same schema, new values.
- Schedule format already defined: `{ days: "1-5", open: "9am", close: "5pm" }` rows. Use existing day-range format.

### Established Patterns
- `isCurrentServiceLevel: true` is a flag on the tier object, used by templates and JS to render the amber "Current level" badge. Set on exactly one tier.
- `annualCost` drives the tax calculation. It is added to collection slider values to compute total annual cost ÷ total households.
- IDs marked `// URL-IMMUTABLE` in config comments — update comment to `// URL: compact uses array index; verbose id changed from vN`

### Integration Points
- No template changes needed — `staffingLevels` is already looped in Nunjucks templates
- No calculator changes needed — formula reads `annualCost` by reference
- Test coverage: `test/config.test.js` tests config structure. Verify tests still pass after update; update cost expectations if any are hardcoded.

</code_context>

<specifics>
## Specific Ideas

- PDF source file is in the phase directory: `Providence Library budget levels.pdf`
- The librarian explicitly recommends two people working at the same time for safety — this is worth preserving in descriptions
- Option 6 note from PDF: "The Library Director would work full time which means they would have the education and time to implement more programs, improve library practices, and perform outreach" — use this language in the Full Service description

</specifics>

<deferred>
## Deferred Ideas

- Collections slider updates based on PDF data (the PDF also has specific Libby/collections costs — this could be a separate phase if the collection slider values need updating)
- Overhead costs (ILS, programs, supplies, upgrades) are NOT included in `annualCost` per D-02; a future phase could model these as a separate dimension if desired
- Verbose URL migration shim for old staffing IDs (only needed if existing shared links with `?staffing=1fte-2pte` format need to remain valid)

</deferred>

---

*Phase: 20-update-hours-selection-with-new-data*
*Context gathered: 2026-04-05*
