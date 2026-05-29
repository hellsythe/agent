import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from '../sessions/sessions.module';
import { LLM_PORT } from './application/ports/llm.port';
import { CreateChatUseCase } from './application/use-cases/create-chat/create-chat.use-case';
import { DeleteChatUseCase } from './application/use-cases/delete-chat/delete-chat.use-case';
import { GetChatByIdUseCase } from './application/use-cases/get-chat-by-id/get-chat-by-id.use-case';
import { GetChatsUseCase } from './application/use-cases/get-chats/get-chats.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message/send-message.use-case';
import { UpdateChatUseCase } from './application/use-cases/update-chat/update-chat.use-case';
import { CHAT_REPOSITORY } from './domain/chat.repository';
import { OpenAiHttpAdapter } from './infrastructure/http/adapters/llm/openai-http.adapter';
import { ChatsController } from './infrastructure/http/controllers/chats.controller';
import { ChatMongoRepository } from './infrastructure/persistence/mongo/chat.mongo.repository';
import {
  ChatSchema,
  ChatSchemaDefinition,
} from './infrastructure/persistence/mongo/chat.schema';

@Module({
  imports: [
    ConfigModule,
    SessionsModule,
    MongooseModule.forFeature([
      { name: ChatSchema.name, schema: ChatSchemaDefinition },
    ]),
  ],
  controllers: [ChatsController],
  providers: [
    CreateChatUseCase,
    GetChatsUseCase,
    GetChatByIdUseCase,
    UpdateChatUseCase,
    DeleteChatUseCase,
    SendMessageUseCase,
    ChatMongoRepository,
    OpenAiHttpAdapter,
    { provide: CHAT_REPOSITORY, useExisting: ChatMongoRepository },
    { provide: LLM_PORT, useExisting: OpenAiHttpAdapter },
  ],
  exports: [CHAT_REPOSITORY, LLM_PORT],
})
export class ChatsModule {}
