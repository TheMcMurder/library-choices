---
phase: 8
slug: hours-open-schedule-display
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — static site; validation via build output inspection and `pnpm build` |
| **Config file** | none |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 1 | HOURS-03 | build | `pnpm build` | ✅ | ⬜ pending |
| 8-01-02 | 01 | 1 | HOURS-01, HOURS-02 | build + grep | `pnpm build && grep -r "Hours Open" _site/` | ✅ | ⬜ pending |
| 8-01-03 | 01 | 1 | HOURS-04 | manual | inspect config.js comment block | ✅ | ⬜ pending |
| 8-01-04 | 01 | 1 | HOURS-05 | manual | load `?staffing=1fte-2pte` in browser | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework installation needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Schedule renders correctly in browser | HOURS-02 | Visual output not automatable via build alone | Open `_site/index.html` in browser; confirm each staffing option shows schedule table below radio label |
| Edit guide covers schedule format | HOURS-04 | Comment block content requires human review | Open `src/_data/config.js`; confirm comment block contains schedule editing section with copy-pasteable example |
| URL `?staffing=1fte-2pte` restores selection | HOURS-05 | Browser navigation required | Load `index.html?staffing=1fte-2pte`; confirm third radio pre-selected |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
