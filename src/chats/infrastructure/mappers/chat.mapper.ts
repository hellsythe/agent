import { Chat, ChatPrimitives } from '../../domain/chat.entity';

export interface ChatPersistence {
  _id?: unknown;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  visibility: 'public' | 'internal';
  turnId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export class ChatMapper {
  static toDomain(raw: ChatPersistence): Chat {
    const primitives: ChatPrimitives = {
      id: String(raw._id),
      sessionId: raw.sessionId,
      userId: raw.userId,
      role: raw.role,
      content: raw.content,
      visibility: raw.visibility,
      turnId: raw.turnId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
    };

    return new Chat(primitives);
  }

  static toPersistence(chat: Chat): ChatPersistence {
    const raw = chat.toPrimitives();
    return {
      _id: raw.id,
      sessionId: raw.sessionId,
      userId: raw.userId,
      role: raw.role,
      content: raw.content,
      visibility: raw.visibility,
      turnId: raw.turnId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
    };
  }
}
