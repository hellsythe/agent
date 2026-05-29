import type { ChatRole, ChatVisibility } from '../../../domain/chat.entity';

export interface GetChatsQuery {
  sessionId?: string;
  userId?: string;
  role?: ChatRole;
  visibility?: ChatVisibility;
  turnId?: string;
}
