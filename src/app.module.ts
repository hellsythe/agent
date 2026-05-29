import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@sdkconsultoria/nestjs-base/shared/infrastructure/infrastructure.module';
import { ChatsModule } from './chats/chats.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [InfrastructureModule, SessionsModule, ChatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
