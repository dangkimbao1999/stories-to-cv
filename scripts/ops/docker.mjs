import { spawn } from "node:child_process";
import { parseArgs } from "./lib/env-config.mjs";

const forwardedArgs = process.argv.slice(2).filter((token) => token !== "--");
const { positional, flags } = parseArgs(forwardedArgs);
const action = positional[0] || "ps";
const service = positional[1] || flags.service;
const envName = flags.env || "local";

const composeFiles = ["-f", "docker-compose.yml"];
if (envName === "server") {
  composeFiles.push("-f", "docker-compose.server.yml");
}

const project = flags.project || `stories-to-cv-${envName}`;
const baseArgs = ["compose", "--project-name", project, ...composeFiles];

function actionArgs() {
  switch (action) {
    case "build":
      return ["build", ...(service ? [service] : [])];
    case "down":
      return ["down", ...(flags.volumes ? ["--volumes"] : [])];
    case "logs":
      return [
        "logs",
        ...(flags.follow ? ["--follow"] : []),
        ...(flags.tail ? ["--tail", flags.tail] : []),
        ...(flags.since ? ["--since", flags.since] : []),
        ...(flags.timestamps ? ["--timestamps"] : []),
        ...(service ? [service] : []),
      ];
    case "ps":
      return ["ps"];
    case "restart":
      return ["restart", ...(service ? [service] : [])];
    case "up":
      return ["up", "-d", ...(flags.build ? ["--build"] : []), ...(service ? [service] : [])];
    default:
      console.error(`Unknown Docker action "${action}". Use one of: up, down, build, logs, ps, restart.`);
      process.exit(1);
  }
}

const dockerArgs = [...baseArgs, ...actionArgs()];
const printableCommand = ["docker", ...dockerArgs].join(" ");

if (flags.print) {
  console.log(printableCommand);
  process.exit(0);
}

console.log(printableCommand);

const child = spawn("docker", dockerArgs, {
  cwd: process.cwd(),
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
