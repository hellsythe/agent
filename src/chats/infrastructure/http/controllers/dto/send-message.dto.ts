import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @ApiPropertyOptional({
    description: 'Optional session id. If missing, a new session is created.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  sessionId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  userId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  message!: string;
}
