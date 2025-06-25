#!/usr/bin/env node
// index.js
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';

const cwd = process.cwd();

console.log('🛠️ @SigismundBT setup configurating...');

// Check if package.json exists
const pkgPath = path.join(cwd, 'package.json');
if (!existsSync(pkgPath)) {
  console.error("❌ package.json does not exist, please run 'pnpm init' first.");
  process.exit(1);
}

// Load and modify package.json
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

// Force set fields regardless of existing values
pkg.description = pkg.description || '';
pkg.license = pkg.license || 'MIT';
pkg.author = pkg.author || '';
pkg.repository = pkg.repository || { type: '', url: '' };
pkg.type = 'module';
// pkg.packageManager left unchanged if already set
pkg.main = 'dist/index.js';
pkg.types = 'dist/index.d.ts';

// Add scripts (non-destructive, except overwrite test if it's empty or echo)
pkg.scripts = {
  ...pkg.scripts,
  dev: pkg.scripts?.dev || 'pnpm run build',
  build: pkg.scripts?.build || 'node build.mjs',
  format: pkg.scripts?.format || 'prettier --write .',
  test:
    !pkg.scripts?.test || pkg.scripts.test.trim() === 'echo "Error: no test specified" && exit 1'
      ? 'vitest run'
      : pkg.scripts.test,
  release: pkg.scripts?.release || 'bumpp --commit --tag',
  start: pkg.scripts?.start || 'node dist/index.js'
};

// Add devDependencies
pkg.devDependencies = {
  ...pkg.devDependencies
};

// Reorder package.json fields (custom order)
const sortedPkg = {
  name: pkg.name,
  version: pkg.version,
  packageManager: pkg.packageManager,
  description: pkg.description,
  license: pkg.license,
  author: pkg.author,
  repository: pkg.repository,
  main: pkg.main,
  types: pkg.types,
  type: pkg.type,
  scripts: pkg.scripts,
  devDependencies: pkg.devDependencies,
  dependencies: pkg.dependencies,
  bin: pkg.bin
};

writeFileSync(pkgPath, JSON.stringify(sortedPkg, null, 2));
console.log('✅ package.json updated.');

// Create /src folder
const srcDir = path.join(cwd, 'src');
if (!existsSync(srcDir)) {
  mkdirSync(srcDir);
  console.log('📁 /src created.');
} else {
  console.log('📁 /src already exists.');
}

// Create /dist folder
const distDir = path.join(cwd, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir);
  console.log('📁 /dist created.');
} else {
  console.log('📁 /dist already exists.');
}

// Generate .prettierrc
const prettierConfig = `{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "none"
}`;
writeFileSync(path.join(cwd, '.prettierrc'), prettierConfig);
console.log('✅ .prettierrc created.');

// Generate tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: 'esnext',
    module: 'es2022',
    moduleResolution: 'node',
    outDir: 'dist',
    strict: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    skipLibCheck: true,
    resolveJsonModule: true
  },
  include: [
    'src/**/*',
    '**/*.test.ts',
    '**/*.spec.ts',
    'vitest.config.ts'
  ],
  exclude: ['node_modules', 'dist']
};
writeFileSync(path.join(cwd, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
console.log('✅ tsconfig.json created.');

// Generate vitest.config.ts
const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 50000,
    include: ['test/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    globals: true,
    mockReset: true,
    clearMocks: true
  }
});
`;
writeFileSync(path.join(cwd, 'vitest.config.ts'), vitestConfig);
console.log('✅ vitest.config.ts created.');

// Generate .gitignore
const gitignore = `
node_modules
*.log
dist
.cache
.env
playground
.idea
.DS_Store
.eslintcache
`;
writeFileSync(path.join(cwd, '.gitignore'), gitignore);
console.log('✅ .gitignore created.');

// Install dev dependencies
console.log('📦 Installing dev dependencies...');
execSync('pnpm add -D bumpp prettier vitest typescript', { stdio: 'inherit' });

console.log('\n🎉 Initialization complete.');
