# Stack Research

**Domain:** Data-driven civic interactive configurator — static site with JavaScript calculator
**Researched:** 2026-03-20
**Confidence:** MEDIUM-HIGH (Tailwind v4 confirmed from official docs; Eleventy v3 and Alpine.js from training data through August 2025; Astro version from training data)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Eleventy (11ty) | `^3.0` | Static site generator — renders Nunjucks templates with data from `_data/` files | Purpose-built for data-driven static HTML generation; zero-opinion output; the `_data/` convention gives non-developer-editable data files for free; no client-side JS bundle from the framework itself; fits the architecture already established in ARCHITECTURE.md |
| Tailwind CSS | `^4.1` | Utility-first CSS — mobile-first responsive styling | v4.1 stable (April 2025); v4.x is the current generation; CSS-first config with `@theme` block replaces `tailwind.config.js`; automatic content detection eliminates manual `content` array config; mobile-first by default |
| `@tailwindcss/postcss` | `^4.1` | PostCSS plugin — integrates Tailwind into Eleventy's build pipeline | Eleventy is not a Vite project; it uses PostCSS for CSS transforms. The `@tailwindcss/postcss` package is the correct Tailwind v4 integration path for PostCSS-based workflows |
| Vanilla JavaScript (ES2020+) | Browser-native | Runtime calculator — reads embedded data, responds to form events, updates DOM | The calculator is ~50 lines of arithmetic and DOM manipulation. Vanilla JS is sufficient; no framework overhead; no dependencies to maintain; works without a bundler or transpile step |
| Nunjucks | `^3.2` | HTML templating language for Eleventy | Eleventy's most feature-complete template engine; supports loops, filters, and the `| dump | safe` pattern needed to embed `_data/config.js` as JSON into a `<script>` tag (see ARCHITECTURE.md Pattern 1) |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Alpine.js | `^3.x` | Lightweight reactive UI framework (~15 KB min+gz) | Use if the shareable-URL state encoding feature (v1.x) requires managing complex form state across multiple controls. Alpine's `x-data` / `x-model` declarative bindings are cleaner than manual `document.querySelector` chains for state serialization. **Not required for v1 MVP** — vanilla JS is sufficient for the initial calculator. Upgrade path: add Alpine when state complexity grows. |
| PostCSS | `^8.x` | CSS post-processor | Required as the runtime for `@tailwindcss/postcss`. Eleventy does not include PostCSS by default; it must be wired in via an Eleventy plugin or a separate build step |
| `@11ty/eleventy-plugin-postcss` | latest | Bridges PostCSS into Eleventy's asset pipeline | Allows Eleventy to transform `src/css/input.css` through PostCSS/Tailwind during the same `eleventy` build command, keeping one build step |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `npm` scripts | Build orchestration | `"build": "eleventy"` is sufficient; Tailwind runs as a PostCSS plugin inside Eleventy, so no separate `tailwindcss --watch` process is needed. `"start": "eleventy --serve"` for local dev |
| Eleventy Dev Server | Local development with hot-reload | Bundled with Eleventy v3 (`@11ty/eleventy-dev-server`); no separate server needed; serves `_site/` locally |
| GitHub Actions | CI/CD deployment to GitHub Pages | `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` — full pattern in ARCHITECTURE.md |
| Node.js | Build runtime | `>=18.0.0` required for Eleventy v3 (uses modern ESM). Use `engines` field in `package.json` to document this requirement |

---

## Installation

```bash
# Core build dependencies
npm install --save-dev @11ty/eleventy nunjucks

# Tailwind CSS v4 with PostCSS integration
npm install --save-dev tailwindcss @tailwindcss/postcss postcss

# Eleventy PostCSS plugin (wires PostCSS into Eleventy asset pipeline)
npm install --save-dev @11ty/eleventy-plugin-postcss

# Alpine.js (add only when state complexity warrants it — NOT needed for v1 MVP)
# If using via CDN (recommended for this scale):
#   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
# If using via npm:
npm install alpinejs
```

---

## Tailwind v4 Configuration (Important: No tailwind.config.js)

Tailwind v4 replaces `tailwind.config.js` with CSS-native configuration. The **ARCHITECTURE.md reference to `tailwind.config.js` is a Tailwind v3 pattern and should not be created for a v4 project.**

