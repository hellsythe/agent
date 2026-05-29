import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSessionDto {
  @ApiPropertyOptional({ description: 'New alias for the session' })
  @IsOptional()
  @IsString()
  alias?: string;
}
