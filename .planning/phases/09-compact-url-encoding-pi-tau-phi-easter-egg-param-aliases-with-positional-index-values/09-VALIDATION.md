---
phase: 9
slug: compact-url-encoding-pi-tau-phi-easter-egg-param-aliases-with-positional-index-values
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing (no test framework in project) |
| **Config file** | none |
| **Quick run command** | Open `index.html` in browser, verify URL bar |
| **Full suite command** | Manual checklist — encode/decode roundtrip for all param combinations |
| **Estimated runtime** | ~5 minutes |

---

## Sampling Rate

- **After every task commit:** Load page in browser, verify URL updates to compact form
- **After every plan wave:** Full roundtrip checklist (encode + decode + backward compat)
- **Before `/gsd:verify-work`:** All manual checklist items must pass
- **Max feedback latency:** ~5 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 9-01-01 | 01 | 1 | compact-encode | manual | open index.html → check URL bar shows pi/tau/phi | ✅ | ⬜ pending |
| 9-01-02 | 01 | 1 | compact-decode | manual | paste compact URL → verify state restores correctly | ✅ | ⬜ pending |
| 9-01-03 | 01 | 1 | backward-compat | manual | paste verbose URL → verify state restores correctly | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — no test framework to install.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Compact URL written on state change | compact-encode | No test framework; browser-only behavior | Change staffing/collections/cities → check URL bar shows `?pi=N&tau=N&phi=N,N` |
| Compact URL decodes to correct state | compact-decode | DOM state inspection only | Paste `?pi=0&tau=1&phi=0,2` → verify correct staffing/collection/cities selected |
| Verbose URL still decodes | backward-compat | DOM state inspection only | Paste `?staffing=1fte&collections=30000&cities=providence` → verify state restores |
| Round-trip fidelity | roundtrip | Browser only | Select state, copy URL, open fresh tab, paste URL, verify identical selections |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5 minutes
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
