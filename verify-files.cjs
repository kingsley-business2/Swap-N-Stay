// verify-files.js (ESM version)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  {
    path: 'src/hooks/useAuth.ts',
    template: `/* your template here */`,
  },
  {
    path: 'src/lib/supabase.ts',
    template: `/* your template here */`,
  },
];

let repaired = false;

for (const { path: relPath, template } of files) {
  const fullPath = path.resolve(__dirname, relPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ ${relPath} missing — restoring`);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, template.trim());
    repaired = true;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8').trim();
  if (content.length < 50 || !content.includes('export')) {
    console.warn(`⚠️ ${relPath} appears broken — restoring`);
    fs.writeFileSync(fullPath, template.trim());
    repaired = true;
    continue;
  }

  console.log(`✅ Verified: ${relPath}`);
}

console.log(repaired ? '🔧 Files repaired.' : '🎉 All files valid.');
