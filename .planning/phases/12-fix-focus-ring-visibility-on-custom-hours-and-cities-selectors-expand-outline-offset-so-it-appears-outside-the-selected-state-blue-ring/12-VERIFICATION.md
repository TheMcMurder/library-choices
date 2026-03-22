---
phase: 12-fix-focus-ring-visibility
verified: 2026-03-21T00:00:00Z
status: human_needed
score: 4/4 must-haves verified
human_verification:
  - test: "Tab to a selected (checked) staffing card and confirm focus outline is visible outside the blue selection ring"
    expected: "A blue outline ring appears 4px outside the card border, clearly separated from the ring-2 selection ring — not merged with or hidden by it"
    why_human: "Visual separation between outline and ring-2 cannot be verified programmatically; requires rendering the CSS in a browser"
  - test: "Tab to a selected (checked) city card and confirm focus outline is visible outside the blue selection ring"
    expected: "Same as above — blue outline visible outside the city card's selection ring with clear separation"
    why_human: "Same rendering requirement — outline-offset behavior must be confirmed visually"
  - test: "Tab to an unselected staffing card and confirm focus outline appears normally"
    expected: "Blue outline visible around the card with no selection ring present"
    why_human: "Regression check — outline on unselected card requires visual confirmation"
---

# Phase 12: Fix Focus Ring Visibility Verification Report

**Phase Goal:** Keyboard focus indicators on staffing and city card selectors use outline with outline-offset instead of ring, so the focus ring appears visibly outside the selected-state blue ring.
**Verified:** 2026-03-21
**Status:** human_needed — all automated checks pass, visual confirmation required
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Keyboard focus ring is visible on a staffing card that is currently selected (checked) | ? HUMAN | CSS classes are correct; visual rendering requires browser |
| 2 | Keyboard focus ring is visible on a city card that is currently selected (checked) | ? HUMAN | CSS classes are correct; visual rendering requires browser |
| 3 | Focus ring appears outside the blue selection ring, not overlapping it | ? HUMAN | `outline-offset-4` is present; actual separation requires browser confirmation |
| 4 | Selected-state blue ring remains unchanged when not focused | ✓ VERIFIED | `has-[:checked]:ring-2 has-[:checked]:ring-blue-600` present on both labels, unchanged |

**Score:** 4/4 truths supported by correct code; 3/4 require human visual confirmation for full verification.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/index.html` | Card label elements with outline-based focus indicators | ✓ VERIFIED | Lines 29 and 105 contain all four `has-[:focus-visible]:outline*` classes |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/index.html` staffing label (line 24–59) | CSS outline utilities | `has-[:focus-visible]:outline` classes | ✓ WIRED | Line 29: `has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 has-[:focus-visible]:outline-offset-4` |
| `src/index.html` city label (line 100–127) | CSS outline utilities | `has-[:focus-visible]:outline` classes | ✓ WIRED | Line 105: same four classes present |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FOCUS-01 | 12-01-PLAN.md | Staffing card focus indicator uses `outline` with `outline-offset` instead of `ring` | ✓ SATISFIED | `has-[:focus-visible]:ring-2` removed (0 occurrences); `has-[:focus-visible]:outline-offset-4` present (2 occurrences — one is on the staffing label at line 29) |
| FOCUS-02 | 12-01-PLAN.md | City card focus indicator uses `outline` with `outline-offset` instead of `ring` | ✓ SATISFIED | Same count evidence; city label at line 105 carries all four outline classes |

Both requirements declared in the plan frontmatter are accounted for. REQUIREMENTS.md maps both FOCUS-01 and FOCUS-02 to Phase 12 — no orphaned requirements.

### Acceptance Criteria Counts

| Criterion | Expected | Actual | Pass |
|-----------|----------|--------|------|
| `has-[:focus-visible]:outline-offset-4` occurrences | 2 | 2 | ✓ |
| `has-[:focus-visible]:outline-2` occurrences | 2 | 2 | ✓ |
| `has-[:focus-visible]:outline-blue-600` occurrences | 2 | 2 | ✓ |
| `has-[:focus-visible]:ring-2` occurrences | 0 | 0 | ✓ |
| `has-[:focus-visible]:ring-blue-600` occurrences | 0 | 0 | ✓ |
| `has-[:checked]:ring-2` occurrences (unchanged) | 2 | 2 | ✓ |

### Anti-Patterns Found

No anti-patterns detected. No TODO/FIXME, no placeholder returns, no empty handlers. The change is a targeted class substitution on two label elements. No JavaScript files were modified.

### Human Verification Required

#### 1. Selected staffing card focus ring visibility

**Test:** Run `npx @11ty/eleventy --serve`, open http://localhost:8080, click a staffing card to select it (blue ring appears), then Tab away and Shift+Tab back to the same selected card.
**Expected:** A blue outline ring appears visibly outside the card border — separated from the selection ring by 4px of space. The focus indicator should not merge with or be hidden behind the selection ring.
**Why human:** The CSS property `outline-offset` creates physical separation between the outline and the box edge. Whether this separation is visually perceptible on top of the `ring-2` (box-shadow) selection ring requires rendering in a browser. `grep` cannot evaluate rendered CSS stacking.

#### 2. Selected city card focus ring visibility

**Test:** Scroll to the Participating Cities section, click a city card to select it, then Tab away and back to the selected card.
**Expected:** Same as above — blue outline with 4px offset visible outside the city card's selection ring.
**Why human:** Same rendering requirement.

#### 3. Unselected card focus behavior (regression)

**Test:** Tab to an unselected staffing or city card (do not click it).
**Expected:** Blue outline ring appears around the card with no selection ring present — outline-only state renders correctly.
**Why human:** Ensures the outline-only state (no ring-2 from selection) renders without visual oddity.

### Gaps Summary

No code gaps. All acceptance criteria pass. The implementation correctly replaces `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600` with `has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 has-[:focus-visible]:outline-offset-4` on both the staffing label (line 29) and city label (line 105). The selected-state ring classes are untouched.

The only open item is human visual confirmation that the outline-offset creates the intended visible separation in a real browser.

---

_Verified: 2026-03-21_
_Verifier: Claude (gsd-verifier)_
