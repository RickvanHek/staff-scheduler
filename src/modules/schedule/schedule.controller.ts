import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateScheduleBodyDto } from './dtos/create-schedule.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createSchedule(@Request() req, @Body() body: CreateScheduleBodyDto) {
    const { date, shiftLength } = body;
    this.scheduleService.createSchedule(req.user.userId, date, shiftLength);
  }
}
