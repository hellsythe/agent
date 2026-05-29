import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../../domain/session.entity';
import { SESSION_REPOSITORY } from '../../../domain/session.repository';
import type { SessionRepository } from '../../../domain/session.repository';
import { CreateSessionCommand } from './create-session.command';

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: CreateSessionCommand): Promise<Session> {
    const now = new Date();
    const session = new Session({
      id: '',
      userId: command.userId,
      alias: command.alias?.trim() || 'new session',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: command.createdBy ?? command.userId,
      updatedBy: command.createdBy ?? command.userId,
    });

    return this.sessionRepository.save(session);
  }
}
