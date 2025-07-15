import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configExample = `
// gen.config.js
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

function findProjectRoot(dir) {
  while (dir !== '/' && dir !== '.') {
    if (
      fs.existsSync(path.join(dir, 'src/app')) ||
      fs.existsSync(path.join(dir, 'package.json'))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

export default function initGenConfig({ force = false } = {}) {
  const rootDir = findProjectRoot(process.cwd());
  const targetPath = path.join(rootDir, 'gen.config.js');
  if (fs.existsSync(targetPath) && !force) {
    console.error(
      'gen.config.js file already exists in the project root:',
      rootDir
    );
    return;
  }
  fs.writeFileSync(targetPath, configExample, 'utf8');
  console.log(
    'gen.config.js file generated in the root of the project:',
    rootDir
  );
}
