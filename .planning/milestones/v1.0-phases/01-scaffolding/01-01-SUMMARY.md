---
phase: 01-scaffolding
plan: 01
subsystem: infra
tags: [eleventy, tailwindcss, postcss, npm-run-all2, static-site, github-pages]

# Dependency graph
requires: []
provides:
  - Eleventy v3 ESM config with pathPrefix /library-choices/ and HtmlBasePlugin
  - Tailwind CSS v4 build pipeline via @tailwindcss/postcss and @tailwindcss/cli
  - Working npm run build producing _site/ with compiled CSS
  - Eleventy data cascade verified via src/_data/config.js
  - .gitignore excluding _site/, node_modules/, compiled.css
affects: [02-github-actions, all-subsequent-phases]

# Tech tracking
tech-stack:
  added:
    - "@11ty/eleventy@3.1.5 — static site generator (ESM config)"
    - "tailwindcss@4.2.2 — utility CSS framework (v4, CSS-first)"
    - "@tailwindcss/postcss@4.2.2 — PostCSS adapter for Tailwind v4"
    - "@tailwindcss/cli@4.2.2 — CLI for compiling style.css to compiled.css"
    - "postcss@8.5.8 — CSS transformation pipeline"
    - "npm-run-all2@7.0.2 — parallel/sequential npm script runner"
  patterns:
    - "ESM-first project (type:module in package.json)"
    - "Tailwind v4 CSS-first config (@import 'tailwindcss', no tailwind.config.js)"
    - "Sequential build: run-s build:css build:11ty (CSS must precede Eleventy)"
    - "Tailwind writes compiled.css to src/css/, Eleventy passthrough-copies to _site/css/"
    - "HtmlBasePlugin rewrites all asset URLs to include pathPrefix automatically"
    - "Data cascade: src/_data/config.js exports default object, available as {{ config.* }}"

key-files:
  created:
    - package.json
    - eleventy.config.js
    - postcss.config.mjs
    - .gitignore
    - src/css/style.css
    - src/_data/config.js
    - src/index.html
  modified: []

key-decisions:
  - "Added type:module to package.json — eleventy.config.js uses ESM import syntax; without this Node emits MODULE_TYPELESS_PACKAGE_JSON warnings and performance overhead"
  - "Updated engines to node>=20 — @tailwindcss/oxide@4.2.2 native bindings require Node 20+; Node 18 installs wrong optional platform packages"
  - "Added @tailwindcss/cli as explicit devDependency — Tailwind v4 ships the CLI as a separate package; it is not bundled with tailwindcss or @tailwindcss/postcss"
  - "Converted src/_data/config.js to ESM export default — required by type:module; module.exports is CJS syntax and throws ReferenceError in ESM context"

patterns-established:
  - "Pattern 1: Tailwind v4 install requires three packages: tailwindcss, @tailwindcss/postcss, @tailwindcss/cli"
  - "Pattern 2: With type:module, all data files in src/_data/ must use ESM export default syntax"
  - "Pattern 3: Node 20+ required for local development (oxide native bindings); CI workflow should pin node-version: '20'"

requirements-completed: [INFR-01, INFR-03]

# Metrics
duration: 5min
completed: 2026-03-20
---

# Phase 01 Plan 01: Project Scaffold Summary

**Eleventy v3 ESM static site with Tailwind CSS v4 PostCSS pipeline producing pathPrefix-correct _site/ output from npm run build**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-20T10:30:17Z
- **Completed:** 2026-03-20T10:35:23Z
- **Tasks:** 2
- **Files modified:** 7 created, 1 package-lock.json

## Accomplishments
- `npm run build` exits 0 and produces `_site/index.html` with compiled CSS
- HtmlBasePlugin rewrites `/css/compiled.css` to `/library-choices/css/compiled.css` in built HTML
- Eleventy data cascade works: `{{ config.siteName }}` renders "Cache County Library Choices"
- Tailwind CSS v4 compiles 515 lines of utilities from `@import "tailwindcss"` single-line entry
- `_site/` is gitignored and contains only static `.html` and `.css` files (INFR-03 satisfied)

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize project and create all configuration files** - `d9d8f1d` (chore)
2. **Task 2: Create minimal index.html and verify full build pipeline** - `ac2aae6` (feat)

