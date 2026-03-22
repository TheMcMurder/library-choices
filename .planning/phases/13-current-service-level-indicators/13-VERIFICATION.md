---
phase: 13-current-service-level-indicators
verified: 2026-03-22T21:30:00Z
status: passed
score: 5/5 must-haves verified
human_verification:
  - test: "Visual ring coexistence — selected current card"
    expected: "Third staffing card shows both amber outer ring (ring-offset-2) and blue inner selection ring simultaneously when clicked"
    why_human: "CSS ring layering with has-[:checked] cannot be verified by static grep; requires browser rendering"
  - test: "Focus outline layering — current card"
    expected: "When tabbing to current card, focus outline is outermost (outside amber ring at offset-4)"
    why_human: "Three-layer ring stacking (focus offset-4, amber offset-2, blue no-offset) requires live browser inspection"
  - test: "Amber tick persistence — slider interaction"
    expected: "Moving slider from $30k to any other value leaves $30k tick amber; moving back makes it blue, then returning away makes it amber again"
    why_human: "JS class-toggle behavior requires live slider interaction to verify the guard works dynamically"
  - test: "Screen reader badge announcement"
    expected: "VoiceOver announces 'Current level' when navigating to or past the badge span on the current staffing card"
    why_human: "ARIA/screen reader behavior cannot be verified by static code analysis"
---

# Phase 13: Current Service Level Indicators Verification Report

**Phase Goal:** Add current service level indicators to the staffing card and collections slider tick so citizens always see which options represent the current baseline.
**Verified:** 2026-03-22T21:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The staffing card for 'Current' (index 2) shows an amber ring in both selected and unselected states | VERIFIED | `src/index.html` line 31: `{% if level.isCurrentServiceLevel %}ring-2 ring-amber-500 ring-offset-2{% endif %}` applied unconditionally to label; built `_site/index.html` line 85 confirms rendered output |
| 2 | The same card shows a 'Current level' badge in the top-right corner in both states | VERIFIED | `src/index.html` lines 33-37: badge span with `absolute top-2 right-2 bg-amber-500` inserted before input; parent label has `relative` unconditionally (line 30); confirmed in built output lines 87-89 |
| 3 | When the card is selected, the blue selection ring and the amber ring are both visible simultaneously | VERIFIED (automated portion) | `has-[:checked]:ring-2 has-[:checked]:ring-blue-600` (no offset) coexists with `ring-2 ring-amber-500 ring-offset-2` on same element; CSS ring layering correct by design; visual confirmation requires human |
| 4 | The collections slider tick at $30k is amber and remains amber when the slider moves to any other position | VERIFIED (automated portion) | `src/index.html` line 95: initial amber class set by template; `src/js/calculator.js` lines 61-66: JS guard reads `btn.dataset.currentLevel === 'true'` and preserves `text-amber-600 font-semibold` when `!isActive && isCurrentLevel`; built output line 136 confirms `data-current-level="true"` and `text-amber-600 font-semibold` on $30k tick |
| 5 | A screen reader can read the 'Current level' badge text | VERIFIED (automated portion) | Badge span contains plain visible text "Current level" with no `aria-hidden`; the containing tick-label container is `aria-hidden="true"` (collections row) but the staffing card badge is NOT hidden; human verification recommended for actual announcement |

