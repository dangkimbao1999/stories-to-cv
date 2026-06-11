# Worktrees

This directory is the default home for task-specific git worktrees created by `pnpm ops:worktree:create`.

Recommended convention:

- one branch per task
- branch names prefixed with `codex/`
- branch names should normally be `codex/feat/<slug>`, `codex/fix/<slug>`, or `codex/chore/<slug>`
- keep worktrees short-lived
- remove them after merge using `pnpm ops:worktree:remove -- --branch codex/<type>/<name>`
