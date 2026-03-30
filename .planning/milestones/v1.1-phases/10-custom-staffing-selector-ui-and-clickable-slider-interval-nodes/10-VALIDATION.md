---
phase: 10
slug: custom-staffing-selector-ui-and-clickable-slider-interval-nodes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — pure HTML/CSS/JS, manual + browser verification |
| **Config file** | none |
| **Quick run command** | `npx @11ty/eleventy --serve` (build + visual check) |
| **Full suite command** | `npx @11ty/eleventy` (full build, check for errors) |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx @11ty/eleventy` (check build succeeds, no errors)
- **After every plan wave:** Run `npx @11ty/eleventy` + manual browser verification
- **Before `/gsd:verify-work`:** Full suite must be green + all manual verifications pass
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | staffing-selector | visual | `npx @11ty/eleventy` | ✅ | ⬜ pending |
| 10-01-02 | 01 | 1 | staffing-selector-state | visual | `npx @11ty/eleventy` | ✅ | ⬜ pending |
| 10-02-01 | 02 | 1 | slider-nodes | visual | `npx @11ty/eleventy` | ✅ | ⬜ pending |
| 10-02-02 | 02 | 1 | slider-nodes-calc | manual | browser test | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No new test framework installation needed — this phase is pure HTML/CSS/JS with Eleventy build.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Staffing card selected state (visual highlight) | staffing-selector | CSS `:has()` visual change, no automated CSS test | Click each staffing option card, verify selected card shows highlighted border/background |
| Staffing card radio accessible via keyboard | staffing-selector | Keyboard navigation requires manual testing | Tab to cards, press Space/Enter, verify selection changes |
| Slider interval node click updates calculator result | slider-nodes-calc | Requires DOM interaction + computed output verification | Click each marked node on salary slider, verify displayed result updates correctly |
| Slider node click is equivalent to dragging slider | slider-nodes-calc | Behavioral equivalence check | Click a node, note result; drag slider to same position, verify same result |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
