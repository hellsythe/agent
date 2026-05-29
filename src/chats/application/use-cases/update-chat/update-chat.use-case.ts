import { Inject, Injectable } from '@nestjs/common';
import { Chat } from '../../../domain/chat.entity';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { UpdateChatCommand } from './update-chat.command';

@Injectable()
export class UpdateChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(command: UpdateChatCommand): Promise<Chat | null> {
    const existing = await this.chatRepository.findById(command.id);
    if (!existing) {
      return null;
    }

    const current = existing.toPrimitives();
    const updated = new Chat({
      ...current,
      content: command.content ?? current.content,
      visibility: command.visibility ?? current.visibility,
      updatedBy: command.updatedBy ?? current.updatedBy,
      updatedAt: new Date(),
    });

    return this.chatRepository.update(updated);
  }
}
