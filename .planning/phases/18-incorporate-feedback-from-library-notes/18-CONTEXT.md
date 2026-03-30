# Phase 18: Incorporate Feedback from Library Notes - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Update `src/_data/config.js` with real data from the librarian's notes (NOTES.md). Changes are data-only: slider tier values and descriptions, staffing card descriptions, and a programming budget comment. No new UI, no new sliders, no structural changes.

</domain>

<decisions>
## Implementation Decisions

### Digital collections slider — replace 4 placeholder tiers with 5 real tiers

Current config has 4 options ($5k/$10k/$15k/$20k — all PLACEHOLDER). Replace entirely with 5 tiers in this order (URL index 0–4):

| Index | Value  | isCurrentServiceLevel | Description |
|-------|--------|----------------------|-------------|
| 0     | $5,000  | false | Beehive only — substantially longer wait times for digital titles, shared with the entire state library system |
| 1     | $15,000 | false | Beehive + our own digital titles — longer wait times for most titles with a few select accelerated titles that we purchase |
| 2     | $30,000 | false | Beehive + expanded — longer wait times for most titles with some titles reduced via purchases |
| 3     | $55,000 | **true** | Current service level (own Libby: $6k software + ~$28k new content + ~$20k repurchases annually) |
| 4     | $65,000 | false | Beehive + expanded — shorter wait times for most popular books |

- **D-01:** Default selection should move to the current-level tier ($55k, index 3).
- **D-02:** Source attribution: cite the librarian's notes (`NOTES.md`) rather than the old generic FY2025 budget proposal string.
- **D-03:** Expanding from 4 to 5 tiers is safe — all prior values were PLACEHOLDER, no real shared URLs to break.

### Physical collections slider — move current-level marker to $15k

Keep same 5 tiers ($0/$5k/$10k/$15k/$20k). Only change:

- **D-04:** Move `isCurrentServiceLevel: true` from the $10,000 option to the $15,000 option. (Actual 2025 spend: ~$12,515 — books $9,158 + DVDs $438 + exploration kits/equipment $2,919.)
- **D-05:** Update the $15,000 option description to reflect what physical collections actually includes: books, DVDs, exploration kits, and equipment (e.g., telescopes, audiobook players).
- **D-06:** Update the $10,000 option description to reflect a reduced/core collection (books and DVDs, limited specialty items).
- **D-07:** Source attribution: cite NOTES.md.

### Staffing card descriptions — update to reflect real context

Annual costs remain PLACEHOLDER (notes give clerk wages at $12/hr and 84 hrs/week, but not full tiered costs). Only descriptions change:

- **D-08:** "Current" card (1fte-2pte, 44 hrs/week): Update description to reflect the librarian's language — 2 staff working at a time Mon–Fri, 10 hours outside normal 9–5, impact on accessibility.
- **D-09:** "Basic" and "Extended" cards: Update descriptions to reflect reduced accessibility and staff coverage at those levels. Use the librarian's framing that hours outside 9–5 are what enable working citizens to use the library.
- **D-10:** Source field on staffing levels: keep existing "Cache County HR salary schedule FY2025" (cost data not yet real).

### Programming costs — comment only, no new UI

- **D-11:** Add a comment block in `config.js` (near the staffing section or as a standalone comment) documenting the programming cost data from NOTES.md:
  - Summer reading: ~$1,000–$1,500/year
  - Storytime: ~$300/year
  - Other programs: ~$1,000–$2,000/year
  - Total programming estimate: ~$2,300–$4,800/year
  - Note: not currently modeled as a slider — captured here for future reference.

### Draft watermark

- **D-12:** Keep `draft: true`. Staffing costs are still PLACEHOLDER — watermark stays until all numbers are real.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source data
- `.planning/phases/18-incorporate-feedback-from-library-notes/NOTES.md` — Librarian's primary data source. Contains all real cost figures used in this phase. Read this before writing any values.

### Config structure
- `src/_data/config.js` — File being updated. Read the full file before making changes to understand current structure, PLACEHOLDER markers, NON-DEVELOPER EDIT GUIDE, and URL-immutability warnings.

### Prior context (URL encoding constraints)
- `.planning/phases/14-separate-digital-and-physical-collections/14-CONTEXT.md` — Established `delta`/`tau` URL params for digital/physical indices and the 0-based positional encoding rule.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/_data/config.js`: The only file being modified. All site data lives here.
- `src/js/lib/url-helpers.js`: `encodeIndices`/`decodeIndices` use array positions — adding a 5th digital tier adds index 4, which is handled automatically by bounds checking (out-of-range falls to null/default).

### Established Patterns
- Config values are 0-based positional — **never insert in the middle of an array**, always append to end.
- `isCurrentServiceLevel: true` drives amber tick on sliders; exactly one option per slider should have it.
- `isDefault: true` sets the initial slider position on page load — should match the current-level option.
- PLACEHOLDER comments mark values not yet confirmed with real data.

### Integration Points
- No template or JS changes needed — this is a pure data update.
- Tests in `test/config.test.js` validate config structure (array shapes, required fields) — they should still pass after this update. Confirm with `pnpm test`.

</code_context>

<specifics>
## Specific Ideas

- The librarian noted: "Hours open could be changed or lessened but that impacts the accessibility of the library." Use this framing in the staffing card descriptions to help citizens understand the real trade-off.
- The librarian noted that joining the Beehive Consortium "would increase the collection size, lower costs, and increase wait times for items." The 5-tier digital structure explicitly models this trade-off across all tiers.
- Actual 2025 digital breakdown (from NOTES.md): Libby software $6,000 + new purchases $28,292 (305 audiobooks, 154 ebooks) + repurchases $19,509 (103 audiobooks, 290 ebooks). The $55k current tier reflects this.

</specifics>

<deferred>
## Deferred Ideas

- **Programming slider**: Summer reading, storytime, and other programming costs (~$2.3k–$4.8k/year) captured as a comment in config.js. Adding a full programming slider is a new UI capability — separate future phase.
- **Staffing annualCost real values**: Notes give clerk wages ($12/hr, 84 hrs/week) but not full tiered annual costs. Needs Cache County HR data before updating. Tracked in PROJECT.md as a known placeholder.
- **draft: false**: Site remains in draft mode until staffing costs are finalized.

</deferred>

---

*Phase: 18-incorporate-feedback-from-library-notes*
*Context gathered: 2026-03-29*
