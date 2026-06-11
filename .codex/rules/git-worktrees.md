# Git Worktree Rules

- Never commit directly to `main`.
- For any new feature, create a new worktree first and implement the feature inside that worktree.
- Use dedicated worktrees for larger tasks or parallel streams of work.
- Create branches with the `codex/` prefix.
- Default branch classes are `codex/feat/<slug>`, `codex/fix/<slug>`, and `codex/chore/<slug>`.
- Avoid generic names like `codex/tmp` or `codex/test`.
- Review your own diff before commit and before push.
- Review includes running the relevant technical checks, not just reading the diff.
- If TypeScript source changed, run typecheck before commit.
- If logic changed, run focused unit/integration tests before commit.
- If a user-facing flow changed, run relevant E2E checks before commit or before opening a draft PR.
- Rebase on the latest remote base branch before pushing when upstream has moved.
- Resolve conflicts deliberately and re-run verification after conflict resolution.
- Stage explicit files only.
- Do not delete a worktree until its branch is merged or intentionally abandoned.
