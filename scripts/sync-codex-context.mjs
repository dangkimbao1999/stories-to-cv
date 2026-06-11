import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function assertPath(path) {
  if (!existsSync(resolve(root, path))) {
    throw new Error(`Missing required path: ${path}`);
  }
}

function assertDirHasFiles(path) {
  assertPath(path);
  const fullPath = resolve(root, path);
  const entries = readdirSync(fullPath);
  if (entries.length === 0) {
    throw new Error(`Directory is empty: ${path}`);
  }
}

assertPath("AGENTS.md");
assertPath(".codex/README.md");
assertDirHasFiles(".codex/agents");
assertDirHasFiles(".codex/rules");
assertDirHasFiles(".agents/skills");
assertDirHasFiles(".codex/memory");
assertDirHasFiles("scripts/ops");
assertDirHasFiles("docs/guides");
assertDirHasFiles("docs/specs");
assertDirHasFiles("docs/plans");
assertDirHasFiles("docs/runlogs");

console.log("Codex context structure looks good.");
