---
phase: 02-data-and-controls
verified: 2026-03-20T20:30:00Z
status: human_needed
score: 11/12 must-haves verified
human_verification:
  - test: "Confirm CONF-02 intent is satisfied by the select dropdown"
    expected: "User can control collections budget independently of staffing — either as a binary toggle or as a budget-amount selector"
    why_human: "CONF-02 says 'toggle collections budget on/off independently of staffing'. The user directed a change from checkbox to select dropdown at the human-verify checkpoint. The select provides independent control of the budget amount but does not allow setting collections to zero/off. Whether this satisfies the on/off intent requires product owner confirmation."
---

# Phase 02: Data and Controls Verification Report

**Phase Goal:** Establish the complete data schema and all interactive controls so the page renders a fully structured form with real data.
**Verified:** 2026-03-20T20:30:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | All costs, staffing levels, collections info, and city data live in config.js with no values hardcoded elsewhere | VERIFIED | `src/_data/config.js` contains full schema; `grep -E '\$[0-9]' src/index.html` returns zero matches |
| 2  | A non-developer can update any cost or city name by editing only src/_data/config.js — inline comments explain what to change | VERIFIED | Block comment "NON-DEVELOPER EDIT GUIDE" at top of config.js covers cost changes, city name/household changes, and adding a new city |
| 3  | A non-developer can understand which values to edit by reading the inline comments | VERIFIED | Block comment and 8x `// PLACEHOLDER` comments on every numeric value line |
| 4  | Adding a new city object to the cities array requires no other file changes | VERIFIED | Template uses `{% for city in config.cities %}` — adding to the array automatically renders a new checkbox |
| 5  | Staffing radio buttons render from config.staffingLevels with cost and description visible | VERIFIED | Built output: 3 radio inputs, costs shown as "$150,000/year", "$190,000/year", "$230,000/year"; descriptions present |
| 6  | Collections checkbox renders from config.collections with cost and description visible | VERIFIED (with note) | Implementation used a select dropdown (user-directed change) rather than checkbox. Select renders 6 options ($10k–$60k), $30k pre-selected; description and citation present |
| 7  | City checkboxes render from config.cities with household counts visible | VERIFIED | Built output: 4 checkboxes; household counts shown as "2,100", "1,800", "950", "620" via toLocaleString filter |
| 8  | Source citations appear for staffing costs, collections budget, and household counts | VERIFIED | `grep -c '<cite' _site/index.html` returns 8 (3 staffing + 1 collections + 4 cities) |
| 9  | Explanatory copy is present alongside each staffing level and the collections toggle | VERIFIED | `<p>` description rendered under each staffing radio; collections description rendered below select |
| 10 | No cost value, label, or city name is hardcoded in the template — all come from config | VERIFIED | `grep -E '\$[0-9]' src/index.html` returns zero matches; all labels, costs, household counts from Nunjucks expressions |
| 11 | window.LIBRARY_DATA contains the full config object for Phase 3 | VERIFIED | Built output contains unescaped JSON with siteName, staffingLevels[3], collections.options[6], cities[4] — no `&quot;` escaping |
| 12 | CONF-02: User can toggle collections budget on/off independently of staffing | NEEDS HUMAN | User directed a change from checkbox (on/off) to select dropdown (budget amount). Select provides independent control but does not allow setting collections to zero. CONF-02 says "on/off" — human must confirm intent is satisfied |

