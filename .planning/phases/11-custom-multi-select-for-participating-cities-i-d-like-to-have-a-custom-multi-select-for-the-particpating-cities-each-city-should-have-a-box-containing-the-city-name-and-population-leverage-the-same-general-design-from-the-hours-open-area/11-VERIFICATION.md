---
phase: 11-custom-multi-select-participating-cities
verified: 2026-03-21T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
re_verification: false
human_verification:
  - test: "Click anywhere on a city card surface (not just text)"
    expected: "Card toggles to gray (unselected) and back to blue (selected) — entire label surface is the click target"
    why_human: "Cannot verify pointer hit-target area programmatically; requires browser interaction"
  - test: "Tab through city cards, press Space on a focused card"
    expected: "Visible focus ring appears on the card wrapper (not the hidden checkbox); Space toggles selection"
    why_human: "Keyboard focus ring appearance and Space key behavior require browser verification"
  - test: "Uncheck all 4 city cards"
    expected: "Result bar shows 'Select at least one city' zero-city guard message"
    why_human: "JavaScript runtime behavior — cannot verify from static HTML"
  - test: "Toggle a city card, observe browser URL bar"
    expected: "phi param updates in the URL query string to reflect current city selection"
    why_human: "URL encoding round-trip is a JavaScript runtime behavior"
---

# Phase 11: Custom City Card Multi-Select Verification Report

**Phase Goal:** City selections are presented as clickable full-width card elements matching the Phase 10 staffing card design, each showing city name, household count, and source citation — making city selection visually consistent with the rest of the configurator.
**Verified:** 2026-03-21
**Status:** HUMAN_NEEDED — all automated checks pass; browser verification required for interaction and runtime behavior
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                                  | Status     | Evidence                                                                                      |
|----|--------------------------------------------------------------------------------------------------------|------------|-----------------------------------------------------------------------------------------------|
| 1  | Each city displays as a full-width clickable card with city name, household count, and source citation | VERIFIED   | `src/index.html` lines 100-126: label card wraps city name span, households p, cite block     |
| 2  | Clicking anywhere on a city card toggles its checkbox selection                                        | HUMAN NEEDED | Markup is correct (label[for] wraps sr-only input); click-target behavior needs browser test |
| 3  | Selected city cards show blue ring and blue-50 background; unselected show gray — CSS-only             | VERIFIED   | `has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600` at line 103   |
| 4  | Tab and Space keyboard navigation works with visible focus ring on card wrapper                        | HUMAN NEEDED | `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600` present (line 105); runtime behavior needs browser test |
| 5  | calculator.js and url.js integration contracts preserved — no JS files modified                        | VERIFIED   | Both JS files last modified in Phase 10 (18:33) and Phase 9 (16:55); Phase 11 commit (20:34) touches only `src/index.html` |

**Score:** 5/5 truths verified (3 fully automated, 2 require browser confirmation)

### Required Artifacts

| Artifact        | Expected                                            | Status     | Details                                                                                                 |
|-----------------|-----------------------------------------------------|------------|---------------------------------------------------------------------------------------------------------|
| `src/index.html` | City card multi-select UI replacing inline checkbox | VERIFIED   | Lines 96-128: cities fieldset contains full-width card labels with sr-only checkboxes, no old flex pattern |

**Level 1 — Exists:** `src/index.html` exists.
**Level 2 — Substantive:** Contains `has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600` at line 103 (cities fieldset). Old `flex items-center gap-2 min-h-[44px]` inline pattern is absent. Contains `class="sr-only"` on city checkboxes (line 114).
**Level 3 — Wired:** City fieldset is inside `<form id="configurator">`. Both `calculator.js` and `url.js` are loaded via `<script>` tags at lines 169-170 and query `input[name="cities"]` — the name attribute is present at line 110.

### Key Link Verification

