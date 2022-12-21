import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
import {
  ListSchedulesQueryParamsDto,
  ListSchedulesResponseDto,
  ScheduleResponseDto,
} from './dtos/list-schedules.dto';
import { ScheduleService } from './schedule.service';
import { getFromToDate } from 'src/common/utils/date.helper';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/schedule')
@ApiTags('admin')
@ApiSecurity('bearer')
export class ScheduleAdminController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOkResponse({
    description: 'Schedules',
    type: ListSchedulesResponseDto,
  })
  @Get()
  async getSchedules(
    @Query() query: ListSchedulesQueryParamsDto,
  ): Promise<ListSchedulesResponseDto> {
    const { from, to } = getFromToDate(query.from, query.to);
    return new ListSchedulesResponseDto(
      from,
      to,
      await this.scheduleService.listSchedules({ from, to, ...query }, [
        'user',
      ]),
    );
  }

  @ApiOkResponse({
    description: 'Schedule',
    type: ScheduleResponseDto,
  })
  @Get(':id')
  async getSchedule(
    @Param('id') scheduleId: number,
  ): Promise<ScheduleResponseDto> {
    return new ScheduleResponseDto(
      await this.scheduleService.getSchedule({ scheduleId }),
    );
  }

  @ApiOkResponse({
    description: 'New schedule',
    type: ScheduleResponseDto,
  })
  @Post()
  async createSchedule(
    @Body() body: CreateScheduleAdminBodyDto,
  ): Promise<ScheduleResponseDto> {
    const { userId, date, hours } = body;
    return new ScheduleResponseDto(
      await this.scheduleService.createSchedule(userId, date, hours),
    );
  }

  @ApiOkResponse({
    description: 'New schedule',
    type: ScheduleResponseDto,
  })
  @Patch(':id')
  async editSchedule(
    @Param('id') scheduleId: number,
    @Body() body: EditScheduleAdminBodyDto,
  ): Promise<ScheduleResponseDto> {
    const { date, hours } = body;
    return new ScheduleResponseDto(
      await this.scheduleService.editSchedule(scheduleId, date, hours),
    );
  }

  @Delete(':id')
  deleteSchedule(@Param('id') scheduleId: number) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
