import { UserAdminResponseDto } from '../../user/dtos/user-admin.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { Schedule } from '../entities/schedule.entity';

export class ScheduleAdminResponseDto {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserAdminResponseDto;

  constructor(schedule: Schedule) {
    const { date, hours, id, user } = schedule;
    this.date = date;
    this.hours = hours;
    this.id = id;
    this.user = user && new UserAdminResponseDto(user);
  }
}
export class ListSchedulesAdminResponseDto {
  @ApiProperty()
  from: Date;

  @ApiProperty()
  to: Date;

  @ApiProperty({ isArray: true, type: ScheduleAdminResponseDto })
  data: ScheduleAdminResponseDto[];

  constructor(from: Date, to: Date, schedules: Schedule[]) {
    this.from = from;
    this.to = to;
    this.data = schedules.map(
      (schedule) => new ScheduleAdminResponseDto(schedule),
    );
  }
}
