# Feature Research

**Domain:** Civic interactive policy configurator / property tax impact calculator
**Researched:** 2026-03-20
**Confidence:** MEDIUM (training data; web search unavailable. Civic UX patterns are stable and well-documented — confidence in the categorizations is HIGH; specific competitor features are MEDIUM without live verification.)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy for a civic audience.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Real-time calculation display | Users expect instant feedback as they change inputs — any delay creates doubt about whether their selection registered | LOW | Pure JS math, no async needed; calculate on every input event |
| Single authoritative output number prominently displayed | Citizens came for "what does this cost me" — if that answer is buried, the tool fails its mission | LOW | Large typographic treatment, above the fold on mobile |
| Labeled controls with clear descriptive text | Civic audiences are not specialists; every control needs a plain-language label and a brief explanation of what that choice means | LOW | Label element wired to input; explanatory `<p>` beneath or in tooltip |
| Mobile-responsive layout with adequate touch targets | Majority of civic web traffic is mobile; controls too small to tap = unusable | LOW-MEDIUM | Tailwind touch target utilities; min 44x44px per WCAG 2.5.5; already in-scope |
| WCAG 2.1 AA accessibility | Government-adjacent sites face accessibility expectations; screen reader users and keyboard-only users must complete the full interaction | MEDIUM | Semantic HTML, ARIA labels on dynamic output region (`aria-live`), sufficient color contrast (4.5:1 text, 3:1 UI components) |
| Source/methodology transparency | Citizens distrust numbers without provenance; a brief "how is this calculated?" section with source links prevents "who made this up?" reactions | LOW | Static copy block; link to city data or council documents |
| Print-friendly rendering | Citizens share paper printouts at council meetings; a print stylesheet or print button is expected for public-decision tools | LOW | CSS `@media print` rules; hide controls, show full scenario summary |
| Correct and consistent arithmetic | The calculation must be verifiably correct (total cost / total households) and match any official materials; errors destroy credibility | LOW | Unit-test the calculation function in isolation |

### Differentiators (Competitive Advantage / Civic Trust Builders)

Features that set this tool apart. Not universally expected, but build trust and shareability in civic contexts.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Shareable URL with full state encoded | Citizens email a link of their specific scenario to a neighbor or city council member; scenario survives browser refresh | LOW-MEDIUM | Encode selected staffing level, collections toggle, and city checkboxes in URL query params or hash; read on page load; pure client-side |
| Scenario summary text (auto-generated) | Converts raw controls into a plain-English sentence: "With 1 FTE + 1 PTE, collections, and Providence + Nibley participating, your annual cost would be $X" — removes ambiguity about what the user configured | LOW | Template string from current state; update on every change |
| Data-last-updated date visible on page | Numbers change as negotiations progress; displaying "data current as of [date]" from the data file prevents outdated scenarios from causing harm | LOW | Expose a `last_updated` field in the data file; render it in the footer or near the output |
| Keyboard-navigable controls in logical order | Beyond base WCAG compliance, a tab order that mirrors the decision flow (staffing → collections → cities → result) makes the tool feel intentional and professional | LOW | HTML source order + no `tabindex` hacks |
| Clear "no cities selected" / edge-case handling | If zero cities are checked, division by zero is possible; showing "Select at least one city to see your cost" rather than NaN or $Infinity signals thoughtful design | LOW | Guard clause in calculation; conditional display message |
| Visible cost breakdown alongside total | Showing "Staffing: $X / Collections: $Y / Total: $Z" alongside the per-household number helps citizens understand where their money goes, increasing buy-in | LOW | Additional output section; same data already computed |

### Anti-Features (Things to Deliberately NOT Build)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / saved scenarios | "So people can come back to their scenario" | Requires a backend, authentication, GDPR-adjacent data concerns, and ongoing maintenance — catastrophically out of scope for a static civic site | Shareable URL encoding covers 95% of this use case with zero infrastructure |
| Per-city property tax rate display | "Citizens want to know their exact dollar amount based on assessed value" | Property tax rates vary by assessed value, exemptions, and taxing district overlaps — this requires per-parcel data the site won't have; displaying a per-rate number creates false precision and errors | Keep output as annual cost per household (a meaningful, verifiable average) with a note explaining the simplification |
| Animated / transitioning number output | "Makes it feel more dynamic" | Animation introduces motion that can trigger vestibular disorders (WCAG 2.3.3); adds JS complexity; delays the number reaching the user; A11y cost is high relative to UX benefit | Instant update is faster and more trustworthy; use CSS `transition` only on non-numeric elements if desired |
| Comparison mode / side-by-side scenarios | "Let users compare two configurations at once" | Doubles UI complexity; confuses single-question focus; shareable URLs already handle the "show someone else your scenario" need | Shareable URL is the comparison mechanism — send two different links |
| Embedded comment section / feedback form | "Gather community input" | Requires spam management, moderation, or a third-party service (Disqus, etc.); shifts site from information tool to community platform | Link to the official public comment channel (city council meeting, email to clerk) |
| Real-time data sync from external source | "Pull live numbers from a Google Sheet so updates are automatic" | Introduces a network dependency that breaks offline use, adds CORS complexity, and creates a runtime failure mode for a civic tool that must always work | Keep data in a local file; the site owner updates it manually — this is the documented maintenance path |
| Dark mode toggle | "Accessibility" | Not an accessibility requirement; adds CSS complexity; for a single-purpose civic tool with a short session length, the benefit is negligible | Respect `prefers-color-scheme` media query passively if desired, but don't build a toggle |

---

## Feature Dependencies

