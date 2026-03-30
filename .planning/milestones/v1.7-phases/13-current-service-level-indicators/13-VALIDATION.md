---
phase: 13
slug: current-service-level-indicators
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — visual/manual only (no test runner in project) |
| **Config file** | none |
| **Quick run command** | `open index.html` (browser visual check) |
| **Full suite command** | Manual checklist (see Per-Task Verification Map) |
| **Estimated runtime** | ~5 minutes manual |

---

## Sampling Rate

- **After every task commit:** Open browser, verify indicator still visible
- **After every plan wave:** Run full manual checklist below
- **Before `/gsd:verify-work`:** Full checklist must be green
- **Max feedback latency:** ~2 minutes per check

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | CURR-01 | visual | none — open browser | ✅ | ⬜ pending |
| 13-01-02 | 01 | 1 | CURR-02 | visual | none — open browser | ✅ | ⬜ pending |
| 13-01-03 | 01 | 1 | CURR-03 | visual | none — open browser | ✅ | ⬜ pending |
| 13-01-04 | 01 | 1 | CURR-04 | visual | none — open browser | ✅ | ⬜ pending |
| 13-01-05 | 01 | 1 | CURR-05 | manual | screen reader check | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — no test framework needed. All verification is visual/manual via browser.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Amber border visible when card unselected | CURR-01 | CSS visual | Open app, verify staffing card 3 has amber ring with no selection |
| Amber border coexists with blue selection ring | CURR-01 | CSS visual | Click staffing card 3, verify both amber and blue rings visible simultaneously |
| "Current level" badge visible (unselected) | CURR-02 | CSS visual | Load app, verify badge in top-right of staffing card 3 |
| "Current level" badge visible (selected) | CURR-02 | CSS visual | Click staffing card 3, verify badge remains visible |
| Amber slider tick at current-level option | CURR-03 | CSS visual | Load app, verify collections slider has amber tick at position 2 |
| Amber tick remains when slider moves | CURR-03 | CSS visual | Drag slider away from position 2, verify amber tick still amber |
| Indicators persist when different card selected | CURR-04 | CSS visual | Click staffing card 1, verify card 3 still shows amber border and badge |
| Screen reader announces "Current level" | CURR-05 | Assistive tech | Use VoiceOver/NVDA, tab to badge, verify "Current level" is announced |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
