---
phase: 21
slug: show-your-work-totals
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-15
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.x |
| **Config file** | `vite.config.js` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green + manual browser visual check
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | D-01, D-02, D-03, D-04, D-05, D-06 | manual + regression | `pnpm test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

- `test/calculator.test.js` — existing unit tests for `calculatePerHousehold` and related functions
- `test/config.test.js` — existing unit tests for config shape validation

*No new test stubs required — this phase is a DOM display-layer change. The new code is string-building HTML inside `updateResult()` which does not have a seam for unit testing without a DOM.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Two-line collapsed bar (per-household + total) | D-01 | DOM rendering not testable in Vitest unit layer | Select cities, verify bar shows `$X.XX/household/year` on line 1 and `$X,XXX total` on line 2 |
| All 3 cost components shown even when $0 | D-04 | DOM rendering | Set Physical collections to $0; open popover; verify Physical row is still present |
| Accounting layout: right-aligned amounts, left-aligned labels | D-05 | Visual layout | Open popover; verify amounts are right-aligned in a distinct column, labels left-aligned |
| Horizontal rule separates addends from Total | D-05 | Visual layout | Open popover; verify `<hr>` line appears between Physical and Total rows |
| Division equation displayed below Total | D-06 | DOM rendering | Open popover; verify formula row reads `$X,XXX ÷ N households = $X.XX/year` |
| Screen reader announces content correctly | (a11y) | Requires AT tool | Use VoiceOver/NVDA; verify `÷` pronounced intelligibly; add `aria-label` if not |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