```
[Shareable URL encoding]
    └──requires──> [Stable control state model] (all inputs reflected in one state object)
                       └──requires──> [Real-time calculation] (state must be the source of truth for display)

[Scenario summary text]
    └──requires──> [Stable control state model]

[Print-friendly rendering]
    └──enhances──> [Scenario summary text] (print version shows summary, not raw controls)

[Data-last-updated date]
    └──requires──> [last_updated field in data file]

[Edge-case "no cities" handling]
    └──requires──> [Real-time calculation] (the guard runs inside the calc function)

[Cost breakdown display]
    └──requires──> [Real-time calculation] (same computed values, more display surface)
```

### Dependency Notes

- **Shareable URL requires stable state model:** The URL encoding step can only happen if all inputs are managed through a single state object (or equivalent). Ad-hoc per-element reads make encoding unreliable. Wire all controls to write a state object on change; encode state to URL from that object.
- **Scenario summary text requires stable state model:** Same rationale — the template string reads from state, not from DOM.
- **Print rendering enhances scenario summary:** The print stylesheet should suppress interactive controls and show the scenario summary text so a printed page reads like a document, not a form.
- **Edge-case handling is inside the calculation:** The zero-household guard lives in the same function as the calculation, so it cannot be built independently.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed for citizens to use this at a city council meeting.

- [ ] Real-time calculation display — the entire purpose of the tool
- [ ] Labeled controls: staffing radio buttons, collections checkbox, city checkboxes — the three configured dimensions from PROJECT.md
- [ ] Single prominent output: annual cost per household — the one number citizens need
- [ ] Source/methodology transparency block — without this, the tool has zero civic credibility
- [ ] Mobile-responsive layout with 44px+ touch targets — majority of users will be on phones
- [ ] WCAG 2.1 AA compliance — keyboard navigation, `aria-live` on result region, sufficient contrast
- [ ] Edge-case handling: zero cities selected shows guidance message instead of NaN
- [ ] Data-last-updated date — numbers are actively changing; users must know when data was current
- [ ] Print stylesheet — council meeting use case requires paper output

### Add After Validation (v1.x)

Features to add once core is confirmed working and being used.

- [ ] Shareable URL encoding — add once city council members start asking "how do I send someone my scenario?"; straightforward to add without architectural change
- [ ] Scenario summary auto-generated text — add once users express confusion about what their current configuration means
- [ ] Cost breakdown display (staffing / collections subtotals) — add if users ask "where does the money go?"

### Future Consideration (v2+)

- [ ] Multi-language support (Spanish) — defer until there is evidence of non-English-speaking users engaging with this specific decision
- [ ] Embed mode (iframe-friendly) — defer unless a city website wants to embed the tool

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Real-time calculation display | HIGH | LOW | P1 |
| Labeled controls with explanatory copy | HIGH | LOW | P1 |
| Single prominent output number | HIGH | LOW | P1 |
| Source / methodology transparency | HIGH | LOW | P1 |
| Mobile-responsive + touch targets | HIGH | LOW | P1 |
| WCAG 2.1 AA accessibility | HIGH | MEDIUM | P1 |
| Edge-case (zero cities) handling | HIGH | LOW | P1 |
| Data-last-updated date | HIGH | LOW | P1 |
| Print stylesheet | MEDIUM | LOW | P1 |
| Shareable URL encoding | HIGH | LOW-MEDIUM | P2 |
| Scenario summary text | MEDIUM | LOW | P2 |
| Cost breakdown display | MEDIUM | LOW | P2 |
| Dark mode (passive `prefers-color-scheme`) | LOW | LOW | P3 |
| Multi-language support | LOW (unvalidated) | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

Comparable tools in the civic interactive configurator space (training data; not live-verified):

| Feature | Budget Simulator tools (e.g., Balancing Act, OpenGov) | Simple civic calculators (e.g., city budget pages) | This project's approach |
|---------|------------------------------------------------------|------------------------------------------------------|-------------------------|
| Real-time output | Yes | Usually yes | Yes — core requirement |
| Shareable URLs | Yes (Balancing Act encodes state) | Rarely | P2 — add after v1 |
| Print export | Yes | Sometimes | CSS print stylesheet — v1 |
| WCAG compliance | Varies; often only partial | Often poor | Full AA target — v1 |
| Source citations | Rarely prominent | Rarely | Explicit methodology block — v1 |
| Mobile-first | Balancing Act is desktop-first | Rarely | Tailwind mobile-first — v1 |
| Data file separation | No (admin UI) | No (hard-coded) | Yes — core architectural requirement |
| User accounts | Yes | No | Explicitly out of scope |

**Key differentiation for this project:** The combination of (1) mobile-first, (2) visible source citations, (3) data-file-driven updatability without a CMS, and (4) dead-simple single-output focus positions this tool as more trustworthy and maintainable than typical civic budget tools, which are either heavyweight SaaS or abandoned hard-coded pages.

---

## Sources

- Training knowledge: WCAG 2.1/2.2 specification (W3C) — touch target minimum 44x44px (Success Criterion 2.5.5); `aria-live` regions for dynamic content; color contrast ratios (HIGH confidence — stable published standard)
- Training knowledge: Civic technology UX patterns from Code for America, Sunlight Foundation, and similar open-government projects — shareable URLs, source transparency, plain-language labeling (MEDIUM confidence — patterns are well-established but not live-verified for 2026)
- Training knowledge: Balancing Act (balancingact-usa.com) and OpenGov budget simulator feature sets — used as representative examples of heavyweight civic budget tools (MEDIUM confidence — feature sets may have evolved since training cutoff)
- PROJECT.md (this repository) — definitive scope for anti-feature and MVP decisions (HIGH confidence)

---
*Feature research for: Civic interactive property tax configurator (Cache County Library Choices)*
*Researched: 2026-03-20*
