---
status: partial
phase: 22-usage-and-other-analytics-tracking
source: [22-VERIFICATION.md]
started: 2026-04-16T10:20:00Z
updated: 2026-04-16T10:20:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. GA4 snippet absent when ga4MeasurementId is null
expected: Build with `ga4MeasurementId: null` (default), confirm no gtag script tag appears in `_site/index.html`

result: [pending]

### 2. GA4 snippet present when ga4MeasurementId is set
expected: Set `ga4MeasurementId` to a real measurement ID in `src/_data/config.js`, rebuild, confirm correct `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX">` snippet appears in `_site/index.html`

result: [pending]

### 3. No GA4 network requests on localhost
expected: Load site on localhost with a measurement ID set, open DevTools Network tab, confirm no requests to `google-analytics.com` or `googletagmanager.com` fire (hostname guard active)

result: [pending]

### 4. Custom events appear in GA4 Real-time/DebugView on production
expected: Deploy to production with a real GA4 property and measurement ID, interact with the calculator (change library, city, currency, toggle breakdown, load a shared URL), confirm all 6 custom events (`library_selected`, `city_changed`, `currency_changed`, `digital_slider_changed`, `breakdown_opened`, `shared_url_loaded`) appear in GA4 Real-time or DebugView within ~30 seconds

result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
