import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toPascalCase(str) {
  return str
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

// Utilidad para obtener el preset del flag
function getPreset(flags) {
  const aliases = {
    table: "table",
    "-t": "table",
    "--type=table": "table",
    "-tt": "table",
    "-tf": "filter",
    "--type=filter": "filter",
    "-tad": "add-dialog",
    "--type=add-dialog": "add-dialog",
  };

  for (const flag of flags) {
    if (aliases[flag]) return aliases[flag];
    const eqIndex = flag.indexOf("=");
    if (eqIndex !== -1) {
      const key = flag.slice(0, eqIndex) + "=" + flag.slice(eqIndex + 1);
      if (aliases[key]) return aliases[key];
    }
  }

  return "default";
}

export default async function generateNgComponent(
  name,
  customPath = "app",
  isBare = false,
  flags = [],
) {
  const baseDir = path.resolve(`${customPath}/${name}`);
  const pascal = toPascalCase(name);

  // Detectar el preset a usar
  const preset = getPreset(flags);

  await mkdir(baseDir, { recursive: true });

  if (!isBare) {
    await mkdir(path.join(baseDir, "services"), { recursive: true });
    await mkdir(path.join(baseDir, "models"), { recursive: true });
    await mkdir(path.join(baseDir, "interfaces"), { recursive: true });
  }

  // Carga las plantillas según el preset
  const [ts, html, scss] = await Promise.all([
    readFile(
      path.join(
        __dirname,
        `../templates/component/${preset}/${preset}.component.ts`,
      ),
      "utf-8",
    ),
    readFile(
      path.join(
        __dirname,
        `../templates/component/${preset}/${preset}.component.html`,
      ),
      "utf-8",
    ),
    readFile(
      path.join(
        __dirname,
        `../templates/component/${preset}/${preset}.component.scss`,
      ),
      "utf-8",
    ),
  ]);

  const replace = (str) =>
    str.replace(/{{name}}/g, name).replace(/{{pascalName}}/g, pascal);

  await writeFile(path.join(baseDir, `${name}.component.ts`), replace(ts));
  await writeFile(path.join(baseDir, `${name}.component.html`), replace(html));
  await writeFile(path.join(baseDir, `${name}.component.scss`), replace(scss));

  console.log(`${name} generado en ${baseDir} usando el preset "${preset}"`);
}
