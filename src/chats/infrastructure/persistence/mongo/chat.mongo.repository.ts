import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoCriteriaBuilder } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/mongo-criteria.builder';
import { MongoRepositoryBase } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/mongo.repository.base';
import type { ChatCriteria } from '../../../domain/chat.criteria';
import { Chat } from '../../../domain/chat.entity';
import type { ChatRepository } from '../../../domain/chat.repository';
import { ChatMapper, type ChatPersistence } from '../../mappers/chat.mapper';
import { CHAT_FILTER_MAP } from './chat.filter-map';
import { ChatSchema } from './chat.schema';

@Injectable()
export class ChatMongoRepository
  extends MongoRepositoryBase<ChatSchema, ChatPersistence>
  implements ChatRepository
{
  constructor(@InjectModel(ChatSchema.name) model: Model<ChatSchema>) {
    super(model);
  }

  async save(chat: Chat): Promise<Chat> {
    const raw = ChatMapper.toPersistence(chat);
    const created = await this.insertRaw({
      sessionId: raw.sessionId,
      userId: raw.userId,
      role: raw.role,
      content: raw.content,
      visibility: raw.visibility,
      turnId: raw.turnId,
      deletedAt: raw.deletedAt,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
    });

    return ChatMapper.toDomain(created);
  }

  async saveMany(chats: Chat[]): Promise<Chat[]> {
    const output: Chat[] = [];
    for (const chat of chats) {
      output.push(await this.save(chat));
    }

    return output;
  }

  async findAll(): Promise<Chat[]> {
    const rows = await this.findManyRaw({ deletedAt: null });
    return rows.map((row) => ChatMapper.toDomain(row));
  }

  async findByCriteria(criteria: ChatCriteria): Promise<Chat[]> {
    const filter = MongoCriteriaBuilder.build(criteria, CHAT_FILTER_MAP);
    const rows = await this.findManyRaw({ ...filter, deletedAt: null });
    return rows.map((row) => ChatMapper.toDomain(row));
  }

  async findById(id: string): Promise<Chat | null> {
    const row = await this.findOneRaw({ _id: id, deletedAt: null });
    return row ? ChatMapper.toDomain(row) : null;
  }

  async update(chat: Chat): Promise<Chat | null> {
    const raw = ChatMapper.toPersistence(chat);
    const result = await this.updateByIdRaw(chat.id, {
      content: raw.content,
      visibility: raw.visibility,
      updatedBy: raw.updatedBy,
    });

    if (!result.matchedCount) {
      return null;
    }

    return this.findById(chat.id);
  }

  async delete(id: string, deletedBy?: string | null): Promise<void> {
    await this.softDeleteRaw(id, deletedBy ?? null);
  }
}
