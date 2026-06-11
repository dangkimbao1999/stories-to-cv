---
name: tdd
description: |
  Red/green/refactor protocol for all code changes in Stories to CV.
---

# TDD

All source changes follow:

1. RED: write or tighten a failing test.
2. GREEN: implement the minimum code to pass.
3. REFACTOR: improve clarity while preserving green tests.

Checklist:

- prove the test fails for the intended reason
- run focused tests during the loop
- run relevant suite checks before commit
- avoid adding behavior without a test unless the change is pure configuration or documentation
