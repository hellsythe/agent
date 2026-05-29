import type { ChatCriteria } from './chat.criteria';
import type { Chat } from './chat.entity';

export const CHAT_REPOSITORY = Symbol('CHAT_REPOSITORY');

export interface ChatRepository {
  save(chat: Chat): Promise<Chat>;
  saveMany(chats: Chat[]): Promise<Chat[]>;
  findAll(): Promise<Chat[]>;
  findByCriteria(criteria: ChatCriteria): Promise<Chat[]>;
  findById(id: string): Promise<Chat | null>;
  update(chat: Chat): Promise<Chat | null>;
  delete(id: string, deletedBy?: string | null): Promise<void>;
}
