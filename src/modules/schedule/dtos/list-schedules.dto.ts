import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { UserResponseDto } from '../../user/dtos/user.dto';
import { Schedule } from '../entities/schedule.entity';
export class ListSchedulesQueryParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  coworkerUserId: number;
}

export class ScheduleResponseDto {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  user?: UserResponseDto;

  constructor(schedule: Schedule) {
    const { date, hours, id, user } = schedule;
    this.date = date;
    this.hours = hours;
    this.id = id;
    this.user = user && new UserResponseDto(user);
  }
}
export class ListSchedulesResponseDto {
  @ApiProperty()
  from: Date;

  @ApiProperty()
  to: Date;

  @ApiProperty({ isArray: true, type: ScheduleResponseDto })
  data: ScheduleResponseDto[];

  constructor(from: Date, to: Date, schedules: Schedule[]) {
    this.from = from;
    this.to = to;
    this.data = schedules.map((schedule) => new ScheduleResponseDto(schedule));
  }
}
