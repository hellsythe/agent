import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'sessions',
  timestamps: true,
})
export class SessionSchema {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, default: 'new session' })
  alias!: string;

  @Prop({ type: Date, default: null, index: true })
  deletedAt!: Date | null;

  @Prop({ type: String, default: null })
  createdBy!: string | null;

  @Prop({ type: String, default: null })
  updatedBy!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SessionSchemaDefinition =
  SchemaFactory.createForClass(SessionSchema);

SessionSchemaDefinition.index({ userId: 1, deletedAt: 1 });
