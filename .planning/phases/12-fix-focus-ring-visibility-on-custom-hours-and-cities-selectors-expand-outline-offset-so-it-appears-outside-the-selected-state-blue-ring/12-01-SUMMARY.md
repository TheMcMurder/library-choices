---
plan: 12-01
phase: 12
status: complete
---

## Summary

Replaced `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600` with `has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-600 has-[:focus-visible]:outline-offset-4` on both staffing and city card labels in `src/index.html`.

## Key Files

### Modified
- `src/index.html` — Card label elements with outline-based focus indicators (both staffing and city)

## Self-Check: PASSED

- ✓ 2 occurrences of `has-[:focus-visible]:outline-offset-4`
- ✓ 0 occurrences of `has-[:focus-visible]:ring-2`
- ✓ `has-[:checked]:ring-2` selection ring unchanged (2 occurrences)
- ✓ `npx @11ty/eleventy` exits 0
- ✓ Human verified: focus outline visible outside selection ring in browser

## Deviations

None.
