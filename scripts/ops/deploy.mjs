import { spawn } from "node:child_process";
import { parseArgs, readEnvConfig } from "./lib/env-config.mjs";

const { positional } = parseArgs(process.argv.slice(2));
const envName = positional[0];

if (!envName) {
  console.error("Usage: pnpm ops:deploy -- <environment>");
  process.exit(1);
}

const { data, path } = readEnvConfig();
const envConfig = data[envName];

if (!envConfig?.deploy) {
  console.error(`Environment "${envName}" has no deploy command in ${path}`);
  process.exit(1);
}

console.log(`Deploying to ${envName}...`);
const child = spawn(envConfig.deploy, {
  cwd: process.cwd(),
  shell: true,
  stdio: "inherit"
});
child.on("exit", (code) => process.exit(code ?? 0));
