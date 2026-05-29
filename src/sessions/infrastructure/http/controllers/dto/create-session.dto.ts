import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ description: 'User id owner of the session' })
  @IsString()
  @MinLength(1)
  userId!: string;

  @ApiPropertyOptional({ description: 'Optional alias for the session' })
  @IsOptional()
  @IsString()
  alias?: string;
}
