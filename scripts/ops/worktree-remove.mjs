import { spawnSync } from "node:child_process";
import { parseArgs, resolveFromRoot } from "./lib/env-config.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const branch = flags.branch;

if (!branch) {
  console.error("Usage: pnpm ops:worktree:remove -- --branch codex/<branch-name>");
  process.exit(1);
}

const sanitized = branch.replace(/[\\/]/g, "-");
const worktreePath = resolveFromRoot(".codex", "worktrees", sanitized);

console.log(`Removing worktree ${worktreePath}`);
const result = spawnSync(`git worktree remove "${worktreePath}"`, {
  cwd: process.cwd(),
  shell: true,
  stdio: "inherit"
});

process.exit(result.status ?? 0);
