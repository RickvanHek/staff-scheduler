import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateScheduleAdminBodyDto } from './dtos/create-schedule-admin.dto';
import { EditScheduleAdminBodyDto } from './dtos/edit-schedule-admin.dto';
import { ListSchedulesQueryParamsDto } from './dtos/list-schedules.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/schedule')
export class ScheduleAdminController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getSchedules(@Query() query: ListSchedulesQueryParamsDto) {
    return this.scheduleService.listSchedules(query);
  }

  @Get(':id')
  getSchedule(@Param('id') scheduleId: number) {
    return this.scheduleService.getSchedule({ scheduleId });
  }

  @Post()
  createSchedule(@Body() body: CreateScheduleAdminBodyDto) {
    const { userId, date, shiftLength } = body;
    return this.scheduleService.createSchedule(userId, date, shiftLength);
  }

  @Patch(':id')
  editSchedule(
    @Param('id') scheduleId: number,
    @Body() body: EditScheduleAdminBodyDto,
  ) {
    const { date, shiftLength } = body;
    return this.scheduleService.editSchedule(scheduleId, date, shiftLength);
  }

  @Delete(':id')
  deleteSchedule(@Param('id') scheduleId: number) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
