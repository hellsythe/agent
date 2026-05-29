import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../../domain/session.entity';
import { SESSION_REPOSITORY } from '../../../domain/session.repository';
import type { SessionRepository } from '../../../domain/session.repository';
import { GetSessionsQuery } from './get-sessions.query';

@Injectable()
export class GetSessionsUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(query: GetSessionsQuery): Promise<Session[]> {
    return this.sessionRepository.findByCriteria(query);
  }
}
