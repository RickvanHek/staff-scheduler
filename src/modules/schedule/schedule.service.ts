import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRespository: Repository<Schedule>,
    private userService: UserService,
  ) {}

  async createSchedule(userId: number, date: Date, shiftLength: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with user id: ${userId} not found`);
    }
    const schedule = new Schedule(user, date, shiftLength);
    return this.scheduleRespository.save(schedule);
  }
}
