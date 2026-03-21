---
phase: 08-hours-open-schedule-display
verified: 2026-03-21T22:10:00Z
status: passed
score: 5/5 must-haves verified
re_verification: false
---

# Phase 8: Hours Open Schedule Display Verification Report

**Phase Goal:** Display each staffing option's weekly hours-open schedule inline in the UI
**Verified:** 2026-03-21T22:10:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The staffing section heading reads "Hours Open" — no "Staffing Level" text visible anywhere | VERIFIED | `_site/index.html` line 22: `<legend ... >Hours Open</legend>`; `grep -c "Staffing Level" _site/index.html` = 0 |
| 2 | Each staffing radio option shows a schedule table (days + hours) directly below the label, always visible | VERIFIED | 3 `<table>` elements in built output, one per staffing option, inside the Nunjucks for-loop with no JS toggle; `grep -c "<table" _site/index.html` = 3 |
| 3 | Schedule data in config.js uses structured {days, open, close} arrays with 12-hour format | VERIFIED | `src/_data/config.js` lines 100-102, 111-113, 122-125: all three staffingLevels have `schedule:` arrays with `{days, open, close}` shape using `"11am"`, `"10am"`, `"4pm"`, `"5pm"`, `"6pm"`, `"2pm"` |
| 4 | The NON-DEVELOPER EDIT GUIDE in config.js covers schedule editing with a copy-pasteable two-row example | VERIFIED | `src/_data/config.js` lines 46-72: contains "To change open/close hours", "To add a schedule row", day-number key, and copy-pasteable two-row `schedule: [...]` example |
| 5 | URL `?staffing=1fte-2pte` still restores the correct radio selection — url.js is untouched | VERIFIED | `src/js/url.js` unchanged (staffing restoration logic lines 41-52 intact); `data-cost` preserved on all 3 radio inputs in built output |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/_data/config.js` | schedule arrays on each staffingLevel + extended edit guide | VERIFIED | All 3 staffingLevel objects have `schedule:` arrays; edit guide lines 46-72 cover schedule editing with copy-pasteable example; `// URL-IMMUTABLE` comments on all 3 `id:` lines |
| `eleventy.config.js` | formatDays Nunjucks filter | VERIFIED | Lines 13-28: `addFilter("formatDays", ...)` registered immediately after `toLocaleString`; uses `2024-01-01T12:00:00Z` reference date, `timeZone: "UTC"`, handles single-day and range inputs |
| `src/index.html` | Hours Open heading + schedule tables in staffing fieldset | VERIFIED | Line 22: `Hours Open` legend; lines 39-54: `<table>` with `<thead scope="col">` headers and `{% for row in level.schedule %}` body; `<time>` wrapping on open/close values; `<cite>` removed from staffing loop only |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/index.html` | `eleventy.config.js` | `formatDays` Nunjucks filter call | VERIFIED | `src/index.html` line 49: `{{ row.days \| formatDays }}`; built output line 41 shows `Monday–Friday` (filter executed at build time) |
| `src/index.html` | `src/_data/config.js` | `level.schedule` array in Nunjucks for loop | VERIFIED | `src/index.html` line 47: `{% for row in level.schedule %}`; built output renders 4 schedule rows across 3 staffing options |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| HOURS-01 | 08-01-PLAN.md | Staffing section heading reads "Hours Open" (not "Staffing Level") | SATISFIED | `_site/index.html`: `<legend>Hours Open</legend>` present; zero instances of "Staffing Level" in built output |
| HOURS-02 | 08-01-PLAN.md | Each staffing option displays its weekly schedule inline, always visible below the radio label (no JS toggle needed) | SATISFIED | 3 `<table>` elements in built output, rendered server-side via Nunjucks with no client-side JS involved |
| HOURS-03 | 08-01-PLAN.md | Schedule data is structured in config.js as an array of {days, open, close} entries using 12-hour format | SATISFIED | `src/_data/config.js` lines 100-125: all three schedule arrays use 12-hour strings (`"11am"`, `"4pm"`, etc.) |
| HOURS-04 | 08-01-PLAN.md | Site owner can update schedules via GitHub web UI — NON-DEVELOPER EDIT GUIDE covers schedule format with a copy-pasteable example | SATISFIED | `src/_data/config.js` lines 46-72: three subsections covering change, add, and remove operations; copy-pasteable two-row example at lines 68-72 |
| HOURS-05 | 08-01-PLAN.md | Existing URL encoding for staffing selections (?staffing=1fte-2pte) continues to work unchanged | SATISFIED | `src/js/url.js` unmodified (confirmed by source read); `data-cost` on all 3 radio inputs preserved in built output (`grep -c "data-cost" _site/index.html` = 3) |

All 5 requirement IDs declared in the plan are accounted for. No orphaned requirements found in REQUIREMENTS.md for Phase 8.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/_data/config.js` | 99, 110, 121 | `// PLACEHOLDER` on annualCost values | Info | Pre-existing from earlier phases; intentional marker for future real data; does not affect schedule display functionality |
| `src/_data/config.js` | 150, 157, 164, 171 | `// PLACEHOLDER` on households values | Info | Pre-existing from earlier phases; outside scope of Phase 8 |

