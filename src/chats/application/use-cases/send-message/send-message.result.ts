import type { Chat } from '../../../domain/chat.entity';

export interface SendMessageResult {
  userMessage: Chat;
  assistantMessage: Chat;
  internalMessages: Chat[];
}
