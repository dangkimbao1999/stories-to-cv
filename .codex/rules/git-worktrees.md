# Git Worktree Rules

- Never commit directly to `main`.
- For any new feature, create a new worktree first and implement the feature inside that worktree.
- Use dedicated worktrees for larger tasks or parallel streams of work.
- Create branches with the `codex/` prefix.
- Default branch classes are `codex/feat/<slug>`, `codex/fix/<slug>`, and `codex/chore/<slug>`.
- Avoid generic names like `codex/tmp` or `codex/test`.
- Review your own diff before commit and before push.
- Review includes running the relevant technical checks, not just reading the diff.
- Run typecheck before every commit.
- Run focused unit/integration tests before every commit.
- If a user-facing flow changed, run relevant E2E checks before commit or before opening a draft PR.
- Rebase on the latest remote base branch before pushing when upstream has moved.
- Resolve conflicts deliberately and re-run verification after conflict resolution.
- Open PRs as draft by default.
- Only mark a PR ready when:
  1. implementation is complete
  2. typecheck and relevant tests pass
  3. requested review changes are addressed
  4. the PR description accurately reflects the diff
  5. the user has explicitly approved moving the PR to ready
- Stage explicit files only.
- Do not delete a worktree until its branch is merged or intentionally abandoned.
