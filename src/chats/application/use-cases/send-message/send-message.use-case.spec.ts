import { SendMessageUseCase } from './send-message.use-case';
import type { LlmPort } from '../../ports/llm.port';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { Chat } from '../../../domain/chat.entity';

describe('SendMessageUseCase', () => {
  it('stores user, assistant and internal messages', async () => {
    const llmPort: LlmPort = {
      generateText: jest.fn().mockResolvedValue({
        content: 'hello from llm',
        model: 'gpt-4o-mini',
        promptTokens: 5,
        completionTokens: 4,
      }),
    };

    const chatRepository: ChatRepository = {
      save: jest.fn(),
      saveMany: jest.fn(async (chats: Chat[]) => chats),
      findAll: jest.fn(),
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new SendMessageUseCase(chatRepository, llmPort);
    const result = await useCase.execute({
      sessionId: 'session-1',
      userId: 'user-1',
      message: 'hi',
    });

    expect(result.userMessage.role).toBe('user');
    expect(result.assistantMessage.role).toBe('assistant');
    expect(result.internalMessages).toHaveLength(2);
    expect(chatRepository.saveMany).toHaveBeenCalledTimes(1);
  });
});
