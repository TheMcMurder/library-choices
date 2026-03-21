# Phase 1: Scaffolding - Research

**Researched:** 2026-03-20
**Domain:** Eleventy v3 static site generator + Tailwind CSS v4 + GitHub Actions / GitHub Pages
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFR-01 | Eleventy v3 static site generator with `_data/config.js` data cascade | Eleventy v3.1.5 is current stable; `_data/` is Eleventy's standard data directory; `config.js` files export plain JS objects and are automatically loaded |
| INFR-02 | GitHub Actions deploy to GitHub Pages | Official Eleventy docs provide a sample workflow using `actions/upload-pages-artifact` + `actions/deploy-pages`; requires repo Settings → Pages → Source: GitHub Actions |
| INFR-03 | No runtime server dependencies — fully static output | Eleventy produces a `_site/` directory of plain HTML/CSS/JS with zero server code; Tailwind CSS compiles at build time |
</phase_requirements>

---

## Summary

Phase 1 establishes the build pipeline: Eleventy v3 generates static HTML from templates, Tailwind CSS v4 compiles utility CSS at build time via PostCSS, and GitHub Actions deploys the `_site/` output to GitHub Pages on every push to `main`. This is a well-trodden stack with official documentation for each integration step.

The single largest gotcha for this project is GitHub Pages path prefix. Because the site deploys to a subdirectory URL (e.g., `https://owner.github.io/library-choices/`), all asset paths must be rooted relative to that prefix — not the domain root. Eleventy's built-in `pathPrefix` config option combined with the `HtmlBasePlugin` handles this automatically when configured correctly from day one.

Tailwind CSS v4 is a significant departure from v3. It no longer uses `tailwind.config.js` or `@tailwind base/components/utilities` directives. Configuration is CSS-first via `@theme {}` blocks and the only required CSS statement is `@import "tailwindcss";`. This simplifies the scaffolding but requires awareness that most tutorials found via search are for v3.

**Primary recommendation:** Use `npm-run-all2` to run `tailwindcss --watch` and `eleventy --serve` concurrently in development, and `run-s` (sequential) for production builds. Write compiled CSS into `src/css/` so Eleventy can passthrough-copy it into `_site/`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @11ty/eleventy | 3.1.5 | Static site generator | Project requirement; v3 is current stable |
| tailwindcss | 4.2.2 | Utility CSS framework | Project requirement; v4 is current stable |
| @tailwindcss/postcss | 4.2.2 | Tailwind v4 PostCSS plugin | Required adapter — v4 no longer ships as a PostCSS plugin directly in the `tailwindcss` package |
| postcss | 8.5.8 | CSS transformation pipeline | Required by @tailwindcss/postcss |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| npm-run-all2 | 8.0.4 | Run scripts in parallel or series | Enables `npm start` to run Eleventy + Tailwind concurrently in dev; `run-s` for sequential prod build |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| npm-run-all2 | concurrently | Both work; npm-run-all2 is more idiomatic with npm scripts (`run-s`, `run-p`); either is fine |
| PostCSS integration | Tailwind standalone CLI | Standalone CLI has no npm dependency but requires downloading a binary; PostCSS keeps everything in node_modules |

**Installation:**
```bash
npm install --save-dev @11ty/eleventy tailwindcss @tailwindcss/postcss postcss npm-run-all2
```

**Verified versions (2026-03-20):**
```
@11ty/eleventy    3.1.5   (npm dist-tag: latest)
tailwindcss       4.2.2   (npm dist-tag: latest)
@tailwindcss/postcss  4.2.2
postcss           8.5.8
npm-run-all2      8.0.4
```

---

## Architecture Patterns

### Recommended Project Structure

```
/                              # project root
├── src/                       # Eleventy input directory
│   ├── _includes/             # Nunjucks/HTML partials
│   ├── _data/                 # Eleventy data cascade (config.js lives here)
│   ├── css/
│   │   └── style.css          # Tailwind entry (@import "tailwindcss")
│   ├── js/                    # Client-side JS (passthroughed)
│   └── index.html             # Homepage template
├── _site/                     # Build output (gitignored, never committed)
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── eleventy.config.js         # Eleventy configuration (ESM)
├── postcss.config.mjs         # PostCSS configuration
├── package.json
└── .gitignore                 # Must include: _site/, node_modules/
```

### Pattern 1: Eleventy v3 ESM Config with pathPrefix and HtmlBasePlugin

**What:** ESM-style `eleventy.config.js` that sets `pathPrefix` to the GitHub repo name and registers the built-in `HtmlBasePlugin` to rewrite all asset URLs automatically.

**When to use:** Always — required from day one to avoid GitHub Pages 404s on CSS/JS assets.

