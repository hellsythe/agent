#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const targetFlagIndex = args.indexOf('--target');

const baseTarget =
  targetFlagIndex >= 0 && args[targetFlagIndex + 1]
    ? path.resolve(args[targetFlagIndex + 1])
    : process.cwd();

const sharedPath = path.join(baseTarget, 'src', 'shared');

if (fs.existsSync(sharedPath)) {
  fs.rmSync(sharedPath, { recursive: true, force: true });
  process.stdout.write(`Shared eliminado en ${sharedPath}\n`);
} else {
  process.stdout.write(`Shared no existe en ${sharedPath}\n`);
}
