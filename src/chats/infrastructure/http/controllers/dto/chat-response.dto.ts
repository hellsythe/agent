import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sessionId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ['user', 'assistant', 'system', 'tool'] })
  role!: 'user' | 'assistant' | 'system' | 'tool';

  @ApiProperty()
  content!: string;

  @ApiProperty({ enum: ['public', 'internal'] })
  visibility!: 'public' | 'internal';

  @ApiProperty()
  turnId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
