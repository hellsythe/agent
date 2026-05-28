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

const sourceSkillsDir = path.resolve(__dirname, '..', 'stubs', 'skills');
const destinationSkillsDir = path.join(baseTarget, '.opencode', 'skills');
const sourceCommandsDir = path.resolve(__dirname, '..', 'stubs', 'commands');
const destinationCommandsDir = path.join(baseTarget, '.opencode', 'commands');
const sourceConfig = path.resolve(__dirname, '..', 'stubs', 'opencode.jsonc');
const destinationConfig = path.join(baseTarget, 'opencode.jsonc');
const sourceAgents = path.resolve(__dirname, '..', 'stubs', 'AGENTS.md');
const destinationAgents = path.join(baseTarget, 'AGENTS.md');

if (!fs.existsSync(sourceSkillsDir)) {
  process.stderr.write('No se encontro la carpeta skills en el paquete.\n');
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

copyDirectory(sourceSkillsDir, destinationSkillsDir);

if (fs.existsSync(sourceCommandsDir)) {
  copyDirectory(sourceCommandsDir, destinationCommandsDir);
}

if (fs.existsSync(sourceConfig) && (force || !fs.existsSync(destinationConfig))) {
  fs.copyFileSync(sourceConfig, destinationConfig);
}

if (fs.existsSync(sourceAgents) && (force || !fs.existsSync(destinationAgents))) {
  fs.copyFileSync(sourceAgents, destinationAgents);
}

process.stdout.write(`Skills instaladas en ${destinationSkillsDir}\n`);
process.stdout.write(`Comandos instalados en ${destinationCommandsDir}\n`);
process.stdout.write(`Configuracion en ${destinationConfig}\n`);
process.stdout.write(`AGENTS en ${destinationAgents}\n`);
if (!force) {
  process.stdout.write('Tip: usa --force para sobrescribir archivos existentes.\n');
}
