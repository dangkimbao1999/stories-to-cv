import { createReadStream, existsSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { parseArgs, readEnvConfig, resolveFromRoot } from "./lib/env-config.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const envName = flags.env || positional[0] || "local";
const serviceName = flags.service;
const follow = Boolean(flags.follow);

const { data, path } = readEnvConfig();
const envConfig = data[envName];

if (!envConfig) {
  console.error(`Environment "${envName}" not found in ${path}`);
  process.exit(1);
}

if (envName === "local") {
  const logs = envConfig.logs || [];
  const selected = serviceName ? logs.filter((entry) => entry.name === serviceName) : logs;

  if (selected.length === 0) {
    console.error(`No local logs configured${serviceName ? ` for service "${serviceName}"` : ""}.`);
    process.exit(1);
  }

  for (const entry of selected) {
    const filePath = resolveFromRoot(entry.file);
    if (!existsSync(filePath)) {
      console.log(`[${entry.name}] log file not found yet: ${filePath}`);
      continue;
    }

    console.log(`\n=== ${entry.name}: ${filePath} ===`);
    const size = statSync(filePath).size;
    const stream = createReadStream(filePath, {
      encoding: "utf8",
      start: Math.max(0, size - 16_000)
    });
    stream.pipe(process.stdout);
  }

  if (follow && selected.length === 1) {
    const filePath = resolveFromRoot(selected[0].file);
    const tail = spawn(`powershell -Command "Get-Content -Path '${filePath}' -Wait -Tail 30"`, {
      cwd: process.cwd(),
      shell: true,
      stdio: "inherit"
    });
    tail.on("exit", (code) => process.exit(code ?? 0));
  }

  process.exit(0);
}

if (typeof envConfig.logs !== "string") {
  console.error(`Environment "${envName}" does not define a remote logs command.`);
  process.exit(1);
}

const child = spawn(envConfig.logs, {
  cwd: process.cwd(),
  shell: true,
  stdio: "inherit"
});
child.on("exit", (code) => process.exit(code ?? 0));
