---
phase: 4
slug: visual-polish-and-shareability
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — manual verification + build smoke test |
| **Config file** | none — no test directory exists |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build` + manual browser verification (375px viewport, URL round-trip)
- **Before `/gsd:verify-work`:** All four success criteria verified manually
- **Max feedback latency:** ~5 seconds (build) + manual check

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | DESG-01, DESG-02, DESG-03 | Build smoke + manual visual | `pnpm build` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | DESG-02 | Build smoke + manual 375px | `pnpm build` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | CONF-06 | Build smoke + manual URL round-trip | `pnpm build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Confirm `pnpm build` exits 0 before any Phase 4 changes (baseline green)

*No test framework install needed. All Phase 4 requirements are visual/behavioral and require manual browser verification. Installing Playwright for Phase 4 alone is disproportionate — manual verification against the four success criteria is the correct gate.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Civic visual design renders correctly | DESG-01 | No automated visual regression tool installed | Open `http://localhost:8080` after `pnpm start`, review header bar, sticky result bar, footer, typography |
| No horizontal scroll at 375px | DESG-02 | Requires browser viewport resize | Open DevTools → set viewport to 375px wide; scroll page; confirm no horizontal scrollbar |
| Annual cost visible above fold on mobile | DESG-02 | Requires browser at mobile viewport | At 375px width, confirm sticky result bar shows dollar amount without scrolling |
| URL params restore exact selections | CONF-06 | Requires browser interaction | Set selections, copy URL from address bar, open in new tab/window, confirm all form controls match original state |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
