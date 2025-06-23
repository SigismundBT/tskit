# @sigbt/tskit

This is @sigismundbt's personal TypeScript init kit.

## Usage

```bash
pnpm init
npx @sigbt/tskit
```

## What it does

- Creates `src/` and `dist/` directories
- Adds `.prettierrc`, `tsconfig.json`, `vitest.config.ts`, and `.gitignore`
- Injects default scripts into `package.json`:
  - `dev`, `build`, `format`, `test`, `release`, `start`
- Adds devDependencies:
  - `prettier`, `typescript`, `vitest`, `bumpp`

## Requirements

- You must run `pnpm init` before using `tskit`.