**Example:**
```javascript
// Source: https://www.11ty.dev/docs/config/ and https://www.11ty.dev/docs/plugins/html-base/
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrite all asset URLs to include pathPrefix automatically
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Pass through compiled CSS and JS unchanged
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Watch source CSS so Eleventy restarts when Tailwind recompiles
  eleventyConfig.addWatchTarget("src/css/");

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    pathPrefix: "/library-choices/",   // Must match GitHub repo name
  };
}
```

### Pattern 2: Tailwind CSS v4 PostCSS Setup (CSS-first, no tailwind.config.js)

**What:** v4 uses a single `@import "tailwindcss";` in the CSS entry file. No `@tailwind base/components/utilities` directives. No `tailwind.config.js`. Customization goes in `@theme {}` blocks inside the CSS file itself.

**When to use:** Always with Tailwind v4. Most tutorials online show v3 patterns — do not use them.

**Example:**
```css
/* src/css/style.css */
/* Source: https://tailwindcss.com/docs/installation/using-postcss */
@import "tailwindcss";

/* Theme customizations (optional, replaces tailwind.config.js extend) */
@theme {
  /* --color-brand: #1a2e5a; */
}
```

```javascript
// postcss.config.mjs
// Source: https://tailwindcss.com/docs/installation/using-postcss
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Pattern 3: npm Scripts for Development and Production

**What:** Parallel Tailwind + Eleventy in dev, sequential build for CI.

```json
{
  "scripts": {
    "start": "npm-run-all -p dev:*",
    "build": "run-s build:css build:11ty",
    "build:11ty": "eleventy",
    "build:css": "tailwindcss -i src/css/style.css -o src/css/compiled.css",
    "dev:11ty": "eleventy --serve",
    "dev:css": "tailwindcss -i src/css/style.css -o src/css/compiled.css --watch"
  }
}
```

Note: Tailwind writes `compiled.css` into `src/css/` and Eleventy passthroughs the whole `src/css/` directory into `_site/css/`. This avoids race conditions between the two build processes.

### Pattern 4: GitHub Actions Workflow

**What:** Official Eleventy-provided workflow using `actions/upload-pages-artifact` + `actions/deploy-pages`.

**Example:**
```yaml
# .github/workflows/deploy.yml
# Source: https://github.com/11ty/eleventy-base-blog/blob/main/.github/workflows/gh-pages.yml.sample
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Cache npm
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      - run: npm ci
      - run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Required repo setup:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.

### Anti-Patterns to Avoid

- **Hardcoding absolute asset paths (`/css/style.css`):** On GitHub Pages the site lives at `/library-choices/`, so `/css/style.css` 404s. Use relative paths or rely on HtmlBasePlugin + pathPrefix.
- **Committing `_site/` to the repo:** The workflow uses `actions/upload-pages-artifact` directly from the build output — `_site/` should never be in git. Add it to `.gitignore`.
- **Using `tailwind.config.js` patterns:** All v3 tutorials show `content: [...]` and `@tailwind base` — these are v3 patterns. v4 scans content automatically and uses `@import "tailwindcss"`.
- **Running `eleventy` before `tailwindcss` in production build:** CSS must be compiled before Eleventy copies it. Use `run-s build:css build:11ty` (sequential), not parallel.
- **Using `setUseGitIgnore(false)` without understanding it:** Disabling gitignore support causes Eleventy to watch `_site/` and can create infinite rebuild loops.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Asset URL rewriting for subdirectory deployments | Custom Nunjucks filter to prefix all URLs | `HtmlBasePlugin` (built into Eleventy 2.0+) | Covers `a[href]`, `img[src]`, `srcset`, `video`, `audio`, `source` — a custom filter will miss edge cases |
| CSS purging/tree-shaking | Manual PurgeCSS setup | Tailwind v4 built-in | v4's engine handles dead code elimination automatically |
| Parallel script execution | Shell `&` background processes | `npm-run-all2` | Cross-platform, proper signal handling, readable exit codes |

**Key insight:** The HtmlBasePlugin exists precisely because path prefix rewriting is deceptively complex across all HTML element types. Custom solutions reliably miss cases like `srcset` or `<link>` preloads.

---

## Common Pitfalls

### Pitfall 1: GitHub Pages 404 on CSS/JS (pathPrefix not set)

**What goes wrong:** Site HTML loads but all assets return 404. Browser requests `/css/style.css` but GitHub Pages serves from `/library-choices/css/style.css`.

**Why it happens:** GitHub Pages user sites deploy to `username.github.io` (no subdirectory), but project sites deploy to `username.github.io/repo-name/`. Without pathPrefix, Eleventy generates absolute paths from the domain root.

