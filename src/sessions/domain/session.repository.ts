import { Session } from './session.entity';
import { SessionCriteria } from './session.criteria';

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');

export interface SessionRepository {
  save(session: Session): Promise<Session>;
  findAll(): Promise<Session[]>;
  findByCriteria(criteria: SessionCriteria): Promise<Session[]>;
  findById(id: string): Promise<Session | null>;
  update(session: Session): Promise<Session | null>;
  delete(id: string, deletedBy?: string | null): Promise<void>;
}
