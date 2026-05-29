import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@sdkconsultoria/nestjs-base/shared/infrastructure/infrastructure.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [InfrastructureModule, SessionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
