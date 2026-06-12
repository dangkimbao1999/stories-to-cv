import { existsSync, readdirSync, readFileSync } from "node:fs";
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

const requiredSkills = [
  "agents-dev",
  "brainstorming-specs",
  "ci",
  "commit-and-pr-writing",
  "debugging",
  "deploy",
  "dispatching-parallel-agents",
  "e2e-testing",
  "executing-plans",
  "finishing-development-branch",
  "git-workflow",
  "investigation",
  "logs",
  "memory",
  "multi-env-dev",
  "plan-writing",
  "receiving-code-review",
  "requesting-code-review",
  "skill-authoring",
  "start-dev",
  "subagent-driven-development",
  "tdd",
  "using-stories-to-cv-skills",
  "verification-before-completion",
];

for (const skill of requiredSkills) {
  const skillPath = `.agents/skills/${skill}/SKILL.md`;
  assertPath(skillPath);

  const content = readFileSync(resolve(root, skillPath), "utf8");
  if (!/^---\r?\n/.test(content)) {
    throw new Error(`Skill is missing YAML frontmatter: ${skillPath}`);
  }
  if (!content.includes(`name: ${skill}`)) {
    throw new Error(`Skill frontmatter name must match folder: ${skillPath}`);
  }
  if (!/description:\s*(\||>|["']).+|description:\s*\n\s+\S/s.test(content)) {
    throw new Error(`Skill is missing description frontmatter: ${skillPath}`);
  }
}

console.log("Codex context structure looks good.");
