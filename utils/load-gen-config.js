import fs from "fs";
import path from "path";

// Si encuentras un .js lo importas, si es .json lo parseas.
export async function loadGenConfig() {
  let dir = process.cwd();
  while (dir !== "/") {
    const jsConfig = path.join(dir, "gen.config.js");
    if (fs.existsSync(jsConfig)) {
      // Para ESM
      const mod = await import("file://" + jsConfig);
      return mod.default || {};
    }
    dir = path.dirname(dir);
  }
  return {};
}
