import { request } from "node:http";
import { request as httpsRequest } from "node:https";
import { parseArgs, readEnvConfig } from "./lib/env-config.mjs";

function hit(url) {
  return new Promise((resolve) => {
    const fn = url.startsWith("https") ? httpsRequest : request;
    const req = fn(url, { method: "GET" }, (res) => {
      res.resume();
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, statusCode: res.statusCode });
    });
    req.on("error", (error) => resolve({ ok: false, error: error.message }));
    req.end();
  });
}

const { positional } = parseArgs(process.argv.slice(2));
const envName = positional[0] || "local";
const { data, path } = readEnvConfig();
const envConfig = data[envName];

if (!envConfig?.health && !envConfig?.verify) {
  console.error(`Environment "${envName}" has no health/verify targets in ${path}`);
  process.exit(1);
}

const checks = envConfig.health || envConfig.verify;
let failures = 0;

for (const check of checks) {
  const result = await hit(check.url);
  if (!result.ok) {
    failures += 1;
    console.log(`FAIL ${check.name}: ${check.url} ${result.statusCode ?? result.error}`);
    continue;
  }

  console.log(`OK   ${check.name}: ${check.url} ${result.statusCode}`);
}

process.exit(failures > 0 ? 1 : 0);
