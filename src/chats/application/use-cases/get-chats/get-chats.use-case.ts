import { Inject, Injectable } from '@nestjs/common';
import type { Chat } from '../../../domain/chat.entity';
import { CHAT_REPOSITORY } from '../../../domain/chat.repository';
import type { ChatRepository } from '../../../domain/chat.repository';
import type { GetChatsQuery } from './get-chats.query';

@Injectable()
export class GetChatsUseCase {
  constructor(
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(query: GetChatsQuery): Promise<Chat[]> {
    return this.chatRepository.findByCriteria(query);
  }
}
