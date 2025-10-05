const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'src/hooks/useAuth.ts',
    template: `/* full working template here */`,
  },
  {
    path: 'src/lib/supabase.ts',
    template: `/* full working template here */`,
  },
];

for (const { path: relPath, template } of files) {
  const fullPath = path.resolve(relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, template.trim());
  console.log(`🔁 Overwritten: ${relPath}`);
}

console.log('✅ All critical files restored before build.');