**How to avoid:** Set `pathPrefix: "/library-choices/"` in `eleventy.config.js` return value AND add `HtmlBasePlugin`. Verify by inspecting the rendered HTML in `_site/` — `<link href="/library-choices/css/compiled.css">` is correct; `<link href="/css/compiled.css">` is not.

**Warning signs:** Assets load in local dev (`--serve` uses `/`) but 404 on the deployed URL.

### Pitfall 2: Tailwind v4 Scans Gitignored Directories by Default (including _site)

**What goes wrong:** Tailwind v4 auto-detects content to scan. In v4.2+, it respects `.gitignore` and excludes `_site/` automatically. However, if `.gitignore` is absent or malformed, Tailwind may scan compiled output and generate incorrect utilities.

**Why it happens:** v4 uses file-system heuristics rather than an explicit `content` array.

**How to avoid:** Ensure `.gitignore` includes `_site/` and `node_modules/` before running any builds. These entries tell Tailwind which directories to skip.

**Warning signs:** Build completes but CSS file is unexpectedly large, or Tailwind logs show scanning `_site/`.

### Pitfall 3: Eleventy Watches _site/ and Creates Infinite Rebuild Loop

**What goes wrong:** In `--serve` mode, Eleventy watches for file changes and triggers rebuilds. If Tailwind writes compiled CSS into `_site/` (the output directory), Eleventy detects the change and rebuilds, which triggers Tailwind again.

**Why it happens:** Writing build artifacts into the output directory blurs the line between source and output.

**How to avoid:** Write Tailwind's compiled output into `src/css/compiled.css` (a source directory), then let Eleventy passthrough-copy it to `_site/css/`. Add `addWatchTarget("src/css/")` so Eleventy re-copies when it changes.

**Warning signs:** `npm start` causes continuous rebuild messages without saving any files.

### Pitfall 4: Missing `permissions` in GitHub Actions Workflow

**What goes wrong:** Deployment fails with `Error: HttpError: Resource not accessible by integration`.

**Why it happens:** The `deploy` job needs `pages: write` and `id-token: write` permissions explicitly granted.

**How to avoid:** Include the `permissions` block in the deploy job as shown in the workflow pattern above.

**Warning signs:** Build job succeeds, deploy job fails with a permissions error.

### Pitfall 5: Eleventy Processes _data/config.js as a Page

**What goes wrong:** Eleventy treats some JS files as templates and attempts to render them as output pages.

**Why it happens:** Eleventy's data cascade files in `_data/` are loaded as data, not templates. However, if the file is outside `_data/` or if `.eleventyignore` is misconfigured, it may be processed incorrectly.

**How to avoid:** Keep `config.js` inside `src/_data/` (not `src/` root) and ensure Eleventy's `dir.input` points to `src`. The `_data/` directory is special to Eleventy and its contents are never rendered as output pages.

---

## Code Examples

### Minimal index.html for Scaffolding Verification

```html
<!-- src/index.html -->
<!-- A minimal page to verify the full pipeline works end-to-end -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cache County Library Choices</title>
    <link rel="stylesheet" href="/css/compiled.css" />
  </head>
  <body class="bg-white text-gray-900 p-8">
    <h1 class="text-2xl font-bold">Library Choices</h1>
    <p class="mt-2 text-gray-600">Pipeline verification placeholder.</p>
  </body>
</html>
```

### Minimal .gitignore

```
_site/
node_modules/
.cache/
*.log
```

### Eleventy Data Cascade Verification

```javascript
// src/_data/config.js
// Source: https://www.11ty.dev/docs/data-js/
// Verifies that Eleventy loads JS data files correctly
module.exports = {
  siteName: "Cache County Library Choices",
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with `content: [...]` | CSS-first `@theme {}`, automatic content scanning | Tailwind v4 (Jan 2025) | No config file needed; all v3 tutorials are outdated |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` | Tailwind v4 (Jan 2025) | Single import replaces three directives |
| `tailwindcss` as direct PostCSS plugin | `@tailwindcss/postcss` as PostCSS plugin | Tailwind v4 (Jan 2025) | Separate npm package required |
| `.eleventy.js` (CommonJS) | `eleventy.config.js` (ESM, `export default`) | Eleventy v3 (Oct 2024) | Both still work; ESM is preferred in v3 |
| `gh-pages` branch deployment | `actions/deploy-pages` (GitHub native) | GitHub Actions, 2023+ | No separate branch needed; cleaner history |

**Deprecated/outdated:**
- `peaceiris/actions-gh-pages`: Still works but is a third-party action; the GitHub-native `actions/deploy-pages` is preferred
- `tailwindcss` npm package providing a CLI binary: In v4, the CLI is separate (`tailwindcss` CLI still works for watching, but config is CSS-based now)
- `tailwind.config.js` `content` array: Replaced by automatic file scanning in v4

