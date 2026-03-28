---
status: partial
phase: 14-separate-digital-and-physical-collections
source: [14-VERIFICATION.md]
started: 2026-03-28T00:00:00Z
updated: 2026-03-28T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visual layout — two stacked sliders
expected: Two labeled sliders ("Digital collections budget" above, "Physical print collections budget" below), separated by a horizontal rule. Each has tick buttons and a source citation.
result: [pending]

### 2. Slider independence — live interaction
expected: Each slider moves without affecting the other's position, description text, or amount display.
result: [pending]

### 3. Three-component total cost display
expected: With staffing=Basic ($150k), digital=$10k, physical=$5k → result bar shows $165,000/households (or per-household equivalent).
result: [pending]

### 4. URL round-trip for both params
expected: URL contains `delta=3&tau=0` when digital=$20k (index 3) and physical=$0 (index 0). Both sliders restore on reload.
result: [pending]

### 5. Amber current-level ticks on both sliders
expected: $15k tick on digital and $10k tick on physical display in amber on fresh load. Moving away and back toggles amber correctly.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
