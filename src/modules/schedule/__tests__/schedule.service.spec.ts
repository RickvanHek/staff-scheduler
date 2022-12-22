import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { addDays, addMonths, subDays, addYears } from 'date-fns';
import { Repository } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { ScheduleService } from '../schedule.service';

describe('ScheduleService', () => {
  let service: ScheduleService,
    userService: UserService,
    scheduleRepository: Repository<Schedule>,
    userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User, Schedule],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Schedule]),
      ],
      providers: [ScheduleService, UserService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    scheduleRepository = module.get(getRepositoryToken(Schedule));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  let adminUser: User;

  beforeEach(async () => {
    await userRepository.delete({});
    await scheduleRepository.delete({});
    adminUser = await userService.register('admin@admin.com', 'password');
  });

  describe('WHEN we create a schedule', () => {
    it('THEN we expect all needed fields to be returned', async () => {
      const user: User = await userService.register(
        'test@test.com',
        'password',
      );
      const now = new Date();
      const schedule: Schedule = await service.createSchedule(user.id, now, 5);
      expect(schedule.id).toBe(1);
      expect(schedule.date).toBe(now);
      expect(schedule.user.id).toBe(user.id);
    });
    it('THEN we expect an error if user doesnt exists', async () => {
      try {
        await service.createSchedule(123, new Date(), 5);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    it('THEN we expect an error if date is not in future', async () => {
      const user: User = await userService.register(
        'test@test.com',
        'password',
      );
      try {
        await service.createSchedule(user.id, subDays(new Date(), 1), 5);
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
      }
    });
  });

  describe('WHEN we edit a schedule', () => {
    it('THEN we expect the passed fields to be updated', async () => {
      const user: User = await userService.register(
        'test@test.com',
        'password',
      );
      const now = new Date();
      const fiveDayFromNow = addDays(now, 5);
      const schedule: Schedule = await service.createSchedule(user.id, now, 5);
      await service.editSchedule(schedule.id, fiveDayFromNow, 1);
      const updatedSchedule = await scheduleRepository.findOneBy({
        id: schedule.id,
      });
      expect(updatedSchedule.id).toBe(schedule.id);
      expect(updatedSchedule.date).toEqual(fiveDayFromNow);
      expect(updatedSchedule.hours).toBe(1);
    });
  });

  describe('WHEN we delete a schedule', () => {
    it('THEN expect the schedule to be deleted from the database', async () => {
      const user: User = await userService.register(
        'test@test.com',
        'password',
      );
      const now = new Date();
      const schedule: Schedule = await service.createSchedule(user.id, now, 5);
      const scheduleBeforeDeletion = await scheduleRepository.findOneBy({
        id: schedule.id,
      });
      expect(scheduleBeforeDeletion).toBeDefined();
      await service.deleteSchedule(schedule.id);
      const scheduleAfterDeletion = await scheduleRepository.findOneBy({
        id: schedule.id,
      });
      expect(scheduleAfterDeletion).toBeNull();
    });
  });

  describe('WHEN we list schedules', () => {
    let user: User;
    const now = new Date();
    beforeEach(async () => {
      user = await userService.register('test@test.com', 'password');
      await service.createSchedule(user.id, now, 5);
      await service.createSchedule(user.id, addMonths(now, 1), 5);
      await service.createSchedule(user.id, addYears(now, 1), 5);
    });
    it.each([
      {
        params: {
          from: now,
          to: addDays(now, 1),
        },
        expectedSchedules: 1,
      },
      {
        params: {
          from: now,
          to: addMonths(now, 2),
        },
        expectedSchedules: 2,
      },
      {
        params: {
          from: addMonths(now, 1),
          to: addMonths(addYears(now, 1), 1),
        },
        expectedSchedules: 2,
      },
    ])(
      'THEN expect schedules according to the passed parameters',
      async ({ params, expectedSchedules }) => {
        const schedules: Schedule[] = await service.listSchedules(params);
        expect(schedules.length).toBe(expectedSchedules);
      },
    );
  });
});
