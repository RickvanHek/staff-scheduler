import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNumber, IsPositive } from 'class-validator';

export class CreateScheduleBodyDto {
  @ApiProperty()
  @IsDefined()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @IsPositive()
  shiftLength: number;
}
