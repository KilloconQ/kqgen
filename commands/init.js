import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configExample = `
  // gen.config.js
  export default {
    theme: {
      primaryColor: "#377bc8",
      secondaryColor: "#7c3aed",
      borderRadius: "8px",
      fontFamily: "Inter, sans-serif"
    },
    output: {
      preset: "tailwind", // or 'scss', 'css'
      generateVariablesFile: true
    }
  };
  `.trimStart();

export default function initGenConfig() {
  const targetPath = path.resolve(process.cwd(), "gen.config.js");
  if (fs.existsSync(targetPath)) {
    console.error(
      "El archivo gen.config.js ya existe en el directorio actual.",
    );
    return;
  }

  fs.writeFileSync(targetPath, configExample, "utf8");
  console.log("Archivo gen.config.js creado en la raíz de tu proyecto");
}
