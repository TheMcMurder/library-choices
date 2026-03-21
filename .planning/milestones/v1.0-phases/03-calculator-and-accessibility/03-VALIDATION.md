---
phase: 3
slug: calculator-and-accessibility
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | {pytest 7.x / jest 29.x / vitest / go test / other} |
| **Config file** | {path or "none — Wave 0 installs"} |
| **Quick run command** | `{quick command}` |
| **Full suite command** | `{full command}` |
| **Estimated runtime** | ~{N} seconds |

---

## Sampling Rate

- **After every task commit:** Run `{quick run command}`
- **After every plan wave:** Run `{full suite command}`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** {N} seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | CONF-04 | unit | `{command}` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | CONF-04 | unit | `{command}` | ❌ W0 | ⬜ pending |
| 3-01-03 | 01 | 1 | CONF-05 | unit | `{command}` | ❌ W0 | ⬜ pending |
| 3-01-04 | 01 | 1 | TRST-03 | manual | — | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `{tests/test_file.js}` — stubs for CONF-04, CONF-05
- [ ] `{framework install}` — if no framework detected

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Screen reader announces cost updates | TRST-03 | aria-live behavior requires AT testing | Use VoiceOver/NVDA; change a control; verify announcement |
| All controls keyboard-operable | TRST-03 | Requires keyboard tab navigation testing | Tab through all controls; verify reachable and operable |
| 44px touch targets | TRST-03 | Visual/spatial measurement | Inspect element dimensions in DevTools |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < {N}s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
