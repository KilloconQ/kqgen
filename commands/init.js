// commands/init.js
import fs from 'fs';
import { access, writeFile, rename } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_MJS = 'gen.config.mjs';
const CONFIG_JS = 'gen.config.js';

const esmConfigExample = `// ${CONFIG_MJS} (ESM)
export default {
  theme: {
    primaryColor: "#000",
    secondaryColor: "#fff",
    borderRadius: "8px",
    fontFamily: "Inter, sans-serif"
  },
  framework: {
    name: "angular",
    version: 20
  },
  output: {
    preset: "scss",
    generateVariablesFile: true
  }
};
`.trimStart();

function findProjectRoot(startDir) {
  let dir = path.resolve(startDir);
  const root = path.parse(dir).root; // ✅ "C:\\" en Windows, "/" en Unix
  while (true) {
    if (
      fs.existsSync(path.join(dir, 'src', 'app')) ||
      fs.existsSync(path.join(dir, 'package.json'))
    ) {
      return dir;
    }
    if (dir === root) break;
    dir = path.dirname(dir);
  }
  // fallback al cwd si no se encontró nada anterior
  return process.cwd();
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export default async function initGenConfig({ force = false } = {}) {
  const rootDir = findProjectRoot(process.cwd());
  const mjsPath = path.join(rootDir, CONFIG_MJS);
  const jsPath = path.join(rootDir, CONFIG_JS);

  const hasMjs = await exists(mjsPath);
  const hasJs = await exists(jsPath);

  // 1) Ya hay .mjs
  if (hasMjs && !force) {
    console.log(
      chalk.yellow(`✔ ${CONFIG_MJS} ya existe en:`),
      chalk.gray(rootDir)
    );
    console.log(
      chalk.gray('Usa --force para sobrescribir si realmente lo necesitas.')
    );
    return;
  }

  // 2) Hay .js legado y NO hay .mjs → migramos automáticamente (rename)
  if (!hasMjs && hasJs && !force) {
    try {
      await rename(jsPath, mjsPath);
      console.log(
        chalk.green('Migrado:'),
        chalk.gray(`${CONFIG_JS} → ${CONFIG_MJS}`)
      );
      console.log(chalk.gray('Proyecto listo para ESM-only sin warnings.'));
      return;
    } catch (err) {
      console.error(
        chalk.red('Error al migrar archivo de configuración:'),
        err.message
      );
      console.log(
        chalk.yellow('Intentando crear un'),
        chalk.cyan(CONFIG_MJS),
        chalk.yellow('nuevo…')
      );
      // seguimos y escribimos el .mjs
    }
  }

  // 3) Crear/ sobrescribir .mjs (si --force o no existía nada)
  try {
    await writeFile(mjsPath, esmConfigExample, 'utf8');
    console.log(chalk.green('Creado:'), chalk.gray(mjsPath));
  } catch (err) {
    console.error(chalk.red('No se pudo escribir el archivo:'), err.message);
  }

  // 4) Aviso si coexiste un .js (solo informativo)
  if (await exists(jsPath)) {
    console.log(
      chalk.yellow(
        `Aviso: todavía existe un ${CONFIG_JS}. Puedes borrarlo para evitar confusiones.`
      )
    );
  }
}
