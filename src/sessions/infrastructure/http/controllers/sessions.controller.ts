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
import { CreateSessionUseCase } from '../../../application/use-cases/create-session/create-session.use-case';
import { DeleteSessionUseCase } from '../../../application/use-cases/delete-session/delete-session.use-case';
import { GetSessionByIdUseCase } from '../../../application/use-cases/get-session-by-id/get-session-by-id.use-case';
import { GetSessionsUseCase } from '../../../application/use-cases/get-sessions/get-sessions.use-case';
import { UpdateSessionUseCase } from '../../../application/use-cases/update-session/update-session.use-case';
import { SessionPresenter } from '../presenters/session.presenter';
import { CreateSessionDto } from './dto/create-session.dto';
import { FindSessionsQueryDto } from './dto/find-sessions-query.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly getSessionsUseCase: GetSessionsUseCase,
    private readonly getSessionByIdUseCase: GetSessionByIdUseCase,
    private readonly updateSessionUseCase: UpdateSessionUseCase,
    private readonly deleteSessionUseCase: DeleteSessionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiOkResponse({ type: SessionResponseDto })
  async create(@Body() dto: CreateSessionDto): Promise<SessionResponseDto> {
    const session = await this.createSessionUseCase.execute({
      userId: dto.userId,
      alias: dto.alias,
    });

    return SessionPresenter.toResponse(session);
  }

  @Get()
  @ApiOkResponse({ type: SessionResponseDto, isArray: true })
  async findAll(
    @Query() query: FindSessionsQueryDto,
  ): Promise<SessionResponseDto[]> {
    const sessions = await this.getSessionsUseCase.execute(query);
    return sessions.map((session) => SessionPresenter.toResponse(session));
  }

  @Get(':id')
  @ApiOkResponse({ type: SessionResponseDto })
  async findById(@Param('id') id: string): Promise<SessionResponseDto> {
    const session = await this.getSessionByIdUseCase.execute({ id });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return SessionPresenter.toResponse(session);
  }

  @Patch(':id')
  @ApiOkResponse({ type: SessionResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ): Promise<SessionResponseDto> {
    const session = await this.updateSessionUseCase.execute({
      id,
      alias: dto.alias,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return SessionPresenter.toResponse(session);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteSessionUseCase.execute({ id });
  }
}
