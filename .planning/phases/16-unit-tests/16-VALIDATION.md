---
phase: 16
slug: unit-tests
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 16 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x |
| **Config file** | `vitest.config.js` (Wave 0 installs) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 0 | setup | install | `pnpm install && pnpm test --passWithNoTests` | ❌ W0 | ⬜ pending |
| 16-01-02 | 01 | 1 | extract | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 16-01-03 | 01 | 1 | config | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 16-01-04 | 01 | 1 | url | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 16-01-05 | 01 | 2 | ci | check | `gh workflow list` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` and `jsdom@26.1.0` — install devDependencies via pnpm
- [ ] `vitest.config.js` — minimal config at project root
- [ ] `package.json` — add `"test": "vitest run"` script
- [ ] `test/` directory created with stub test files

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GitHub Actions `test.yml` appears in Actions tab | CI setup | Requires push to main | Verify at github.com/[repo]/actions after merging |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
