---
name: brainstorming-specs
description: |
  Use before creative or ambiguous product work: new features, workflows, UX changes, architecture choices, or behavior changes where user intent, scope, or success criteria are not yet clear.
---

# Brainstorming Specs

Turn a rough idea into a small approved design before implementation.

## Gate

Do not write product code for ambiguous feature work until the design is understood. Keep the design proportional: a small config change may need a paragraph; a workflow may need a spec.

## Process

1. Read nearby context: `AGENTS.md`, relevant docs in `docs/plans/`, current code, and recent git state.
2. Clarify the user's goal, constraints, privacy expectations, and acceptance criteria.
3. Ask one focused question at a time when the answer cannot be inferred safely.
4. Offer 2-3 viable approaches with trade-offs and a recommendation.
5. Present a concise design and get explicit approval before implementation.
6. For non-trivial work, write or update a spec in `docs/specs/` or a plan in `docs/plans/`.
7. Transition to `plan-writing` for multi-step implementation.

## Stories to CV Defaults

- Treat uploaded resumes, transcripts, job descriptions, and generated CVs as sensitive.
- Keep domain language in shared packages.
- Start lean; avoid distributed systems unless the plan proves the need.
- Prefer implementation slices that are independently testable.
