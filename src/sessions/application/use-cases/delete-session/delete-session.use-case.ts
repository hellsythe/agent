import { Inject, Injectable } from '@nestjs/common';
import { SESSION_REPOSITORY } from '../../../domain/session.repository';
import type { SessionRepository } from '../../../domain/session.repository';
import { DeleteSessionCommand } from './delete-session.command';

@Injectable()
export class DeleteSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: DeleteSessionCommand): Promise<void> {
    await this.sessionRepository.delete(command.id, command.deletedBy);
  }
}
