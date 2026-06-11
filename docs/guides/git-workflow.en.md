# Git Workflow Guide

This repository uses a worktree-first git workflow.

## Core rules

- Never commit directly to `main`.
- For any new feature, create a new worktree first.
- Use branch names like:
  - `codex/feat/<slug>`
  - `codex/fix/<slug>`
  - `codex/chore/<slug>`
- Review your own diff before commit and before push.
- Rebase before push when the remote base branch or remote feature branch has changed.

## What review means in this repo

Review is not only reading `git diff`.

Before commit or push, review should include the relevant checks for the touched area:

- TypeScript source changed:
  - run typecheck
- Business logic changed:
  - run focused unit or integration tests
- User-facing flow changed:
  - run relevant E2E checks
- Docs-only changes:
  - review diff carefully; no code checks needed unless related scripts/config changed

## Recommended flow

1. Create a worktree:

```bash
pnpm ops:worktree:create -- codex/feat/my-feature
```

2. Do the work in that worktree.
3. Review the diff:

```bash
git diff --stat
git diff
```

4. Run verification.
5. Commit.
6. Fetch the latest remote state:

```bash
git fetch origin
```

7. Rebase when needed:

```bash
git rebase origin/main
```

Or, if rebasing the feature branch against its remote tracking branch:

```bash
git rebase origin/<your-branch>
```

8. Re-run verification if rebase changed anything.
9. Review the final diff again.
10. Push.

## Verification checklist by change type

- TypeScript/backend/frontend source:
  - `pnpm typecheck`
  - `pnpm test`
- User-facing workflow:
  - `pnpm test:e2e`
- Repo automation or context scripts:
  - run the script directly when possible
  - run `node scripts/sync-codex-context.mjs`

## Conflict resolution

When rebase or merge conflicts happen:

1. Run:

```bash
git status
```

2. Open each conflicted file and resolve the conflict deliberately.
3. Remove conflict markers completely.
4. Re-run the relevant tests or checks.
5. Mark files resolved:

```bash
git add <resolved-files>
```

6. Continue the rebase:

```bash
git rebase --continue
```

7. If the rebase path is wrong, stop and return to the last clean state:

```bash
git rebase --abort
```

## When Codex should be careful

- If there is an existing open PR on the branch, do not silently open another one.
- If the work is a new feature, do not code it in the primary checkout.
- If the diff grew larger than expected, stop and reassess before pushing.
