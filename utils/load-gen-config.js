// utils/load-gen-config.js
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function loadGenConfig(cwd = process.cwd()) {
  let dir = cwd;
  const root = path.parse(dir).root;

  while (true) {
    const mjsConfig = path.join(dir, 'gen.config.mjs');
    const jsConfig = path.join(dir, 'gen.config.js');

    if (fs.existsSync(mjsConfig)) {
      const mod = await import(pathToFileURL(mjsConfig).href);
      return mod.default || {};
    }

    if (fs.existsSync(jsConfig)) {
      console.warn(
        '[kqgen] Encontrado gen.config.js con sintaxis ESM. ' +
          'Renómbralo a gen.config.mjs para evitar warnings de Node.'
      );
      const mod = await import(pathToFileURL(jsConfig).href);
      return mod.default || {};
    }

    if (dir === root) break;
    dir = path.dirname(dir);
  }

  return {};
}
