import type { Chat } from '../../../domain/chat.entity';
import type { SendMessageResult } from '../../../application/use-cases/send-message/send-message.result';
import type { ChatResponseDto } from '../controllers/dto/chat-response.dto';
import type { SendMessageResponseDto } from '../controllers/dto/send-message-response.dto';

export class ChatPresenter {
  static toResponse(chat: Chat): ChatResponseDto {
    return {
      id: chat.id,
      sessionId: chat.sessionId,
      userId: chat.userId,
      role: chat.role,
      content: chat.content,
      visibility: chat.visibility,
      turnId: chat.turnId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  static toSendMessageResponse(result: SendMessageResult): SendMessageResponseDto {
    return {
      userMessage: this.toResponse(result.userMessage),
      assistantMessage: this.toResponse(result.assistantMessage),
    };
  }
}