| From             | To                   | Via                                                   | Status  | Details                                                                                                         |
|------------------|----------------------|-------------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------|
| `src/index.html` | `src/js/calculator.js` | `input[name="cities"]:checked` + `data-households`   | WIRED   | `name="cities"` at line 110; `data-households="{{ city.households }}"` at line 113; `value="{{ city.id }}"` at line 112 |
| `src/index.html` | `src/js/url.js`       | `input[name="cities"]` value for phi encoding        | WIRED   | `value="{{ city.id }}"` at line 112; url.js reads `cb.value` and `form.querySelectorAll('input[name="cities"]')` |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                                                   | Status    | Evidence                                                                                           |
|-------------|-------------|---------------------------------------------------------------------------------------------------------------|-----------|----------------------------------------------------------------------------------------------------|
| CITY-01     | 11-01-PLAN  | City options as clickable full-width card elements wrapping sr-only checkbox — entire card is click target    | SATISFIED | `label[for="city-{{ city.id }}"]` wraps `input[type="checkbox"][class="sr-only"]` — lines 100-126 |
| CITY-02     | 11-01-PLAN  | Each city card shows city name, household count, and source citation with link                                | SATISFIED | `span` (city name, line 117), `p` (households, line 118), `cite` with sourceLink conditional (lines 119-125) |
| CITY-03     | 11-01-PLAN  | Selected card shows ring-2 ring-blue-600 + bg-blue-50; unselected bg-gray-50 + border-gray-200 — CSS-only    | SATISFIED | `has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-600` at line 103; no JS added |
| CITY-04     | 11-01-PLAN  | Tab and Space keyboard navigation works; focus-visible ring on card wrapper via has-[:focus-visible]          | SATISFIED (code) / HUMAN for runtime | `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600` at line 105 |
| CITY-05     | 11-01-PLAN  | Existing calculator.js and url.js integration contracts preserved — name, value, data-households unchanged    | SATISFIED | Commit 5c45b11 modifies only `src/index.html`; calculator.js last touched at 18:33 (Phase 10), Phase 11 at 20:34 |

All 5 requirement IDs declared in the PLAN frontmatter are accounted for. No orphaned requirements found in REQUIREMENTS.md for Phase 11.

### Anti-Patterns Found

| File             | Line | Pattern             | Severity | Impact  |
|------------------|------|---------------------|----------|---------|
| None found       | —    | —                   | —        | —       |

Anti-pattern scan results:
- No TODO/FIXME/PLACEHOLDER comments in `src/index.html`
- No `return null`, empty handlers, or stub implementations
- No `accent-blue-600` on city checkboxes (correctly removed)
- No old `flex items-center gap-2 min-h-[44px]` inline checkbox wrapper pattern
- No hardcoded empty arrays or static data standing in for dynamic content
- `defaultChecked` uses bare attribute pattern (`{% if city.defaultChecked %}checked{% endif %}`) — correct, not `checked="false"` anti-pattern

### Eleventy Build

Build completes successfully: `[11ty] Copied 4 Wrote 1 file in 0.07 seconds (v3.1.5)`.

Built `_site/index.html` contains:
- 4 instances of `name="cities"` (one per city)
- 4 instances of `data-households=` (one per city)
- 7 instances of `class="sr-only"` (4 city + 3 staffing)
- 7 instances of `has-[:checked]:bg-blue-50` (4 city cards + 3 staffing cards)
- 5 `<cite>` elements (4 city sources + 1 collections source)
- 0 instances of old `flex items-center gap-2` pattern

### Human Verification Required

#### 1. Card click-target surface

**Test:** Open the app in a browser. Click the blank area inside a city card (not on the text).
**Expected:** The card toggles selection state — entire label surface responds, not just the text.
**Why human:** Pointer event hit-testing cannot be confirmed from static HTML analysis.

#### 2. Keyboard navigation and Space toggle

**Test:** Tab into the city cards section, observe focus ring, press Space.
**Expected:** Visible focus ring appears on the card wrapper (not inside it); Space toggles the checkbox and updates card color.
**Why human:** CSS `has-[:focus-visible]` behavior and Space key handling require a live browser with rendered CSS.

#### 3. Zero-city guard

**Test:** Uncheck all 4 city cards.
**Expected:** Result bar shows "Select at least one city" message instead of a dollar amount.
**Why human:** This is runtime JavaScript behavior in `calculator.js` — cannot verify from static HTML.

#### 4. URL phi param encoding

**Test:** Toggle a city card. Observe the URL bar.
**Expected:** The `phi` query param updates to reflect current city selection after each toggle.
**Why human:** URL encoding is a `url.js` runtime behavior triggered by input events — not visible in static markup.

### Gaps Summary

No gaps. All automated checks pass — the city card markup, integration contracts, CSS-only selection pattern, and JS file preservation are all correctly implemented. The four human verification items above are runtime behavior confirmations, not blockers; the code structure supporting each is verified present.

The SUMMARY claim of "plan executed exactly as written" is confirmed by the source — `src/index.html` lines 96-128 match the exact target markup specified in the PLAN `<action>` block.

---

_Verified: 2026-03-21_
_Verifier: Claude (gsd-verifier)_
