---
name: dispatching-parallel-agents
description: |
  Use when there are two or more independent investigations, failing test groups, code searches, or implementation tasks that can run without shared state or edit conflicts.
---

# Dispatching Parallel Agents

Parallelize independent work while keeping integration centralized.

## Process

1. Group work by independent domain: test file, subsystem, service, or failure boundary.
2. Do not parallelize tasks that edit the same files or depend on each other's results.
3. Give each agent a narrow prompt with:
   - one goal
   - relevant files or commands
   - constraints
   - expected summary format
4. Integrate results in the coordinating session.
5. Verify final behavior yourself.

## Good Candidates

- Unrelated test failures in different packages.
- Separate log investigations for web and worker.
- Independent docs, schema, and UI review passes.

## Bad Candidates

- A single root-cause investigation.
- Shared migrations or package manager changes.
- Security-sensitive changes that need one coherent audit trail.
