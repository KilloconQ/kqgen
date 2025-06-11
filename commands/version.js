import { readFileSync } from "fs";
import { join } from "path";

export function getVersion() {
  const pkg = JSON.parse(
    readFileSync(join(import.meta.dirname, "../package.json"), "utf8"),
  );
  return pkg.version;
}
