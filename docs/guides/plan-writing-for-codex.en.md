# Plan Writing Guide For Codex

This guide defines how Codex should write plans in this repository.

The structure is intentionally inspired by the reference template's `superpowers` artifacts:

- specs explain the `what` and `why`
- plans explain the `how`
- runlogs record verification evidence after execution

## Core rule

Before writing a new plan, check:

1. [docs/plans/INDEX.md](C:\Users\dangk\Documents\stories-to-cv\docs\plans\INDEX.md)
2. related existing plans in [docs/plans](C:\Users\dangk\Documents\stories-to-cv\docs\plans\README.md)
3. related specs in [docs/specs](C:\Users\dangk\Documents\stories-to-cv\docs\specs\README.md)

Do not write a new plan as if the repository has no history.

## What a plan is for

A plan should:

- explain how the work will be implemented
- break non-trivial work into executable pieces
- point to affected files, modules, or boundaries
- define how the work will be verified
- reduce ambiguity for the next engineer or coding agent

A plan should not:

- read like marketing
- duplicate the full spec
- become a vague brainstorm with no file/module direction

## Required plan structure

Every non-trivial plan should follow this shape:

1. Title
2. Goal
3. Architecture
4. Tech stack
5. Reference docs
6. Motivation
7. Scope
8. File structure
9. Task breakdown
10. Risks
11. Verification
12. Follow-ups

Use the template at [docs/plans/TEMPLATE.md](C:\Users\dangk\Documents\stories-to-cv\docs\plans\TEMPLATE.md).

## How detailed the plan should be

### For medium work

Include:

- relevant files or packages
- 2-6 tasks
- clear verification steps

### For larger work

Include:

- new vs modified files
- task-level checklists
- sequencing across layers
- explicit risks and dependencies

## What good plan tasks look like

Good tasks:

- are executable
- mention the files or module boundaries involved
- can be verified
- are narrow enough for TDD or focused implementation

Bad tasks:

- "build the whole feature"
- "do backend"
- "finish frontend"

## How to reference prior work

If a new plan continues earlier work:

- link the prior plan in `Reference docs`
- explain whether the new plan extends, replaces, or narrows the earlier one

If direction changed:

- say so explicitly
- do not silently drift away from older plans

## Relationship between specs, plans, and runlogs

### Spec

Use a spec when you need to define the design, trade-offs, or problem framing.

### Plan

Use a plan when you know enough to describe implementation steps.

### Runlog

Use a runlog when the work involves risky rollout, multi-step verification, or important execution evidence.

## Language rules

- Write plans in English.
- Prefer short paragraphs and precise bullets.
- Use concrete file paths when known.
- Use checklists only when the work benefits from progress tracking.

## Codex behavior rule

When starting non-trivial work, Codex should:

1. read related plans first
2. decide whether an existing plan already covers the work
3. update or extend an existing plan when appropriate
4. create a new plan only when the work is materially new
