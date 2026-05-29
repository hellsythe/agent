import type { ChatVisibility } from '../../../domain/chat.entity';

export interface UpdateChatCommand {
  id: string;
  content?: string;
  visibility?: ChatVisibility;
  updatedBy?: string;
}
