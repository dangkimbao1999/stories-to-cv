import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parseArgs, resolveFromRoot } from "./lib/env-config.mjs";

const { positional } = parseArgs(process.argv.slice(2));
const branch = positional[0];

if (!branch) {
  console.error("Usage: pnpm ops:worktree:create -- codex/<type>/<branch-name>");
  process.exit(1);
}

if (!/^codex\/(feat|fix|chore)\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(branch)) {
  console.error("Branch must match codex/feat/<slug>, codex/fix/<slug>, or codex/chore/<slug>.");
  process.exit(1);
}

const sanitized = branch.replace(/[\\/]/g, "-");
const worktreePath = resolveFromRoot(".codex", "worktrees", sanitized);

if (existsSync(worktreePath)) {
  console.error(`Worktree path already exists: ${worktreePath}`);
  process.exit(1);
}

const fetch = spawnSync("git", ["fetch", "origin", "main"], {
  cwd: process.cwd(),
  stdio: "inherit"
});

if ((fetch.status ?? 0) !== 0) {
  process.exit(fetch.status ?? 1);
}

const result = spawnSync("git", ["worktree", "add", worktreePath, "-b", branch, "origin/main"], {
  cwd: process.cwd(),
  stdio: "inherit"
});

process.exit(result.status ?? 0);
