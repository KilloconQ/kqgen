// Comando: ng-service.js
import { mkdir, writeFile, readFile, access } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toPascalCase(str) {
  return str
    .split('-')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('');
}

export default async function generateService(
  name,
  customPath = 'app',
  options = {},
  genConfig = {}
) {
  const baseDir = path.resolve(customPath);
  const pascal = toPascalCase(name);

  await mkdir(baseDir, { recursive: true });

  const framework = genConfig.framework?.name ?? 'angular';
  const frameworkVersion = Number(genConfig.framework?.version ?? 19);

  // Extensión por defecto para Angular < 20
  let scriptExtension = '.service.ts';
  if (framework === 'angular' && frameworkVersion >= 20) {
    // Mantengo tu comportamiento previo de usar .ts "plano" en v20+
    scriptExtension = '.ts';
  } else if (framework !== 'angular') {
    console.error(`Unsupported framework: ${framework}`);
    return;
  }

  const filePath = path.join(baseDir, `${name}${scriptExtension}`);

  // ¿Existe el archivo?
  let exists = false;
  try {
    await access(filePath, fs.constants.F_OK);
    exists = true;
  } catch {
    /* no existe */
  }

  if (exists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `El servicio ${filePath} ya existe. ¿Sobrescribir?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log('Operación cancelada.');
      return;
    }
  }

  // Determinar tipo vía opciones parseadas por Commander
  // Soporta: --rest / --gql / --none y también --type=rest|gql|none
  let apiType =
    (options.rest && 'rest') ||
    (options.gql && 'gql') ||
    (options.none && 'none') ||
    (typeof options.type === 'string' &&
    ['rest', 'gql', 'none'].includes(options.type)
      ? options.type
      : null);

  if (!apiType) {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '¿Qué tipo de servicio deseas crear?',
        choices: [
          { name: 'REST', value: 'rest' },
          { name: 'GraphQL', value: 'gql' },
          { name: 'Ninguno (servicio limpio)', value: 'none' },
        ],
      },
    ]);
    apiType = type;
  }

  // Elegir plantilla y (si aplica) preparar queries GraphQL
  let templateFile = '';
  if (apiType === 'gql') {
    const queriesDir = path.join(baseDir, 'queries');
    await mkdir(queriesDir, { recursive: true });

    const queryTemplates = [
      { tpl: 'get-all-query.ts', out: 'get-all-query.ts' },
      { tpl: 'get-one-query.ts', out: 'get-one-query.ts' },
      { tpl: 'create-query.ts', out: 'create-query.ts' },
      { tpl: 'update-query.ts', out: 'update-query.ts' },
    ];

    for (const { tpl, out } of queryTemplates) {
      const tplContent = await readFile(
        path.join(
          __dirname,
          '..',
          'templates',
          'angular',
          'service',
          'queries',
          tpl
        ),
        'utf-8'
      );
      const outPath = path.join(queriesDir, out);
      const queryContent = tplContent
        .replace(/{{name}}/g, name)
        .replace(/{{pascalName}}/g, pascal)
        .replace(/{{upperName}}/g, name.toUpperCase());
      await writeFile(outPath, queryContent);
    }

    const indexContent = `
export * from './get-all-query';
export * from './get-one-query';
export * from './create-query';
export * from './update-query';
`.trimStart();

    await writeFile(path.join(queriesDir, 'index.ts'), indexContent);
    templateFile = path.join(
      __dirname,
      '..',
      'templates',
      'angular',
      'service',
      'graphql.service.ts'
    );
    console.log('Queries and barrel generados en', queriesDir);
  } else if (apiType === 'rest') {
    templateFile = path.join(
      __dirname,
      '..',
      'templates',
      'angular',
      'service',
      'rest.service.ts'
    );
  } else {
    templateFile = path.join(
      __dirname,
      '..',
      'templates',
      'angular',
      'service',
      'empty.service.ts'
    );
  }

  // Leer plantilla del servicio
  const tpl = await readFile(templateFile, 'utf-8');
  const content = tpl
    .replace(/{{name}}/g, name)
    .replace(/{{pascalName}}/g, pascal)
    .replace(/{{upperName}}/g, name.toUpperCase());

  await writeFile(filePath, content);
  console.log(`${name} service generated successfully`);
}
