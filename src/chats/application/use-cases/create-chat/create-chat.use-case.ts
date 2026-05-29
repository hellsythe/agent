import { Inject, Injectable } from '@nestjs/common';
import { Chat } from '../../../domain/chat.entity';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { CreateChatCommand } from './create-chat.command';

@Injectable()
export class CreateChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(command: CreateChatCommand): Promise<Chat> {
    const now = new Date();
    const chat = new Chat({
      id: '',
      sessionId: command.sessionId,
      userId: command.userId,
      role: command.role,
      content: command.content,
      visibility: command.visibility ?? 'public',
      turnId: command.turnId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.userId,
      updatedBy: command.userId,
    });

    return this.chatRepository.save(chat);
  }
}
