---
phase: 1
slug: scaffolding
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — build pipeline validation via CLI commands |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && ls _site/index.html` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && ls _site/index.html`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | INFR-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | INFR-01 | file | `ls _site/index.html _site/styles.css` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 2 | INFR-02 | ci | `gh workflow view deploy.yml` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 2 | INFR-03 | git | `git check-ignore _site/` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — install eleventy, tailwind, postcss, npm-run-all2
- [ ] `eleventy.config.js` — Eleventy v3 ESM config with pathPrefix and HtmlBasePlugin
- [ ] `.github/workflows/deploy.yml` — GitHub Actions deploy workflow
- [ ] `.gitignore` — include `_site/` entry

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Deployed page loads at GitHub Pages URL with no 404s | INFR-02 | Requires live deployment and browser check | Push to main, wait for Actions to complete, visit `https://<user>.github.io/library-choices/` and verify all assets load |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
