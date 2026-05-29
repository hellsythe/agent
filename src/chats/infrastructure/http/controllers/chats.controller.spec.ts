import { Test } from '@nestjs/testing';
import { ChatsController } from './chats.controller';
import { DeleteChatUseCase } from '../../../application/use-cases/delete-chat/delete-chat.use-case';
import { GetChatByIdUseCase } from '../../../application/use-cases/get-chat-by-id/get-chat-by-id.use-case';
import { GetChatsUseCase } from '../../../application/use-cases/get-chats/get-chats.use-case';
import { SendMessageUseCase } from '../../../application/use-cases/send-message/send-message.use-case';
import { UpdateChatUseCase } from '../../../application/use-cases/update-chat/update-chat.use-case';
import { Chat } from '../../../domain/chat.entity';

const buildChat = (role: 'user' | 'assistant' | 'system' | 'tool', visibility: 'public' | 'internal') =>
  new Chat({
    id: 'chat-1',
    sessionId: 'session-1',
    userId: 'user-1',
    role,
    content: 'hello',
    visibility,
    turnId: 'turn-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdBy: 'user-1',
    updatedBy: 'user-1',
  });

describe('ChatsController', () => {
  it('sends a message and returns user and assistant messages', async () => {
    const sendMessageUseCase = {
      execute: jest.fn().mockResolvedValue({
        userMessage: buildChat('user', 'public'),
        assistantMessage: buildChat('assistant', 'public'),
        internalMessages: [buildChat('system', 'internal')],
      }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [
        { provide: DeleteChatUseCase, useValue: { execute: jest.fn() } },
        { provide: GetChatByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: GetChatsUseCase, useValue: { execute: jest.fn() } },
        { provide: SendMessageUseCase, useValue: sendMessageUseCase },
        { provide: UpdateChatUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    const controller = moduleRef.get(ChatsController);
    const result = await controller.send({
      sessionId: 'session-1',
      userId: 'user-1',
      message: 'hello',
    });

    expect(result.userMessage.role).toBe('user');
    expect(result.assistantMessage.role).toBe('assistant');
  });
});