```css
/* src/css/input.css */
@import "tailwindcss";

/* Custom theme extensions (v4 CSS-first config) */
@theme {
  /* Example: Add only if you need custom tokens */
  /* --color-civic-blue: oklch(0.45 0.15 240); */
}
```

Tailwind v4 auto-detects source files from the filesystem (respecting `.gitignore`). No manual `content` array configuration is needed.

PostCSS config:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Eleventy | Astro | Use Astro instead if the project needs: (1) React/Vue/Svelte components with islands architecture, (2) Content Collections with TypeScript schema validation, (3) MDX-based content. Astro v5 (released Dec 2024) is excellent for content-heavy sites but its component model and build pipeline are heavier than needed for a single-page calculator. Eleventy produces simpler output with less tooling. |
| Eleventy | Hugo | Use Hugo if build speed at scale matters (Hugo is ~100x faster), the team is comfortable with Go templating, or the project will have hundreds of pages. For a single-page site, Hugo's speed advantage is irrelevant and its templating is less approachable for maintainers. |
| Eleventy | Jekyll | Do not use Jekyll. It is the legacy GitHub Pages default (no longer recommended). Ruby-based build chain adds friction; active development has slowed; Tailwind integration is more complex. |
| Vanilla JS | Alpine.js | Use Alpine.js if the interactive state grows beyond ~3 form controls with interdependencies, or if shareable URL encoding requires synchronizing state across many elements. Alpine adds ~15 KB but eliminates manual DOM querying boilerplate for complex state. |
| Vanilla JS | React / Vue / Svelte | Do not use a SPA framework for this project. A tax calculator with three input dimensions and one output number does not justify a component framework's build pipeline, bundle size, hydration complexity, or maintenance surface. |
| `@tailwindcss/postcss` (v4) | `tailwindcss` PostCSS plugin (v3) | If for any reason the team is locked to Tailwind v3 (e.g., an existing project), use `tailwindcss` as a PostCSS plugin with `tailwind.config.js`. For a greenfield project in 2025, start with v4. |
| PostCSS via Eleventy plugin | Vite | Use Vite if Astro or a Vite-native framework is chosen as the SSG. Vite's Tailwind plugin (`@tailwindcss/vite`) is the most seamless v4 integration — but Vite is not compatible with Eleventy's build model. Don't use both. |
| npm scripts | Parcel / Webpack | Do not add a bundler. The calculator JS has no imports and no dependencies — bundling provides zero benefit and adds configuration complexity. Eleventy passthrough-copies the JS file as-is. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `tailwind.config.js` | This is a Tailwind v3 configuration file. Tailwind v4 uses CSS-native `@theme` blocks in your CSS entry file. Creating a `tailwind.config.js` on a v4 project will be ignored or cause confusion | CSS `@theme` block in `src/css/input.css` |
| `@tailwind base; @tailwind components; @tailwind utilities;` directives | These are v3 directives. Tailwind v4 uses a single `@import "tailwindcss";` in CSS | `@import "tailwindcss";` |
| Jekyll | Ruby-based, legacy GitHub Pages default. Active development has slowed. No native JS data pipeline. Tailwind integration requires workarounds | Eleventy |
| React / Vue / Svelte / SolidJS | Component frameworks designed for complex application UIs. This is a single-page calculator — the framework cost (bundle, hydration, build complexity) vastly exceeds the interactivity requirements | Vanilla JS or Alpine.js |
| `fetch()` for config data at runtime | Introduces async complexity, loading states, error handling, and CORS concerns for a static site. Fails on `file://` protocol during local testing | Embed data as inline JSON via Eleventy template (`{{ config | dump | safe }}`) |
| Webpack / Rollup / Parcel | Module bundlers add significant configuration overhead for a project with no npm imports in its client JS | No bundler — Eleventy passthrough-copy for JS files |
| Tailwind v3 on a greenfield project | v3 reached end-of-life when v4 shipped in January 2025. v4 is stable, faster, and uses a simpler CSS-based configuration | Tailwind v4.x (`tailwindcss@latest`) |
| Committing `_site/` to `main` | Pollutes git history, creates merge conflicts, breaks reproducible builds | GitHub Actions CI/CD to deploy `_site/` — keep it in `.gitignore` |

---

## Stack Patterns by Variant

