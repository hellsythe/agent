#!/usr/bin/env node

'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const targetFlagIndex = args.indexOf('--target');
const pmFlagIndex = args.indexOf('--pm');

const baseTarget =
  targetFlagIndex >= 0 && args[targetFlagIndex + 1]
    ? path.resolve(args[targetFlagIndex + 1])
    : process.cwd();

const packageManager =
  pmFlagIndex >= 0 && args[pmFlagIndex + 1] ? args[pmFlagIndex + 1] : 'npm';

const MONGOOSE_VERSION = '7.8.7';
const MONGODB_DRIVER_VERSION = '5.9.2';

const dependencies = [
  '@nestjs/axios',
  '@nestjs/config',
  '@nestjs/mongoose',
  '@nestjs/swagger',
  '@nestjs/terminus',
  'class-transformer',
  'class-validator',
  `mongoose@${MONGOOSE_VERSION}`,
  `mongodb@${MONGODB_DRIVER_VERSION}`,
  'nestjs-graceful-shutdown',
  'nestjs-pino',
  'newrelic',
  'pino',
  'pino-http',
  'pino-pretty',
  'testcontainers',
  'unleash-client',
];

const packageJsonPath = path.join(baseTarget, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  process.stderr.write(`No se encontro package.json en ${baseTarget}\n`);
  process.exit(1);
}

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies.mongoose = MONGOOSE_VERSION;
  packageJson.dependencies.mongodb = MONGODB_DRIVER_VERSION;

  packageJson.overrides = {
    ...(packageJson.overrides || {}),
    mongoose: MONGOOSE_VERSION,
    mongodb: MONGODB_DRIVER_VERSION,
  };

  packageJson.pnpm = packageJson.pnpm || {};
  packageJson.pnpm.overrides = {
    ...(packageJson.pnpm.overrides || {}),
    mongoose: MONGOOSE_VERSION,
    mongodb: MONGODB_DRIVER_VERSION,
  };

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`No se pudo actualizar package.json: ${error.message}\n`);
  process.exit(1);
}

const installArgs =
  packageManager === 'pnpm'
    ? ['add', ...dependencies]
    : packageManager === 'yarn'
      ? ['add', ...dependencies]
      : ['install', ...dependencies];

const result = spawnSync(packageManager, installArgs, {
  cwd: baseTarget,
  stdio: 'inherit',
});

if (result.error) {
  process.stderr.write(`Error ejecutando ${packageManager}: ${result.error.message}\n`);
  process.exit(1);
}

if (typeof result.status === 'number' && result.status !== 0) {
  process.exit(result.status);
}

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies.mongoose = MONGOOSE_VERSION;
  packageJson.dependencies.mongodb = MONGODB_DRIVER_VERSION;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
} catch (error) {
  process.stderr.write(
    `No se pudo fijar mongoose/mongodb exactos en package.json: ${error.message}\n`,
  );
  process.exit(1);
}

process.stdout.write(`Observabilidad instalada en ${baseTarget}\n`);
process.stdout.write(
  `Mongo fijado a mongoose@${MONGOOSE_VERSION} y mongodb@${MONGODB_DRIVER_VERSION}\n`,
);
