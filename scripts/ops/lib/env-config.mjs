import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function repoRoot() {
  return process.cwd();
}

export function resolveFromRoot(...parts) {
  return resolve(repoRoot(), ...parts);
}

export function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export function readEnvConfig() {
  const configPath = resolveFromRoot(".codex", "environments.json");
  const examplePath = resolveFromRoot(".codex", "environments.example.json");
  const chosenPath = existsSync(configPath) ? configPath : examplePath;

  return {
    path: chosenPath,
    data: JSON.parse(readFileSync(chosenPath, "utf8"))
  };
}

export function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return { positional, flags };
}
