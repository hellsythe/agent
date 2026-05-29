import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateChatDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiPropertyOptional({ enum: ['public', 'internal'] })
  @IsOptional()
  @IsIn(['public', 'internal'])
  visibility?: 'public' | 'internal';
}
