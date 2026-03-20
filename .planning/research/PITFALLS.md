# Pitfalls Research

**Domain:** Civic interactive configurator static site (GitHub Pages + Tailwind CSS + data file)
**Researched:** 2026-03-20
**Confidence:** HIGH (domain-specific, verified against official Tailwind docs and MDN)

---

## Critical Pitfalls

### Pitfall 1: GitHub Pages Subdirectory Path Breaks All Assets

**What goes wrong:**
When a repository is deployed as a project site (not a user/org site), GitHub Pages serves it from `https://username.github.io/repo-name/` — not from the root `/`. Any asset reference using a root-relative path (`/css/main.css`, `/data.json`) will 404 because the browser resolves it against `username.github.io/`, not `username.github.io/repo-name/`. The site loads a blank page with no styles and broken JS.

**Why it happens:**
Developers test locally with a dev server that serves from `/`, so everything works. They deploy to GitHub Pages as a project site and assume the same root-relative paths work. The mismatch is invisible during local development and only surfaces after deployment.

**How to avoid:**
- Use relative asset paths (`./css/main.css`, not `/css/main.css`) in HTML templates, OR
- Configure your static site generator's `base` / `baseURL` setting to match the repository name (`/repo-name/`) and use it for all asset links, OR
- Use a custom domain (which does serve from `/`), eliminating the subdirectory entirely.
- During CI, deploy a preview build and verify the deployed URL before treating the site as done.

**Warning signs:**
- Page loads but shows no styles (CSS 404s)
- Console shows 404 errors for `/css/`, `/js/`, or `/data.json` paths
- Works on `localhost:3000` but broken on `username.github.io/repo-name/`
- `fetch('/data.json')` returns HTML (the 404 page) instead of JSON

**Phase to address:**
Project scaffolding phase — set the base path correctly from day one before any asset references are written. Verifying deployment should be a done-criterion for the initial deploy phase.

---

### Pitfall 2: Tailwind JIT Drops Classes Built from String Interpolation

**What goes wrong:**
Tailwind scans source files as plain text. Any class name assembled via string concatenation, template literals, or variable interpolation is invisible to the scanner and will not be included in the generated CSS. The class works in development (if using a dev watcher that catches file changes) but can silently disappear if the scanning misses edge cases, and it will definitely break in production builds if the complete class string is never literally present in source.

Concrete example for this project: generating `text-red-600` or `bg-blue-500` dynamically based on a cost threshold variable will cause those classes to be absent from the production stylesheet.

**Why it happens:**
Tailwind's content scanner is a regex-based text search, not a JavaScript parser. It intentionally avoids runtime evaluation. Developers coming from CSS-in-JS or SCSS assume the build tool can see dynamic values.

**How to avoid:**
- Use complete, literal class strings in source. Use a lookup object for conditional styling:
  ```javascript
  const levelStyle = { low: 'text-green-700', high: 'text-red-700' };
  ```
- If a class must be dynamic, add it to Tailwind's safelist / `@source inline()` directive.
- For this project: since all styling states are known at author time (3 staffing levels, 2 collection states), enumerate them explicitly in templates.

**Warning signs:**
- An element styled conditionally looks right in dev but loses its color/style in the production build.
- The production CSS file (minified) does not contain a class string you expected.
- Styles that depend on a JavaScript variable or data-file value go missing.

**Phase to address:**
Styling/component phase — establish the pattern of explicit class enumeration from the first interactive component. Include a production build + visual check in the definition of done for that phase.

---

### Pitfall 3: Floating-Point Division Produces Display Errors in Tax Calculations

**What goes wrong:**
The tax calculation is `total annual cost / total participating households`. Both values will be currency/dollar amounts read from a data file. IEEE 754 floating-point arithmetic can produce results like `$12.000000000000002` instead of `$12.00`, or rounding errors that accumulate when summing staffing costs and collections costs before dividing.

