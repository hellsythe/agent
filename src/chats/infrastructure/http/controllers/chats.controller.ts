import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteChatUseCase } from '../../../application/use-cases/delete-chat/delete-chat.use-case';
import { GetChatByIdUseCase } from '../../../application/use-cases/get-chat-by-id/get-chat-by-id.use-case';
import { GetChatsUseCase } from '../../../application/use-cases/get-chats/get-chats.use-case';
import { SendMessageUseCase } from '../../../application/use-cases/send-message/send-message.use-case';
import { UpdateChatUseCase } from '../../../application/use-cases/update-chat/update-chat.use-case';
import { ChatPresenter } from '../presenters/chat.presenter';
import { ChatResponseDto } from './dto/chat-response.dto';
import { FindChatsQueryDto } from './dto/find-chats-query.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessageResponseDto } from './dto/send-message-response.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly getChatsUseCase: GetChatsUseCase,
    private readonly getChatByIdUseCase: GetChatByIdUseCase,
    private readonly updateChatUseCase: UpdateChatUseCase,
    private readonly deleteChatUseCase: DeleteChatUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a message to the LLM and store full turn trace' })
  @ApiOkResponse({ type: SendMessageResponseDto })
  async send(@Body() dto: SendMessageDto): Promise<SendMessageResponseDto> {
    const result = await this.sendMessageUseCase.execute({
      sessionId: dto.sessionId,
      userId: dto.userId,
      message: dto.message,
    });

    return ChatPresenter.toSendMessageResponse(result);
  }

  @Get()
  @ApiOkResponse({ type: ChatResponseDto, isArray: true })
  async findAll(@Query() query: FindChatsQueryDto): Promise<ChatResponseDto[]> {
    const chats = await this.getChatsUseCase.execute(query);
    return chats.map((chat) => ChatPresenter.toResponse(chat));
  }

  @Get(':id')
  @ApiOkResponse({ type: ChatResponseDto })
  async findById(@Param('id') id: string): Promise<ChatResponseDto> {
    const chat = await this.getChatByIdUseCase.execute({ id });
    if (!chat) {
      throw new NotFoundException('Chat message not found');
    }

    return ChatPresenter.toResponse(chat);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ChatResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateChatDto): Promise<ChatResponseDto> {
    const chat = await this.updateChatUseCase.execute({
      id,
      content: dto.content,
      visibility: dto.visibility,
    });

    if (!chat) {
      throw new NotFoundException('Chat message not found');
    }

    return ChatPresenter.toResponse(chat);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteChatUseCase.execute({ id });
  }
}
