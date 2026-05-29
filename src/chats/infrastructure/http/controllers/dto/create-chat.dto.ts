import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  sessionId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  userId!: string;

  @ApiProperty({ enum: ['user', 'assistant', 'system', 'tool'] })
  @IsIn(['user', 'assistant', 'system', 'tool'])
  role!: 'user' | 'assistant' | 'system' | 'tool';

  @ApiProperty()
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional({ enum: ['public', 'internal'] })
  @IsOptional()
  @IsIn(['public', 'internal'])
  visibility?: 'public' | 'internal';

  @ApiProperty()
  @IsString()
  @MinLength(1)
  turnId!: string;
}
