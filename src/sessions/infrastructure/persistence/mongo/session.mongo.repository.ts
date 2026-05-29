import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoCriteriaBuilder } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/mongo-criteria.builder';
import { MongoRepositoryBase } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/mongo.repository.base';
import { SessionRepository } from '../../../domain/session.repository';
import { Session } from '../../../domain/session.entity';
import { SessionCriteria } from '../../../domain/session.criteria';
import {
  SessionMapper,
  SessionPersistence,
} from '../../mappers/session.mapper';
import { SessionSchema } from './session.schema';
import { SESSION_FILTER_MAP } from './session.filter-map';

@Injectable()
export class SessionMongoRepository
  extends MongoRepositoryBase<SessionSchema, SessionPersistence>
  implements SessionRepository
{
  constructor(@InjectModel(SessionSchema.name) model: Model<SessionSchema>) {
    super(model);
  }

  async save(session: Session): Promise<Session> {
    const raw = SessionMapper.toPersistence(session);
    const created = await this.insertRaw({
      userId: raw.userId,
      alias: raw.alias,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
      deletedAt: raw.deletedAt,
    });

    return SessionMapper.toDomain(created);
  }

  async findAll(): Promise<Session[]> {
    const rows = await this.findManyRaw({ deletedAt: null });
    return rows.map((row) => SessionMapper.toDomain(row));
  }

  async findByCriteria(criteria: SessionCriteria): Promise<Session[]> {
    const filter = MongoCriteriaBuilder.build(criteria, SESSION_FILTER_MAP);
    const rows = await this.findManyRaw({ ...filter, deletedAt: null });
    return rows.map((row) => SessionMapper.toDomain(row));
  }

  async findById(id: string): Promise<Session | null> {
    const row = await this.findOneRaw({ _id: id, deletedAt: null });
    return row ? SessionMapper.toDomain(row) : null;
  }

  async update(session: Session): Promise<Session | null> {
    const raw = SessionMapper.toPersistence(session);
    const result = await this.updateByIdRaw(session.id, {
      userId: raw.userId,
      alias: raw.alias,
      updatedBy: raw.updatedBy,
    });

    if (!result.matchedCount) {
      return null;
    }

    return this.findById(session.id);
  }

  async delete(id: string, deletedBy?: string | null): Promise<void> {
    await this.softDeleteRaw(id, deletedBy ?? null);
  }
}
