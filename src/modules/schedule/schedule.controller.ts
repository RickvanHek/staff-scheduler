import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ListSchedulesQueryParamsDto } from './dtos/list-schedules.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  listSchedules(@Request() req, @Query() query: ListSchedulesQueryParamsDto) {
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
