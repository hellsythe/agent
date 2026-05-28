#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const targetFlagIndex = args.indexOf('--target');
const force = args.includes('--force');
const pmFlagIndex = args.indexOf('--pm');

const baseTarget =
  targetFlagIndex >= 0 && args[targetFlagIndex + 1]
    ? path.resolve(args[targetFlagIndex + 1])
    : process.cwd();

const packageManager =
  pmFlagIndex >= 0 && args[pmFlagIndex + 1] ? args[pmFlagIndex + 1] : 'npm';

const packageJsonPath = path.join(baseTarget, 'package.json');
const sourceConfig = path.resolve(__dirname, '..', 'stubs', 'commitlint.config.js');
const destinationConfig = path.join(baseTarget, 'commitlint.config.js');
const sourceHusky = path.resolve(__dirname, '..', 'stubs', 'husky');
const destinationHusky = path.join(baseTarget, '.husky');

if (!fs.existsSync(packageJsonPath)) {
  process.stderr.write(`No se encontro package.json en ${baseTarget}\n`);
  process.exit(1);
}

if (!fs.existsSync(sourceConfig) || !fs.existsSync(sourceHusky)) {
  process.stderr.write('No se encontraron stubs de husky/commitlint en el paquete.\n');
  process.exit(1);
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (!force && fs.existsSync(destinationPath)) {
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}

if (force || !fs.existsSync(destinationConfig)) {
  fs.copyFileSync(sourceConfig, destinationConfig);
}

copyDirectory(sourceHusky, destinationHusky);

for (const filePath of [
  path.join(destinationHusky, 'commit-msg'),
  path.join(destinationHusky, 'pre-commit'),
  path.join(destinationHusky, 'pre-commit-docs-reminder'),
]) {
  if (fs.existsSync(filePath)) {
    fs.chmodSync(filePath, 0o755);
  }
}

let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  process.stderr.write(`No se pudo leer package.json: ${error.message}\n`);
  process.exit(1);
}

packageJson.scripts = packageJson.scripts || {};

if (!packageJson.scripts.prepare) {
  packageJson.scripts.prepare = 'husky';
} else if (!packageJson.scripts.prepare.includes('husky')) {
  packageJson.scripts.prepare = `${packageJson.scripts.prepare} && husky`;
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const dependencies = ['husky', '@commitlint/cli', '@commitlint/config-conventional'];
const installArgs =
  packageManager === 'pnpm'
    ? ['add', '-D', ...dependencies]
    : packageManager === 'yarn'
      ? ['add', '-D', ...dependencies]
      : ['install', '-D', ...dependencies];

const installResult = spawnSync(packageManager, installArgs, {
  cwd: baseTarget,
  stdio: 'inherit',
});

if (installResult.error || installResult.status !== 0) {
  process.stderr.write('No se pudieron instalar dependencias de husky/commitlint.\n');
  process.exit(1);
}

const gitDir = path.join(baseTarget, '.git');
if (fs.existsSync(gitDir)) {
  const prepareArgs =
    packageManager === 'pnpm'
      ? ['run', 'prepare']
      : packageManager === 'yarn'
        ? ['run', 'prepare']
        : ['run', 'prepare'];

  const prepareResult = spawnSync(packageManager, prepareArgs, {
    cwd: baseTarget,
    stdio: 'inherit',
  });

  if (prepareResult.error || prepareResult.status !== 0) {
    process.stderr.write('No se pudo ejecutar prepare para instalar hooks de husky.\n');
    process.exit(1);
  }
} else {
  process.stdout.write(
    'No se detecto .git, se omitio la instalacion de hooks en .git/hooks.\n',
  );
}

process.stdout.write(`Husky y commitlint instalados en ${baseTarget}\n`);
if (!force) {
  process.stdout.write('Tip: usa --force para sobrescribir hooks/config existentes.\n');
}
