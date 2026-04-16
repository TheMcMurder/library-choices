# Phase 22: usage and other analytics tracking - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-16
**Phase:** 22-usage-and-other-analytics-tracking
**Areas discussed:** Analytics provider, Interaction event depth, Privacy & consent posture, Analytics account setup

---

## Analytics Provider

| Option | Description | Selected |
|--------|-------------|----------|
| Google Analytics 4 | Free, industry standard, robust event tracking. Data goes to Google. | ✓ |
| Plausible Analytics | Privacy-first, cookieless. $9/mo. | |
| Fathom Analytics | Privacy-first, cookieless. $14/mo. | |
| Simple Analytics | Privacy-first, cookieless. Free tier available. | |

**User's choice:** Google Analytics 4

**Follow-up — Existing property?**

| Option | Selected |
|--------|----------|
| Yes, I have it ready | |
| No, I'll create one | ✓ |
| You decide | |

**Notes:** User hasn't used GA4 in years. Wants setup comments and guidance in code. No existing GA4 property.

**Follow-up — GDPR config:**

| Option | Selected |
|--------|----------|
| Default GA4 config | |
| Minimal data collection mode | ✓ |
| You decide | |

**Notes:** Disable ads personalization, set storage: 'none', reduce data collection footprint.

---

## Interaction Event Depth

| Option | Selected |
|--------|----------|
| Page views only | |
| Key configuration events | ✓ |
| Share/copy URL events | |

**User's choice:** Track both visits and configuration interactions. User noted: "I assume the last selected option will be the user's preferred solution" — confirmed as a reasonable proxy. Data will be shared with the city council.

**Slider granularity:**

| Option | Selected |
|--------|----------|
| Final position only (change event) | ✓ |
| Every movement (input event) | |
| You decide | |

**Specific events selected:**

| Event | Selected |
|-------|----------|
| Staffing level selected | ✓ |
| Collections slider moved | ✓ |
| City checkbox toggled | ✓ |
| Breakdown popover opened | ✓ (added after recommendation) |

**URL-restored visits:**

| Option | Selected |
|--------|----------|
| Yes — distinguish shared visits | ✓ |
| No — keep it simple | |

---

## Privacy & Consent Posture

| Option | Selected |
|--------|----------|
| No banner needed | ✓ |
| Add a simple banner | |
| You decide | |

**User's choice:** No consent banner — civic/non-commercial site with minimal data mode GA4.

**Production-only loading:**

| Option | Selected |
|--------|----------|
| Yes — only load on production | ✓ |
| No — always load | |

**Notes:** Hostname check to skip GA4 on localhost/dev. Keeps analytics data clean.

---

## Analytics Account Setup

**Measurement ID location:**

| Option | Selected |
|--------|----------|
| In config.js | ✓ |
| Hardcoded in index.html | |

**Conditional loading:**

| Option | Selected |
|--------|----------|
| Omit snippet if ID is absent | ✓ |
| Always include snippet | |

**Notes:** Follows existing config.js data-driven pattern. Site owner can toggle analytics by setting/clearing `ga4MeasurementId` via GitHub web UI.

---

## Claude's Discretion

- Whether to create a dedicated `analytics.js` helper module or add gtag calls inline
- Exact gtag initialization config details (beyond storage: 'none' and ads disabled)
- Hostname check implementation (regex vs exact string)
- Event parameter naming conventions (snake_case already chosen by Claude)

## Deferred Ideas

None — discussion stayed within phase scope.
