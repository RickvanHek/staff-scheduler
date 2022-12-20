import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addYears, subYears } from 'date-fns';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Schedule } from './entities/schedule.entity';
import { IListSchedules } from './interfaces/list-schedules.interface';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRespository: Repository<Schedule>,
    private userService: UserService,
  ) {}

  private getQuery(params: IListSchedules) {
    const { scheduleId, userId, from, to } = params;
    const query: FindOptionsWhere<Schedule> = {};
    if (scheduleId) {
      query.id = scheduleId;
    }
    if (userId) {
      query.user = { id: userId };
    }
    if (from && to) {
      query.date = Between(from, to);
    } else if (from) {
      query.date = Between(from, addYears(from, 1));
    } else if (to) {
      query.date = Between(subYears(to, 1), to);
    } else {
      const now = new Date();
      query.date = Between(now, addYears(now, 1));
    }
    return query;
  }

  async listSchedules(params: IListSchedules) {
    const query = this.getQuery(params);
    return this.scheduleRespository.find({ where: query, relations: ['user'] });
  }

  async getSchedule(params: IListSchedules) {
    const query = this.getQuery(params);
    const schedule = await this.scheduleRespository.findOne({
      where: query,
      relations: ['user'],
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  async createSchedule(userId: number, date: Date, shiftLength: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with user id: ${userId} not found`);
    }
    if (date < new Date()) {
      throw new UnprocessableEntityException(
        `Schedule should be in the future`,
      );
    }
    const schedule = new Schedule(user, date, shiftLength);
    return this.scheduleRespository.save(schedule);
  }

  async editSchedule(scheduleId: number, date?: Date, shiftLength?: number) {
    const schedule = await this.scheduleRespository.findOneBy({
      id: scheduleId,
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with id: ${scheduleId} not found`);
    }
    if (date) {
      schedule.date = date;
    }
    if (shiftLength) {
      schedule.shiftLength = shiftLength;
    }
    return this.scheduleRespository.save(schedule);
  }

  async deleteSchedule(scheduleId: number) {
    const schedule = await this.scheduleRespository.findOneBy({
      id: scheduleId,
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with id: ${scheduleId} not found`);
    }
    this.scheduleRespository.remove(schedule);
  }
}
