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

const filesToDelete = [
  path.join(baseTarget, 'src', 'app.controller.ts'),
  path.join(baseTarget, 'src', 'app.controller.spec.ts'),
  path.join(baseTarget, 'src', 'app.service.ts'),
  path.join(baseTarget, 'test', 'app.e2e-spec.ts'),
];

for (const filePath of filesToDelete) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const appModulePath = path.join(baseTarget, 'src', 'app.module.ts');
const mainPath = path.join(baseTarget, 'src', 'main.ts');

if (fs.existsSync(appModulePath)) {
  fs.writeFileSync(
    appModulePath,
    "import { Module } from '@nestjs/common';\nimport { InfrastructureModule } from '@sdkconsultoria/nestjs-base/shared/infrastructure/infrastructure.module';\n\n@Module({\n  imports: [InfrastructureModule],\n  controllers: [],\n  providers: [],\n})\nexport class AppModule {}\n",
  );
}

if (fs.existsSync(mainPath)) {
  fs.writeFileSync(
    mainPath,
    "import { Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { useContainer } from 'class-validator';\nimport { GracefulShutdownModule, setupGracefulShutdown } from 'nestjs-graceful-shutdown';\nimport { configureHttp } from '@sdkconsultoria/nestjs-base/shared/infrastructure/http/http.bootstrap';\nimport { setupSwagger } from '@sdkconsultoria/nestjs-base/shared/infrastructure/http/swagger.config';\nimport { AppModule } from './app.module';\n\n@Module({\n  imports: [AppModule, GracefulShutdownModule.forRoot()],\n})\nclass AllModulesModule {}\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AllModulesModule);\n  useContainer(app.select(AllModulesModule), { fallbackOnErrors: true });\n\n  app.getHttpAdapter().getInstance().disable('x-powered-by');\n  configureHttp(app);\n  setupSwagger(app);\n  setupGracefulShutdown({ app });\n\n  await app.listen(process.env.PORT ?? 3000);\n}\n\nbootstrap();\n",
  );
}

process.stdout.write(`Nest demo cleanup aplicado en ${baseTarget}\n`);
