import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import {
  GracefulShutdownModule,
  setupGracefulShutdown,
} from 'nestjs-graceful-shutdown';
import { configureHttp } from '@sdkconsultoria/nestjs-base/shared/infrastructure/http/http.bootstrap';
import { setupSwagger } from '@sdkconsultoria/nestjs-base/shared/infrastructure/http/swagger.config';
import { AppModule } from './app.module';

@Module({
  imports: [AppModule, GracefulShutdownModule.forRoot()],
})
class AllModulesModule {}

async function bootstrap() {
  const app = await NestFactory.create(AllModulesModule);
  useContainer(app.select(AllModulesModule), { fallbackOnErrors: true });

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  configureHttp(app);
  setupSwagger(app);
  setupGracefulShutdown({ app });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
