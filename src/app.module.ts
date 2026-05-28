import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@sdkconsultoria/nestjs-base/shared/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
