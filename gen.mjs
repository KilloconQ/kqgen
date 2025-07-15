#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
// Delay loading of config until after potential prettier intercept

// Calculate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Early intercept for prettier flag
const rawArgs = process.argv.slice(2);
if (rawArgs.includes('-p') || rawArgs.includes('--prettier')) {
  const filePath = path.join(__dirname, 'commands', 'prettier.js');
  const { default: prettierAction } = await import(
    pathToFileURL(filePath).href
  );
  await prettierAction();
  process.exit(0);
}

// Load custom config
import { loadGenConfig } from './utils/load-gen-config.js';
const genConfig = await loadGenConfig();

const program = new Command();

program
  .name(chalk.green('kqgen'))
  .description(chalk.blue('Angular & NestJS component and service generator'))
  .version(
    genConfig.version || '1.3.0',
    '-v, --version',
    chalk.yellow('output the current version')
  );

// Global options
program
  .option('-p, --prettier', chalk.magenta('Enable prettier configuration'))
  .option(
    '-b, --bare',
    chalk.magenta('Only generate the base file without extra folders')
  );

// ng:component
program
  .command('ng:component <fullPath>')
  .description(chalk.cyan('Generate an Angular component'))
  .addHelpText(
    'after',
    `\n${chalk.gray('Presets:')} default, table, filter, add-dialog`
  )
  .option(
    '-t, --type <preset>',
    chalk.cyan('Preset: default, table, filter, add-dialog'),
    'default'
  )
  .action(async (fullPath, options) => {
    await runGenerator('ng-component.js', fullPath, options);
  });

// ng:service
program
  .command('ng:service <fullPath>')
  .description(chalk.cyan('Generate an Angular service'))
  .addHelpText('after', `\n${chalk.gray('Types:')} REST, GraphQL, none`)
  .option('-r, --rest', chalk.cyan('Force REST service'))
  .option('-g, --gql', chalk.cyan('Force GraphQL service'))
  .option('-n, --none', chalk.cyan('Empty service'))
  .action(async (fullPath, options) => {
    await runGenerator('ng-service.js', fullPath, options);
  });

// init
program
  .command('init')
  .description(chalk.cyan('Create a sample gen.config.js in project root'))
  .action(async () => {
    const { default: initAction } = await import(
      path.join(__dirname, 'commands/init.js')
    );
    await initAction();
  });

// help alias
program
  .command('help')
  .description(chalk.cyan('Display help for kqgen'))
  .action(() => program.outputHelp());

async function runGenerator(scriptFile, fullPath, options) {
  const filePath = path.join(__dirname, 'commands', scriptFile);
  const { default: action } = await import(pathToFileURL(filePath).href);

  const cwd = process.cwd();
  const projectRoot = findProjectRootWithSrcApp(cwd);
  const parts = fullPath.split('/');
  const name = parts.pop();
  let targetDir;

  if (parts.length) {
    if (projectRoot) {
      targetDir = path.join(projectRoot, 'src/app', ...parts);
    } else {
      targetDir = path.join(cwd, 'src/app', ...parts);
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(chalk.yellow("Created 'src/app' at:"), targetDir);
    }
  } else {
    targetDir = projectRoot
      ? [cwd, projectRoot].includes(cwd)
        ? path.join(projectRoot, 'src/app')
        : cwd
      : cwd;
  }

  await action(name, targetDir, options.bare, process.argv.slice(3), genConfig);
}

function findProjectRootWithSrcApp(dir) {
  while (dir !== '/' && dir !== '.') {
    if (fs.existsSync(path.join(dir, 'src/app'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

async function main() {
  await program.parseAsync(process.argv);
}

main();