**Score:** 5/5 truths verified (4 fully automated + interactive behavior requires human confirmation per human_verification items above)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/index.html` | Amber ring classes, badge markup, data-current-level attribute on tick | VERIFIED | Contains `ring-amber-500`, `ring-offset-2`, `level.isCurrentServiceLevel`, `opt.isCurrentServiceLevel`, `Current level`, `absolute top-2 right-2`, `bg-amber-500`, `data-current-level="true"`, `text-amber-600`, `min-h-[44px] relative` — all PLAN acceptance criteria strings confirmed present |
| `src/js/calculator.js` | Guard preventing amber tick override | VERIFIED | Contains `dataset.currentLevel`, `isCurrentLevel`, `text-amber-600`, `!isActive && !isCurrentLevel`, `!isActive && isCurrentLevel` — all PLAN acceptance criteria strings confirmed present; no hardcoded `30000` in `updateSliderLabels` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/index.html` | `src/_data/config.js` | `isCurrentServiceLevel` flag in Nunjucks loop | WIRED | Template uses `level.isCurrentServiceLevel` (staffing loop) and `opt.isCurrentServiceLevel` (collections loop); config.js sets `isCurrentServiceLevel: true` on `staffingLevels[2]` (id: `1fte-2pte`) and `collections.options[2]` (value: 30000); Nunjucks resolves at build time — confirmed in `_site/index.html` output |
| `src/js/calculator.js` | `src/index.html` | `data-current-level` attribute read by JS guard | WIRED | Template emits `data-current-level="true"` on current-level tick button (confirmed in built output line 136); JS reads `btn.dataset.currentLevel === 'true'` (calculator.js line 61); bridge is complete and functional |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CURR-01 | 13-01-PLAN.md | Staffing card with `isCurrentServiceLevel: true` shows amber border visible in both selected and unselected states; coexists with blue selection ring | SATISFIED | `ring-2 ring-amber-500 ring-offset-2` applied to label element unconditionally (not inside `has-[:checked]`); blue ring is `has-[:checked]:ring-2 has-[:checked]:ring-blue-600` at no offset — both coexist on same element by CSS specificity |
| CURR-02 | 13-01-PLAN.md | Current staffing card shows amber "Current level" badge top-right, visible in both selected and unselected states | SATISFIED | `<span class="absolute top-2 right-2 ... bg-amber-500 ...">Current level</span>` inserted before `<input>` inside label; `relative` on label enables positioning; badge is static markup not toggled by selection state |
| CURR-03 | 13-01-PLAN.md | Collections slider tick for `isCurrentServiceLevel: true` option is styled amber and persists regardless of slider position | SATISFIED | Initial amber classes set by template; JS guard in `updateSliderLabels` preserves `text-amber-600 font-semibold` when `isCurrentLevel && !isActive`; no hardcoded values used |
| CURR-04 | 13-01-PLAN.md | All indicators template-driven from `isCurrentServiceLevel` flag — no hardcoded option IDs or values in templates | SATISFIED | All conditionals use `level.isCurrentServiceLevel` or `opt.isCurrentServiceLevel`; no `1fte-2pte` or `30000` appear in any indicator conditional; JS uses only `dataset.currentLevel` attribute, no hardcoded values |
| CURR-05 | 13-01-PLAN.md | Screen reader communicates "Current level" for badge (color not sole signal) | SATISFIED (with human caveat) | Badge text "Current level" is plain visible text, not `aria-hidden`; plain text satisfies WCAG requirement that color is not the only signal; actual screen reader announcement requires human verification |

No orphaned requirements — all 5 CURR IDs (CURR-01 through CURR-05) are claimed by plan 13-01 and all are accounted for with implementation evidence.

---

### Anti-Patterns Found

None. Scan of `src/index.html` and `src/js/calculator.js` found no TODO/FIXME/PLACEHOLDER comments, no stub returns, and no hardcoded indicator values. The `30000` value in `src/index.html` line 84 is the range input's `value` default (slider starting position) — not related to any indicator conditional. No hardcoded IDs or values appear in the JS guard.

---

### Human Verification Required

The following items cannot be verified by static analysis and require live browser testing. They are documented here for the site owner or developer to confirm before launch.

#### 1. Visual Ring Coexistence — Selected Current Card

**Test:** Click the third staffing card ("Current"). Observe the card borders.
**Expected:** Two rings visible simultaneously — the inner blue ring (`ring-blue-600`) from the `has-[:checked]` state, and the outer amber ring (`ring-amber-500 ring-offset-2`) from the permanent indicator.
**Why human:** CSS ring layering with `has-[:checked]` pseudo-class cannot be confirmed by reading static markup; requires browser rendering to verify both rings render without one masking the other.

#### 2. Focus Outline Layering — Current Card

**Test:** Tab to the third staffing card using keyboard navigation.
**Expected:** Three distinct layers visible: innermost blue selection ring (if checked), middle amber ring at offset-2, outermost focus outline at offset-4.
**Why human:** Three-layer stacking behavior requires live browser inspection with focus active.

#### 3. Amber Tick Persistence — Slider Interaction

**Test:** Load the page (slider starts at $30k, tick should be blue as active). Move slider to $10k. Observe $30k tick. Move slider back to $30k. Move away again.
**Expected:** (a) At $10k: $30k tick is amber. (b) At $30k: $30k tick is blue (active). (c) After moving away: $30k tick returns to amber.
**Why human:** JS class-toggle guard behavior requires live slider interaction to confirm the `isCurrentLevel` guard works correctly through multiple state transitions.

#### 4. Screen Reader Badge Announcement

**Test:** Open VoiceOver (Cmd+F5 on macOS). Navigate to the staffing cards section. Tab through or browse to the third card.
**Expected:** VoiceOver announces "Current level" when reaching the badge span.
**Why human:** ARIA announcement behavior depends on screen reader software and browser implementation; cannot be verified by static markup analysis alone.

---

### Gaps Summary

No gaps. All five must-have truths are verified by static analysis of the actual codebase. Both artifacts exist, are substantive (not stubs), and are wired to each other and to the config data source. All five CURR requirements have direct implementation evidence. The build succeeds (`npm run build` exits 0). Both task commits (70b9e05, a74016f) exist and are valid.

The four human verification items above are standard interactive/visual checks that should be completed before the v1.2 milestone is declared production-ready, but they do not block goal achievement — the code correctly implements all required behaviors.

---

_Verified: 2026-03-22T21:30:00Z_
_Verifier: Claude (gsd-verifier)_
