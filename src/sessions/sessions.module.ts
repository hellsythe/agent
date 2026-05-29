import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateSessionUseCase } from './application/use-cases/create-session/create-session.use-case';
import { DeleteSessionUseCase } from './application/use-cases/delete-session/delete-session.use-case';
import { GetSessionByIdUseCase } from './application/use-cases/get-session-by-id/get-session-by-id.use-case';
import { GetSessionsUseCase } from './application/use-cases/get-sessions/get-sessions.use-case';
import { UpdateSessionUseCase } from './application/use-cases/update-session/update-session.use-case';
import { SESSION_REPOSITORY } from './domain/session.repository';
import { SessionsController } from './infrastructure/http/controllers/sessions.controller';
import { SessionMongoRepository } from './infrastructure/persistence/mongo/session.mongo.repository';
import {
  SessionSchema,
  SessionSchemaDefinition,
} from './infrastructure/persistence/mongo/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionSchema.name, schema: SessionSchemaDefinition },
    ]),
  ],
  controllers: [SessionsController],
  providers: [
    CreateSessionUseCase,
    GetSessionsUseCase,
    GetSessionByIdUseCase,
    UpdateSessionUseCase,
    DeleteSessionUseCase,
    SessionMongoRepository,
    {
      provide: SESSION_REPOSITORY,
      useExisting: SessionMongoRepository,
    },
  ],
  exports: [SESSION_REPOSITORY],
})
export class SessionsModule {}
