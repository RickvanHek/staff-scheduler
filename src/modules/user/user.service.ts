import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IEditUser } from './interfaces/edit-user-admin.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<{ user: User; totalHours: number }[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .innerJoin('user.schedules', 'schedules')
      .addSelect('SUM(schedules.hours)', 'totalHours')
      .groupBy('user.id')
      .orderBy('totalHours', 'DESC');
    const rawUsersWithTotalHours = await queryBuilder.getRawMany();
    const users = await queryBuilder.getMany();
    return users.map((user) => ({
      user: user,
      totalHours: parseInt(
        rawUsersWithTotalHours.find((rawUser) => rawUser.user_id === user.id)
          .totalHours,
      ),
    }));
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneById(userId: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: userId });
  }

  async register(username: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // TODO: hash
    const user = new User(username, password);
    return this.usersRepository.save(user);
  }

  async delete(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }
    this.usersRepository.remove(user);
  }

  async edit(userId: number, params: IEditUser) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }
    const { username, isActive, isAdmin } = params;
    if (username) {
      user.username = username;
    }
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }
    return this.usersRepository.save(user);
  }
}
