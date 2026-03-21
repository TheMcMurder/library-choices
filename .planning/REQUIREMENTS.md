# Requirements: Cache County Library Choices

**Defined:** 2026-03-20
**Core Value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## v1 Requirements (Complete — v1.0)

### Configurator

- [x] **CONF-01**: User can select a staffing level (Basic / Extended / Current) via radio buttons
- [x] **CONF-02**: User can toggle collections budget on/off independently of staffing
- [x] **CONF-03**: User can check/uncheck participating cities (Providence, Nibley, Millville, River Heights + data-driven for future additions)
- [x] **CONF-04**: Tax impact result updates in real time as any selection changes
- [x] **CONF-05**: Zero-city guard — friendly explanatory message shown when no cities are selected (no NaN/error displayed)
- [x] **CONF-06**: Shareable URL — current selections encoded in query string so scenarios can be linked

### Data & Updatability

- [x] **DATA-01**: All costs and household counts live in a single `_data/config.js` file with inline comments
- [x] **DATA-02**: Adding or removing a city requires editing only the data file (no template changes)
- [x] **DATA-03**: Data file is simple enough to edit via GitHub's web UI without a local dev environment

### Trust & Accessibility

- [x] **TRST-01**: Source citations shown for cost estimates and household counts
- [x] **TRST-02**: Explanatory copy alongside each choice dimension (what does each staffing level mean in practice?)
- [x] **TRST-03**: WCAG 2.1 AA — `aria-live` on result region, full keyboard navigation, 44px minimum touch targets

### Design & UX

- [x] **DESG-01**: Polished, trustworthy visual design appropriate for civic engagement (not a prototype aesthetic)
- [x] **DESG-02**: Mobile-first responsive layout — full functionality on a phone without zooming
- [x] **DESG-03**: Clean, simple design language using Tailwind CSS v4

### Infrastructure

- [x] **INFR-01**: Eleventy v3 static site generator with `_data/config.js` data cascade
- [x] **INFR-02**: GitHub Actions deploy to GitHub Pages
- [x] **INFR-03**: No runtime server dependencies — fully static output

## v1.1 Requirements

### Collections Budget Slider (SLDR)

- [x] **SLDR-01**: User can adjust the collections budget via a range slider (replaces the dropdown)
- [x] **SLDR-02**: Slider snaps to 6 discrete nodes matching existing dollar amounts ($10k–$60k in $10k steps)
- [x] **SLDR-03**: Each node displays an "Available books/digital" description; the lowest node describes digital-only access (Beehive/Libby)
- [x] **SLDR-04**: Description text and the tax result update live during drag and keyboard navigation — not only on release
- [x] **SLDR-05**: Screen reader users hear a citizen-meaningful label via dynamically updated `aria-valuetext` (not the raw integer)
- [x] **SLDR-06**: Dollar amount labels are visible below the slider on all browsers (CSS label row, not datalist-only, due to Firefox bug)
- [x] **SLDR-07**: Slider thumb and track are custom styled to match the site's civic design (blue-800)
- [x] **SLDR-08**: Previously shared URLs containing `?collections=30000` restore the correct slider node

### Hours Open (HOURS)

- [ ] **HOURS-01**: Staffing section heading reads "Hours Open" (not "Staffing Level")
- [ ] **HOURS-02**: Each staffing option displays its weekly schedule inline, always visible below the radio label (no JS toggle needed)
- [ ] **HOURS-03**: Schedule data is structured in `config.js` as an array of `{days, open, close}` entries using 12-hour format (e.g. `9am`, `4pm`)
- [ ] **HOURS-04**: Site owner can update schedules via GitHub web UI — NON-DEVELOPER EDIT GUIDE covers schedule format with a copy-pasteable example
- [ ] **HOURS-05**: Existing URL encoding for staffing selections (`?staffing=1fte-2pte`) continues to work unchanged

## v2 Requirements

### Enhancements

- **ENH-01**: Scenario summary text — human-readable sentence describing the selected combination
- **ENH-02**: Print stylesheet — printable version of the configured scenario
- **ENH-03**: Per-city cost breakdown (requires parcel/assessment data beyond household count)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend/server | Fully static; no runtime needed |
| User accounts | Shareable URL covers the sharing need |
| Per-city tax rates | Uniform per-household split is the agreed model |
| Real-time data sync | Tool must work offline; data updates via data file |
| Logan, Hyrum, other self-library cities | They have their own libraries and are not participants |
| Animated schedule transitions | Motion disorder risk; instant update is more accessible |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| DATA-01 | Phase 2 | Complete |
| DATA-02 | Phase 2 | Complete |
| DATA-03 | Phase 2 | Complete |
| CONF-01 | Phase 2 | Complete |
| CONF-02 | Phase 6 | Complete |
| CONF-03 | Phase 2 | Complete |
| TRST-01 | Phase 2 | Complete |
| TRST-02 | Phase 2 | Complete |
| CONF-04 | Phase 3 | Complete |
| CONF-05 | Phase 3 | Complete |
| TRST-03 | Phase 3 | Complete |
| CONF-06 | Phase 6 | Complete |
| DESG-01 | Phase 6 | Complete |
| DESG-02 | Phase 6 | Complete |
| DESG-03 | Phase 6 | Complete |
| SLDR-01 | Phase 7 | Complete |
| SLDR-02 | Phase 7 | Complete |
| SLDR-03 | Phase 7 | Complete |
| SLDR-04 | Phase 7 | Complete |
| SLDR-05 | Phase 7 | Complete |
| SLDR-06 | Phase 7 | Complete |
| SLDR-07 | Phase 7 | Complete |
| SLDR-08 | Phase 7 | Complete |
| HOURS-01 | Phase 8 | Pending |
| HOURS-02 | Phase 8 | Pending |
| HOURS-03 | Phase 8 | Pending |
| HOURS-04 | Phase 8 | Pending |
| HOURS-05 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 16 total — all Complete ✓
- v1.1 requirements: 13 total
- Mapped to phases: 13 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-21 — v1.1 traceability added (SLDR → Phase 7, HOURS → Phase 8)*
