---
phase: 01-scaffolding
plan: 02
subsystem: infra
tags: [github-actions, github-pages, ci-cd, eleventy, tailwindcss, pnpm, deploy]

# Dependency graph
requires:
  - phase: 01-scaffolding-01
    provides: "pnpm run build producing _site/, package.json with build scripts, .gitignore excluding _site/"
provides:
  - GitHub Actions workflow deploying to GitHub Pages on push to main
  - Verified live deployment at https://mcmurdie.github.io/library-choices/
  - Complete CI/CD pipeline for the static site
affects: [all-subsequent-phases]

# Tech tracking
tech-stack:
  added:
    - "actions/checkout@v4 — GitHub Actions checkout step"
    - "pnpm/action-setup@v4 — pnpm setup in CI"
    - "actions/setup-node@v4 — Node.js 22 with pnpm cache in CI"
    - "actions/upload-pages-artifact@v3 — uploads _site/ as Pages artifact"
    - "actions/deploy-pages@v4 — GitHub native Pages deployment"
  patterns:
    - "Two-job workflow: build produces artifact, deploy consumes it (jobs separated for permissions clarity)"
    - "Node.js 22 in CI (current LTS, satisfies >=20 for @tailwindcss/oxide native bindings)"
    - "pnpm install --frozen-lockfile for reproducible CI installs from lockfile"
    - "permissions: pages:write + id-token:write required in deploy job (not build job)"
    - "Pages source must be set to GitHub Actions in repo Settings before first deploy"

key-files:
  created:
    - .github/workflows/deploy.yml
  modified:
    - pnpm-lock.yaml

key-decisions:
  - "Used pnpm/action-setup@v4 in CI after project migrated from npm to pnpm — frozen-lockfile install for reproducibility"
  - "Separated build and deploy into two jobs — deploy job holds Pages permissions, build job stays minimal; cleaner than combining into one job"
  - "Used Node.js 22 in CI workflow — current LTS, satisfies >=20 requirement for @tailwindcss/oxide native bindings"

patterns-established:
  - "Pattern 1: GitHub Pages deployment requires two things: workflow with permissions block AND Settings > Pages > Source set to GitHub Actions"
  - "Pattern 2: The deploy job needs pages:write and id-token:write — missing these causes HttpError: Resource not accessible by integration"
  - "Pattern 3: CI package manager must match local tooling — pnpm/action-setup@v4 + frozen-lockfile for pnpm projects"

requirements-completed: [INFR-02]

# Metrics
duration: ~20min
completed: 2026-03-20
---

# Phase 01 Plan 02: GitHub Actions Deploy Workflow Summary

**GitHub Actions two-job pnpm workflow that builds with Node 22, runs pnpm install + pnpm run build, uploads _site/ as a Pages artifact, and deploys to https://mcmurdie.github.io/library-choices/ on push to main — verified live with styled content and no 404 errors**

## Performance

- **Duration:** ~20 min (includes human-verify checkpoint wait)
- **Started:** 2026-03-20T08:19:45Z
- **Completed:** 2026-03-20
- **Tasks:** 2 of 2 (Task 1: auto, Task 2: human-verify — approved)
- **Files modified:** 1 created (.github/workflows/deploy.yml)

## Accomplishments

- `.github/workflows/deploy.yml` created with all required steps, permissions, and pnpm support
- Workflow pushed to remote and triggered on push to main
- Site live and user-verified at https://mcmurdie.github.io/library-choices/: styled content loads, no 404 errors on assets (CSS loads correctly)
- CI updated to use pnpm (pnpm/action-setup@v4, frozen-lockfile) after npm-to-pnpm migration

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions deploy workflow** - `b0db1c6` (chore)
2. **Task 2: Verify GitHub Pages deployment** - human-verify checkpoint (no code commit — verification only, approved by user)

Post-checkpoint commits (pnpm migration, committed separately):
- `6f668e4` chore: migrate from npm to pnpm
- `a2e00a4` docs: update ROADMAP build command to pnpm
- `af98154` updating index.html to test pnpm update

## Files Created/Modified

- `.github/workflows/deploy.yml` — Two-job GitHub Actions workflow: build (checkout, pnpm setup, Node 22, pnpm install --frozen-lockfile, pnpm run build, upload artifact) + deploy (pages:write/id-token:write permissions, deploy-pages@v4)

## Decisions Made

- pnpm/action-setup@v4 used in CI to match the project's package manager after the npm-to-pnpm migration; `pnpm install --frozen-lockfile` for reproducible installs
- Build and deploy separated into two jobs: keeps permissions scoped to the deploy job only, matches the GitHub-native recommended pattern
- Node.js 22 selected for CI: current LTS, well above the >=20 floor required by @tailwindcss/oxide native bindings

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated deploy.yml for pnpm after npm-to-pnpm project migration**
- **Found during:** Post-checkpoint continuation (migration committed between checkpoint and resume)
- **Issue:** Original deploy.yml used `npm ci` and `actions/cache` npm pattern; project was migrated to pnpm after Task 1 was committed
- **Fix:** Workflow updated to use `pnpm/action-setup@v4`, `cache: "pnpm"` on setup-node, and `pnpm install --frozen-lockfile`; these changes were already committed in `6f668e4`
- **Files modified:** .github/workflows/deploy.yml
- **Verification:** User confirmed deployed site loads with styled content and no 404s
- **Committed in:** `6f668e4` (chore: migrate from npm to pnpm)

---

**Total deviations:** 1 (1 blocking — package manager change required to keep CI consistent with local tooling)
**Impact on plan:** Required for CI correctness after project-level tooling decision. No scope creep.

## Issues Encountered

- `gh` CLI not available in the execution environment during Task 1 — could not run `gh workflow list` pre-checkpoint check. Workflow was verified as pushed to the remote via `git push` output.
- npm-to-pnpm migration occurred between checkpoint and resume, requiring deploy.yml to be updated (handled as Rule 3 auto-fix above).

## User Setup Required

One-time GitHub repo configuration was needed before the workflow would succeed:

- Go to repository Settings > Pages > "Build and deployment" > Source, select **GitHub Actions** (not "Deploy from a branch")

User confirmed this was completed. No further setup required for subsequent phases.

## Next Phase Readiness

- Full CI/CD pipeline is operational: push to main triggers build and deploy automatically
- Live site at https://mcmurdie.github.io/library-choices/ is the working baseline for Phase 02 (data model)
- No blockers for Phase 02

## Self-Check: PASSED

- `.github/workflows/deploy.yml` exists and verified on disk (pnpm variant)
- Task 1 commit `b0db1c6` verified in git log
- pnpm migration commit `6f668e4` verified in git log
- User confirmed live site loads with styled content and no 404 errors

---
*Phase: 01-scaffolding*
*Completed: 2026-03-20*
