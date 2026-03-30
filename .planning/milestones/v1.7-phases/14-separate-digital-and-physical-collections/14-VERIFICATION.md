---
phase: 14-separate-digital-and-physical-collections
verified: 2026-03-28T00:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification: false
---

# Phase 14: Separate Digital and Physical Collections Verification Report

**Phase Goal:** Separate digital and physical collections budget into two independently-controlled sliders
**Verified:** 2026-03-28
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Digital slider and physical slider move independently — changing one does not affect the other's value or display | VERIFIED | Tick click handler scoped via `data-slider` attribute; `updateSliderLabels` queries `[data-slider="sliderId"]` — no cross-slider coupling possible |
| 2 | Total cost in result bar equals staffing cost + digital budget + physical budget | VERIFIED | `calculator.js:42` — `var totalCost = getStaffingCost() + getDigitalCost() + getPhysicalCost();` |
| 3 | Shared URL with delta and tau params restores both slider positions correctly on page load | VERIFIED | `url.js:81-100` — delta restores `collections-digital`, tau restores `collections-physical`, each with bounds checking |
| 4 | Amber current-level tick appears on the correct tick for each slider independently | VERIFIED | `slider.njk:23-25` — `data-current-level="true"` conditional on `isCurrentServiceLevel`; `calculator.js:64-69` — amber class toggled independently per slider via scoped query |
| 5 | NON-DEVELOPER EDIT GUIDE documents both collectionsDigital and collectionsPhysical keys | VERIFIED | `config.js:33-45` — two separate EDIT GUIDE entries; `config.js:81-92` — compact URLs warning lists delta, collectionsDigital, and collectionsPhysical |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/_data/config.js` | collectionsDigital and collectionsPhysical config keys | VERIFIED | `collectionsDigital` at line 153 (4 options, values 5k/10k/15k/20k, isCurrentServiceLevel on 15k); `collectionsPhysical` at line 166 (5 options, values 0/5k/10k/15k/20k, isCurrentServiceLevel on 10k); old `collections` key absent |
| `src/_includes/macros/slider.njk` | Reusable slider macro | VERIFIED | `{% macro collectionSlider(` at line 1; `data-slider="{{ id }}"` at line 21; `data-current-level="true"` conditional at line 23; step computed dynamically at line 13; tick class `text-sm` at line 24 |
| `src/index.html` | Two macro calls inside Collections Budget fieldset | VERIFIED | Macro import at line 1; digital macro call lines 73-81; `<hr>` separator at line 82; physical macro call lines 83-91; no `id="collections"` or `config.collections.source` remaining |
| `src/js/calculator.js` | Two-slider cost calculation | VERIFIED | `getDigitalCost()` at line 15; `getPhysicalCost()` at line 20; three-component total at line 42; `updateSliderLabels(sliderId, dataKey, amountId, descriptionId)` at line 50; `updateAllSliderLabels()` wrapper at line 73; scoped tick handler at line 111 |
| `src/js/url.js` | delta + tau URL encoding | VERIFIED | `params.set('delta',` at line 31; `params.set('tau',` at line 41; `params.get('delta')` at line 82; `params.get('tau')` at line 93; no `data.collections.` refs; verbose backward-compat branch removed |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/index.html` | `src/_includes/macros/slider.njk` | Nunjucks macro import | WIRED | Line 1: `{% from "macros/slider.njk" import collectionSlider %}` — macro called twice in Collections Budget fieldset |
| `src/js/calculator.js` | `src/index.html` | DOM element IDs | WIRED | `getElementById('collections-digital')` at line 16; `getElementById('collections-physical')` at line 21; matching `id="collections-digital"` and `id="collections-physical"` rendered by macro |
| `src/js/url.js` | `src/_data/config.js` | `window.LIBRARY_DATA.collectionsDigital` | WIRED | `data.collectionsDigital.options.findIndex(...)` at line 28; `data.collectionsPhysical.options.findIndex(...)` at line 38; `LIBRARY_DATA` inlined from config via `window.LIBRARY_DATA = {{ config \| dump \| safe }}` in index.html |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| COLL-01 | 14-01-PLAN.md | `collections` config key replaced with `collectionsDigital` and `collectionsPhysical` — old blended key removed entirely | SATISFIED | `config.js:153-178` — both new keys present; no bare `collections:` key found anywhere |
| COLL-02 | 14-01-PLAN.md | Reusable Nunjucks macro (`collectionSlider`) renders both sliders from same template with different parameters | SATISFIED | `src/_includes/macros/slider.njk` — parameterized macro; both calls in `index.html` use same macro |
| COLL-03 | 14-01-PLAN.md | Two stacked sliders inside Collections Budget fieldset — digital on top, physical below, each with own description and source citation | SATISFIED | `index.html:71-92` — fieldset with digital macro, `<hr>`, physical macro; macro renders `<p id="descriptionId">` and `<cite>Source: {{ source }}</cite>` for each |
| COLL-04 | 14-01-PLAN.md | Total tax = staffing cost + digital budget + physical budget (additive, no floor/ceiling) | SATISFIED | `calculator.js:42` — `getStaffingCost() + getDigitalCost() + getPhysicalCost()` |
| COLL-05 | 14-01-PLAN.md | URL encoding uses `tau` for physical collections index and `delta` for digital collections index | SATISFIED | `url.js:24-41` encode; `url.js:81-101` restore; bounds-checking silently falls to default on out-of-range |
| COLL-06 | 14-01-PLAN.md | Both sliders display Phase 13 amber current-level tick independently via `isCurrentServiceLevel` flag and `data-current-level` attribute | SATISFIED | `slider.njk:23,25` — conditional `data-current-level="true"` and amber classes; `calculator.js:64-70` — scoped toggle preserves amber when not active |
| COLL-07 | 14-01-PLAN.md | NON-DEVELOPER EDIT GUIDE in config.js updated to document both `collectionsDigital` and `collectionsPhysical` keys | SATISFIED | `config.js:33-45` — two "To change a ... collections description" entries; `config.js:81-92` — compact URLs warning includes delta, collectionsDigital, collectionsPhysical |

All 7 requirements satisfied. No orphaned requirements.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/_data/config.js` | 119, 130, 141 | `// PLACEHOLDER` comments on staffing `annualCost` values | Info | Pre-existing from prior phases — not introduced by phase 14; unrelated to collections sliders |

No blockers or warnings introduced by this phase.

---

### Human Verification Required

#### 1. Visual layout — two stacked sliders

**Test:** Open `localhost:8080` after `npx @11ty/eleventy --serve`. Scroll to Collections Budget fieldset.
**Expected:** Two labeled sliders ("Digital collections budget" above, "Physical print collections budget" below), separated by a horizontal rule. Each has tick buttons and a source citation.
**Why human:** Visual rendering and layout cannot be verified by static file analysis.

#### 2. Slider independence — live interaction

**Test:** Move digital slider to $20k. Observe physical slider. Then move physical slider to $0. Observe digital slider.
**Expected:** Each slider moves without affecting the other's position, description text, or amount display.
**Why human:** DOM interaction and real-time event behavior require a browser.

#### 3. Three-component total cost display

**Test:** Set staffing to Basic ($150k), digital to $10k, physical to $5k. Observe result bar.
**Expected:** Result bar shows `$165,000 / households` (or per-household equivalent).
**Why human:** Numerical display and live calculation require browser interaction.

#### 4. URL round-trip for both params

**Test:** Move digital to $20k (index 3), physical to $0 (index 0). Copy URL. Open fresh tab and paste.
**Expected:** URL contains `delta=3&tau=0`. Both sliders restore to correct positions on load.
**Why human:** URL state, page reload, and slider restoration require browser interaction.

#### 5. Amber current-level ticks on both sliders

**Test:** Load the page fresh (default state). Inspect the $15k tick on digital and $10k tick on physical.
**Expected:** Both ticks display in amber. Moving either slider away from its current-level value restores amber when that tick is no longer active.
**Why human:** Visual color state and toggle behavior require browser inspection.

---

### Gaps Summary

None. All five observable truths are verified, all seven requirement IDs are satisfied, and all three key links are wired end-to-end. The Eleventy build completes without errors (1 file written in 0.17s). The only notes are pre-existing staffing PLACEHOLDER comments from earlier phases, unrelated to this phase's deliverables.

---

_Verified: 2026-03-28_
_Verifier: Claude (gsd-verifier)_