For a civic tool presenting official-sounding tax numbers, a stray decimal place or unexpected cent destroys credibility.

**Why it happens:**
JavaScript's `Number` type is binary floating-point. Division and addition of non-powers-of-two fractions (i.e., most dollar amounts) cannot be represented exactly. `0.1 + 0.2 === 0.30000000000000004` is the canonical example.

**How to avoid:**
- Store all monetary values in the data file as integer cents (e.g., `25000000` for $250,000), not dollars.
- Perform all arithmetic in integer cents, divide last, then convert to display dollars only for output.
- If dollar storage is required for human readability in the data file, multiply to cents at read time before any arithmetic.
- Use `toFixed(2)` only at the final display step — never on intermediate values.
- Add a unit test for the calculation function with known-bad floating-point cases (e.g., costs that produce repeating decimals).

**Warning signs:**
- Output shows trailing near-zeros: `$12.000000000000002`
- Output varies by one cent depending on addition order
- Household counts or cost values in the data file are decimals

**Phase to address:**
Calculation logic phase — write and test the math module before connecting it to UI. The data file schema design should specify integer-cents-or-dollars convention explicitly.

---

### Pitfall 4: Partial Data Presented as Complete, Misleading Citizens

**What goes wrong:**
The data file lists costs and household counts for "cities considering participation." If a city is listed with a placeholder or estimated figure while another city has confirmed figures, the configurator presents all of them with equal authority. Citizens see a tax number that is partly speculative and partly confirmed, with no indication which is which — and may form opinions or quote figures based on incomplete information.

This is especially dangerous for a civic tool influencing a real public decision.

**Why it happens:**
The site owner updates numbers incrementally as city councils vote or provide data. The data file doesn't distinguish between "confirmed" and "estimated" figures. The template has no mechanism to surface that distinction, so it never gets added.

**How to avoid:**
- Add a `status` field to each city entry in the data file: `"confirmed"` vs `"estimated"`.
- Render an asterisk, badge, or tooltip next to cities with estimated figures.
- Include a prominent site-level caveat when any displayed number includes estimated inputs.
- Add an `as_of_date` field to the data file so the displayed output can show "figures as of [date]."
- Document the data file schema so the site owner knows which fields are required vs. optional.

**Warning signs:**
- Data file has comments like "TBD" or "~" in household counts
- City list changes between discussions but the template shows all as equivalent
- No "last updated" date visible to users anywhere on the page

**Phase to address:**
Data file schema design phase (before or alongside the configurator build). The schema should encode uncertainty from the start, not be retrofitted later.

---

### Pitfall 5: Interactive Controls Fail Accessibility for Touch and Keyboard Users

**What goes wrong:**
Custom-styled checkboxes and radio buttons (built with Tailwind utility classes over `<div>` or `<span>` elements) lose native keyboard focus, Enter/Space activation, and screen reader announcements. On mobile, tap targets that are visually small (the visible check mark area) are too small for reliable touch, failing WCAG 2.5.5 (44x44px minimum).

This matters for a civic tool: older voters who need accessibility tools, mobile users on phones, and anyone tabbing through the form will have a broken experience.

**Why it happens:**
Tailwind makes it easy to style any element. Developers style a `<div>` to look like a checkbox without understanding that `<input type="checkbox">` provides free keyboard interaction, focus management, and screen reader semantics. Touch targets feel "big enough" in desktop browser DevTools mobile simulation but fail on real devices.

**How to avoid:**
- Use native `<input type="checkbox">` and `<input type="radio">` elements. Style them with Tailwind's peer-/sibling selector patterns to achieve custom visuals while preserving native behavior.
- Ensure the associated `<label>` wraps or is linked via `for`/`id` — this automatically extends the touch/click target to the entire label area.
- Set minimum touch target sizes with padding: `p-3` or `min-h-[44px]` on the label.
- Test with keyboard-only navigation (Tab, Space, Enter) on every interactive control.
- Test on a real mobile device, not just Chrome DevTools.

