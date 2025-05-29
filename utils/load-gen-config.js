import fs from "fs";
import path from "path";

export async function loadGenConfig() {
  let dir = process.cwd();
  while (dir !== "/") {
    const jsConfig = path.join(dir, "gen.config.js");
    if (fs.existsSync(jsConfig)) {
      const mod = await import("file://" + jsConfig);
      return mod.default || {};
    }
    dir = path.dirname(dir);
  }
  return {};
}
