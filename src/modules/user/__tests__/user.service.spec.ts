import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../entities/user.entity';
import { IGetUsersWithTotals } from '../interfaces/get-users-with-totals.interface';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService, userRepository: Repository<User>;

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
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    userRepository.delete({});
  });

  describe('WHEN we register a user', () => {
    it('THEN we expect all needed fields to be returned', async () => {
      const user: User = await service.register('test@test.com', 'password');
      expect(user.id).toBe(1);
      expect(user.isActive).toBe(true);
      expect(user.isAdmin).toBe(false);
      expect(user.username).toBe('test@test.com');
    });
    it('THEN we expect an error if user already exists', async () => {
      const user: User = await service.register('test@test.com', 'password');
      try {
        await service.register('test@test.com', 'password');
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('WHEN we want to find one user by username', () => {
    it('THEN we expect the user to be returned if username is correct', async () => {
      const newUser: User = await service.register('test@test.com', 'password');
      const user: User = await service.findOneByUsername(newUser.username);
      expect(user.id).toBe(1);
      expect(user.isActive).toBe(true);
      expect(user.isAdmin).toBe(false);
      expect(user.username).toBe('test@test.com');
    });
  });

  describe('WHEN we want to find one user by id', () => {
    it('THEN we expect the user to be returned if id is correct', async () => {
      const newUser: User = await service.register('test@test.com', 'password');
      const user: User = await service.findOneById(newUser.id);
      expect(user.id).toBe(1);
      expect(user.isActive).toBe(true);
      expect(user.isAdmin).toBe(false);
      expect(user.username).toBe('test@test.com');
    });
  });

  describe('WHEN we want to delete an existing user', () => {
    it('THEN we expect the user to be deleted', async () => {
      const newUser: User = await service.register('test@test.com', 'password');
      await service.delete(newUser.id);
      const user: User = await userRepository.findOneBy({ id: newUser.id });
      expect(user).toBeNull();
    });
    it('THEN we expect an erorr if we try to delete an unexisting user', async () => {
      try {
        await service.delete(123);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('WHEN we want to edit an existing user', () => {
    it('THEN we expect the user to be updated', async () => {
      const newUser: User = await service.register('test@test.com', 'password');
      await service.edit(newUser.id, {
        isAdmin: true,
        isActive: false,
        username: 'new@test.com',
      });
      const user: User = await userRepository.findOneBy({ id: newUser.id });
      expect(user.username).toBe('new@test.com');
      expect(user.isActive).toBe(false);
      expect(user.isAdmin).toBe(true);
    });
    it('THEN we expect an error if we try to edit an unexisting user', async () => {
      try {
        await service.edit(123, { username: 'new@test.com' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('WHEN we want to list user with totals', () => {
    it('THEN we expect a list with 2 users with 0 total hours if there are no schedules', async () => {
      await service.register('test@test.com', 'password');
      await service.register('test2@test.com', 'password');
      const usersWithTotals: IGetUsersWithTotals =
        await service.getUsersWithTotals();
      expect(usersWithTotals.usersWithTotals.length).toBe(2);
      expect(usersWithTotals.usersWithTotals[0].totalHours).toBe(0);
      expect(usersWithTotals.usersWithTotals[1].totalHours).toBe(0);
    });
  });

  describe('WHEN we want to list coworkers', () => {
    it('THEN we expect a list of coworkers', async () => {
      const user: User = await service.register('test@test.com', 'password');
      await service.register('test2@test.com', 'password');
      await service.register('test3@test.com', 'password');
      const coworkers: User[] = await service.listCoworkers(user.id);
      expect(coworkers.length).toBe(2);
    });
    it('THEN we expect an empty list if there are no coworkers', async () => {
      const user: User = await service.register('test@test.com', 'password');
      const coworkers: User[] = await service.listCoworkers(user.id);
      expect(coworkers.length).toBe(0);
    });
  });
});