**Warning signs:**
- Checkboxes are `<div>` or `<span>` elements with `onClick` handlers instead of `<input type="checkbox">`
- Clicking the label text doesn't toggle the checkbox
- Tab key skips over controls or focus ring is invisible
- On a phone, requires precise tap on the small box rather than the whole row

**Phase to address:**
Component build phase — establish the correct pattern (native input + label) on the very first checkbox before building the city list. Fix cost is near-zero at this stage; retrofitting is painful.

---

### Pitfall 6: Data File Update Workflow Is Too Fragile for a Non-Developer Owner

**What goes wrong:**
The site owner is a city council member or civic advocate, not a developer. If the data file is YAML with strict indentation, JSON without comments, or embedded in a JavaScript module, a single missed space or stray comma corrupts the entire file, silently breaks the site, and the owner cannot diagnose it. Updates stall or stop happening.

**Why it happens:**
Developers choose data formats for technical convenience (JSON is easy to `import`, YAML is what Jekyll uses). They don't consider the edit experience for a non-technical owner who will make changes under time pressure, possibly via GitHub's web editor.

**How to avoid:**
- Use JSON with a strict, flat, commented example in the repository (JSON doesn't support comments, but a `data.example.json` with annotations helps).
- Alternatively, use TOML — less indentation-sensitive than YAML, simpler than JSON for small configs.
- Provide a `data-schema.md` or inline validation that catches malformed files at build time with a human-readable error.
- Add a CI check (GitHub Actions) that validates the data file on every push and reports errors in plain English.
- Document every field in a README adjacent to the data file.

**Warning signs:**
- Owner asks "where do I change the number for Nibley?" and there's no answer in the repo
- Data file has nested objects deeper than 2 levels
- No validation runs on data file changes before deploy
- Build silently deploys with default/fallback values when the data file is broken

**Phase to address:**
Data file design phase — schema, format choice, and validation should be finalized before building templates that depend on the schema. Owner update workflow should be explicitly tested (simulate a non-developer edit) before launch.

---

### Pitfall 7: GitHub Pages Deploy Action Caches Stale Build Artifacts

**What goes wrong:**
GitHub Actions caches are keyed by branch and cache key. If the workflow uses `actions/cache` for `node_modules` or the Tailwind build output without a proper cache key (e.g., keyed on `package-lock.json` hash), a dependency upgrade or Tailwind config change won't invalidate the cache. The deployed site continues serving the old stylesheet. This is particularly insidious because the local build shows the correct output.

**Why it happens:**
Cache configurations are often copied from generic templates. The cache key is set to a static string or only invalidated on `package.json` changes, not `package-lock.json` or Tailwind config changes.

**How to avoid:**
- Key the `node_modules` cache on `${{ hashFiles('**/package-lock.json') }}`.
- Key any build-output cache on the combination of source files and config.
- For a simple project like this, avoid caching the build output entirely — the build is fast enough that caching adds more risk than value.
- After any workflow configuration change, manually trigger a fresh workflow run with "Re-run all jobs" (not "Re-run failed jobs") to bypass any stale cache.

**Warning signs:**
- Pushed a CSS change but the live site still shows the old style
- `git log` on main shows the new code but the deployed site doesn't reflect it
- Workflow shows a "Cache hit" message and completes suspiciously quickly

**Phase to address:**
Initial deployment setup phase — establish correct cache key strategy before the first production deploy.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode city names/costs in HTML templates | Faster first build | Every data update requires HTML edits; owner can't self-serve | Never — data file is a stated requirement |
| Use `<div onClick>` for checkboxes | Easier custom styling | Accessibility failures; keyboard broken; screen readers mute | Never for interactive controls |
| Store costs as display strings ("$250,000") in data file | Human-readable data file | Requires string parsing before math; fragile | Never — store as numbers, format at display time |
| Skip production build test, only test dev server | Faster iteration | Tailwind purge misses classes; path issues hidden | Never — always run one production build before shipping |
| Single HTML file with all data inline | Zero build tooling | Non-developer cannot update data; owner dependency on developer forever | Only for a throwaway 24-hour prototype |
| No `as_of_date` in data file | Simpler schema | Citizens can't tell if numbers are current; credibility risk | Never for a live civic tool |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages + project repo | Root-relative asset paths (`/css/main.css`) | Relative paths (`./css/main.css`) or configure `base` to `/repo-name/` |
| GitHub Pages + custom domain | Forgetting `CNAME` file gets deleted on redeploy | Check CNAME file into repo root; Actions workflow preserves it |
| GitHub Actions deploy | Using `actions/upload-pages-artifact` with wrong `path` | Point `path` to the exact output directory (e.g., `dist/` or `_site/`), not the repo root |
| Data file + static site generator | Generator silently uses stale data after file edit | Verify the SSG watches the data file, not just template files, in dev mode |
| Tailwind CLI + data file | Tailwind not scanning the data file for class names | Add data file path to `content` array in Tailwind config if classes are referenced there |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Shipping unminified Tailwind CSS | Page load slow on mobile over 4G/LTE | Always run production build (`NODE_ENV=production`) which enables JIT purge | Even at 1 user — file is 3–4MB vs. ~5–15KB |
| Large inline data object in `<script>` tag | Slight parse delay; harder to update | Keep data in separate JSON file, `fetch()` at runtime or inject at build time | Not a real performance concern at this scale, but makes owner updates harder |
| No `defer` or `async` on script tags | JavaScript blocks HTML parsing | Add `defer` to all script tags | Any page load on slow connection |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Displaying raw data file values as HTML without escaping | XSS if a city name contains `<script>` | Use text content assignment (`textContent =`), not `innerHTML =`, for all data-derived values |
| Including real resident PII (household addresses) in data file | Privacy violation; data committed to public repo | Data file should contain only aggregate counts and dollar amounts — no individual data |
| Committing API keys or secrets to the repo "for later" | Public repo exposes credentials permanently | Never put secrets in a static site repo; GitHub Pages is public by default |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Output updates only on form submit, not on each change | Users don't see the "live" configurator feel; have to click to see effect | Update the output number on every `change` and `input` event — no submit button needed |
| No "default/current scenario" pre-selected | Users see $0 or blank until they click checkboxes; confusing starting state | Pre-select the current operation scenario (1 FTE + 2 PTE + all current cities + collections) as the default |
| Single output number with no context | "$47/year" is meaningless without knowing what the current alternative is | Show "compared to $0 if library closes" or frame cost relative to current county tax contribution |
| City checkboxes with no explanation of what selecting/deselecting means | Citizens don't understand that deselecting a city removes it from cost-sharing | Label the city section: "Cities participating in cost-sharing" with brief explanation |
| No mobile keyboard/number input testing | On phones, page interactions feel broken or controls are too small | Test the entire flow on a real mobile device before launch, not just DevTools simulation |
| Displaying very precise outputs ("$46.83/year") for estimated inputs | False precision implies official accuracy; damages trust if number changes | Round to nearest dollar when any input is estimated; show "approximately" qualifier |

---

## "Looks Done But Isn't" Checklist

- [ ] **Tax calculation:** Verify with at least two city combinations manually; confirm floating-point output is exactly `$XX.XX`, not `$XX.XXXXXXXX`.
- [ ] **Deployed site:** Load the actual GitHub Pages URL (not localhost) and verify styles render, data loads, and calculation works.
- [ ] **Mobile touch targets:** Open on a real phone (not DevTools). Tap each checkbox. Confirm label area is tappable, not just the box graphic.
- [ ] **Keyboard navigation:** Tab through every control, press Space on checkboxes, confirm all states are reachable without a mouse.
- [ ] **Data file update round-trip:** Have a non-developer (or simulate one) edit the data file via GitHub web UI, commit, verify the site updates correctly within minutes.
- [ ] **Asset paths after deploy:** Inspect the deployed page source. Confirm no 404s in browser console for CSS, JS, or data files.
- [ ] **All city combinations:** Test with all cities selected, no cities selected, and one city selected. Confirm no divide-by-zero or display errors.
- [ ] **Tailwind production build:** Run `NODE_ENV=production` build locally. Open the output HTML. Verify conditional styles (color classes for different cost levels) are present in the stylesheet.
- [ ] **`CNAME` file preserved:** If using a custom domain, confirm the `CNAME` file is in the output and is not deleted by the deploy workflow.
- [ ] **Data staleness indicator:** Confirm the page shows a "figures as of [date]" notice that matches the `as_of_date` in the data file.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| GitHub Pages subdirectory path broken | LOW | Change all absolute paths to relative or set `base` config; rebuild and redeploy |
| Tailwind purged a needed class | LOW | Add class to safelist or ensure literal class string in source; rebuild |
| Floating-point display error in tax output | LOW | Rewrite calculation to use integer cents; update unit tests |
| Data file schema is wrong and owner can't update | MEDIUM | Redesign schema, migrate existing data, update all templates that reference old keys |
| Accessibility failures discovered post-launch | MEDIUM | Replace custom `<div>` controls with native `<input>` elements; retest |
| Partial data presented without caveats — civic backlash | MEDIUM–HIGH | Add `status` and `as_of_date` fields; redeploy with caveats; proactive communication |
| GitHub Actions cache serving stale build | LOW | Clear Actions cache via GitHub UI; re-run workflow |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| GitHub Pages subdirectory path | Phase 1: Project setup & initial deploy | Load the deployed URL; confirm zero 404s in console |
| Tailwind JIT missing dynamic classes | Phase 2: Component styling | Run production build locally; inspect output CSS for all conditional classes |
| Floating-point tax calculation errors | Phase 3: Calculation logic | Unit test with known edge-case values; confirm output is formatted `$XX.XX` |
| Partial/estimated data presented as authoritative | Phase 2: Data file schema | Data file includes `status` and `as_of_date` fields; template renders caveats |
| Accessibility failures on interactive controls | Phase 3: Interactive configurator | Keyboard-only walkthrough; axe or Lighthouse accessibility audit |
| Touch targets too small on mobile | Phase 3: Interactive configurator | Physical device test; verify 44px minimum touch area |
| Data file update workflow too fragile | Phase 2: Data file schema | Non-developer simulation: edit data file via GitHub web editor, confirm deploy succeeds |
| GitHub Actions stale cache | Phase 1: CI/CD setup | Verify cache key uses `hashFiles('**/package-lock.json')`; force a fresh run after config change |

---

## Sources

- Tailwind CSS docs — Content Configuration / Dynamic class names: https://tailwindcss.com/docs/content-configuration (confirmed 2026-03-20, HIGH confidence)
- MDN Web Docs — ARIA checkbox role / native input best practices: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role (confirmed 2026-03-20, HIGH confidence)
- GitHub Pages documentation — Project sites served from subdirectory path (domain knowledge, HIGH confidence based on well-established GitHub Pages behavior)
- WCAG 2.5.5 — Target Size (44x44px minimum for touch targets): https://www.w3.org/WAI/WCAG21/Understanding/target-size.html (HIGH confidence, stable standard)
- IEEE 754 floating-point in JavaScript — `0.1 + 0.2` behavior: ECMAScript specification, HIGH confidence, universally documented
- Civic tech community pattern — "estimated vs. confirmed" data distinction: domain knowledge derived from public data tool post-mortems (MEDIUM confidence)

---

*Pitfalls research for: Civic interactive configurator static site (Cache County Library Choices)*
*Researched: 2026-03-20*
