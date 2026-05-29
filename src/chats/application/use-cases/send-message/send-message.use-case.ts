import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { LLM_PORT } from '../../ports/llm.port';
import type { LlmPort } from '../../ports/llm.port';
import { Chat } from '../../../domain/chat.entity';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import { Session } from '../../../../sessions/domain/session.entity';
import { SESSION_REPOSITORY } from '../../../../sessions/domain/session.repository';
import type { SessionRepository } from '../../../../sessions/domain/session.repository';
import type { SendMessageCommand } from './send-message.command';
import type { SendMessageResult } from './send-message.result';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(LLM_PORT)
    private readonly llmPort: LlmPort,
  ) {}

  async execute(command: SendMessageCommand): Promise<SendMessageResult> {
    const turnId = randomUUID();
    const now = new Date();
    const sessionId = await this.resolveSessionId(command.sessionId, command.userId);

    const userMessage = new Chat({
      id: '',
      sessionId,
      userId: command.userId,
      role: 'user',
      content: command.message,
      visibility: 'public',
      turnId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.userId,
      updatedBy: command.userId,
    });

    const systemPromptMessage = new Chat({
      id: '',
      sessionId,
      userId: command.userId,
      role: 'system',
      content: 'System prompt used for this turn',
      visibility: 'internal',
      turnId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.userId,
      updatedBy: command.userId,
    });

    const llmResponse = await this.llmPort.generateText({
      messages: [
        { role: 'system', content: 'You are a concise and helpful assistant.' },
        { role: 'user', content: command.message },
      ],
    });

    const assistantMessage = new Chat({
      id: '',
      sessionId,
      userId: command.userId,
      role: 'assistant',
      content: llmResponse.content,
      visibility: 'public',
      turnId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.userId,
      updatedBy: command.userId,
    });

    const llmTraceMessage = new Chat({
      id: '',
      sessionId,
      userId: command.userId,
      role: 'system',
      content: `LLM model=${llmResponse.model} promptTokens=${llmResponse.promptTokens ?? 0} completionTokens=${llmResponse.completionTokens ?? 0}`,
      visibility: 'internal',
      turnId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.userId,
      updatedBy: command.userId,
    });

    const saved = await this.chatRepository.saveMany([
      userMessage,
      systemPromptMessage,
      assistantMessage,
      llmTraceMessage,
    ]);

    return {
      userMessage: saved[0],
      assistantMessage: saved[2],
      internalMessages: [saved[1], saved[3]],
    };
  }

  private async resolveSessionId(
    sessionId: string | undefined,
    userId: string,
  ): Promise<string> {
    if (sessionId) {
      return sessionId;
    }

    const now = new Date();
    const session = new Session({
      id: '',
      userId,
      alias: 'new session',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: userId,
      updatedBy: userId,
    });

    const createdSession = await this.sessionRepository.save(session);
    return createdSession.id;
  }
}
