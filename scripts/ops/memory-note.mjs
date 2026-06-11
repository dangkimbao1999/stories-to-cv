import { appendFileSync } from "node:fs";
import { parseArgs, resolveFromRoot } from "./lib/env-config.mjs";

const { positional } = parseArgs(process.argv.slice(2));
const target = positional[0];
const message = positional.slice(1).join(" ");

if (!target || !message) {
  console.error("Usage: pnpm ops:memory:add -- <decisions|bugs|environments> \"note text\"");
  process.exit(1);
}

const filePath = resolveFromRoot(".codex", "memory", `${target}.md`);
appendFileSync(filePath, `- ${new Date().toISOString().slice(0, 10)} ${message}\n`, "utf8");
console.log(`Appended memory note to ${filePath}`);
