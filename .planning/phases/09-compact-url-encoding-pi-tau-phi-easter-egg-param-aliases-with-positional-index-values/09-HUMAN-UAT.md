---
status: partial
phase: 09-compact-url-encoding-pi-tau-phi-easter-egg-param-aliases-with-positional-index-values
source: [09-VERIFICATION.md]
started: 2026-03-21T23:35:00Z
updated: 2026-03-21T23:35:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Compact URL write
expected: After any form interaction, address bar shows compact params only — e.g. `?pi=2&tau=2&phi=0,1` — no staffing/collections/cities keys
result: [pending]

### 2. Compact URL decode
expected: Navigating to `?pi=2&tau=2&phi=0,1` restores Staffing=Current (1fte-2pte), collections slider=$30k, cities Providence+Nibley selected on page load
result: [pending]

### 3. Verbose backward compatibility
expected: Navigating to `?staffing=1fte-2pte&collections=30000&cities=providence,nibley` produces the same UI state as the compact URL above
result: [pending]

### 4. Out-of-bounds silent ignore
expected: Navigating to `?pi=99` uses default staffing selection — no JavaScript errors, no visible breakage
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
