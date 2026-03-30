---
phase: 7
slug: collections-budget-slider
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — static Eleventy + Vanilla JS project |
| **Config file** | none |
| **Quick run command** | `pnpm build` |
| **Full suite command** | Manual browser checks (Firefox, Safari, Chrome) |
| **Estimated runtime** | ~5 seconds (build) + manual |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build` + full manual browser check (Firefox, Safari, Chrome) covering all 8 requirements
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds (build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 7-01-01 | 01 | 1 | SLDR-01 | smoke | `pnpm build` | ✅ | ⬜ pending |
| 7-01-02 | 01 | 1 | SLDR-02 | manual | Open page, keyboard through all 6 positions | N/A | ⬜ pending |
| 7-01-03 | 01 | 1 | SLDR-03 | manual | Verify each node shows correct description text | N/A | ⬜ pending |
| 7-01-04 | 01 | 1 | SLDR-04 | manual | Drag slider slowly; result bar updates mid-drag | N/A | ⬜ pending |
| 7-01-05 | 01 | 1 | SLDR-05 | manual | VoiceOver/NVDA: confirm meaningful label announced | N/A | ⬜ pending |
| 7-01-06 | 01 | 1 | SLDR-06 | manual | Open in Firefox, Safari, Chrome; confirm $10k–$60k label row visible | N/A | ⬜ pending |
| 7-01-07 | 01 | 1 | SLDR-07 | manual | Visual inspection of thumb/track styling across browsers | N/A | ⬜ pending |
| 7-01-08 | 01 | 1 | SLDR-08 | manual | Paste `?collections=30000` URL in new tab; verify slider at $30k | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework install needed.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 6 nodes snap to $10k–$60k | SLDR-02 | No test framework | Open page, drag/keyboard through all 6 positions, confirm each snaps |
| Description updates per node | SLDR-03 | Visual/DOM check | Click/keyboard to each node; confirm correct citizen-meaningful text shown |
| Live update during drag | SLDR-04 | Interaction timing | Drag slider slowly; result bar must update mid-drag, not only on release |
| Screen reader `aria-valuetext` | SLDR-05 | Requires screen reader | VoiceOver/NVDA: confirm "30,000 dollars — Print collection + digital" announced on slider change |
| Labels visible in Firefox, Safari, Chrome | SLDR-06 | Cross-browser rendering | Open in each browser; confirm $10k–$60k label row renders below slider |
| Thumb/track styled blue-800 | SLDR-07 | Visual inspection | Confirm slider thumb and track match civic blue-800 color across browsers |
| URL restores slider position | SLDR-08 | URL/state integration | Paste `?collections=30000` in new tab; verify slider lands at $30k node |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s (automated build)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
