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

const sourceDevcontainerDir = path.resolve(__dirname, '..', 'stubs', 'devcontainer');
const destinationDevcontainerDir = path.join(baseTarget, '.devcontainer');
const sourceDockerCompose = path.resolve(__dirname, '..', 'stubs', 'docker-compose.yml');
const destinationDockerCompose = path.join(baseTarget, 'docker-compose.yml');

if (!fs.existsSync(sourceDevcontainerDir)) {
  process.stderr.write('No se encontro stubs/devcontainer en el paquete.\n');
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

copyDirectory(sourceDevcontainerDir, destinationDevcontainerDir);

if (fs.existsSync(sourceDockerCompose) && (force || !fs.existsSync(destinationDockerCompose))) {
  fs.copyFileSync(sourceDockerCompose, destinationDockerCompose);
}

process.stdout.write(`Devcontainer instalado en ${destinationDevcontainerDir}\n`);
process.stdout.write(`Docker compose en ${destinationDockerCompose}\n`);
if (!force) {
  process.stdout.write('Tip: usa --force para sobrescribir archivos existentes.\n');
}
