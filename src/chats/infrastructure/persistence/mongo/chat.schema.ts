import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { ChatRole, ChatVisibility } from '../../../domain/chat.entity';

@Schema({ collection: 'chats', timestamps: true })
export class ChatSchema {
  @Prop({ required: true, index: true })
  sessionId!: string;

  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, enum: ['user', 'assistant', 'system', 'tool'] })
  role!: ChatRole;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true, enum: ['public', 'internal'], default: 'public' })
  visibility!: ChatVisibility;

  @Prop({ required: true, index: true })
  turnId!: string;

  @Prop({ type: Date, default: null, index: true })
  deletedAt!: Date | null;

  @Prop({ type: String, default: null })
  createdBy!: string | null;

  @Prop({ type: String, default: null })
  updatedBy!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ChatSchemaDefinition = SchemaFactory.createForClass(ChatSchema);

ChatSchemaDefinition.index({ sessionId: 1, createdAt: 1 });
