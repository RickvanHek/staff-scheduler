import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleAdminBodyDto } from './dtos/create-schedule-admin.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/schedule')
export class ScheduleAdminController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createSchedule(@Body() body: CreateScheduleAdminBodyDto) {
    const { userId, date, shiftLength } = body;
    this.scheduleService.createSchedule(userId, date, shiftLength);
  }
}