## Files Created/Modified
- `package.json` — project manifest with ESM type, build scripts, engines>=20, all devDependencies
- `package-lock.json` — dependency lockfile (174 packages)
- `eleventy.config.js` — ESM Eleventy config with HtmlBasePlugin, pathPrefix, passthrough CSS/JS
- `postcss.config.mjs` — PostCSS config with @tailwindcss/postcss plugin
- `.gitignore` — excludes _site/, node_modules/, .cache/, *.log, src/css/compiled.css
- `src/css/style.css` — Tailwind v4 entry (`@import "tailwindcss"`)
- `src/_data/config.js` — ESM data cascade seed (siteName: "Cache County Library Choices")
- `src/index.html` — minimal pipeline verification page with Tailwind utility classes

## Decisions Made
- `"type": "module"` added to package.json: eleventy.config.js uses ESM `import`; without this declaration Node re-parses the file as ESM at runtime, emitting performance warnings on every build
- `engines.node` updated to `>=20`: @tailwindcss/oxide (Tailwind v4's Rust engine) ships platform-specific native bindings as optional dependencies; npm on Node 18 installs the wrong set, causing a `Cannot find native binding` fatal error at runtime
- `@tailwindcss/cli` added as explicit devDependency: Tailwind v4 removed the CLI from the core `tailwindcss` package; the `tailwindcss` command requires this separate package
- `src/_data/config.js` converted from `module.exports` to `export default`: with `type:module`, Node treats all `.js` files as ESM; `module.exports` is undefined in ESM scope and throws a ReferenceError during Eleventy's data cascade loading

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing @tailwindcss/cli dependency**
- **Found during:** Task 2 (build:css script execution)
- **Issue:** `tailwindcss: command not found` — Tailwind v4 does not include the CLI in the `tailwindcss` package; it is a separate `@tailwindcss/cli` package
- **Fix:** Ran `npm install --save-dev @tailwindcss/cli`
- **Files modified:** package.json, package-lock.json
- **Verification:** `tailwindcss` binary available in node_modules/.bin/; build:css succeeds
- **Committed in:** ac2aae6 (Task 2 commit)

**2. [Rule 3 - Blocking] Clean reinstall to resolve @tailwindcss/oxide native binding failure**
- **Found during:** Task 2 (first npm run build attempt)
- **Issue:** `Cannot find native binding @tailwindcss/oxide-darwin-arm64` — npm optional dependency bug; installing on Node 18 placed wrong platform packages
- **Fix:** Removed node_modules/ and package-lock.json; reinstalled with Node 20.19.3 via nvm
- **Files modified:** package-lock.json regenerated
- **Verification:** Build exits 0 with no native binding errors
- **Committed in:** ac2aae6 (Task 2 commit)

**3. [Rule 1 - Bug] Added type:module and updated engines to node>=20**
- **Found during:** Task 2 (post-build warning, then ESM conflict)
- **Issue 1:** `MODULE_TYPELESS_PACKAGE_JSON` warning — eleventy.config.js is ESM but package.json lacked `"type": "module"`, causing Node to reparse it at runtime
- **Issue 2:** `module is not defined in ES module scope` — src/_data/config.js used `module.exports` CJS syntax which fails under ESM
- **Fix:** Added `"type": "module"` to package.json, updated engines to `>=20`, converted config.js to `export default`
- **Files modified:** package.json, src/_data/config.js
- **Verification:** `npm run build` exits 0 with no warnings; data cascade renders correctly
- **Committed in:** ac2aae6 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (all Rule 3 blocking / Rule 1 bug — Tailwind v4 ecosystem differences from plan assumptions)
**Impact on plan:** All auto-fixes were necessary to get the build working. No scope creep. The acceptance criteria from the plan are all satisfied. The key insight for future phases: Tailwind v4 requires @tailwindcss/cli separately, Node 20+, and a type:module package.

## Issues Encountered
- Tailwind v4 ecosystem split: three separate packages required (`tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/cli`) vs. the research noting only two. The CLI was implicitly assumed to be bundled but is a distinct package since v4.
- Node 18 vs Node 20 incompatibility: @tailwindcss/oxide native bindings silently fail under Node 18's optional dependency resolution. The engines field in the plan (`>=18`) was too permissive; `>=20` is the correct minimum for Tailwind v4.

## User Setup Required
None - no external service configuration required. Development environment uses Node 20 via nvm.

## Next Phase Readiness
- Build pipeline is fully operational; `npm run build` exits 0 every run
- Project structure is established for Phase 01 Plan 02 (GitHub Actions deploy workflow)
- Node 20+ must be used locally and in CI (document in .github/workflows/deploy.yml as `node-version: '20'`)

## Self-Check: PASSED

All created files verified to exist on disk. Both task commits (d9d8f1d, ac2aae6) verified in git log.

---
*Phase: 01-scaffolding*
*Completed: 2026-03-20*
