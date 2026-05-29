import type { ChatRole, ChatVisibility } from './chat.entity';

export interface ChatCriteria {
  sessionId?: string;
  userId?: string;
  role?: ChatRole;
  visibility?: ChatVisibility;
  turnId?: string;
}
