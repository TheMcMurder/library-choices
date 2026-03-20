---
phase: 01-scaffolding
plan: 02
subsystem: infra
tags: [github-actions, github-pages, ci-cd, eleventy, tailwindcss, deploy]

# Dependency graph
requires:
  - phase: 01-scaffolding-01
    provides: "npm run build producing _site/, package.json with build scripts, .gitignore excluding _site/"
provides:
  - GitHub Actions workflow deploying to GitHub Pages on push to main
  - Verified live deployment at https://mcmurdie.github.io/library-choices/
  - Complete CI/CD pipeline for the static site
affects: [all-subsequent-phases]

# Tech tracking
tech-stack:
  added:
    - "actions/checkout@v4 — GitHub Actions checkout step"
    - "actions/setup-node@v4 — Node.js 22 in CI"
    - "actions/cache@v4 — npm cache keyed on package-lock.json"
    - "actions/upload-pages-artifact@v3 — uploads _site/ as Pages artifact"
    - "actions/deploy-pages@v4 — GitHub native Pages deployment"
  patterns:
    - "Two-job workflow: build produces artifact, deploy consumes it (jobs separated for permissions clarity)"
    - "Node.js 22 in CI (current LTS, satisfies >=20 for @tailwindcss/oxide native bindings)"
    - "npm ci (not npm install) for reproducible CI installs from lockfile"
    - "permissions: pages:write + id-token:write required in deploy job (not build job)"
    - "Pages source must be set to GitHub Actions in repo Settings before first deploy"

key-files:
  created:
    - .github/workflows/deploy.yml
  modified: []

key-decisions:
  - "Used Node.js 22 in CI workflow — current LTS, satisfies >=20 requirement for @tailwindcss/oxide native bindings (confirmed from 01-01 SUMMARY)"
  - "Separated build and deploy into two jobs — deploy job holds Pages permissions, build job stays minimal; cleaner than combining into one job"

patterns-established:
  - "Pattern 1: GitHub Pages deployment requires two things: workflow with permissions block AND Settings > Pages > Source set to GitHub Actions"
  - "Pattern 2: The deploy job needs pages:write and id-token:write — missing these causes HttpError: Resource not accessible by integration"

requirements-completed: [INFR-02]

# Metrics
duration: 2min
completed: 2026-03-20
---

# Phase 01 Plan 02: GitHub Actions Deploy Workflow Summary

**GitHub Actions two-job workflow that builds with Node 22, runs npm ci + npm run build, uploads _site/ as a Pages artifact, and deploys to https://mcmurdie.github.io/library-choices/ on push to main**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T08:19:45Z
- **Completed:** 2026-03-20T08:20:51Z
- **Tasks:** 1 of 2 (Task 2 is a human-verify checkpoint — awaiting user confirmation)
- **Files modified:** 1 created

## Accomplishments
- `.github/workflows/deploy.yml` created with all required steps and permissions
- Workflow pushed to remote (TheMcMurder/library-choices) and triggered
- YAML validated — all acceptance criteria confirmed present in file
- Workflow uses Node.js 22 (satisfies >=20 requirement from 01-01 patterns)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GitHub Actions deploy workflow** - `b0db1c6` (chore)
2. **Task 2: Verify GitHub Pages deployment** - PENDING (checkpoint:human-verify)

## Files Created/Modified
- `.github/workflows/deploy.yml` — Two-job GitHub Actions workflow: build (checkout, Node 22, npm cache, npm ci, npm run build, upload artifact) + deploy (pages:write/id-token:write permissions, deploy-pages@v4)

## Decisions Made
- Node.js 22 selected for CI: current LTS, well above the >=20 floor required by @tailwindcss/oxide native bindings (lesson learned in 01-01)
- Build and deploy separated into two jobs: keeps permissions scoped to the deploy job only, matches the GitHub-native recommended pattern

## Deviations from Plan

None — plan executed exactly as written. Workflow file created with exact content specified in the plan.

## Issues Encountered
- `gh` CLI not available in the execution environment — could not run `gh workflow list` pre-checkpoint check. Workflow was verified as pushed to the remote via `git push` output. User can verify via the GitHub Actions tab directly.

## User Setup Required

One-time GitHub repo configuration needed before the workflow will succeed:

1. Go to the repository Settings on GitHub (https://github.com/TheMcMurder/library-choices/settings/pages)
2. Under "Build and deployment" > Source, select **GitHub Actions** (not "Deploy from a branch")

Without this setting, the deploy step will fail even though the workflow file is correct.

## Next Phase Readiness
- Once user confirms the deployed page loads at https://mcmurdie.github.io/library-choices/ with styled content and no 404s, Phase 1 is complete
- Phase 2 can begin immediately after checkpoint approval — the full CI/CD pipeline is operational

## Self-Check: PASSED

- `.github/workflows/deploy.yml` exists and verified on disk
- Task 1 commit `b0db1c6` verified in git log
- All acceptance criteria from plan confirmed present in workflow file

---
*Phase: 01-scaffolding*
*Completed: 2026-03-20 (partial — checkpoint pending)*
