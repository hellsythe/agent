import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../../domain/session.entity';
import { SESSION_REPOSITORY } from '../../../domain/session.repository';
import type { SessionRepository } from '../../../domain/session.repository';
import { UpdateSessionCommand } from './update-session.command';

@Injectable()
export class UpdateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: UpdateSessionCommand) {
    const existing = await this.sessionRepository.findById(command.id);

    if (!existing) {
      return null;
    }

    const updated = existing.toPrimitives();
    const next = {
      ...updated,
      alias: command.alias?.trim() || updated.alias,
      updatedAt: new Date(),
      updatedBy: command.updatedBy ?? updated.updatedBy,
    };

    return this.sessionRepository.update(new Session(next));
  }
}
