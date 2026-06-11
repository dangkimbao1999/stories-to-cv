import { createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import { EOL } from "node:os";
import { ensureDir, readEnvConfig, resolveFromRoot } from "./lib/env-config.mjs";

const { data, path } = readEnvConfig();
const localConfig = data.local;

if (!localConfig?.run?.length) {
  console.error(`No local.run commands found in ${path}`);
  process.exit(1);
}

const logDir = resolveFromRoot(".codex", "logs");
ensureDir(logDir);

console.log("Starting local stack...");

for (const service of localConfig.run) {
  const logPath = resolveFromRoot(".codex", "logs", `${service.name}.log`);
  const stream = createWriteStream(logPath, { flags: "a" });
  stream.write(`${EOL}[${new Date().toISOString()}] starting ${service.name}: ${service.command}${EOL}`);

  const child = spawn(service.command, {
    cwd: process.cwd(),
    shell: true,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.pipe(stream);
  child.stderr.pipe(stream);
  child.unref();

  console.log(`- ${service.name} -> pid ${child.pid}, log: ${logPath}`);
}

console.log("Local services were started in detached mode.");
