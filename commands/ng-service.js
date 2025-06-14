// Comando: ng-service.js
import { mkdir, writeFile, readFile, access, constants } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toPascalCase(str) {
  return str
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

function parseFlags(flags) {
  return {
    isRest:
      Array.isArray(flags) && flags.some((f) => f === "-r" || f === "--rest"),
    isGql:
      Array.isArray(flags) && flags.some((f) => f === "-g" || f === "--gql"),
    isNone:
      Array.isArray(flags) && flags.some((f) => f === "-n" || f === "--none"),
  };
}

export default async function generateService(
  name,
  customPath = "app",
  isBare = false,
  flags = [],
  genConfig = {},
) {
  flags = flags || [];
  const baseDir = path.resolve(`${customPath}`);
  const pascal = toPascalCase(name);

  await mkdir(baseDir, { recursive: true });
  console.log("gen");
  const framework = genConfig.framework?.name ?? "angular";
  const frameworkVersion = genConfig.framework?.version ?? 19;

  let scriptExtension = ".service.ts";

  switch (framework) {
    case "angular":
      if (frameworkVersion >= 20) {
        scriptExtension = ".ts";
      }
      break;

    default:
      console.error(`Unsupported framework: ${framework}`);
      return;
  }

  const filePath = path.join(baseDir, `${name}${scriptExtension}`);

  let exists = false;
  try {
    await access(filePath, constants.F_OK);
    exists = true;
  } catch {}

  if (exists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `El servicio ${filePath} ya existe. ¿Sobrescribir?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log("Operación cancelada.");
      return;
    }
  }

  const { isRest, isGql, isNone } = parseFlags(flags);
  let apiType = null;
  if (isRest) apiType = "rest";
  else if (isGql) apiType = "gql";
  else if (isNone) apiType = "none";
  else {
    const { type } = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "¿Qué tipo de servicio deseas crear?",
        choices: [
          { name: "REST", value: "rest" },
          { name: "GraphQL", value: "gql" },
          { name: "Ninguno (servicio limpio)", value: "none" },
        ],
      },
    ]);
    apiType = type;
  }

  let templateFile = "";
  if (apiType === "gql") {
    await mkdir(path.join(baseDir, "queries"), { recursive: true });
    templateFile = path.join(
      __dirname,
      "../templates/angular/service/graphql.service.ts",
    );
    console.log("Directorio de queries creado");
  } else if (apiType === "rest") {
    templateFile = path.join(
      __dirname,
      "../templates/angular/service/rest.service.ts",
    );
  } else {
    templateFile = path.join(
      __dirname,
      "../templates/service/angular/empty.service.ts",
    );
  }

  if (apiType === "gql") {
    const queriesDir = path.join(baseDir, "queries");
    await mkdir(queriesDir, { recursive: true });

    const queryTemplates = [
      { tpl: "get-all-query.ts", out: "get-all-query.ts" },
      { tpl: "get-one-query.ts", out: "get-one-query.ts" },
      { tpl: "create-query.ts", out: "create-query.ts" },
      { tpl: "update-query.ts", out: "update-query.ts" },
    ];

    for (const { tpl, out } of queryTemplates) {
      const tplContent = await readFile(
        path.join(__dirname, `../templates/angular/service/queries/${tpl}`),
        "utf-8",
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

    await writeFile(path.join(queriesDir, "index.ts"), indexContent);
    console.log("Queries and barrel generados en", queriesDir);
  }

  const tpl = await readFile(templateFile, "utf-8");
  const content = tpl
    .replace(/{{name}}/g, name)
    .replace(/{{pascalName}}/g, pascal)
    .replace(/{{upperName}}/g, name.toUpperCase());

  await writeFile(filePath, content);
  console.log(`${name} service generated successfully`);
}
