import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export default function prettier() {
  const currentDir = process.cwd();
  const templateDir = join(import.meta.dirname, "../templates/prettier");
  
  // Lista de archivos a copiar
  const files = [".prettierrc", ".prettierignore"];
  
  console.log("🎨 Setting up Prettier configuration...");
  
  files.forEach(file => {
    const sourcePath = join(templateDir, file);
    const targetPath = join(currentDir, file);
    
    if (existsSync(targetPath)) {
      console.log(`⚠️  ${file} already exists, skipping...`);
      return;
    }
    
    try {
      const content = readFileSync(sourcePath, "utf8");
      writeFileSync(targetPath, content);
      console.log(`✅ Created ${file}`);
    } catch (error) {
      console.error(`❌ Error copying ${file}:`, error.message);
    }
  });
  
  console.log("\n🎉 Prettier setup complete!");
  console.log("📋 Next steps:");
  console.log("  1. Install prettier: npm install --save-dev prettier");
  console.log("  2. Add scripts to package.json:");
  console.log('     "format": "prettier --write ."');
  console.log('     "format:check": "prettier --check ."');
}
