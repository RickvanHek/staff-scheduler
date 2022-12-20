import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { intervalToDuration } from 'date-fns';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ListSchedulesQueryParamsDto } from './dtos/list-schedules.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
@ApiTags('schedule')
@ApiSecurity('bearer')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  listSchedules(@Request() req, @Query() query: ListSchedulesQueryParamsDto) {
    if (
      query.to &&
      query.from &&
      intervalToDuration({ start: query.from, end: query.to }).years >= 1
    ) {
      throw new UnprocessableEntityException(`Maximum time frame is 1 year`);
    }
    return this.scheduleService.listSchedules({
      userId: req.user.userId,
      ...query,
    });
  }

  @Get(':id')
  getSchedule(@Request() req, @Param('id') scheduleId: number) {
    return this.scheduleService.getSchedule({
      scheduleId,
      userId: req.user.userId,
    });
  }
}
