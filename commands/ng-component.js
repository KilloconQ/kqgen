import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toPascalCase(str) {
  return str
    .split('-')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('');
}

export default async function generateComponent(
  name,
  customPath = 'app',
  isBare = false,
  options = {},
  genConfig = {}
) {
  const baseDir = path.resolve(path.join(customPath, name));
  const pascal = toPascalCase(name);

  const primaryColor = genConfig.theme?.primaryColor || '#000';
  const secondaryColor = genConfig.theme?.secondaryColor || '#fff';
  const borderRadius = genConfig.theme?.borderRadius || '5px';

  const framework = genConfig.framework?.name ?? 'angular';
  const frameworkVersion = Number(genConfig.framework?.version ?? 19);

  // Extensiones por defecto (Angular < 20)
  let scriptExtension = '.component.ts';
  let templateExtension = '.component.html';
  let styleExtension = '.component.scss';

  // Ajuste para Angular 20+
  const isA20Plus = framework === 'angular' && frameworkVersion >= 20;
  if (isA20Plus) {
    scriptExtension = '.ts';
    templateExtension = '.html';
    styleExtension = '.scss';
  } else if (framework !== 'angular') {
    console.error(`Unsupported framework: ${framework}`);
    return;
  }

  // Determina el preset desde Commander (options.type)
  const preset = options.type ?? 'default';

  await mkdir(baseDir, { recursive: true });

  if (!isBare) {
    await mkdir(path.join(baseDir, 'services'), { recursive: true });
    await mkdir(path.join(baseDir, 'models'), { recursive: true });
    await mkdir(path.join(baseDir, 'interfaces'), { recursive: true });
  }

  // Rutas de templates (A<20 usa *.component.*, A≥20 usa sin sufijo)
  const baseTemplate = isA20Plus ? preset : `${preset}.component`;

  const tsTemplatePath = path.join(
    __dirname,
    '..',
    'templates',
    'angular',
    'component',
    preset,
    `${baseTemplate}.ts`
  );
  const htmlTemplatePath = path.join(
    __dirname,
    '..',
    'templates',
    'angular',
    'component',
    preset,
    `${baseTemplate}.html`
  );
  const scssTemplatePath = path.join(
    __dirname,
    '..',
    'templates',
    'angular',
    'component',
    preset,
    `${baseTemplate}.scss`
  );

  // Lee templates en paralelo
  let ts, html, scss;
  try {
    [ts, html, scss] = await Promise.all([
      readFile(tsTemplatePath, 'utf-8'),
      readFile(htmlTemplatePath, 'utf-8'),
      readFile(scssTemplatePath, 'utf-8'),
    ]);
  } catch (err) {
    console.error(
      `Error reading templates for preset "${preset}". ` +
        `Check that the files exist under templates/angular/component/${preset}/`
    );
    throw err;
  }

  // Reemplazos comunes
  const applyReplacements = str =>
    str
      .replace(/{{name}}/g, name)
      .replace(/{{pascalName}}/g, pascal)
      .replace(/{{primaryColor}}/g, primaryColor)
      .replace(/{{secondaryColor}}/g, secondaryColor)
      .replace(/{{borderRadius}}/g, borderRadius);

  // Escribe archivos finales
  await writeFile(
    path.join(baseDir, `${name}${scriptExtension}`),
    applyReplacements(ts)
  );
  await writeFile(
    path.join(baseDir, `${name}${templateExtension}`),
    applyReplacements(html)
  );
  await writeFile(
    path.join(baseDir, `${name}${styleExtension}`),
    applyReplacements(scss)
  );

  console.log(`${name} component successfully generated`);
}
