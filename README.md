# Cache County Library Service Choices

An interactive, mobile-first static website that helps Cache County citizens understand the fiscal impact of library service and funding decisions.

**Live site:** https://themcmurder.github.io/library-choices/

## What it does

Citizens configure a scenario by selecting:

- **Hours Open** — staffing level (Basic through Current service)
- **Digital collections budget** — 5 tiers from $5k (state access only) to $65k (expanded with shorter wait times)
- **Physical collections budget** — 5 tiers from $0 (digital only) to $20k (full print + AV + periodicals)
- **Participating cities** — Providence, Nibley, Millville, River Heights

The site instantly shows the **property tax cost per household per year** for the selected combination. Scenarios are shareable via URL.

## Tech stack

- [Eleventy v3](https://www.11ty.dev/) — static site generator (ESM, Nunjucks templates)
- [Tailwind CSS v4](https://tailwindcss.com/) — standalone CLI
- Vanilla ES modules — no frontend framework
- [Vitest](https://vitest.dev/) — 21 tests covering config, calculations, and URL encoding
- GitHub Pages — automatic deployment on push to `main`

## Development

```bash
pnpm install
pnpm start        # Eleventy dev server + Tailwind watch
```

```bash
pnpm run build    # Production build → _site/
pnpm test         # Run test suite
```

## Agents
- Claude - Substantial contributions

## Project structure

```
src/
  index.html              # Single-page Nunjucks template
  _data/config.js         # All scenario data (staffing, collections, cities)
  _includes/macros/
    slider.njk            # Shared collections slider macro
  js/
    calculator.js         # Cost calculation + DOM updates
    url.js                # URL parameter encode/decode
    lib/
      calculator-helpers.js
      url-helpers.js
  css/
    style.css             # Tailwind directives + custom rules
test/
  config.test.js
  calculator.test.js
  url.test.js
.github/workflows/
  deploy.yml              # GitHub Pages deployment
  test.yml                # Non-blocking CI
```

## Updating data

All scenario data lives in [src/_data/config.js](src/_data/config.js). The file includes an extensive **NON-DEVELOPER EDIT GUIDE** — costs, city names, household counts, and service descriptions can all be updated through the GitHub web editor without touching any other files.

**Important:** The URL sharing scheme uses array-position indices for compact encoding. Always **append** new items to the end of the `staffingLevels`, `collectionsDigital`, `collectionsPhysical`, and `cities` arrays — inserting or reordering will break existing shared links.

When data is finalized, set `draft: false` in `config.js` to remove the "SAMPLE DATA" watermark.

## Cost model

Total annual cost = staffing + digital collections + physical collections

This sum is divided by the total number of households across participating cities to produce a per-household annual tax figure. Each dimension is independently adjustable; costs are additive.
