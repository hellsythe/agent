export type ChatRole = 'user' | 'assistant' | 'system' | 'tool';
export type ChatVisibility = 'public' | 'internal';

export interface ChatAuditFields {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ChatPrimitives extends ChatAuditFields {
  id: string;
  sessionId: string;
  userId: string;
  role: ChatRole;
  content: string;
  visibility: ChatVisibility;
  turnId: string;
}

export class Chat {
  constructor(private readonly attributes: ChatPrimitives) {}

  get id(): string {
    return this.attributes.id;
  }

  get sessionId(): string {
    return this.attributes.sessionId;
  }

  get userId(): string {
    return this.attributes.userId;
  }

  get role(): ChatRole {
    return this.attributes.role;
  }

  get content(): string {
    return this.attributes.content;
  }

  get visibility(): ChatVisibility {
    return this.attributes.visibility;
  }

  get turnId(): string {
    return this.attributes.turnId;
  }

  get createdAt(): Date {
    return this.attributes.createdAt;
  }

  get updatedAt(): Date {
    return this.attributes.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.attributes.deletedAt;
  }

  get createdBy(): string | null {
    return this.attributes.createdBy;
  }

  get updatedBy(): string | null {
    return this.attributes.updatedBy;
  }

  toPrimitives(): ChatPrimitives {
    return { ...this.attributes };
  }
}
