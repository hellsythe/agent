import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { DeleteChatCommand } from './delete-chat.command';

@Injectable()
export class DeleteChatUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(command: DeleteChatCommand): Promise<void> {
    await this.chatRepository.delete(command.id, command.deletedBy ?? null);
  }
}
