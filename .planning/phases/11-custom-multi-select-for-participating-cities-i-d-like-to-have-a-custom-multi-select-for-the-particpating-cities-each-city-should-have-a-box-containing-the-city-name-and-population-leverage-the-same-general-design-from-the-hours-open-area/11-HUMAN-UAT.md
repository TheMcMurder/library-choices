---
status: partial
phase: 11-custom-city-card-multi-select
source: [11-VERIFICATION.md]
started: 2026-03-21T00:00:00Z
updated: 2026-03-21T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Card click-target
expected: Click the blank area of a card (not just the text); card should toggle selection state
result: [pending]

### 2. Keyboard focus ring + Space
expected: Tab to card, verify focus ring appears on card wrapper, Space toggles selection
result: [pending]

### 3. Zero-city guard
expected: Uncheck all 4 cities; result bar shows "Select at least one city"
result: [pending]

### 4. URL phi param
expected: Toggle a city; `phi` query param updates in the URL bar
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