No blockers or warnings. All PLACEHOLDER comments are pre-existing and intentional, not introduced by Phase 8.

---

### Human Verification Required

#### 1. Visual schedule table rendering

**Test:** Run `pnpm start`, open the page in a browser, and inspect all three staffing options.
**Expected:** Each option shows a schedule table with "Days" and "Hours" column headers; day names render as "Monday–Friday" and "Saturday" (not numeric codes); time ranges display with en dash separator.
**Why human:** Visual rendering quality and en dash vs hyphen distinction cannot be confirmed by grep alone.

#### 2. Calculator integration after staffing switch

**Test:** Load the page, switch between the three staffing radio options.
**Expected:** The result bar at the bottom updates the cost figure each time a different option is selected.
**Why human:** Requires browser runtime execution of `calculator.js`.

#### 3. URL restoration with `?staffing=1fte-2pte`

**Test:** Open the page with `?staffing=1fte-2pte` in the URL.
**Expected:** The "Current" (third) radio option is pre-selected on load.
**Why human:** Requires browser runtime execution of `url.js` restoration logic.

Note: The SUMMARY documents that a human checkpoint (Task 3) was completed and approved during the plan execution. The above items are listed for completeness as they cannot be re-verified programmatically.

---

### Build Verification

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| `pnpm build` exit | 0 | 0 (success) | Yes |
| `Hours Open` in `_site/index.html` | >= 1 | 1 | Yes |
| `Staffing Level` in `_site/index.html` | 0 | 0 | Yes |
| `<table` in `_site/index.html` | 3 | 3 | Yes |
| `data-cost` in `_site/index.html` | 3 | 3 | Yes |
| `<cite` outside staffing section | All outside staffing | 5 (1 Collections + 4 Cities) | Yes |
| `Monday` in `_site/index.html` | >= 1 (formatDays working) | 3 | Yes |
| `scope="col"` in `_site/index.html` | 6 (2 headers x 3 tables) | 6 | Yes |
| `<time>` lines in `_site/index.html` | >= 3 lines (>= 6 elements) | 4 lines (8 elements) | Yes |

Note on cite count: The plan acceptance criterion stated "exactly 2 matches" but there are 4 cities rendered individually, each with a `<cite>`. The 5 cites in the built output are all outside the staffing fieldset (1 Collections, 4 Cities). The requirement HOURS-02 intent — no cites in staffing section — is fully satisfied.

---

### Commits Verified

| Hash | Description | Present |
|------|-------------|---------|
| `82ca175` | feat(08-01): add schedule data to config.js and register formatDays filter | Yes |
| `dbb0784` | feat(08-01): rename staffing heading to Hours Open and add schedule tables | Yes |
| `68a496d` | docs(08-01): update labels and schedule data to match built UI (Basic/Extended/Current) | Yes |

---

## Summary

Phase 8 goal achieved. All five must-have truths are verified against the actual codebase:

- The heading is "Hours Open" with zero residual "Staffing Level" text.
- All three staffing options render inline schedule tables (no JavaScript) with semantic `<thead scope="col">` structure and `<time>` elements.
- Config data uses the correct `{days, open, close}` structure with 12-hour format strings.
- The NON-DEVELOPER EDIT GUIDE is complete with change/add/remove guidance and a copy-pasteable two-row example.
- `url.js` is unchanged and `data-cost` attributes are preserved, ensuring URL-based radio restoration continues to work.

Three human-verifiable items are noted (visual quality, calculator runtime, URL restoration) but the SUMMARY confirms these were checked at the Task 3 human-verify checkpoint during execution.

---

_Verified: 2026-03-21T22:10:00Z_
_Verifier: Claude (gsd-verifier)_
