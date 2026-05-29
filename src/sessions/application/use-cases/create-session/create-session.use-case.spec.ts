import { CreateSessionUseCase } from './create-session.use-case';
import { SessionRepository } from '../../../domain/session.repository';
import { Session } from '../../../domain/session.entity';

describe('CreateSessionUseCase', () => {
  it('creates a session with default alias when alias is missing', async () => {
    const repository: SessionRepository = {
      save: jest.fn(async (session: Session) => session),
      findAll: jest.fn(),
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new CreateSessionUseCase(repository);
    const result = await useCase.execute({ userId: 'user-1' });

    expect(result.userId).toBe('user-1');
    expect(result.alias).toBe('new session');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
