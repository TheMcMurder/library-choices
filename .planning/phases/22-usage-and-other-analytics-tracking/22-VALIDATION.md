---
phase: 22
slug: usage-and-other-analytics-tracking
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-16
---

# Phase 22 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (existing) |
| **Config file** | vitest.config.js (or package.json scripts) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 22-01-01 | 01 | 1 | analytics.js module | unit | `npm test` | ❌ W0 | ⬜ pending |
| 22-01-02 | 01 | 1 | config.js field | unit | `npm test` | ❌ W0 | ⬜ pending |
| 22-01-03 | 01 | 1 | index.html snippet | manual | browser DevTools | N/A | ⬜ pending |
| 22-01-04 | 01 | 1 | event wiring | unit | `npm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/analytics.test.js` (or equivalent) — stubs for analytics module unit tests
- [ ] Test stubs for `trackEvent` no-op guard, hostname check, and event parameter shapes

*If vitest not yet installed, Wave 0 installs it.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GA4 snippet loads in production | D-04, D-06 | Requires live deploy + network request | Deploy to mcmurdie.github.io, open DevTools Network tab, confirm request to google-analytics.com |
| Events appear in GA4 DebugView | D-07 | Requires GA4 property + DebugView | Enable GA4 DebugView, interact with site, confirm events appear within 30s |
| No analytics on localhost | D-06 | Requires browser check | Run locally, confirm no gtag network requests in DevTools |
| No cookies set | D-02 | Requires browser inspection | Check Application > Cookies in DevTools — no `_ga` or `_gid` cookies |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
