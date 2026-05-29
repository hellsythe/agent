import type { ChatRole, ChatVisibility } from '../../../domain/chat.entity';

export interface CreateChatCommand {
  sessionId: string;
  userId: string;
  role: ChatRole;
  content: string;
  visibility?: ChatVisibility;
  turnId: string;
}
