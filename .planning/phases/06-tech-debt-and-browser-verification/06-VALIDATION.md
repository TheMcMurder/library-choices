---
phase: 6
slug: tech-debt-and-browser-verification
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — this phase is primarily file deletion, config changes, and manual browser verification |
| **Config file** | none |
| **Quick run command** | `grep -r "data-cost" index.html templates/ 2>/dev/null && echo "FAIL: data-cost still present" || echo "PASS: data-cost removed"` |
| **Full suite command** | `grep -r "postcss.config" . --include="*.js" --include="*.mjs" --include="*.html" 2>/dev/null | grep -v ".planning" && echo "FAIL: postcss still referenced" || echo "PASS"` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick run command
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | DESG-01 | grep | `test ! -f postcss.config.mjs && echo PASS || echo FAIL` | ✅ | ⬜ pending |
| 6-01-02 | 01 | 1 | DESG-02 | grep | `grep -n "data-cost" index.html templates/*.njk 2>/dev/null && echo FAIL || echo PASS` | ✅ | ⬜ pending |
| 6-01-03 | 01 | 1 | DESG-03 | grep | `grep "defaultChecked" src/config.js && grep "defaultChecked" templates/*.njk && echo PASS || echo FAIL` | ✅ | ⬜ pending |
| 6-02-01 | 02 | 2 | CONF-06 | manual | Browser verification checklist completed | N/A | ⬜ pending |
| 6-02-02 | 02 | 2 | CONF-02 | manual | CONF-02 decision documented in STATE.md | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed — verification is grep-based (file deletion, attribute removal) and manual (browser testing).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Civic design renders correctly | CONF-06 | Requires browser rendering | Open deployed URL, verify civic header/footer present |
| Sticky bar behavior on scroll | CONF-06 | Requires browser interaction | Scroll page, verify filter bar sticks |
| Tooltip displays on hover | CONF-06 | Requires mouse interaction | Hover cost elements, verify tooltip appears |
| URL round-trip (share link) | CONF-06 | Requires browser navigation | Copy share URL, open new tab, verify state restored |
| Fallback render (no JS) | CONF-06 | Requires JS disabled | Disable JS, verify page loads without errors |
| Back button navigation | CONF-06 | Requires browser history | Navigate away, click back, verify state preserved |
| Mobile 375px layout | CONF-06 | Requires device/emulation | DevTools 375px, verify layout not broken |
| DRAFT overlay visibility | CONF-06 | Requires visual check | Verify DRAFT watermark visible when flag set |
| Collections layout (Phase 02) | CONF-06 | Requires visual check | Verify select/radio layout correct |
| window.LIBRARY_DATA (Phase 02/03) | CONF-06 | Requires browser console | Open console, verify window.LIBRARY_DATA defined |
| Screen reader accessibility | CONF-06 | Requires assistive tech | Test with VoiceOver/NVDA |
| Keyboard focus rings | CONF-06 | Requires keyboard navigation | Tab through page, verify focus rings visible |
| Touch targets (mobile) | CONF-06 | Requires touch/emulation | Test tap targets ≥ 44px on mobile emulation |
| CONF-02 product decision | CONF-02 | Requires product owner input | Document decision in STATE.md |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
