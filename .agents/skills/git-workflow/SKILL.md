---
name: git-workflow
description: |
  Worktree-first git workflow for safe parallel development in Stories to CV.
---

# Git Workflow

- Before starting a new feature or fix, run `git fetch origin main`.
- Create new worktrees from the fetched `origin/main`, not from a stale local `main`.
- Never commit directly to `main`.
- For any new feature, create a dedicated worktree first.
- Use branch names like `codex/feat/<slug>`, `codex/fix/<slug>`, or `codex/chore/<slug>`.
- Stage explicit files only.
- Run verification before commit.
- Review the diff before commit and again before push.
- Before pushing, always run `git fetch origin main`, then rebase on `origin/main`.
- Open PRs as draft by default.
- Do not mark a PR ready unless the user explicitly asks or approves it.

Review means:

- read the diff
- run typecheck before every commit
- run focused tests before every commit

Recommended sequence:

1. `git fetch origin main`
2. `pnpm ops:worktree:create -- codex/feat/feature-name`
3. implement with TDD
4. review `git diff --stat` and `git diff`
5. run verification
6. commit
7. `git fetch origin main`
8. `git rebase origin/main`
9. resolve conflicts carefully, re-run checks, then push
10. `gh pr create --draft ...`
11. wait for explicit user approval before `gh pr ready`

Helpful commands:

- `pnpm ops:worktree:create -- codex/feat/feature-name`
- `pnpm ops:worktree:remove -- --branch codex/feat/feature-name`
