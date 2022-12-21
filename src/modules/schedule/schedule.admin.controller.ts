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
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { getFromToDate } from 'src/common/utils/date.helper';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateScheduleAdminBodyDto } from './dtos/create-schedule-admin.dto';
import { EditScheduleAdminBodyDto } from './dtos/edit-schedule-admin.dto';
import {
  ListSchedulesAdminResponseDto,
  ScheduleAdminResponseDto,
} from './dtos/list-schedules-admin.dto';
import { ListSchedulesQueryParamsDto } from './dtos/list-schedules.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/schedule')
@ApiTags('admin')
@ApiSecurity('bearer')
export class ScheduleAdminController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOkResponse({
    description: 'Schedules',
    type: ListSchedulesAdminResponseDto,
  })
  @Get()
  async getSchedules(
    @Query() query: ListSchedulesQueryParamsDto,
  ): Promise<ListSchedulesAdminResponseDto> {
    const { from, to } = getFromToDate(query.from, query.to);
    return new ListSchedulesAdminResponseDto(
      from,
      to,
      await this.scheduleService.listSchedules({ from, to, ...query }, [
        'user',
      ]),
    );
  }

  @ApiOkResponse({
    description: 'Schedule',
    type: ScheduleAdminResponseDto,
  })
  @Get(':id')
  async getSchedule(
    @Param('id') scheduleId: number,
  ): Promise<ScheduleAdminResponseDto> {
    return new ScheduleAdminResponseDto(
      await this.scheduleService.getSchedule({ scheduleId }),
    );
  }

  @ApiOkResponse({
    description: 'New schedule',
    type: ScheduleAdminResponseDto,
  })
  @Post()
  async createSchedule(
    @Body() body: CreateScheduleAdminBodyDto,
  ): Promise<ScheduleAdminResponseDto> {
    const { userId, date, hours } = body;
    return new ScheduleAdminResponseDto(
      await this.scheduleService.createSchedule(userId, date, hours),
    );
  }

  @ApiOkResponse({
    description: 'New schedule',
    type: ScheduleAdminResponseDto,
  })
  @Patch(':id')
  async editSchedule(
    @Param('id') scheduleId: number,
    @Body() body: EditScheduleAdminBodyDto,
  ): Promise<ScheduleAdminResponseDto> {
    const { date, hours } = body;
    return new ScheduleAdminResponseDto(
      await this.scheduleService.editSchedule(scheduleId, date, hours),
    );
  }

  @Delete(':id')
  deleteSchedule(@Param('id') scheduleId: number) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
