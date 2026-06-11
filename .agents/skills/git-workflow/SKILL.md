---
name: git-workflow
description: |
  Worktree-first git workflow for safe parallel development in Stories to CV.
---

# Git Workflow

- Never commit directly to `main`.
- For any new feature, create a dedicated worktree first.
- Use branch names like `codex/feat/<slug>`, `codex/fix/<slug>`, or `codex/chore/<slug>`.
- Stage explicit files only.
- Run verification before commit.
- Review the diff before commit and again before push.
- Rebase on the latest remote base branch before pushing when the remote has changed.
- Open PRs as draft by default.
- Do not mark a PR ready unless the user explicitly asks or approves it.

Review means:

- read the diff
- run typecheck before every commit
- run focused tests before every commit
- run relevant E2E checks if user-facing flows changed

Recommended sequence:

1. `pnpm ops:worktree:create -- codex/feat/feature-name`
2. implement with TDD
3. review `git diff --stat` and `git diff`
4. run verification
5. commit
6. `git fetch origin`
7. `git rebase origin/<base-branch>` when needed
8. resolve conflicts carefully, re-run checks, then push
9. `gh pr create --draft ...`
10. wait for explicit user approval before `gh pr ready`

Helpful commands:

- `pnpm ops:worktree:create -- codex/feat/feature-name`
- `pnpm ops:worktree:remove -- --branch codex/feat/feature-name`
