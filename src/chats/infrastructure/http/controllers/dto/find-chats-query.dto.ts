import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindChatsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ enum: ['user', 'assistant', 'system', 'tool'] })
  @IsOptional()
  @IsIn(['user', 'assistant', 'system', 'tool'])
  role?: 'user' | 'assistant' | 'system' | 'tool';

  @ApiPropertyOptional({ enum: ['public', 'internal'] })
  @IsOptional()
  @IsIn(['public', 'internal'])
  visibility?: 'public' | 'internal';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  turnId?: string;
}
