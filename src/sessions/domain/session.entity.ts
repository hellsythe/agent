export interface SessionAuditFields {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface SessionPrimitives extends SessionAuditFields {
  id: string;
  userId: string;
  alias: string;
}

export class Session {
  constructor(private readonly attributes: SessionPrimitives) {}

  get id(): string {
    return this.attributes.id;
  }

  get userId(): string {
    return this.attributes.userId;
  }

  get alias(): string {
    return this.attributes.alias;
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

  toPrimitives(): SessionPrimitives {
    return { ...this.attributes };
  }
}
