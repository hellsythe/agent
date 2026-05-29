import { ApiProperty } from '@nestjs/swagger';
import { ChatResponseDto } from './chat-response.dto';

export class SendMessageResponseDto {
  @ApiProperty({ type: ChatResponseDto })
  userMessage!: ChatResponseDto;

  @ApiProperty({ type: ChatResponseDto })
  assistantMessage!: ChatResponseDto;
}
