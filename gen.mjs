#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [, , command, fullPath, ...flags] = process.argv;
const [scope, subcommand] = command?.split(":") ?? [];

const commandMap = {
  "ng:component": "ng-component.js",
  "ng:util": "ng-service.js",
  "ng:service": "ng-service.js",
  "ng:c": "ng-component.js",
  "ng:s": "ng-service.js",
  "--help": "help.js",
  "-h": "help.js",
  help: "help.js",
};

const commandKey = subcommand ? `${scope}:${subcommand}` : command;
const file = commandMap[commandKey];

if (!file) {
  console.error(`Comando no reconocido: ${commandKey}`);
  process.exit(1);
}

const filePath = path.join(__dirname, "commands", file);
const { default: action } = await import(`file://${filePath}`);

if (commandKey === "help") {
  action(); // no necesita argumentos
} else {
  if (!fullPath) {
    console.error("Uso: gen <comando> <ruta/completa/al/nombre> [--bare | -b]");
    process.exit(1);
  }

  const parts = fullPath.split("/");
  const name = parts.pop();
  const targetDir = path.join("app", ...parts);
  const isBare = flags.some((flag) => ["--bare", "-b"].includes(flag));

  await action(name, targetDir, isBare, flags);
}
