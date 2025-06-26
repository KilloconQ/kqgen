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
  "--version": "version.js",
  "-v": "version.js",
  //angular
  "ng:component": "ng-component.js",
  "ng:service": "ng-service.js",
  "ng:util": "ng-service.js",
  "ng:c": "ng-component.js",
  "ng:s": "ng-service.js",
  "ng:u": "ng-service.js",
  //nest
  "nest:controller": "nest-controller.js",
  "nest:repository": "nest-repository.js",
  "nest:resolver": "nest-resolver.js",
  "nest:resource": "nest-resource.js",
  "nest:service": "nest-service.js",
  "nest:module": "nest-module.js",
  "nest:c": "nest-controller.js",
  "nest:r": "nest-resolver.js",
  "nest:repo": "nest-repository.js",
  "nest:res": "nest-resource.js",
  "nest:s": "nest-service.js",
  "nest:m": "nest-module.js",
  help: "help.js",
  init: "init.js",
};

const commandKey = subcommand ? `${scope}:${subcommand}` : command;
const file = commandMap[commandKey];

/**
 * Helper: Show help and exit
 */
async function showHelpAndExit() {
  const helpPath = path.join(__dirname, "commands", "help.js");
  const { default: showHelp } = await import(`file://${helpPath}`);
  showHelp();
  process.exit(1);
}

if (!file) {
  await showHelpAndExit();
}

const filePath = path.join(__dirname, "commands", file);
const { default: action } = await import(`file://${filePath}`);

if (commandKey === "-v") {
  const { getVersion } = await import("./commands/version.js");
  console.log(`Version: ${getVersion()}`);
  process.exit(0);
}

if (commandKey === "help") {
  action();
} else if (commandKey === "init") {
  await action();
  process.exit(0);
} else {
  if (!fullPath) {
    console.error("Usage: kqgen <command> <full/path/to/name> [--bare | -b]");
    await showHelpAndExit();
  }

  const parts = fullPath.split("/");
  const name = parts.pop();

  /**
   * Find the nearest project root that contains src/app
   */
  function findProjectRootWithSrcApp(dir) {
    while (dir !== "/" && dir !== ".") {
      if (fs.existsSync(path.join(dir, "src/app"))) return dir;
      dir = path.dirname(dir);
    }
    return null;
  }

  let targetDir;
  const cwd = process.cwd();
  const projectRoot = findProjectRootWithSrcApp(cwd);

  if (parts.length > 0) {
    // If subfolders are specified, ALWAYS generate under src/app/...
    if (projectRoot) {
      targetDir = path.join(projectRoot, "src/app", ...parts);
    } else {
      fs.mkdirSync(path.join(cwd, "src/app"), { recursive: true });
      targetDir = path.join(cwd, "src/app", ...parts);
      console.log("Created 'src/app' at:", path.join(cwd, "src/app"));
    }
  } else {
    if (
      projectRoot &&
      (cwd === projectRoot || cwd === path.join(projectRoot, "src"))
    ) {
      targetDir = path.join(projectRoot, "src/app");
    } else {
      targetDir = cwd;
    }
  }

  const isBare = flags.some((flag) => ["--bare", "-b"].includes(flag));

  try {
    await action(name, targetDir, isBare, flags, genConfig);
  } catch (e) {
    if (e.name === "ExitPromptError" || e.message?.includes("SIGINT")) {
      console.log("\nSee you soon.");
      process.exit(0);
    }
    // On any other error, show help as fallback
    console.error(e);
    await showHelpAndExit();
  }
}
