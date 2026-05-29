import { Test } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { CreateSessionUseCase } from '../../../application/use-cases/create-session/create-session.use-case';
import { GetSessionsUseCase } from '../../../application/use-cases/get-sessions/get-sessions.use-case';
import { GetSessionByIdUseCase } from '../../../application/use-cases/get-session-by-id/get-session-by-id.use-case';
import { UpdateSessionUseCase } from '../../../application/use-cases/update-session/update-session.use-case';
import { DeleteSessionUseCase } from '../../../application/use-cases/delete-session/delete-session.use-case';
import { Session } from '../../../domain/session.entity';

const buildSession = () =>
  new Session({
    id: 'session-1',
    userId: 'user-1',
    alias: 'new session',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdBy: 'user-1',
    updatedBy: 'user-1',
  });

describe('SessionsController', () => {
  it('creates a session', async () => {
    const createSessionUseCase = { execute: jest.fn().mockResolvedValue(buildSession()) };

    const moduleRef = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        { provide: CreateSessionUseCase, useValue: createSessionUseCase },
        { provide: GetSessionsUseCase, useValue: { execute: jest.fn() } },
        { provide: GetSessionByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateSessionUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteSessionUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    const controller = moduleRef.get(SessionsController);
    const result = await controller.create({ userId: 'user-1' });

    expect(result.userId).toBe('user-1');
    expect(result.alias).toBe('new session');
  });
});
