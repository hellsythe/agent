import { SendMessageUseCase } from './send-message.use-case';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { Chat } from '../../../domain/chat.entity';
import { Session } from '../../../../sessions/domain/session.entity';
import type { SessionRepository } from '../../../../sessions/domain/session.repository';
import type { AgentLoopService } from '../../../../support-agent/application/services/agent-loop.service';

describe('SendMessageUseCase', () => {
  it('stores user, assistant and internal messages', async () => {
    const agentLoopService = {
      execute: jest.fn().mockResolvedValue({
        response: 'diagnosis response',
        playbookId: 'carousel_template_failed',
        confidence: 0.88,
        evidence: ['clients.findByName: ok'],
        finalInputs: { clientId: 'client-1' },
        iterations: 2,
      }),
    } as unknown as AgentLoopService;

    const chatRepository: ChatRepository = {
      save: jest.fn(),
      saveMany: jest.fn(async (chats: Chat[]) => chats),
      findAll: jest.fn(),
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sessionRepository: SessionRepository = {
      save: jest.fn(
        async (session: Session) =>
          new Session({ ...session.toPrimitives(), id: 'session-1' }),
      ),
      findAll: jest.fn(),
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new SendMessageUseCase(
      chatRepository,
      sessionRepository,
      agentLoopService,
    );
    const result = await useCase.execute({
      sessionId: 'session-1',
      userId: 'user-1',
      message: 'hi',
    });

    expect(result.userMessage.role).toBe('user');
    expect(result.assistantMessage.role).toBe('assistant');
    expect(result.internalMessages).toHaveLength(3);
    expect(chatRepository.saveMany).toHaveBeenCalledTimes(1);
  });

  it('creates a new session when sessionId is missing', async () => {
    const agentLoopService = {
      execute: jest.fn().mockResolvedValue({
        response: 'diagnosis response',
        playbookId: 'carousel_template_failed',
        confidence: 0.88,
        evidence: ['clients.findByName: ok'],
        finalInputs: { clientId: 'client-1' },
        iterations: 2,
      }),
    } as unknown as AgentLoopService;

    const chatRepository: ChatRepository = {
      save: jest.fn(),
      saveMany: jest.fn(async (chats: Chat[]) => chats),
      findAll: jest.fn(),
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const sessionRepository: SessionRepository = {
      save: jest.fn(
        async (session: Session) =>
          new Session({
            ...session.toPrimitives(),
            id: 'generated-session-id',
          }),
      ),
      findAll: jest.fn(),
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new SendMessageUseCase(
      chatRepository,
      sessionRepository,
      agentLoopService,
    );
    const result = await useCase.execute({ userId: 'user-1', message: 'hi' });

    expect(sessionRepository.save).toHaveBeenCalledTimes(1);
    expect(result.userMessage.sessionId).toBe('generated-session-id');
    expect(result.assistantMessage.sessionId).toBe('generated-session-id');
  });
});
