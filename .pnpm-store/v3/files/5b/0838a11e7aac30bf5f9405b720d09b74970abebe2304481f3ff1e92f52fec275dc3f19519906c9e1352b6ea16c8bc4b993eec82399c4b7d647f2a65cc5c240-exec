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

const sourceEnvExample = path.resolve(__dirname, '..', 'stubs', '.env.example');
const destinationEnvExample = path.join(baseTarget, '.env.example');
const destinationEnv = path.join(baseTarget, '.env');

if (!fs.existsSync(sourceEnvExample)) {
  process.stderr.write('No se encontro stubs/.env.example en el paquete.\n');
  process.exit(1);
}

if (force || !fs.existsSync(destinationEnvExample)) {
  fs.copyFileSync(sourceEnvExample, destinationEnvExample);
}

if (force || !fs.existsSync(destinationEnv)) {
  fs.copyFileSync(sourceEnvExample, destinationEnv);
}

process.stdout.write(`Env example instalado en ${destinationEnvExample}\n`);
process.stdout.write(`Env instalado en ${destinationEnv}\n`);
if (!force) {
  process.stdout.write('Tip: usa --force para sobrescribir archivos existentes.\n');
}
