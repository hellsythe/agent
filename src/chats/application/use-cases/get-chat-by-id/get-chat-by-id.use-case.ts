import { Inject, Injectable } from '@nestjs/common';
import type { Chat } from '../../../domain/chat.entity';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { GetChatByIdQuery } from './get-chat-by-id.query';

@Injectable()
export class GetChatByIdUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(query: GetChatByIdQuery): Promise<Chat | null> {
    return this.chatRepository.findById(query.id);
  }
}