**If the data file will be updated by a non-developer via GitHub's web editor:**
- Use `_data/config.json` (JSON) instead of `_data/config.js` (JS module)
- JSON has stricter syntax (no comments, no trailing commas, no computed values) but GitHub's web editor validates JSON inline
- Add a comment at the top of the file in a companion `_data/config.README.md` explaining each field
- Downside: loss of inline comments explaining what each number means; mitigate with clear key names and the README

**If Alpine.js is added for v1.x shareable URL feature:**
- Load Alpine via CDN defer script tag (no bundler needed, ~15KB, stays off critical path)
- Replace manual `document.querySelector` chains in `calculator.js` with `x-data` state object
- URL encoding: serialize `$store` or `x-data` object to `URLSearchParams` on every `x-on:change`
- Read URL params on `Alpine.store` initialization

**If the project grows to multiple pages (About, FAQ, Methodology):**
- Add Eleventy layouts (`src/_layouts/base.njk`) and partials (`src/_includes/`)
- Data file structure does not change — `_data/config.js` remains the single source of truth
- Add `src/about.njk`, `src/methodology.njk` as additional pages

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@11ty/eleventy@^3.0` | Node.js `>=18.0.0` | Eleventy v3 dropped support for Node 14/16; uses ESM-compatible internals. Verify Node version on CI runner matches local |
| `tailwindcss@^4.1` | `@tailwindcss/postcss@^4.1` | Must use the matching `@tailwindcss/postcss` version — not the legacy `tailwindcss` PostCSS plugin from v3. Both packages should be on the same major version |
| `tailwindcss@^4.1` | `postcss@^8.x` | Tailwind v4 requires PostCSS 8. PostCSS 7 is incompatible |
| `nunjucks@^3.2` | `@11ty/eleventy@^3.0` | Eleventy v3 bundles Nunjucks support; no separate configuration needed. The `nunjucks` package itself is a transitive dependency |
| Alpine.js `@^3.x` | Vanilla JS calculator | Alpine can coexist with vanilla JS. If Alpine is added, ensure no naming conflicts between Alpine's `x-data` scope and `window.LIBRARY_DATA` |
| `actions/deploy-pages@v4` | GitHub Actions | Requires Pages source set to "GitHub Actions" in repo settings (not branch-based deployment). This is a one-time manual setting change in the GitHub repo UI |

---

## Key Tailwind v4 Migration Note for Architecture.md

The current ARCHITECTURE.md references `tailwind.config.js` in the recommended project structure. This file does not exist in Tailwind v4. The correct v4 project structure omits it:

```
library-choices/
├── _data/
│   └── config.js          # ALL scenario numbers
├── src/
│   ├── index.njk          # Single page template
│   ├── css/
│   │   └── input.css      # @import "tailwindcss"; + @theme block
│   └── js/
│       └── calculator.js  # Runtime calculation logic
├── _site/                 # Build output (gitignored)
├── .eleventy.js           # Eleventy config
├── postcss.config.js      # @tailwindcss/postcss plugin config
└── package.json           # Build scripts + dependencies
```

`tailwind.config.js` → removed (v4 does not use it)
`postcss.config.js` → added (configures `@tailwindcss/postcss`)

---

## Sources

- Tailwind CSS official blog, https://tailwindcss.com/blog/tailwindcss-v4 — v4.0 stable confirmed January 22, 2025 (HIGH confidence — fetched from official source)
- Tailwind CSS official blog, https://tailwindcss.com/blog/tailwindcss-v4-1 — v4.1 release confirmed April 3, 2025 (HIGH confidence — fetched from official source)
- Tailwind CSS installation docs, https://tailwindcss.com/docs/installation — v4.2 shown as current docs version; PostCSS and Vite plugin both valid (HIGH confidence — fetched from official source)
- Eleventy v3.0 release — ESM support, Node 18+ requirement, Nunjucks support (MEDIUM confidence — training data through August 2025; WebFetch unavailable to verify current patch version)
- Alpine.js v3.x bundle size (~15KB) and reactive model — (MEDIUM confidence — training data; WebFetch unavailable)
- Astro v5.0 release (December 2024) — used as comparison point for alternatives (MEDIUM confidence — training data)
- ARCHITECTURE.md (this repository) — authoritative for Eleventy choice, data embedding pattern, and GitHub Actions deployment workflow (HIGH confidence)

---
*Stack research for: Civic interactive property tax configurator (Cache County Library Choices)*
*Researched: 2026-03-20*
