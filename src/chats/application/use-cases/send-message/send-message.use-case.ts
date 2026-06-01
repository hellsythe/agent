import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Chat } from '../../../domain/chat.entity';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import { Session } from '../../../../sessions/domain/session.entity';
import { SESSION_REPOSITORY } from '../../../../sessions/domain/session.repository';
import type { SessionRepository } from '../../../../sessions/domain/session.repository';
import type { SendMessageCommand } from './send-message.command';
import type { SendMessageResult } from './send-message.result';
import { AgentLoopService } from '../../../../support-agent/application/services/agent-loop.service';
import type { PlaybookId } from '../../../../support-agent/domain/playbook.entity';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    private readonly agentLoopService: AgentLoopService,
  ) {}

  async execute(command: SendMessageCommand): Promise<SendMessageResult> {
    const turnId = randomUUID();
    const now = new Date();
    const sessionId = await this.resolveSessionId(
      command.sessionId,
      command.userId,
    );
    const conversationData = await this.buildConversationData(sessionId);

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

    const loopResult = await this.agentLoopService.execute({
      message: command.message,
      conversationContext: conversationData.context,
      previousState: conversationData.previousState,
    });

    const assistantMessage = new Chat({
      id: '',
      sessionId,
      userId: command.userId,
      role: 'assistant',
      content: loopResult.response,
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
      content: `AGENT playbook=${loopResult.playbookId} confidence=${loopResult.confidence} iterations=${loopResult.iterations} evidence=${JSON.stringify(loopResult.evidence)} finalInputs=${JSON.stringify(loopResult.finalInputs)}`,
      visibility: 'internal',
      turnId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.userId,
      updatedBy: command.userId,
    });

    const stateMessage = new Chat({
      id: '',
      sessionId,
      userId: command.userId,
      role: 'system',
      content: `AGENT_STATE ${JSON.stringify(loopResult.conversationState)}`,
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
      stateMessage,
    ]);

    return {
      userMessage: saved[0],
      assistantMessage: saved[2],
      internalMessages: [saved[1], saved[3], saved[4]],
    };
  }

  private async buildConversationData(sessionId: string): Promise<{
    context: string;
    previousState?: {
      pendingPlaybookId: PlaybookId | 'unknown';
      collectedInputs: Record<string, unknown>;
      lastMissingInputs: string[];
    };
  }> {
    const previousMessages = (await this.chatRepository.findByCriteria({
      sessionId,
      visibility: undefined,
    })) ?? [];

    const previousState = this.extractLatestState(previousMessages);
    const publicMessages = previousMessages.filter(
      (message) => message.visibility === 'public',
    );

    const ordered = [...publicMessages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    const recent = ordered.slice(-6);

    return {
      context: recent
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n'),
      previousState,
    };
  }

  private extractLatestState(messages: Chat[]): {
    pendingPlaybookId: PlaybookId | 'unknown';
    collectedInputs: Record<string, unknown>;
    lastMissingInputs: string[];
  } | undefined {
    const ordered = [...messages].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    for (const message of ordered) {
      if (message.visibility !== 'internal' || !message.content.startsWith('AGENT_STATE ')) {
        continue;
      }

      const rawState = message.content.slice('AGENT_STATE '.length);
      try {
        const parsed = JSON.parse(rawState) as {
          pendingPlaybookId?: string;
          collectedInputs?: Record<string, unknown>;
          lastMissingInputs?: string[];
        };
        if (!parsed.pendingPlaybookId) {
          continue;
        }

        return {
          pendingPlaybookId: parsed.pendingPlaybookId as PlaybookId | 'unknown',
          collectedInputs: parsed.collectedInputs ?? {},
          lastMissingInputs: parsed.lastMissingInputs ?? [],
        };
      } catch {
        continue;
      }
    }
    return undefined;
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
