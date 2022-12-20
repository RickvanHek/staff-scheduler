import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';
import { CreateScheduleBodyDto } from './create-schedule.dto';

export class CreateScheduleAdminBodyDto extends CreateScheduleBodyDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  userId: number;
}
