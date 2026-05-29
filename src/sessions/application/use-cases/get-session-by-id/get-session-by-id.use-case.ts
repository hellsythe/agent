import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../../domain/session.entity';
import { SESSION_REPOSITORY } from '../../../domain/session.repository';
import type { SessionRepository } from '../../../domain/session.repository';
import { GetSessionByIdQuery } from './get-session-by-id.query';

@Injectable()
export class GetSessionByIdUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(query: GetSessionByIdQuery): Promise<Session | null> {
    return this.sessionRepository.findById(query.id);
  }
}
