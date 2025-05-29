#!/usr/bin/env node

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { loadGenConfig } from "./utils/load-gen-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [, , command, fullPath, ...flags] = process.argv;
const [scope, subcommand] = command?.split(":") ?? [];

const genConfig = await loadGenConfig();

const commandMap = {
  "--help": "help.js",
  "-h": "help.js",
  "ng:c": "ng-component.js",
  "ng:component": "ng-component.js",
  "ng:s": "ng-service.js",
  "ng:service": "ng-service.js",
  "ng:util": "ng-service.js",
  help: "help.js",
  init: "init.js",
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
  action();
} else if (commandKey === "init") {
  await action();
  process.exit(0);
} else {
  if (!fullPath) {
    console.error("Uso: gen <comando> <ruta/completa/al/nombre> [--bare | -b]");
    process.exit(1);
  }

  const parts = fullPath.split("/");
  const name = parts.pop();

  let targetDir;

  if (parts.length > 0) {
    // Busca src/app hacia arriba en la jerarquía de carpetas
    let rootDir = process.cwd();
    let foundSrcApp = false;
    while (rootDir !== "/" && !foundSrcApp) {
      if (fs.existsSync(path.join(rootDir, "src/app"))) {
        foundSrcApp = true;
        break;
      }
      rootDir = path.dirname(rootDir);
    }
    if (!foundSrcApp) {
      // Crea src/app en el directorio actual
      rootDir = process.cwd();
      fs.mkdirSync(path.join(rootDir, "src/app"), { recursive: true });
      console.log(
        "Creado directorio 'src/app' en:",
        path.join(rootDir, "src/app"),
      );
    }
    targetDir = path.join(rootDir, "src/app", ...parts);
  } else {
    // Sin / => usa la carpeta actual como base
    targetDir = process.cwd();
  }

  const isBare = flags.some((flag) => ["--bare", "-b"].includes(flag));

  try {
    await action(name, targetDir, isBare, flags, genConfig);
  } catch (e) {
    if (e.name === "ExitPromptError" || e.message?.includes("SIGINT")) {
      console.log("\nPrompt cancelado por el usuario.");
      process.exit(0);
    }
    throw e;
  }
}
