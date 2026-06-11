import { spawnSync } from "node:child_process";

const commands = [
  { label: "lint", command: "pnpm lint" },
  { label: "typecheck", command: "pnpm typecheck" },
  { label: "test", command: "pnpm test" }
];

for (const step of commands) {
  console.log(`\n== ${step.label} ==`);
  const result = spawnSync(step.command, {
    cwd: process.cwd(),
    shell: true,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nCI preflight passed.");
