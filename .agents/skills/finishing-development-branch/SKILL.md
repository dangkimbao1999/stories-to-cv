---
name: finishing-development-branch
description: |
  Use after implementation and verification are complete to finish a branch: inspect diff, commit, rebase if needed, push, draft PR, or leave clear handoff notes.
---

# Finishing Development Branch

Close work in a way that is reviewable and recoverable.

## Process

1. Run `verification-before-completion`.
2. Inspect state:
   - `git status --short --branch`
   - `git diff --stat`
   - `git diff`
3. Clean generated artifacts that should not be committed.
4. Stage explicit files only.
5. Commit with a message that states what changed and why.
6. Fetch/rebase if the base branch moved; re-run verification after conflict resolution.
7. Push the branch.
8. Open or update a draft PR by default.
9. Summarize:
   - branch
   - commit
   - PR link if created
   - verification
   - known limitations

## Never

- Commit directly to `main`.
- Mark a PR ready without explicit user approval.
- Hide failed or skipped checks.
- Remove another person's uncommitted changes.
