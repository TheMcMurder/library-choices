---
phase: 11
slug: custom-multi-select-for-participating-cities
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — visual/browser verification only |
| **Config file** | none |
| **Quick run command** | open `src/index.html` in browser, inspect cities fieldset |
| **Full suite command** | open `src/index.html` in browser, verify all 4 cities render as cards |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Open `src/index.html` in browser, verify cities fieldset renders cards
- **After every plan wave:** Full visual inspection of cities multi-select
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | Cities card UI | visual | open src/index.html | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework — this is a static HTML/CSS template change.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| City cards render with name + population | Phase 11 | Static HTML, no automated test runner | Open src/index.html in browser; verify each city shows as a styled card with name and population |
| Card selection state (checked/unchecked) | Phase 11 | CSS-only state, requires browser rendering | Click city cards; verify visual selected state toggles with `has-[:checked]` CSS |
| Calculator still computes correctly | Phase 11 | Integration with JS calculation | Select cities, enter staffing hours, verify totals update correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