**Score:** 11/12 truths verified (1 needs human confirmation)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/_data/config.js` | Full data schema with staffingLevels array, collections object, cities array | VERIFIED | 104 lines; `export default` ESM; staffingLevels[3], collections.options[6], cities[4]; NON-DEVELOPER EDIT GUIDE block comment; 8x PLACEHOLDER comments |
| `eleventy.config.js` | toLocaleString Nunjucks filter | VERIFIED | `addFilter("toLocaleString", ...)` present; `htmlTemplateEngine: "njk"` added (required fix for Nunjucks in .html files) |
| `src/js/calculator.js` | Phase 3 placeholder | VERIFIED | 2-line comment file; "Phase 3 will implement this file" present; `_site/js/calculator.js` exists after build |
| `src/index.html` | Complete form with data-driven controls, citations, descriptions, LIBRARY_DATA embedding | VERIFIED | 100 lines; all controls present; min_lines 80 satisfied |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/index.html` | `src/_data/config.js` | Nunjucks for loops over config.staffingLevels, config.cities | VERIFIED | `{% for level in config.staffingLevels %}` and `{% for city in config.cities %}` present and producing 3 radios + 4 checkboxes in built output |
| `src/index.html` | `window.LIBRARY_DATA` | `config \| dump \| safe` filter in script tag | VERIFIED | `window.LIBRARY_DATA = {{ config \| dump \| safe }};` renders valid unescaped JSON in `_site/index.html` |
| `src/index.html staffing radios` | Phase 3 calculator | `data-cost` attribute | VERIFIED | `data-cost=` appears 4 times in built output (3 staffing radios + 1 select); staffing radio `data-cost` values are 150000, 190000, 230000 |
| `src/index.html city checkboxes` | Phase 3 calculator | `data-households` attribute | VERIFIED | `data-households=` appears 4 times in built output with correct values (2100, 1800, 950, 620) |
| `eleventy.config.js` | `src/index.html` | `toLocaleString` filter | VERIFIED | Filter registered; built output shows "150,000", "190,000", "230,000", "2,100", "1,800" — toLocaleString applied correctly |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| DATA-01 | 02-01-PLAN | All costs and household counts live in a single `_data/config.js` with inline comments | SATISFIED | config.js is the single source of truth; 8 PLACEHOLDER inline comments; all values as integers |
| DATA-02 | 02-01-PLAN | Adding or removing a city requires editing only the data file | SATISFIED | Template iterates `{% for city in config.cities %}` — adding a city object to the array requires no template changes |
| DATA-03 | 02-01-PLAN | Data file simple enough to edit via GitHub web UI without local dev environment | SATISFIED | NON-DEVELOPER EDIT GUIDE block comment; plain JavaScript with no complex logic or build-time transforms in config.js itself |
| CONF-01 | 02-02-PLAN | User can select a staffing level via radio buttons | SATISFIED | 3 radio inputs with name="staffing"; first radio pre-checked via `{% if loop.first %}checked{% endif %}` |
| CONF-02 | 02-02-PLAN | User can toggle collections budget on/off independently of staffing | NEEDS HUMAN | User-directed change replaced checkbox with select dropdown. Select allows independent budget adjustment ($10k–$60k) but does not offer a zero/off option. Whether this satisfies the on/off intent requires confirmation |
| CONF-03 | 02-02-PLAN | User can check/uncheck participating cities (Providence, Nibley, Millville, River Heights + data-driven for future additions) | SATISFIED | 4 city checkboxes, all checked by default, data-driven via Nunjucks loop |
| TRST-01 | 02-02-PLAN | Source citations shown for cost estimates and household counts | SATISFIED | 8 `<cite>` elements in built output covering all 3 staffing levels, collections, and 4 cities |
| TRST-02 | 02-02-PLAN | Explanatory copy alongside each choice dimension | SATISFIED | `<p>` descriptions rendered under each staffing radio and under collections select |

**Orphaned requirements:** None. All 8 requirement IDs declared in plan frontmatter are accounted for. REQUIREMENTS.md traceability table lists DATA-01 through DATA-03 and CONF-01 through CONF-03, TRST-01, TRST-02 as Phase 2 Complete — consistent with what the plans claimed.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/js/calculator.js` | 1-2 | File is entirely a placeholder comment | Info | Expected — Phase 3 will implement. Not a blocker for Phase 2 goal |

No blocker anti-patterns found. No TODO/FIXME in template or data files. No empty function handlers. No stub API responses. The calculator.js placeholder is intentional and documented.

### Human Verification Required

#### 1. CONF-02 Collections On/Off Intent

**Test:** Open the rendered page. Confirm with the product owner whether the collections budget select dropdown (showing $10,000/year through $60,000/year) satisfies the requirement to "toggle collections budget on/off independently of staffing."

**Expected:** Product owner confirms either (a) the select is acceptable because users can explore budget scenarios rather than binary on/off, OR (b) a zero option or separate checkbox is needed to allow fully excluding collections.

**Why human:** CONF-02 says "on/off" but the implementation (user-directed at the checkpoint) uses a select with a minimum of $10,000. No automated check can determine whether the product intent was binary toggle or budget exploration. The user who directed the change may have intended to supersede the original requirement, but this needs explicit confirmation.

#### 2. Visual correctness in browser

**Test:** Run `pnpm run dev` and open the local URL. Verify:
- Page heading shows "Cache County Library Service Choices"
- Staffing Level section has 3 radio buttons with costs and descriptions
- Collections Budget section has a dropdown showing $10,000–$60,000 with $30,000 pre-selected
- Participating Cities section has 4 checkboxes with household counts
- Every section has a "Source:" citation line
- Layout is centered with gray fieldset backgrounds
- Open DevTools console and type `window.LIBRARY_DATA` — verify full config object is present

**Expected:** All controls visible, readable, and correctly populated. window.LIBRARY_DATA returns an object with staffingLevels, collections, and cities arrays.

**Why human:** Tailwind class rendering, visual spacing, readability, and browser console inspection cannot be verified programmatically.

### Gaps Summary

No gaps block the phase goal. The phase objective — "fully structured form with real data" — is achieved: config.js is the single source of truth, all form controls render from that data via Nunjucks loops, source citations and descriptions are present, data attributes are wired for Phase 3, and window.LIBRARY_DATA is correctly embedded.

One requirement (CONF-02) has an implementation that diverged from its literal "on/off" specification via a user-directed change at the human-verify checkpoint. This needs product owner confirmation but does not block the core phase goal.

---

_Verified: 2026-03-20T20:30:00Z_
_Verifier: Claude (gsd-verifier)_
