---
phase: 2
slug: data-and-controls
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-20
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — build + grep (Eleventy static build produces inspectable HTML) |
| **Config file** | none |
| **Quick run command** | `pnpm run build` |
| **Full suite command** | `pnpm run build && grep -c 'type="radio"' _site/index.html && grep -c 'data-households' _site/index.html && grep -c '<cite' _site/index.html` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm run build`
- **After every plan wave:** Run `pnpm run build && grep -c 'type="radio"' _site/index.html && grep -c 'data-households' _site/index.html`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | DATA-01, DATA-02, DATA-03 | smoke | `node -e "import('./src/_data/config.js').then(m => { const c = m.default; if (c.staffingLevels.length !== 3) process.exit(1); if (c.cities.length !== 4) process.exit(1); if (typeof c.collections.annualCost !== 'number') process.exit(1); console.log('PASS'); })"` | :white_check_mark: created by task | :white_large_square: pending |
| 02-01-02 | 01 | 1 | DATA-01 | smoke | `pnpm run build && test -f _site/js/calculator.js && grep -c "toLocaleString" eleventy.config.js` | :white_check_mark: created by task | :white_large_square: pending |
| 02-02-01 | 02 | 2 | CONF-01, CONF-02, CONF-03, TRST-01, TRST-02 | smoke | `pnpm run build && grep -c 'type="radio"' _site/index.html && grep -c 'type="checkbox"' _site/index.html && grep -c 'data-cost=' _site/index.html && grep -c 'data-households=' _site/index.html && grep -c '<cite' _site/index.html && grep -c 'LIBRARY_DATA' _site/index.html` | :white_check_mark: created by task | :white_large_square: pending |

*Status: :white_large_square: pending / :white_check_mark: green / :x: red / :warning: flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework installation needed — Eleventy's static build produces HTML files that are inspectable via `grep` and `node` import checks.

- [x] `src/_data/config.js` — expanded from stub to full schema (02-01-01)
- [x] `eleventy.config.js` — toLocaleString filter added (02-01-02)
- [x] `src/js/calculator.js` — placeholder created (02-01-02)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Form controls render visually correct in browser (radio buttons selectable, checkboxes toggleable, layout matches UI-SPEC) | CONF-01, CONF-02, CONF-03 | Visual layout and interactive behavior cannot be verified by grep | 1. Run `pnpm run dev` or `pnpm run build && pnpm run serve`. 2. Open local URL in browser. 3. Verify 3 staffing radios with costs, 1 collections checkbox, 4 city checkboxes with household counts. 4. Verify citations appear under each section. 5. Check `window.LIBRARY_DATA` in DevTools console. |
| config.js inline comments are clear to a non-developer | DATA-03 | Readability is subjective; requires human judgment | Open `src/_data/config.js` and confirm the block comment edit guide is understandable without JavaScript knowledge. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-20
