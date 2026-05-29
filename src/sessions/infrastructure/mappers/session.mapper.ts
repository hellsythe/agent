import { Session, SessionPrimitives } from '../../domain/session.entity';

export interface SessionPersistence {
  _id?: unknown;
  userId: string;
  alias: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export class SessionMapper {
  static toDomain(raw: SessionPersistence): Session {
    const primitives: SessionPrimitives = {
      id: String(raw._id),
      userId: raw.userId,
      alias: raw.alias,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
    };

    return new Session(primitives);
  }

  static toPersistence(session: Session): SessionPersistence {
    const raw = session.toPrimitives();

    return {
      _id: raw.id,
      userId: raw.userId,
      alias: raw.alias,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
    };
  }
}
