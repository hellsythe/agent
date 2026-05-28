#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const targetFlagIndex = args.indexOf('--target');
const force = args.includes('--force');

const baseTarget =
  targetFlagIndex >= 0 && args[targetFlagIndex + 1]
    ? path.resolve(args[targetFlagIndex + 1])
    : process.cwd();

const sourceDir = path.resolve(
  __dirname,
  '..',
  'stubs',
  'test',
  'testcontainers',
);
const destinationDir = path.join(baseTarget, 'test', 'testcontainers');
const jestE2EPath = path.join(baseTarget, 'test', 'jest-e2e.json');

if (!fs.existsSync(sourceDir)) {
  process.stderr.write('No se encontraron stubs de testcontainers en el paquete.\n');
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

function ensureJestSetupFileEntry() {
  fs.mkdirSync(path.dirname(jestE2EPath), { recursive: true });

  let config;
  if (!fs.existsSync(jestE2EPath)) {
    config = {
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testEnvironment: 'node',
      testRegex: '\\.e2e-spec\\.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
    };
  } else {
    try {
      config = JSON.parse(fs.readFileSync(jestE2EPath, 'utf8'));
    } catch (error) {
      process.stderr.write(
        `No se pudo leer test/jest-e2e.json: ${error.message}\n`,
      );
      process.exit(1);
    }
  }

  const setupPath = '<rootDir>/testcontainers/jest.setup.ts';
  const setupFilesAfterEnv = Array.isArray(config.setupFilesAfterEnv)
    ? config.setupFilesAfterEnv
    : [];

  if (!setupFilesAfterEnv.includes(setupPath)) {
    setupFilesAfterEnv.push(setupPath);
  }

  config.setupFilesAfterEnv = setupFilesAfterEnv;
  fs.writeFileSync(jestE2EPath, `${JSON.stringify(config, null, 2)}\n`);
}

copyDirectory(sourceDir, destinationDir);
ensureJestSetupFileEntry();

process.stdout.write(`Testcontainers test setup instalado en ${destinationDir}\n`);
process.stdout.write(`Configuracion e2e actualizada en ${jestE2EPath}\n`);
if (!force) {
  process.stdout.write('Tip: usa --force para sobrescribir archivos existentes.\n');
}
