import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "AGENTS.md",
  "package.json",
  "pnpm-workspace.yaml",
  "turbo.json",
  "tsconfig.base.json",
  "docs/solution-architecture.vi.md",
  "docs/agentic-development-flow.vi.md",
  ".codex/agents",
  ".codex/rules",
  ".agents/skills",
  "scripts/ops"
];

const missing = required.filter((file) => !existsSync(join(root, file)));

if (missing.length > 0) {
  console.log(JSON.stringify({ decision: "block", reason: `Repository conventions are incomplete. Missing: ${missing.join(", ")}` }));
  process.exit(0);
}

const syncCheck = spawnSync("node", ["scripts/sync-codex-context.mjs"], {
  cwd: root,
  encoding: "utf8"
});

if (syncCheck.status !== 0) {
  console.log(JSON.stringify({ decision: "block", reason: syncCheck.stderr || syncCheck.stdout || "Codex context validation failed." }));
  process.exit(0);
}

console.log(JSON.stringify({ continue: true }));
