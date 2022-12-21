import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { intervalToDuration } from 'date-fns';
import { getFromToDate } from 'src/common/utils/date.helper';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  ListSchedulesQueryParamsDto,
  ListSchedulesResponseDto,
  ScheduleResponseDto,
} from './dtos/list-schedules.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
@ApiTags('schedule')
@ApiSecurity('bearer')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOkResponse({
    description: 'Schedules',
    type: ListSchedulesResponseDto,
  })
  @Get()
  async listSchedules(
    @Request() req,
    @Query() query: ListSchedulesQueryParamsDto,
  ): Promise<ListSchedulesResponseDto> {
    if (
      query.to &&
      query.from &&
      intervalToDuration({ start: query.from, end: query.to }).years >= 1
    ) {
      throw new UnprocessableEntityException(`Maximum time frame is 1 year`);
    }
    const { from, to } = getFromToDate(query.from, query.to);
    return new ListSchedulesResponseDto(
      from,
      to,
      await this.scheduleService.listSchedules({
        userId: req.user.userId,
        ...query,
      }),
    );
  }

  @ApiOkResponse({
    description: 'Schedule',
    type: ScheduleResponseDto,
  })
  @Get(':id')
  async getSchedule(
    @Request() req,
    @Param('id') scheduleId: number,
  ): Promise<ScheduleResponseDto> {
    if (Number.isNaN(scheduleId)) {
      throw new UnprocessableEntityException(`Invalid schedule id`);
    }
    return new ScheduleResponseDto(
      await this.scheduleService.getSchedule({
        scheduleId,
        userId: req.user.userId,
      }),
    );
  }
}
