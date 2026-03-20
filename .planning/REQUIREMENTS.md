# Requirements: Cache County Library Choices

**Defined:** 2026-03-20
**Core Value:** Citizens can explore any combination of service and funding choices and immediately see what it costs them — empowering informed participation in a real public decision.

## v1 Requirements

### Configurator

- [ ] **CONF-01**: User can select a staffing level (1 FTE / 1 FTE+1 PTE / 1 FTE+2 PTE) via radio buttons
- [ ] **CONF-02**: User can toggle collections budget on/off independently of staffing
- [ ] **CONF-03**: User can check/uncheck participating cities (Providence, Nibley, Millville, River Heights + data-driven for future additions)
- [ ] **CONF-04**: Tax impact result updates in real time as any selection changes
- [ ] **CONF-05**: Zero-city guard — friendly explanatory message shown when no cities are selected (no NaN/error displayed)
- [ ] **CONF-06**: Shareable URL — current selections encoded in query string so scenarios can be linked

### Data & Updatability

- [ ] **DATA-01**: All costs and household counts live in a single `_data/config.js` file with inline comments
- [ ] **DATA-02**: Adding or removing a city requires editing only the data file (no template changes)
- [ ] **DATA-03**: Data file is simple enough to edit via GitHub's web UI without a local dev environment

### Trust & Accessibility

- [ ] **TRST-01**: Source citations shown for cost estimates and household counts
- [ ] **TRST-02**: Explanatory copy alongside each choice dimension (what does each staffing level mean in practice?)
- [ ] **TRST-03**: WCAG 2.1 AA — `aria-live` on result region, full keyboard navigation, 44px minimum touch targets

### Design & UX

- [ ] **DESG-01**: Polished, trustworthy visual design appropriate for civic engagement (not a prototype aesthetic)
- [ ] **DESG-02**: Mobile-first responsive layout — full functionality on a phone without zooming
- [ ] **DESG-03**: Clean, simple design language using Tailwind CSS v4

### Infrastructure

- [x] **INFR-01**: Eleventy v3 static site generator with `_data/config.js` data cascade
- [x] **INFR-02**: GitHub Actions deploy to GitHub Pages
- [x] **INFR-03**: No runtime server dependencies — fully static output

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

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| CONF-01 | Phase 2 | Pending |
| CONF-02 | Phase 2 | Pending |
| CONF-03 | Phase 2 | Pending |
| TRST-01 | Phase 2 | Pending |
| TRST-02 | Phase 2 | Pending |
| CONF-04 | Phase 3 | Pending |
| CONF-05 | Phase 3 | Pending |
| TRST-03 | Phase 3 | Pending |
| CONF-06 | Phase 4 | Pending |
| DESG-01 | Phase 4 | Pending |
| DESG-02 | Phase 4 | Pending |
| DESG-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