---

## Open Questions

1. **Custom domain vs. subdirectory URL**
   - What we know: If the repo owner sets up a custom domain (e.g., `librarychoices.cachecounty.org`), pathPrefix should be `/` not `/library-choices/`
   - What's unclear: Whether a custom domain will be used for this project
   - Recommendation: Implement with `pathPrefix: "/library-choices/"` for now; switching to a custom domain later only requires removing the pathPrefix setting

2. **Node.js version in CI**
   - What we know: Eleventy v3 requires Node.js >= 18; the sample workflow uses Node 22
   - What's unclear: Whether the repo owner's local environment matches (relevant if they run builds locally)
   - Recommendation: Pin to Node 22 in the workflow (current LTS); add `"engines": { "node": ">=18" }` to package.json

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No automated test framework — this phase is infrastructure/build pipeline verification |
| Config file | None |
| Quick run command | `npm run build && ls _site/` |
| Full suite command | `npm run build` + manual URL verification on deployed page |

Phase 1 success criteria are verified by inspection, not by automated unit tests. The phase gate is:
1. `npm run build` exits 0 and produces `_site/index.html`
2. The GitHub Actions workflow completes without error
3. The deployed URL loads with no 404s on assets
4. `git ls-files _site/` returns empty (nothing in `_site/` is tracked)

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Verification Command | Notes |
|--------|----------|-----------|----------------------|-------|
| INFR-01 | `npm run build` produces `_site/` with HTML | smoke | `npm run build && test -f _site/index.html` | Manual — check HTML is valid, CSS is linked |
| INFR-02 | GitHub Actions deploys to Pages URL | smoke/manual | Check Actions tab + visit deployed URL | Automated by workflow |
| INFR-03 | Output is fully static (no server code) | manual | Inspect `_site/` — only `.html`, `.css`, `.js` files | No `.php`, no server config |

### Sampling Rate

- **Per task:** `npm run build` (verify `_site/` produced correctly)
- **Per wave:** Full build + deploy verification (check Actions workflow passes)
- **Phase gate:** All three success criteria TRUE before Phase 2

### Wave 0 Gaps

- [ ] `package.json` — does not exist yet; must be created with `npm init`
- [ ] `eleventy.config.js` — must be created
- [ ] `postcss.config.mjs` — must be created
- [ ] `src/css/style.css` — Tailwind entry point, must be created
- [ ] `src/index.html` — minimal template for pipeline verification
- [ ] `.github/workflows/deploy.yml` — GitHub Actions workflow
- [ ] `.gitignore` — must include `_site/` before first build

---

## Sources

### Primary (HIGH confidence)

- https://www.11ty.dev/docs/get-started/ — Eleventy v3 install requirements, Node 18 minimum
- https://www.11ty.dev/docs/config/ — `pathPrefix`, `dir` config, ESM export format
- https://www.11ty.dev/docs/plugins/html-base/ — HtmlBasePlugin, automatic URL rewriting
- https://www.11ty.dev/docs/ignores/ — `.gitignore` integration, `setUseGitIgnore`
- https://www.11ty.dev/docs/deployment/ — GitHub Pages workflow sample reference
- https://tailwindcss.com/docs/installation/using-postcss — v4 PostCSS install, packages, CSS import
- https://tailwindcss.com/blog/tailwindcss-v4 — v4 architecture changes, CSS-first config, automatic scanning
- npm registry (2026-03-20): `@11ty/eleventy@3.1.5`, `tailwindcss@4.2.2`, `@tailwindcss/postcss@4.2.2`, `postcss@8.5.8`, `npm-run-all2@8.0.4`

### Secondary (MEDIUM confidence)

- https://github.com/11ty/eleventy-base-blog — Official sample GitHub Actions workflow YAML (fetched via WebFetch)
- https://abdullahyahya.com/2025/02/set-up-a-simple-and-reliable-static-site-generator-using-11ty-eleventy-tailwind-css/ — Verified Eleventy + Tailwind v4 integration pattern (2025-02)

### Tertiary (LOW confidence — for awareness only)

- Various WebSearch results on peaceiris/actions-gh-pages (deprecated in favor of native deploy-pages)
- Community patterns for npm-run-all2 concurrent scripts (patterns verified against npm-run-all2 docs)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against npm registry on 2026-03-20
- Architecture: HIGH — patterns verified against official Eleventy and Tailwind documentation
- Pitfalls: HIGH for pathPrefix/asset 404s (official docs explicit); MEDIUM for Tailwind v4 gitignore scanning (from GitHub issues, not official docs)

**Research date:** 2026-03-20
**Valid until:** 2026-06-20 (90 days — Eleventy and Tailwind both stable; minor patch versions may change)
