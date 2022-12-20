import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNumber, IsPositive } from 'class-validator';

export class EditScheduleAdminBodyDto {
  @ApiPropertyOptional()
  @IsDefined()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional()
  @IsDefined()
  @IsNumber()
  @IsPositive()
  shiftLength?: number;
}
