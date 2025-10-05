// verify-files.js
// Run before build to ensure critical files exist and are valid

const fs = require('fs');
const path = require('path');

// List of required files
const requiredFiles = [
  'src/hooks/useAuth.ts',
  'src/lib/supabase.ts'
];

let hasError = false;

for (const file of requiredFiles) {
  const fullPath = path.resolve(file);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required file: ${file}`);
    hasError = true;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8').trim();
  if (content.length === 0) {
    console.error(`❌ File is empty: ${file}`);
    hasError = true;
    continue;
  }

  // Extra validation for useAuth.ts
  if (file.includes('useAuth.ts')) {
    if (!content.includes('export const useAuth')) {
      console.error(`❌ ${file} does not contain "export const useAuth"`);
      hasError = true;
    }
    if (!content.endsWith('};')) {
      console.error(`❌ ${file} does not end cleanly with "};"`);
      hasError = true;
    }
  }

  if (!hasError) {
    console.log(`✅ Verified: ${file}`);
  }
}

if (hasError) {
  console.error('🚨 Build aborted due to missing or invalid files.');
  process.exit(1);
} else {
  console.log('🎉 All required files verified successfully.');
}
